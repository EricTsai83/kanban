"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { GanttChart as GanttChartComponent } from "@/components/gantt-chart";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  AlignJustify,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  GanttChart,
  ImageIcon,
  Kanban,
  Languages,
  LayoutList,
  List,
  Loader2,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useI18n } from "@/components/i18n-provider";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/lib/auth-context";

import { formatMessage, getDictionary, type AppDictionary, type Locale } from "@/lib/i18n";
import { apiUrl } from "@/lib/api";
import { KANBAN_PRIORITIES } from "@/lib/kanban/constants";
import type {
  CreateWorkItemInput,
  KanbanBoard,
  KanbanGroupBy,
  KanbanPriority,
  KanbanSortDir,
  KanbanSortField,
  KanbanViewMode,
  KanbanWorkItem,
  UpdateColumnsInput,
  UpdateWorkItemInput,
} from "@/lib/kanban/types";
import { cn } from "@/lib/utils";

/* ─── types ─── */

type BoardResponse = { board: KanbanBoard | null; error?: string };

type ItemFormState = {
  title: string;
  description: string;
  assignee: string;
  priority: KanbanPriority;
  labels: string;
  estimate: string;
  startDate: string;
  dueDate: string;
  isBlocked: boolean;
  coverImage: string;
  columnId: string;
};

type FiltersState = {
  assignee: string;
  priority: string;
  label: string;
  status: string;
};

/* ─── constants ─── */

const EMPTY_FILTERS: FiltersState = {
  assignee: "",
  priority: "",
  label: "",
  status: "",
};
const DEFAULT_BOARD_NAMES: string[] = [
  getDictionary("en").onboarding.defaultBoardName,
  getDictionary("zh-TW").onboarding.defaultBoardName,
];

/* ─── pure helpers ─── */

function formatDueDate(
  dateStr: string,
  locale: Locale,
  relativeLabels: { today: string; tomorrow: string; yesterday: string },
): string {
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return relativeLabels.today;
  if (diffDays === 1) return relativeLabels.tomorrow;
  if (diffDays === -1) return relativeLabels.yesterday;

  const sameYear = date.getFullYear() === today.getFullYear();
  const fmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  return fmt.format(date);
}

type DueDateUrgency = "overdue" | "today" | "soon" | "normal";

function getDueDateUrgency(dateStr: string): DueDateUrgency {
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays <= 3) return "soon";
  return "normal";
}

const URGENCY_BADGE_CLASS: Record<DueDateUrgency, string> = {
  overdue: "border-destructive/40 bg-destructive/10 text-destructive",
  today: "border-amber-400/40 bg-amber-50 text-amber-600 dark:bg-amber-950/30",
  soon: "border-yellow-400/40 bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30",
  normal: "",
};

const URGENCY_TEXT_CLASS: Record<DueDateUrgency, string> = {
  overdue: "text-destructive",
  today: "text-amber-600",
  soon: "text-yellow-600",
  normal: "text-muted-foreground",
};

function createEmptyForm(columnId = ""): ItemFormState {
  return {
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    labels: "",
    estimate: "",
    startDate: "",
    dueDate: "",
    isBlocked: false,
    coverImage: "",
    columnId,
  };
}

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong.";
}

function buildItemForm(item: KanbanWorkItem): ItemFormState {
  return {
    title: item.title,
    description: item.description,
    assignee: item.assignee,
    priority: item.priority,
    labels: item.labels.join(", "),
    estimate: item.estimate == null ? "" : String(item.estimate),
    startDate: item.startDate ?? "",
    dueDate: item.dueDate ?? "",
    isBlocked: item.isBlocked,
    coverImage: item.coverImage ?? "",
    columnId: item.columnId,
  };
}

function buildPayload(
  f: ItemFormState,
): Omit<CreateWorkItemInput, "columnId"> & { columnId: string } {
  return {
    title: f.title,
    description: f.description,
    assignee: f.assignee,
    priority: f.priority,
    labels: f.labels
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean),
    estimate: f.estimate === "" ? null : Number(f.estimate),
    startDate: f.startDate || null,
    dueDate: f.dueDate || null,
    isBlocked: f.isBlocked,
    coverImage: f.coverImage || null,
    columnId: f.columnId,
  };
}

function colName(b: KanbanBoard, id: string, fallback = "Unknown") {
  return b.columns.find((c) => c.id === id)?.name ?? fallback;
}

function isWip(name: string) {
  const l = name.toLowerCase();
  return !["backlog", "ready", "done", "blocked"].includes(l);
}

function priorityColor(p: KanbanPriority) {
  switch (p) {
    case "urgent":
      return "var(--priority-urgent)";
    case "high":
      return "var(--priority-high)";
    case "medium":
      return "var(--priority-medium)";
    case "low":
      return "var(--priority-low)";
    default:
      return "var(--muted-foreground)";
  }
}

function priorityBadgeClass(p: KanbanPriority) {
  switch (p) {
    case "urgent":
      return "bg-priority-urgent/10 text-priority-urgent";
    case "high":
      return "bg-priority-high/10 text-priority-high";
    case "medium":
      return "bg-priority-medium/10 text-priority-medium";
    case "low":
      return "bg-priority-low/10 text-priority-low";
    default:
      return "";
  }
}

