import type { Metadata } from "next";

export const SUPPORTED_LOCALES = ["en", "zh-TW"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "openspec.locale";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string ? T[K] : DeepPartial<T[K]>;
};

const en = {
  metadata: {
    title: "Engineering Kanban",
    description: "Kanban workspace for software engineering teams",
  },
  locale: {
    label: "Language",
    english: "English",
    traditionalChinese: "Traditional Chinese",
  },
  shared: {
    unknown: "Unknown",
    points: "pts",
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
  },
  onboarding: {
    title: "Create your board",
    subtitle:
      "A workflow optimized for backlog, review, blockers, testing, and delivery.",
    defaultBoardName: "Software Engineering Team",
    boardPlaceholder: "Platform Engineering",
    createBoard: "Create board",
    creatingBoard: "Creating...",
  },
  shell: {
    searchAndFilter: "Search & Filter",
    newItem: "New Item",
    settings: "Settings",
    filtered: "Filtered",
    filter: "Filter",
    new: "New",
    total: "total",
    blocked: "blocked",
    wip: "wip",
    dropHere: "Drop here",
    noItems: "No items",
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    systemWithResolved: "System ({resolved})",
  },
  itemEditor: {
    newWorkItem: "New work item",
    editItem: "Edit item",
    title: "Title",
    description: "Description",
    assignee: "Assignee",
    priority: "Priority",
    column: "Column",
    estimate: "Estimate",
    startDate: "Start date",
    dueDate: "Due date",
    labels: "Labels",
    blocked: "Blocked",
    create: "Create",
    creating: "Creating...",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    titlePlaceholder: "Implement sprint burndown query",
    descriptionPlaceholder: "Details, acceptance notes, review context",
    assigneePlaceholder: "Alex",
    estimatePlaceholder: "5",
    labelsPlaceholder: "frontend, api",
    coverImage: "Cover Image URL",
    unassigned: "Unassigned",
    delete: "Delete",
    confirmDelete: "Confirm delete?",
    deleting: "Deleting...",
  },
  commands: {
    title: "Search & Filter",
    description:
      "Search items, filter by assignee/priority/label/status, or change grouping.",
    placeholder: "Search items, filter, or group...",
    noResults: "No results found.",
    filtersHeading: "Filters",
    clearAllFilters: "Clear all filters",
    assigneePrefix: "Assignee",
    priorityPrefix: "Priority",
    labelPrefix: "Label",
    statusPrefix: "Status",
    groupByHeading: "Group by",
    groupPrefix: "Group",
  },
  settings: {
    workflowColumns: "Workflow columns",
    newColumnName: "New column name",
    add: "Add",
    saveWorkflow: "Save workflow",
  },
  views: {
    compact: "Compact",
    detailed: "Detailed",
    gantt: "Gantt",
    ganttEmpty: "No items with dates to display.",
    ganttEmptyHint: "Add a due date to work items to see them on the timeline.",
    milestone: "Milestone",
    board: "Board",
    list: "List",
  },
  listView: {
    priority: "Priority",
    title: "Title",
    status: "Status",
    assignee: "Assignee",
    labels: "Labels",
    dueDate: "Due Date",
    estimate: "Estimate",
    noItems: "No items match the current filters.",
  },
  groupBy: {
    workflow: "Workflow",
    assignee: "Assignee",
    priority: "Priority",
    status: "Status",
  },
  priority: {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  },
  errors: {
    generic: "Something went wrong.",
    selectWorkItemFirst: "Select a work item first.",
    requestFailed: "Request failed.",
    failedLoadBoard: "Failed to load persisted board.",
    boardAlreadyExists: "A board already exists.",
    createBoardFirst: "Create a board before updating it.",
    moveItemsBeforeRemovingColumn:
      "Move all work items out of a column before removing it.",
    workItemNotFound: "Work item not found.",
    fieldRequired: "{field} is required.",
    fieldMustBeString: "{field} must be a string.",
    fieldMaxLength: "{field} must be {max} characters or fewer.",
    priorityInvalid: "Priority must be one of low, medium, high, or urgent.",
    estimateNumber: "Estimate must be a number.",
    estimateRange: "Estimate must be an integer between 0 and {max}.",
    dueDateString: "Due date must be a string.",
    dueDateFormat: "Due date must use YYYY-MM-DD format.",
    labelsArray: "Labels must be an array of strings.",
    labelsMax: "Labels must contain {max} items or fewer.",
    columnsMin: "Columns must contain at least one column.",
    columnInvalid: "Column {index} is invalid.",
    columnIdsUnique: "Column IDs must be unique.",
    columnNamesUnique: "Column names must be unique.",
    workItemPayloadInvalid: "Work item payload is invalid.",
    columnIdInvalid: "Column ID must reference an existing board column.",
    isBlockedBoolean: "Blocked must be a boolean.",
    storedBoardInvalid: "Stored board is invalid.",
    storedBoardMissing: "Stored board is missing columns or items.",
  },
  fields: {
    boardName: "Board name",
    columnName: "Column name",
    title: "Title",
    description: "Description",
    assignee: "Assignee",
    label: "Label",
    columnId: "Column ID",
    id: "ID",
  },
};

