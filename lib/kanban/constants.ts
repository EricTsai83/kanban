export const DEFAULT_ENGINEERING_COLUMN_NAMES = [
  "Backlog",
  "Ready",
  "In Progress",
  "In Review",
  "Blocked",
  "Testing",
  "Done",
] as const;

export const KANBAN_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const MAX_BOARD_NAME_LENGTH = 80;
export const MAX_COLUMN_NAME_LENGTH = 40;
export const MAX_WORK_ITEM_TITLE_LENGTH = 120;
export const MAX_WORK_ITEM_DESCRIPTION_LENGTH = 2000;
export const MAX_ASSIGNEE_LENGTH = 80;
export const MAX_LABEL_LENGTH = 24;
export const MAX_LABEL_COUNT = 8;
export const MAX_ESTIMATE_POINTS = 40;