function priorityLabel(priority: KanbanPriority, copy: AppDictionary) {
  return copy.priority[priority];
}

function groupByLabel(groupBy: KanbanGroupBy, copy: AppDictionary) {
  return copy.groupBy[groupBy];
}

function localeLabel(locale: Locale, copy: AppDictionary) {
  return locale === "en" ? copy.locale.english : copy.locale.traditionalChinese;
}

function translateFieldName(field: string, copy: AppDictionary) {
  const fields: Record<string, string> = {
    "Board name": copy.fields.boardName,
    "Column name": copy.fields.columnName,
    title: copy.fields.title,
    description: copy.fields.description,
    assignee: copy.fields.assignee,
    label: copy.fields.label,
    columnId: copy.fields.columnId,
    id: copy.fields.id,
  };

  return fields[field] ?? field;
}

function localizeError(message: string, copy: AppDictionary) {
  const exactMatches: Record<string, string> = {
    "Something went wrong.": copy.errors.generic,
    "Select a work item first.": copy.errors.selectWorkItemFirst,
    "Request failed.": copy.errors.requestFailed,
    "Failed to load persisted board.": copy.errors.failedLoadBoard,
    "A board already exists.": copy.errors.boardAlreadyExists,
    "Create a board before updating it.": copy.errors.createBoardFirst,
    "Move all work items out of a column before removing it.":
      copy.errors.moveItemsBeforeRemovingColumn,
    "Work item not found.": copy.errors.workItemNotFound,
    "priority must be one of low, medium, high, or urgent.":
      copy.errors.priorityInvalid,
    "estimate must be a number.": copy.errors.estimateNumber,
    "dueDate must be a string.": copy.errors.dueDateString,
    "dueDate must use YYYY-MM-DD format.": copy.errors.dueDateFormat,
    "labels must be an array of strings.": copy.errors.labelsArray,
    "columns must contain at least one column.": copy.errors.columnsMin,
    "column ids must be unique.": copy.errors.columnIdsUnique,
    "column names must be unique.": copy.errors.columnNamesUnique,
    "Work item payload is invalid.": copy.errors.workItemPayloadInvalid,
    "columnId must reference an existing board column.":
      copy.errors.columnIdInvalid,
    "isBlocked must be a boolean.": copy.errors.isBlockedBoolean,
    "Stored board is invalid.": copy.errors.storedBoardInvalid,
    "Stored board is missing columns or items.": copy.errors.storedBoardMissing,
  };

  if (message in exactMatches) {
    return exactMatches[message];
  }

  const requiredMatch = message.match(/^(.*) is required\.$/);
  if (requiredMatch) {
    return formatMessage(copy.errors.fieldRequired, {
      field: translateFieldName(requiredMatch[1], copy),
    });
  }

  const stringMatch = message.match(/^(.*) must be a string\.$/);
  if (stringMatch) {
    return formatMessage(copy.errors.fieldMustBeString, {
      field: translateFieldName(stringMatch[1], copy),
    });
  }

  const maxLengthMatch = message.match(
    /^(.*) must be (\d+) characters or fewer\.$/,
  );
  if (maxLengthMatch) {
    return formatMessage(copy.errors.fieldMaxLength, {
      field: translateFieldName(maxLengthMatch[1], copy),
      max: maxLengthMatch[2],
    });
  }

  const estimateRangeMatch = message.match(
    /^estimate must be an integer between 0 and (\d+)\.$/,
  );
  if (estimateRangeMatch) {
    return formatMessage(copy.errors.estimateRange, {
      max: estimateRangeMatch[1],
    });
  }

  const labelsMaxMatch = message.match(
    /^labels must contain (\d+) items or fewer\.$/,
  );
  if (labelsMaxMatch) {
    return formatMessage(copy.errors.labelsMax, {
      max: labelsMaxMatch[1],
    });
  }

  const columnInvalidMatch = message.match(/^Column (\d+) is invalid\.$/);
  if (columnInvalidMatch) {
    return formatMessage(copy.errors.columnInvalid, {
      index: columnInvalidMatch[1],
    });
  }

  return message;
}

async function api<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const r = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const p = (await r.json()) as BoardResponse;
  if (!r.ok) throw new Error(p.error ?? "Request failed.");
  return p as T;
}

function optimisticMove(
  board: KanbanBoard,
  itemId: string,
  dest: string,
): KanbanBoard {
  const items = board.items.map((i) => ({ ...i }));
  const item = items.find((i) => i.id === itemId);
  if (!item) return board;
  const nextOrder =
    items
      .filter((i) => i.columnId === dest && i.id !== itemId)
      .reduce((m, i) => Math.max(m, i.order), -1) + 1;
  item.columnId = dest;
  item.order = nextOrder;
  item.updatedAt = new Date().toISOString();
  return { ...board, items, updatedAt: new Date().toISOString() };
}

/* ─── main component ─── */