type Dictionary = typeof en;

const zhTw: DeepPartial<Dictionary> = {
  metadata: {
    title: "工程看板",
    description: "為軟體工程團隊打造的看板工作區",
  },
  locale: {
    label: "語言",
    traditionalChinese: "繁體中文",
  },
  shared: {
    unknown: "未知",
    points: "點",
    today: "今天",
    tomorrow: "明天",
    yesterday: "昨天",
  },
  onboarding: {
    title: "建立你的看板",
    subtitle:
      "為 backlog、review、阻塞、testing 與 delivery 最佳化的工作流程。",
    defaultBoardName: "軟體工程團隊",
    boardPlaceholder: "平台工程團隊",
    createBoard: "建立看板",
    creatingBoard: "建立中...",
  },
  shell: {
    searchAndFilter: "搜尋與篩選",
    newItem: "新增項目",
    settings: "設定",
    filtered: "已篩選",
    filter: "篩選",
    new: "新增",
    total: "總計",
    blocked: "阻塞",
    wip: "進行中",
    dropHere: "拖曳到此",
    noItems: "沒有項目",
  },
  theme: {
    label: "主題",
    light: "淺色",
    dark: "深色",
    system: "系統",
    systemWithResolved: "系統 ({resolved})",
  },
  itemEditor: {
    newWorkItem: "新增工作項目",
    editItem: "編輯項目",
    title: "標題",
    description: "描述",
    assignee: "負責人",
    priority: "優先級",
    column: "欄位",
    estimate: "預估",
    startDate: "開始日期",
    dueDate: "到期日",
    labels: "標籤",
    blocked: "阻塞",
    create: "建立",
    creating: "建立中...",
    save: "儲存",
    saving: "儲存中...",
    cancel: "取消",
    titlePlaceholder: "實作 sprint 燃盡圖查詢",
    descriptionPlaceholder: "細節、驗收備註、review 背景",
    assigneePlaceholder: "Alex",
    estimatePlaceholder: "5",
    labelsPlaceholder: "frontend, api",
    coverImage: "封面圖片 URL",
    unassigned: "未指派",
    delete: "刪除",
    confirmDelete: "確認刪除？",
    deleting: "刪除中...",
  },
  commands: {
    title: "搜尋與篩選",
    description: "搜尋項目、依負責人/優先級/標籤/狀態篩選，或變更分組方式。",
    placeholder: "搜尋項目、篩選或分組...",
    noResults: "找不到結果。",
    filtersHeading: "篩選",
    clearAllFilters: "清除所有篩選",
    assigneePrefix: "負責人",
    priorityPrefix: "優先級",
    labelPrefix: "標籤",
    statusPrefix: "狀態",
    groupByHeading: "分組方式",
    groupPrefix: "分組",
  },
  settings: {
    workflowColumns: "流程欄位",
    newColumnName: "新欄位名稱",
    add: "新增",
    saveWorkflow: "儲存流程",
  },
  views: {
    compact: "緊湊",
    detailed: "詳細",
    gantt: "甘特圖",
    ganttEmpty: "沒有具有日期的項目可顯示。",
    ganttEmptyHint: "為工作項目新增到期日，即可在時間軸上查看。",
    milestone: "里程碑",
    board: "看板",
    list: "列表",
  },
  listView: {
    priority: "優先級",
    title: "標題",
    status: "狀態",
    assignee: "負責人",
    labels: "標籤",
    dueDate: "到期日",
    estimate: "預估",
    noItems: "沒有符合篩選條件的項目。",
  },
  groupBy: {
    workflow: "工作流程",
    assignee: "負責人",
    priority: "優先級",
    status: "狀態",
  },
  priority: {
    low: "低",
    medium: "中",
    high: "高",
    urgent: "緊急",
  },
  errors: {
    generic: "發生錯誤。",
    selectWorkItemFirst: "請先選擇工作項目。",
    requestFailed: "請求失敗。",
    failedLoadBoard: "載入已保存的看板失敗。",
    boardAlreadyExists: "看板已存在。",
    createBoardFirst: "請先建立看板，再進行更新。",
    moveItemsBeforeRemovingColumn: "移除欄位前，請先把所有工作項目移出該欄位。",
    workItemNotFound: "找不到工作項目。",
    fieldRequired: "{field}為必填。",
    fieldMustBeString: "{field}必須是字串。",
    fieldMaxLength: "{field}必須少於或等於 {max} 個字元。",
    priorityInvalid: "優先級必須是低、中、高或緊急其中之一。",
    estimateNumber: "預估必須是數字。",
    estimateRange: "預估必須是 0 到 {max} 之間的整數。",
    dueDateString: "到期日必須是字串。",
    dueDateFormat: "到期日必須使用 YYYY-MM-DD 格式。",
    labelsArray: "標籤必須是字串陣列。",
    labelsMax: "標籤最多只能有 {max} 個。",
    columnsMin: "欄位至少需要一個。",
    columnInvalid: "第 {index} 個欄位無效。",
    columnIdsUnique: "欄位 ID 必須唯一。",
    columnNamesUnique: "欄位名稱必須唯一。",
    workItemPayloadInvalid: "工作項目內容無效。",
    columnIdInvalid: "欄位 ID 必須對應到既有看板欄位。",
    isBlockedBoolean: "阻塞欄位必須是布林值。",
    storedBoardInvalid: "已保存的看板資料無效。",
    storedBoardMissing: "已保存的看板缺少 columns 或 items。",
  },
  fields: {
    boardName: "看板名稱",
    columnName: "欄位名稱",
    title: "標題",
    description: "描述",
    assignee: "負責人",
    label: "標籤",
    columnId: "欄位 ID",
    id: "ID",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  overrides: DeepPartial<T>,
): T {
  const result = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const overrideValue = overrides[key];

    if (overrideValue === undefined) {
      continue;
    }

    const baseValue = base[key];

    if (isRecord(baseValue) && isRecord(overrideValue)) {
      result[key as string] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as DeepPartial<Record<string, unknown>>,
      );
      continue;
    }

    result[key as string] = overrideValue;
  }

  return result as T;
}

const dictionaries: Record<Locale, Dictionary> = {
  en,
  "zh-TW": deepMerge(en, zhTw),
};

export type AppDictionary = Dictionary;

export const defaultMetadata: Metadata = {
  title: en.metadata.title,
  description: en.metadata.description,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getDictionary(locale: Locale): AppDictionary {
  return dictionaries[locale];
}

export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    return value == null ? "" : String(value);
  });
}
