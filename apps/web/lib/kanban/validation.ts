import {
  KANBAN_PRIORITIES,
  MAX_ASSIGNEE_LENGTH,
  MAX_BOARD_NAME_LENGTH,
  MAX_COLUMN_NAME_LENGTH,
  MAX_ESTIMATE_POINTS,
  MAX_LABEL_COUNT,
  MAX_LABEL_LENGTH,
  MAX_WORK_ITEM_DESCRIPTION_LENGTH,
  MAX_WORK_ITEM_TITLE_LENGTH,
} from "@/lib/kanban/constants";
import type {
  CreateWorkItemInput,
  KanbanBoard,
  KanbanPriority,
  UpdateColumnsInput,
  UpdateWorkItemInput,
} from "@/lib/kanban/types";

type RecordLike = Record<string, unknown>;

function isRecordLike(value: unknown): value is RecordLike {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeText(
  value: unknown,
  field: string,
  maxLength: number,
  { required = true }: { required?: boolean } = {},
): string {
  if (value == null) {
    if (required) {
      throw new Error(`${field} is required.`);
    }

    return "";
  }

  if (typeof value !== "string") {
    throw new Error(`${field} must be a string.`);
  }

  const normalized = value.trim();

  if (required && normalized.length === 0) {
    throw new Error(`${field} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer.`);
  }

  return normalized;
}

function normalizePriority(value: unknown): KanbanPriority {
  if (
    typeof value !== "string" ||
    !KANBAN_PRIORITIES.includes(value as KanbanPriority)
  ) {
    throw new Error("priority must be one of low, medium, high, or urgent.");
  }

  return value as KanbanPriority;
}

function normalizeEstimate(value: unknown): number | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("estimate must be a number.");
  }

  if (!Number.isInteger(value) || value < 0 || value > MAX_ESTIMATE_POINTS) {
    throw new Error(
      `estimate must be an integer between 0 and ${MAX_ESTIMATE_POINTS}.`,
    );
  }

  return value;
}

function normalizeStartDate(value: unknown): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("startDate must be a string.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("startDate must use YYYY-MM-DD format.");
  }

  return value;
}

function normalizeDueDate(value: unknown): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("dueDate must be a string.");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("dueDate must use YYYY-MM-DD format.");
  }

  return value;
}

function normalizeCoverImage(value: unknown): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("coverImage must be a string.");
  }

  return value.trim();
}

function normalizeLabels(value: unknown): string[] {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error("labels must be an array of strings.");
  }

  const normalized = value
    .map((label) => normalizeText(label, "label", MAX_LABEL_LENGTH))
    .filter(Boolean);

  const deduped = Array.from(new Set(normalized));

  if (deduped.length > MAX_LABEL_COUNT) {
    throw new Error(`labels must contain ${MAX_LABEL_COUNT} items or fewer.`);
  }

  return deduped;
}

export function normalizeBoardName(value: unknown): string {
  return normalizeText(value, "Board name", MAX_BOARD_NAME_LENGTH);
}

export function normalizeColumnName(value: unknown): string {
  return normalizeText(value, "Column name", MAX_COLUMN_NAME_LENGTH);
}

export function normalizeColumnsInput(
  value: unknown,
): UpdateColumnsInput["columns"] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("columns must contain at least one column.");
  }

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  return value.map((column, index) => {
    if (!isRecordLike(column)) {
      throw new Error(`Column ${index + 1} is invalid.`);
    }

    const normalizedName = normalizeColumnName(column.name);
    const normalizedId =
      typeof column.id === "string" && column.id.trim().length > 0
        ? column.id.trim()
        : undefined;

    if (normalizedId) {
      if (seenIds.has(normalizedId)) {
        throw new Error("column ids must be unique.");
      }

      seenIds.add(normalizedId);
    }

    const nameKey = normalizedName.toLowerCase();
    if (seenNames.has(nameKey)) {
      throw new Error("column names must be unique.");
    }

    seenNames.add(nameKey);

    return {
      id: normalizedId,
      name: normalizedName,
    };
  });
}