export function KanbanApp() {
  const { locale, setLocale, copy } = useI18n();
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardName, setBoardName] = useState<string>(
    copy.onboarding.defaultBoardName,
  );

  const [draftCols, setDraftCols] = useState<UpdateColumnsInput["columns"]>([]);
  const [newColName, setNewColName] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<ItemFormState>(createEmptyForm());

  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [groupBy, setGroupBy] = useState<KanbanGroupBy>("workflow");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const [density, setDensity] = useState<"compact" | "detailed">("detailed");
  const [viewMode, setViewMode] = useState<KanbanViewMode>("board");
  const [sortField, setSortField] = useState<KanbanSortField | null>(null);
  const [sortDir, setSortDir] = useState<KanbanSortDir>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setBoardName((current) =>
      DEFAULT_BOARD_NAMES.includes(current)
        ? copy.onboarding.defaultBoardName
        : current,
    );
  }, [copy.onboarding.defaultBoardName]);

  useEffect(() => {
    (async () => {
      try {
        const d = await api<BoardResponse>(apiUrl("/kanban"), {
          cache: "no-store",
        });
        setBoard(d.board);
        setDraftCols(
          d.board?.columns.map((c) => ({ id: c.id, name: c.name })) ?? [],
        );
        setForm(createEmptyForm(d.board?.columns[0]?.id ?? ""));
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedItem = useMemo(
    () => board?.items.find((i) => i.id === activeId) ?? null,
    [activeId, board],
  );

  const visible = useMemo(() => {
    if (!board) return [];
    return board.items.filter((i) => {
      const cn = colName(board, i.columnId, copy.shared.unknown);
      if (filters.assignee && i.assignee !== filters.assignee) return false;
      if (filters.priority && i.priority !== filters.priority) return false;
      if (filters.label && !i.labels.includes(filters.label)) return false;
      if (filters.status && cn !== filters.status) return false;
      return true;
    });
  }, [board, copy.shared.unknown, filters]);

  const grouped = useMemo(() => {
    if (!board || groupBy === "workflow") return [];
    const g = new Map<string, KanbanWorkItem[]>();
    for (const i of visible) {
      const k =
        groupBy === "assignee"
          ? i.assignee || copy.itemEditor.unassigned
          : groupBy === "priority"
            ? i.priority
            : colName(board, i.columnId, copy.shared.unknown);
      g.set(k, [...(g.get(k) ?? []), i]);
    }
    return Array.from(g.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [board, copy.itemEditor.unassigned, copy.shared.unknown, groupBy, visible]);

  const PRIORITY_ORDER: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

  const sortedItems = useMemo(() => {
    if (!sortField || !sortDir) return visible;
    return [...visible].sort((a, b) => {
      let cmp = 0;
      if (sortField === "priority") {
        cmp = (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
      } else if (sortField === "title") {
        cmp = a.title.localeCompare(b.title);
      } else if (sortField === "status") {
        const sa = board ? colName(board, a.columnId, "") : "";
        const sb = board ? colName(board, b.columnId, "") : "";
        cmp = sa.localeCompare(sb);
      } else if (sortField === "assignee") {
        cmp = a.assignee.localeCompare(b.assignee);
      } else if (sortField === "dueDate") {
        const da = a.dueDate ?? "";
        const db = b.dueDate ?? "";
        cmp = da.localeCompare(db);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [visible, sortField, sortDir, board]);

  const filterOpts = useMemo(() => {
    if (!board)
      return {
        assignees: [] as string[],
        labels: [] as string[],
        statuses: [] as string[],
      };
    return {
      assignees: Array.from(
        new Set(board.items.map((i) => i.assignee).filter(Boolean)),
      ).sort(),
      labels: Array.from(new Set(board.items.flatMap((i) => i.labels))).sort(),
      statuses: board.columns.map((c) => c.name).sort(),
    };
  }, [board]);

  const hasActiveFilters =
    filters.assignee || filters.priority || filters.label || filters.status;
  const errorText = error ? localizeError(error, copy) : null;

  const refresh = useCallback((b: KanbanBoard | null) => {
    setBoard(b);
    setDraftCols(b?.columns.map((c) => ({ id: c.id, name: c.name })) ?? []);
    setForm((cur) =>
      cur.columnId || !b?.columns[0]
        ? cur
        : { ...cur, columnId: b.columns[0].id },
    );
  }, []);

  async function createBoard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMutating(true);
    try {
      const d = await api<BoardResponse>(apiUrl("/kanban"), {
        method: "POST",
        body: JSON.stringify({ name: boardName }),
      });
      refresh(d.board);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setMutating(false);
    }
  }

  async function saveCols() {
    setError(null);
    setMutating(true);
    try {
      const d = await api<BoardResponse>(apiUrl("/kanban/columns"), {
        method: "PATCH",
        body: JSON.stringify({ columns: draftCols }),
      });
      refresh(d.board);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setMutating(false);
    }
  }

  async function submitItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMutating(true);
    try {
      const p = buildPayload(form);
      if (formMode === "edit" && !activeId)
        throw new Error("Select a work item first.");
      const body =
        formMode === "create"
          ? p
          : ({
              id: activeId as string,
              ...p,
            } satisfies UpdateWorkItemInput);
      const d = await api<BoardResponse>(apiUrl("/kanban/items"), {
        method: formMode === "create" ? "POST" : "PATCH",
        body: JSON.stringify(body),
      });
      refresh(d.board);
      if (formMode === "create" && d.board?.columns[0]) {
        setForm(createEmptyForm(d.board.columns[0].id));
      }
      if (formMode === "edit") setSheetOpen(false);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setMutating(false);
    }
  }

  async function moveItem(itemId: string, dest: string) {
    if (!board) return;
    const prev = board;
    setBoard(optimisticMove(board, itemId, dest));
    setError(null);
    try {
      const d = await api<BoardResponse>(apiUrl("/kanban/items"), {
        method: "PATCH",
        body: JSON.stringify({
          id: itemId,
          columnId: dest,
        } satisfies UpdateWorkItemInput),
      });
      refresh(d.board);
    } catch (e) {
      setBoard(prev);
      setError(errMsg(e));
    } finally {
      setDraggingId(null);
      setDragOverCol(null);
    }
  }

  async function deleteItem(itemId: string) {
    const d = await api<BoardResponse>(apiUrl(`/kanban/items/${itemId}`), {
      method: "DELETE",
    });
    refresh(d.board);
  }

  function openCreate() {
    setFormMode("create");
    setActiveId(null);
    setForm(createEmptyForm(board?.columns[0]?.id ?? ""));
    setSheetOpen(true);
  }

  function openEdit(item: KanbanWorkItem) {
    setFormMode("edit");
    setActiveId(item.id);
    setForm(buildItemForm(item));
    setSheetOpen(true);
  }

  function cycleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function themeIcon() {
    if (!mounted || resolvedTheme === "light") {
      return <Sun className="h-4 w-4" />;
    }

    return <Moon className="h-4 w-4" />;
  }

  function themeTooltip() {
    if (!mounted) {
      return copy.theme.label;
    }

    return resolvedTheme === "dark" ? copy.theme.dark : copy.theme.light;
  }


  /* ─── loading ─── */
  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  /* ─── onboarding: create board ─── */
  if (!board)
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Kanban className="h-5 w-5 text-foreground" />
            </div>
            <LanguageSwitcher
              locale={locale}
              onLocaleChange={setLocale}
              copy={copy}
            />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">
              {copy.onboarding.title}
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {copy.onboarding.subtitle}
            </p>
          </div>
          <form className="space-y-4" onSubmit={createBoard}>
            <Input
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder={copy.onboarding.boardPlaceholder}
            />
            {errorText && <p className="text-sm text-destructive">{errorText}</p>}
            <Button type="submit" disabled={mutating} className="w-full">
              {mutating
                ? copy.onboarding.creatingBoard
                : copy.onboarding.createBoard}
            </Button>
          </form>
        </div>
      </div>
    );

  const blockedCount = board.items.filter((i) => i.isBlocked).length;
  const wipCount = board.items.filter((i) =>
    isWip(colName(board, i.columnId)),
  ).length;

  /* ─── main board ─── */
  return (
    <>
      {/* ── sidebar rail ── */}
      <nav className="flex w-14 shrink-0 flex-col items-center gap-1 bg-sidebar py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Kanban className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div className="mt-6 flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/60 transition-colors duration-120 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground!"
                  onClick={() => setCmdOpen(true)}
                />
              }
            >
              <Search className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">
              {copy.shell.searchAndFilter}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/60 transition-colors duration-120 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground!"
                  onClick={openCreate}
                />
              }
            >
              <Plus className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">{copy.shell.newItem}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/60 transition-colors duration-120 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground!"
                  onClick={() => {
                    setSettingsOpen(true);
                    setDraftCols(
                      board.columns.map((c) => ({ id: c.id, name: c.name })),
                    );
                  }}
                />
              }
            >
              <Settings className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">{copy.shell.settings}</TooltipContent>
          </Tooltip>
        </div>

        {/* theme toggle + metrics */}
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          <UserMenu onLogout={handleLogout} />
          <Button
            aria-label={themeTooltip()}
            size="icon"
            className="bg-transparent text-sidebar-foreground/60 transition-colors duration-120 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={cycleTheme}
            title={themeTooltip()}
          >
            {themeIcon()}
          </Button>

          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-sidebar-foreground">
              {board.items.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/50">
              {copy.shell.total}
            </span>
          </div>
          {blockedCount > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-priority-urgent">
                {blockedCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-priority-urgent/60">
                {copy.shell.blocked}
              </span>
            </div>
          )}
          {wipCount > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold text-priority-medium">
                {wipCount}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-priority-medium/60">
                {copy.shell.wip}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* ── content area ── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-base font-semibold">{board.name}</h1>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-primary">
                {copy.shell.filtered}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* view controls group */}
            <div className="flex items-center gap-1">
              {/* view mode switcher: Board / List / Gantt */}
              <div className="flex items-center rounded-md border p-0.5">
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={viewMode === "board" ? "secondary" : "ghost"}
                      size="icon-xs"
                      onClick={() => {
                        setViewMode("board");
                        setSortField(null);
                        setSortDir(null);
                      }}
                      aria-label={copy.views.board}
                    />
                  }>
                    <Kanban className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{copy.views.board}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon-xs"
                      onClick={() => setViewMode("list")}
                      aria-label={copy.views.list}
                    />
                  }>
                    <List className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{copy.views.list}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={viewMode === "gantt" ? "secondary" : "ghost"}
                      size="icon-xs"
                      onClick={() => setViewMode("gantt")}
                      aria-label={copy.views.gantt}
                    />
                  }>
                    <GanttChart className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{copy.views.gantt}</TooltipContent>
                </Tooltip>
              </div>
              {/* density switcher — hidden in gantt mode */}
              {viewMode !== "gantt" && (
              <div className="flex items-center rounded-md border p-0.5">
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={density === "compact" ? "secondary" : "ghost"}
                      size="icon-xs"
                      onClick={() => setDensity("compact")}
                      aria-label={copy.views.compact}
                    />
                  }>
                    <AlignJustify className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{copy.views.compact}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={
                    <Button
                      variant={density === "detailed" ? "secondary" : "ghost"}
                      size="icon-xs"
                      onClick={() => setDensity("detailed")}
                      aria-label={copy.views.detailed}
                    />
                  }>
                    <LayoutList className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{copy.views.detailed}</TooltipContent>
                </Tooltip>
              </div>
              )}
            </div>
            {/* vertical divider separating view controls from action buttons */}
            <div className="h-5 w-px bg-border" aria-hidden="true" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCmdOpen(true)}
            >
              <Filter className="h-3 w-3" /> {copy.shell.filter}{" "}
              <kbd className="ml-1 rounded border px-1 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="h-3 w-3" /> {copy.shell.new}
            </Button>
          </div>
        </header>

        {errorText && (
          <div className="border-b border-destructive/20 bg-destructive/5 px-6 py-2 text-sm text-destructive">
            {errorText}
          </div>
        )}

        {/* list view */}
        {viewMode === "list" && (
          <div className="flex-1 overflow-auto">
            <ListViewLayout
              items={sortedItems}
              board={board}
              sortField={sortField}
              sortDir={sortDir}
              onSort={(field) => {
                if (sortField !== field) {
                  setSortField(field);
                  setSortDir("asc");
                } else if (sortDir === "asc") {
                  setSortDir("desc");
                } else if (sortDir === "desc") {
                  setSortField(null);
                  setSortDir(null);
                }
              }}
              onItemClick={openEdit}
              copy={copy}
              locale={locale}
            />
          </div>
        )}

        {/* gantt view */}
        {viewMode === "gantt" && (
          <div className="flex-1 overflow-hidden">
            <GanttChartComponent
              items={visible}
              columns={board.columns}
              onItemClick={(item) => openEdit(item)}
              copy={copy}
            />
          </div>
        )}

        {/* board columns */}
        {viewMode === "board" && (
        <div className="flex-1 overflow-x-auto">
          {groupBy === "workflow" ? (
            <div className="flex h-full gap-px">
              {board.columns.map((col, idx) => {
                const items = visible
                  .filter((i) => i.columnId === col.id)
                  .sort((a, b) => a.order - b.order);
                const isOver = dragOverCol === col.id;
                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverCol(col.id);
                    }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={() => {
                      if (draggingId) void moveItem(draggingId, col.id);
                      setDragOverCol(null);
                    }}
                    className={`flex h-full min-w-[220px] flex-1 flex-col transition-colors duration-120 ${isOver ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                          {col.name}
                        </h3>
                        <span className="text-[11px] text-muted-foreground/60">
                          {items.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-4">
                      {items.length === 0 ? (
                        <div
                          className={`mx-2 flex items-center justify-center py-12 text-[11px] text-muted-foreground/40 transition-colors duration-120 ${isOver ? "bg-primary/5 text-primary/60" : ""}`}
                        >
                          {isOver ? copy.shell.dropHere : copy.shell.noItems}
                        </div>
                      ) : (
                        items.map((item) => (
                          <WorkItemCard
                            key={item.id}
                            item={item}
                            copy={copy}
                            locale={locale}
                            density={density}
                            onClick={() => openEdit(item)}
                            onDragStart={() => setDraggingId(item.id)}
                            onDragEnd={() => {
                              setDraggingId(null);
                              setDragOverCol(null);
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-6 p-6 lg:grid-cols-2 xl:grid-cols-3">
              {grouped.map(([name, items]) => (
                <div key={name}>
                  <div className="flex items-center gap-2 px-2 pb-3">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                      {groupBy === "priority"
                        ? priorityLabel(name as KanbanPriority, copy)
                        : name}
                    </h3>
                    <span className="text-[11px] text-muted-foreground/60">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <WorkItemCard
                        key={item.id}
                        item={item}
                        copy={copy}
                        locale={locale}
                        density={density}
                        onClick={() => openEdit(item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </main>

      {/* ── item editor dialog ── */}
      <Dialog open={sheetOpen} onOpenChange={(open) => { setSheetOpen(open); if (!open) setConfirmDelete(false); }}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[85vh] p-0">
          {/* hero cover image */}
          {form.coverImage && (
            <CoverImage
              src={form.coverImage}
              height="200px"
              className="rounded-t-lg"
            />
          )}
          <div className="px-6 pt-4 pb-6">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? copy.itemEditor.newWorkItem
                : (selectedItem?.title ?? copy.itemEditor.editItem)}
            </DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4 mt-4" onSubmit={submitItem}>
            <div className="space-y-2">
              <Label htmlFor="item-title">{copy.itemEditor.title}</Label>
              <Input
                id="item-title"
                value={form.title}
                onChange={(e) =>
                  setForm((c) => ({ ...c, title: e.target.value }))
                }
                placeholder={copy.itemEditor.titlePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-desc">{copy.itemEditor.description}</Label>
              <Textarea
                id="item-desc"
                className="min-h-[80px] resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm((c) => ({ ...c, description: e.target.value }))
                }
                placeholder={copy.itemEditor.descriptionPlaceholder}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="item-assignee">{copy.itemEditor.assignee}</Label>
                <Input
                  id="item-assignee"
                  value={form.assignee}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, assignee: e.target.value }))
                  }
                  placeholder={copy.itemEditor.assigneePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <Label>{copy.itemEditor.priority}</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm((c) => ({
                      ...c,
                      priority: (v as KanbanPriority) ?? c.priority,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KANBAN_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {priorityLabel(p, copy)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{copy.itemEditor.column}</Label>
                <Select
                  value={form.columnId}
                  onValueChange={(v) =>
                    setForm((c) => ({ ...c, columnId: v ?? c.columnId }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {board.columns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-estimate">{copy.itemEditor.estimate}</Label>
                <Input
                  id="item-estimate"
                  type="number"
                  value={form.estimate}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, estimate: e.target.value }))
                  }
                  placeholder={copy.itemEditor.estimatePlaceholder}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="item-start">{copy.itemEditor.startDate}</Label>
                <Input
                  id="item-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, startDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-due">{copy.itemEditor.dueDate}</Label>
                <Input
                  id="item-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((c) => ({ ...c, dueDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-labels">{copy.itemEditor.labels}</Label>
              <Input
                id="item-labels"
                value={form.labels}
                onChange={(e) =>
                  setForm((c) => ({ ...c, labels: e.target.value }))
                }
                placeholder={copy.itemEditor.labelsPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-cover">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {copy.itemEditor.coverImage}
                </span>
              </Label>
              <Input
                id="item-cover"
                value={form.coverImage}
                onChange={(e) =>
                  setForm((c) => ({ ...c, coverImage: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="item-blocked"
                checked={form.isBlocked}
                onCheckedChange={(checked) =>
                  setForm((c) => ({ ...c, isBlocked: !!checked }))
                }
              />
              <Label htmlFor="item-blocked">{copy.itemEditor.blocked}</Label>
            </div>
            <div className="flex gap-2 border-t pt-4">
              <Button type="submit" disabled={mutating} className="flex-1">
                {formMode === "create"
                  ? mutating
                    ? copy.itemEditor.creating
                    : copy.itemEditor.create
                  : mutating
                    ? copy.itemEditor.saving
                    : copy.itemEditor.save}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
              >
                {copy.itemEditor.cancel}
              </Button>
              {formMode === "edit" && activeId && (
                confirmDelete ? (
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={mutating}
                    onClick={async () => {
                      setError(null);
                      setMutating(true);
                      try {
                        await deleteItem(activeId);
                        setSheetOpen(false);
                      } catch (e) {
                        setError(errMsg(e));
                      } finally {
                        setMutating(false);
                        setConfirmDelete(false);
                      }
                    }}
                  >
                    {mutating ? copy.itemEditor.deleting : copy.itemEditor.confirmDelete}
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setConfirmDelete(true)}
                        />
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </TooltipTrigger>
                    <TooltipContent>{copy.itemEditor.delete}</TooltipContent>
                  </Tooltip>
                )
              )}
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── command bar ── */}
      <CommandDialog
        open={cmdOpen}
        onOpenChange={(open) => {
          setCmdOpen(open);
          if (!open) setCmdQuery("");
        }}
        title={copy.commands.title}
        description={copy.commands.description}
      >
        <Command shouldFilter={true}>
          <CommandInput
            placeholder={copy.commands.placeholder}
            value={cmdQuery}
            onValueChange={setCmdQuery}
          />
          <CommandList>
            <CommandEmpty>{copy.commands.noResults}</CommandEmpty>
            <CommandGroup heading={copy.commands.filtersHeading}>
              <CommandItem
                onSelect={() => {
                  setFilters(EMPTY_FILTERS);
                  setCmdOpen(false);
                  setCmdQuery("");
                }}
              >
                {copy.commands.clearAllFilters}
              </CommandItem>
              {filterOpts.assignees.map((a) => (
                <CommandItem
                  key={a}
                  data-checked={filters.assignee === a}
                  onSelect={() => {
                    setFilters((f) => ({
                      ...f,
                      assignee: f.assignee === a ? "" : a,
                    }));
                    setCmdOpen(false);
                    setCmdQuery("");
                  }}
                >
                  {copy.commands.assigneePrefix}: {a}
                </CommandItem>
              ))}
              {KANBAN_PRIORITIES.map((p) => (
                <CommandItem
                  key={p}
                  data-checked={filters.priority === p}
                  onSelect={() => {
                    setFilters((f) => ({
                      ...f,
                      priority: f.priority === p ? "" : p,
                    }));
                    setCmdOpen(false);
                    setCmdQuery("");
                  }}
                >
                  {copy.commands.priorityPrefix}: {priorityLabel(p, copy)}
                </CommandItem>
              ))}
              {filterOpts.labels.map((l) => (
                <CommandItem
                  key={l}
                  data-checked={filters.label === l}
                  onSelect={() => {
                    setFilters((f) => ({
                      ...f,
                      label: f.label === l ? "" : l,
                    }));
                    setCmdOpen(false);
                    setCmdQuery("");
                  }}
                >
                  {copy.commands.labelPrefix}: {l}
                </CommandItem>
              ))}
              {filterOpts.statuses.map((s) => (
                <CommandItem
                  key={s}
                  data-checked={filters.status === s}
                  onSelect={() => {
                    setFilters((f) => ({
                      ...f,
                      status: f.status === s ? "" : s,
                    }));
                    setCmdOpen(false);
                    setCmdQuery("");
                  }}
                >
                  {copy.commands.statusPrefix}: {s}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={copy.commands.groupByHeading}>
              {(["workflow", "assignee", "priority", "status"] as const).map(
                (g) => (
                  <CommandItem
                    key={g}
                    data-checked={groupBy === g}
                    onSelect={() => {
                      setGroupBy(g);
                      setCmdOpen(false);
                      setCmdQuery("");
                    }}
                  >
                    {copy.commands.groupPrefix}: {groupByLabel(g, copy)}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      {/* ── settings drawer ── */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{copy.settings.workflowColumns}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Language
              </p>
              <LanguageSwitcher
                locale={locale}
                onLocaleChange={setLocale}
                copy={copy}
              />
            </div>
            <div className="space-y-2">
            {draftCols.map((col, idx) => {
              const count = board.items.filter(
                (i) => i.columnId === col.id,
              ).length;
              return (
                <div
                  key={col.id ?? `new-${idx}`}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <Input
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                    value={col.name}
                    onChange={(e) =>
                      setDraftCols((c) =>
                        c.map((entry, i) =>
                          i === idx
                            ? { ...entry, name: e.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {count}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setDraftCols((c) => {
                        if (idx === 0) return c;
                        const n = [...c];
                        [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]];
                        return n;
                      })
                    }
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() =>
                      setDraftCols((c) => {
                        if (idx === c.length - 1) return c;
                        const n = [...c];
                        [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]];
                        return n;
                      })
                    }
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setDraftCols((c) => c.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
          <div className="border-t p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                className="flex-1"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder={copy.settings.newColumnName}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (!newColName.trim()) return;
                  setDraftCols((c) => [...c, { name: newColName.trim() }]);
                  setNewColName("");
                }}
              >
                {copy.settings.add}
              </Button>
            </div>
            <Button
              onClick={() => {
                void saveCols();
                setSettingsOpen(false);
              }}
              disabled={mutating}
              className="w-full"
            >
              {copy.settings.saveWorkflow}
            </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ─── sub-components ─── */

function LanguageSwitcher({
  locale,
  onLocaleChange,
  copy,
  className,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  copy: AppDictionary;
  className?: string;
}) {
  return (
    <Select value={locale} onValueChange={(value) => onLocaleChange(value as Locale)}>
      <SelectTrigger
        aria-label={copy.locale.label}
        className={cn("h-8 min-w-[124px]", className)}
      >
        <Languages className="h-3.5 w-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{localeLabel("en", copy)}</SelectItem>
        <SelectItem value="zh-TW">{localeLabel("zh-TW", copy)}</SelectItem>
      </SelectContent>
    </Select>
  );
}

function CoverImage({
  src,
  height,
  className,
}: {
  src: string;
  height: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  return status === "error" ? null : (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ height }}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}

function WorkItemCard({
  item,
  copy,
  locale,
  density = "detailed",
  onClick,
  onDragStart,
  onDragEnd,
}: {
  item: KanbanWorkItem;
  copy: AppDictionary;
  locale: Locale;
  density?: "compact" | "detailed";
  onClick: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const visibleLabels = item.labels.slice(0, 3);
  const overflowCount = item.labels.length - 3;
  const isCompact = density === "compact";

  return (
    <button
      type="button"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-lg border border-border/50 bg-card text-left shadow-sm transition-all duration-150",
        "hover:shadow-md hover:border-border",
        isCompact ? "flex-row items-center" : "",
      )}
    >
      {/* cover image — detailed only */}
      {!isCompact && item.coverImage && (
        <CoverImage
          src={item.coverImage}
          height="120px"
          className="rounded-t-lg"
        />
      )}

      <div className={cn("flex flex-1 flex-col gap-1.5 p-3", isCompact && "flex-row items-center gap-2.5 py-2")}>
        {/* title row */}
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-1 shrink-0 rounded-full"
            style={{ background: priorityColor(item.priority) }}
          />
          <span className={cn("flex-1 truncate text-[13px] font-medium", isCompact && "text-[13px]")}>
            {item.title}
          </span>
          {item.isBlocked && (
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
          )}
          {isCompact && (
            <>
              <Badge className={cn(priorityBadgeClass(item.priority), "text-[10px]")}>
                {priorityLabel(item.priority, copy)}
              </Badge>
              {item.assignee ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {item.assignee.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                  ?
                </span>
              )}
            </>
          )}
        </div>

        {/* description snippet — detailed only */}
        {!isCompact && item.description && (
          <p className="line-clamp-2 pl-[14px] text-[12px] leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}

        {/* metadata footer — detailed only */}
        {!isCompact && (
          <div className="flex flex-wrap items-center gap-1.5 pl-[14px] pt-0.5">
            {item.isBlocked && (
              <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                {copy.itemEditor.blocked}
              </Badge>
            )}
            <Badge className={cn(priorityBadgeClass(item.priority), "px-1.5 py-0 text-[10px]")}>
              {priorityLabel(item.priority, copy)}
            </Badge>
            {visibleLabels.map((l) => (
              <Badge
                key={l}
                variant="outline"
                className="px-1.5 py-0 text-[10px] text-primary"
              >
                {l}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                +{overflowCount}
              </span>
            )}
            {item.dueDate && (
              <Badge
                variant="secondary"
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0 text-[10px]",
                  URGENCY_BADGE_CLASS[getDueDateUrgency(item.dueDate)],
                )}
              >
                <Calendar className="h-2.5 w-2.5" />
                {formatDueDate(item.dueDate, locale, copy.shared)}
              </Badge>
            )}
            {item.estimate != null && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {item.estimate} {copy.shared.points}
              </Badge>
            )}
            <div className="flex-1" />
            {item.assignee ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {item.assignee.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                ?
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

const SORTABLE_COLS: Array<{ field: KanbanSortField; labelKey: keyof AppDictionary["listView"] }> = [
  { field: "priority", labelKey: "priority" },
  { field: "title", labelKey: "title" },
  { field: "status", labelKey: "status" },
  { field: "assignee", labelKey: "assignee" },
  { field: "dueDate", labelKey: "dueDate" },
];

function ListViewLayout({
  items,
  board,
  sortField,
  sortDir,
  onSort,
  onItemClick,
  copy,
  locale,
}: {
  items: KanbanWorkItem[];
  board: KanbanBoard;
  sortField: KanbanSortField | null;
  sortDir: KanbanSortDir;
  onSort: (field: KanbanSortField) => void;
  onItemClick: (item: KanbanWorkItem) => void;
  copy: AppDictionary;
  locale: Locale;
}) {
  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="sticky top-0 z-10 flex items-center border-b border-border bg-background px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
        {SORTABLE_COLS.map(({ field, labelKey }) => (
          <button
            key={field}
            type="button"
            onClick={() => onSort(field)}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground",
              field === "priority" && "w-24 shrink-0",
              field === "title" && "min-w-0 flex-1",
              field === "status" && "w-32 shrink-0",
              field === "assignee" && "w-28 shrink-0",
              field === "dueDate" && "w-28 shrink-0",
            )}
          >
            {copy.listView[labelKey]}
            {sortField === field && (
              sortDir === "asc"
                ? <ChevronUp className="h-3 w-3" />
                : <ChevronDown className="h-3 w-3" />
            )}
          </button>
        ))}
        <span className="w-24 shrink-0 px-2 py-1">{copy.listView.labels}</span>
        <span className="w-16 shrink-0 px-2 py-1 text-right">{copy.listView.estimate}</span>
      </div>

      {/* rows */}
      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          {copy.listView.noItems}
        </div>
      ) : (
        items.map((item) => (
          <ListViewRow
            key={item.id}
            item={item}
            statusName={colName(board, item.columnId, copy.shared.unknown)}
            copy={copy}
            locale={locale}
            onClick={() => onItemClick(item)}
          />
        ))
      )}
    </div>
  );
}

function ListViewRow({
  item,
  statusName,
  copy,
  locale,
  onClick,
}: {
  item: KanbanWorkItem;
  statusName: string;
  copy: AppDictionary;
  locale: Locale;
  onClick: () => void;
}) {
  const visibleLabels = item.labels.slice(0, 2);
  const overflowCount = item.labels.length - 2;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center border-b border-border/50 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent/40"
    >
      {/* priority */}
      <div className="flex w-24 shrink-0 items-center gap-1.5 px-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: `var(--priority-${item.priority})` }}
        />
        <span className="text-xs capitalize text-muted-foreground">{item.priority}</span>
      </div>

      {/* title */}
      <div className="flex min-w-0 flex-1 items-center gap-1.5 px-2">
        {item.isBlocked && (
          <AlertTriangle className="h-3 w-3 shrink-0 text-priority-urgent" />
        )}
        <span className="truncate font-medium text-foreground">{item.title}</span>
      </div>

      {/* status */}
      <span className="w-32 shrink-0 truncate px-2 text-xs text-muted-foreground">
        {statusName}
      </span>

      {/* assignee */}
      <span className="w-28 shrink-0 truncate px-2 text-xs text-muted-foreground">
        {item.assignee || copy.itemEditor.unassigned}
      </span>

      {/* due date */}
      <span className={cn(
        "w-28 shrink-0 px-2 text-xs",
        item.dueDate ? URGENCY_TEXT_CLASS[getDueDateUrgency(item.dueDate)] : "text-muted-foreground",
      )}>
        {item.dueDate ? formatDueDate(item.dueDate, locale, copy.shared) : ""}
      </span>

      {/* labels */}
      <div className="flex w-24 shrink-0 items-center gap-1 px-2">
        {visibleLabels.map((l) => (
          <Badge key={l} variant="secondary" className="truncate px-1 py-0 text-[10px]">
            {l}
          </Badge>
        ))}
        {overflowCount > 0 && (
          <span className="text-[10px] text-muted-foreground">+{overflowCount}</span>
        )}
      </div>

      {/* estimate */}
      <span className="w-16 shrink-0 px-2 text-right text-xs text-muted-foreground">
        {item.estimate != null ? `${item.estimate} ${copy.shared.points}` : ""}
      </span>
    </button>
  );
}
