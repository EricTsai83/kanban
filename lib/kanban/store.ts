import { promises as fs } from "node:fs";
import path from "node:path";

import { DEFAULT_ENGINEERING_COLUMN_NAMES } from "@/lib/kanban/constants";
import type {
  KanbanBoard,
  KanbanColumn,
  KanbanWorkItem,
  UpdateColumnsInput,
} from "@/lib/kanban/types";
import {
  normalizeBoardName,
  normalizeColumnsInput,
  normalizeCreateWorkItemInput,
  normalizeUpdateWorkItemInput,
  validateStoredBoard,
} from "@/lib/kanban/validation";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const BOARD_FILE_PATH = path.join(
  DATA_DIRECTORY,
  "engineering-kanban-board.json",
);

export class KanbanStoreError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "KanbanStoreError";
    this.status = status;
  }
}

function nowIsoString() {
  return new Date().toISOString();
}

function sortBoard(board: KanbanBoard): KanbanBoard {
  return {
    ...board,
    columns: [...board.columns].sort((left, right) => left.order - right.order),
    items: [...board.items].sort((left, right) => left.order - right.order),
  };
}

async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true });
}

async function writeBoard(board: KanbanBoard) {
  await ensureDataDirectory();
  const normalized = sortBoard(board);
  await fs.writeFile(BOARD_FILE_PATH, JSON.stringify(normalized, null, 2));
  return normalized;
}

function defaultColumns(): KanbanColumn[] {
  return DEFAULT_ENGINEERING_COLUMN_NAMES.map((name, index) => ({
    id: crypto.randomUUID(),
    name,
    order: index,
  }));
}

function nextItemOrder(items: KanbanWorkItem[], columnId: string) {
  const columnItems = items.filter((item) => item.columnId === columnId);

  if (columnItems.length === 0) {
    return 0;
  }

  return Math.max(...columnItems.map((item) => item.order)) + 1;
}

export async function loadBoard() {
  try {
    const fileContents = await fs.readFile(BOARD_FILE_PATH, "utf8");
    const parsed = JSON.parse(fileContents) as unknown;
    return sortBoard(validateStoredBoard(parsed));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw new KanbanStoreError("Failed to load persisted board.", 500);
  }
}

export async function createBoard(nameInput: unknown) {
  const existing = await loadBoard();

  if (existing) {
    throw new KanbanStoreError("A board already exists.", 409);
  }

  const now = nowIsoString();
  const board: KanbanBoard = {
    id: crypto.randomUUID(),
    name: normalizeBoardName(nameInput),
    createdAt: now,
    updatedAt: now,
    columns: defaultColumns(),
    items: [],
  };

  return writeBoard(board);
}

async function requireBoard() {
  const board = await loadBoard();

  if (!board) {
    throw new KanbanStoreError("Create a board before updating it.", 404);
  }

  return board;
}

export async function saveColumns(input: UpdateColumnsInput["columns"]) {
  const board = await requireBoard();
  const normalizedColumns = normalizeColumnsInput(input);
  const persistedColumns = normalizedColumns.map((column, index) => ({
    id: column.id ?? crypto.randomUUID(),
    name: column.name,
    order: index,
  }));
  const nextColumnIds = new Set(persistedColumns.map((column) => column.id));
  const orphanedItems = board.items.filter(
    (item) => !nextColumnIds.has(item.columnId),
  );

  if (orphanedItems.length > 0) {
    throw new KanbanStoreError(
      "Move all work items out of a column before removing it.",
      409,
    );
  }

  return writeBoard({
    ...board,
    columns: persistedColumns,
    updatedAt: nowIsoString(),
  });
}

export async function createWorkItem(input: unknown) {
  const board = await requireBoard();
  const normalized = normalizeCreateWorkItemInput(input, board);
  const now = nowIsoString();

  const item: KanbanWorkItem = {
    id: crypto.randomUUID(),
    title: normalized.title,
    description: normalized.description ?? "",
    assignee: normalized.assignee ?? "",
    priority: normalized.priority ?? "medium",
    labels: normalized.labels ?? [],
    estimate: normalized.estimate ?? null,
    startDate: normalized.startDate ?? null,
    dueDate: normalized.dueDate ?? null,
    isBlocked: normalized.isBlocked ?? false,
    coverImage: normalized.coverImage ?? null,
    columnId: normalized.columnId,
    order: nextItemOrder(board.items, normalized.columnId),
    createdAt: now,
    updatedAt: now,
  };

  return writeBoard({
    ...board,
    items: [...board.items, item],
    updatedAt: now,
  });
}

export async function updateWorkItem(input: unknown) {
  const board = await requireBoard();
  const normalized = normalizeUpdateWorkItemInput(input, board);
  const current = board.items.find((item) => item.id === normalized.id);

  if (!current) {
    throw new KanbanStoreError("Work item not found.", 404);
  }

  const nextColumnId = normalized.columnId ?? current.columnId;
  const movedColumns = nextColumnId !== current.columnId;
  const nextOrder = movedColumns
    ? nextItemOrder(
        board.items.filter((item) => item.id !== current.id),
        nextColumnId,
      )
    : current.order;
  const updatedItem: KanbanWorkItem = {
    ...current,
    ...normalized,
    columnId: nextColumnId,
    order: nextOrder,
    updatedAt: nowIsoString(),
  };

  return writeBoard({
    ...board,
    items: board.items.map((item) =>
      item.id === current.id ? updatedItem : item,
    ),
    updatedAt: nowIsoString(),
  });
}