export function normalizeCreateWorkItemInput(
  value: unknown,
  board: KanbanBoard,
): CreateWorkItemInput {
  if (!isRecordLike(value)) {
    throw new Error("Work item payload is invalid.");
  }

  const columnId = normalizeText(value.columnId, "columnId", 100);
  const validColumnIds = new Set(board.columns.map((column) => column.id));

  if (!validColumnIds.has(columnId)) {
    throw new Error("columnId must reference an existing board column.");
  }

  return {
    title: normalizeText(value.title, "title", MAX_WORK_ITEM_TITLE_LENGTH),
    description: normalizeText(
      value.description,
      "description",
      MAX_WORK_ITEM_DESCRIPTION_LENGTH,
      { required: false },
    ),
    assignee: normalizeText(value.assignee, "assignee", MAX_ASSIGNEE_LENGTH, {
      required: false,
    }),
    priority:
      value.priority == null ? "medium" : normalizePriority(value.priority),
    labels: normalizeLabels(value.labels),
    estimate: normalizeEstimate(value.estimate),
    startDate: normalizeStartDate(value.startDate),
    dueDate: normalizeDueDate(value.dueDate),
    isBlocked: typeof value.isBlocked === "boolean" ? value.isBlocked : false,
    coverImage: normalizeCoverImage(value.coverImage),
    columnId,
  };
}

export function normalizeUpdateWorkItemInput(
  value: unknown,
  board: KanbanBoard,
): UpdateWorkItemInput {
  if (!isRecordLike(value)) {
    throw new Error("Work item payload is invalid.");
  }

  const id = normalizeText(value.id, "id", 100);
  const next: UpdateWorkItemInput = { id };
  const validColumnIds = new Set(board.columns.map((column) => column.id));

  if ("title" in value) {
    next.title = normalizeText(
      value.title,
      "title",
      MAX_WORK_ITEM_TITLE_LENGTH,
    );
  }

  if ("description" in value) {
    next.description = normalizeText(
      value.description,
      "description",
      MAX_WORK_ITEM_DESCRIPTION_LENGTH,
      { required: false },
    );
  }

  if ("assignee" in value) {
    next.assignee = normalizeText(
      value.assignee,
      "assignee",
      MAX_ASSIGNEE_LENGTH,
      {
        required: false,
      },
    );
  }

  if ("priority" in value) {
    next.priority = normalizePriority(value.priority);
  }

  if ("labels" in value) {
    next.labels = normalizeLabels(value.labels);
  }

  if ("estimate" in value) {
    next.estimate = normalizeEstimate(value.estimate);
  }

  if ("startDate" in value) {
    next.startDate = normalizeStartDate(value.startDate);
  }

  if ("dueDate" in value) {
    next.dueDate = normalizeDueDate(value.dueDate);
  }

  if ("isBlocked" in value) {
    if (typeof value.isBlocked !== "boolean") {
      throw new Error("isBlocked must be a boolean.");
    }

    next.isBlocked = value.isBlocked;
  }

  if ("coverImage" in value) {
    next.coverImage = normalizeCoverImage(value.coverImage);
  }

  if ("columnId" in value) {
    const columnId = normalizeText(value.columnId, "columnId", 100);

    if (!validColumnIds.has(columnId)) {
      throw new Error("columnId must reference an existing board column.");
    }

    next.columnId = columnId;
  }

  return next;
}

export function validateStoredBoard(value: unknown): KanbanBoard {
  if (!isRecordLike(value)) {
    throw new Error("Stored board is invalid.");
  }

  if (!Array.isArray(value.columns) || !Array.isArray(value.items)) {
    throw new Error("Stored board is missing columns or items.");
  }

  return value as KanbanBoard;
}
