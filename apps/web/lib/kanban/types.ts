import type { KANBAN_PRIORITIES } from "@/lib/kanban/constants";

export type KanbanPriority = (typeof KANBAN_PRIORITIES)[number];

export type KanbanGroupBy = "workflow" | "assignee" | "priority" | "status";

export type KanbanViewMode = "board" | "list" | "gantt";

export type KanbanSortField = "priority" | "title" | "status" | "assignee" | "dueDate";

export type KanbanSortDir = "asc" | "desc" | null;

export type KanbanColumn = {
  id: string;
  name: string;
  order: number;
};

export type KanbanWorkItem = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: KanbanPriority;
  labels: string[];
  estimate: number | null;
  startDate: string | null;
  dueDate: string | null;
  isBlocked: boolean;
  coverImage: string | null;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type KanbanBoard = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  columns: KanbanColumn[];
  items: KanbanWorkItem[];
};

export type CreateBoardInput = {
  name: string;
};

export type UpdateColumnsInput = {
  columns: Array<{
    id?: string;
    name: string;
  }>;
};

export type CreateWorkItemInput = {
  title: string;
  description?: string;
  assignee?: string;
  priority?: KanbanPriority;
  labels?: string[];
  estimate?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  isBlocked?: boolean;
  coverImage?: string | null;
  columnId: string;
};

export type UpdateWorkItemInput = {
  id: string;
  title?: string;
  description?: string;
  assignee?: string;
  priority?: KanbanPriority;
  labels?: string[];
  estimate?: number | null;
  startDate?: string | null;
  dueDate?: string | null;
  isBlocked?: boolean;
  coverImage?: string | null;
  columnId?: string;
};
