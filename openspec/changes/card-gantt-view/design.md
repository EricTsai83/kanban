## Context

目前看板應用使用 `KanbanWorkItem` 資料模型，包含 `dueDate`、`createdAt`、`updatedAt` 等時間欄位，但缺少 `startDate`。現有視圖只有工作流欄位視圖（workflow）和分組視圖（grouped by assignee/priority/status），均以卡片列表形式呈現，無法在時間維度上表達排程。

前端為單一 `kanban-app.tsx` 元件（約 1400 行），使用 Shadcn UI + Tailwind CSS，透過 REST API (`/api/kanban/*`) 與 JSON 檔案後端互動。

## Goals / Non-Goals

**Goals:**
- 擴充資料模型，為 `KanbanWorkItem` 新增 `startDate` 欄位
- 建立純 React/CSS 甘特圖元件，不引入外部圖表套件
- 讓甘特圖視圖與現有篩選/分組機制共用相同的資料流
- 甘特圖橫條以優先級顏色編碼，hover 顯示詳細資訊

**Non-Goals:**
- 甘特圖上拖曳調整日期（此階段為唯讀視圖）
- 任務依賴關係的連線呈現
- 虛擬捲動（卡片數量預期在百張以內）

## Decisions

### Decision 1: 純 CSS Grid 實作甘特圖，不使用外部套件

**選擇**: 使用 CSS Grid + 內聯定位計算渲染甘特圖橫條

**替代方案考量**:
- `gantt-task-react` 或 `frappe-gantt`: 功能完整但增加 bundle 體積，且樣式難以與 Shadcn/Tailwind 整合
- Canvas 渲染: 效能好但失去 DOM 事件處理與無障礙支援

**理由**: 專案風格傾向輕量自建元件，且甘特圖需求相對簡單（無依賴線、無拖曳），純 CSS Grid 實作足以應對，並保持與現有 UI 系統的一致性。

### Decision 2: startDate 為 nullable 欄位，預設以 createdAt 作為回退

**選擇**: `startDate: string | null`，甘特圖渲染時若 `startDate` 為 null 則以 `createdAt` 作為起點

**理由**: 向後相容既有資料，不強制使用者補填歷史資料即可看到甘特圖。

### Decision 3: 沒有 dueDate 的卡片在甘特圖中不顯示橫條

**選擇**: 只渲染同時具有起點（startDate 或 createdAt 回退）和 `dueDate` 的卡片橫條；缺少 dueDate 的卡片以里程碑標記（菱形圖示）顯示在起始點上。

**理由**: 沒有結束日期的任務無法構成有意義的時間區間，但仍需在時間軸上有存在感。

### Decision 4: 時間軸範圍自動推算

**選擇**: 從可見卡片的最早起始日期和最晚截止日期自動計算顯示範圍，前後各留 2 天 padding。

**理由**: 避免使用者手動設定日期範圍，減少操作步驟。

### Decision 5: 甘特圖元件作為獨立檔案

**選擇**: 建立 `components/gantt-chart.tsx` 作為獨立元件，接收 `items`、`columns`、`onItemClick` 等 props。

**理由**: 減少 `kanban-app.tsx` 的複雜度，保持單一職責。

## Risks / Trade-offs

- **[大量卡片效能]** → 百張以內使用 DOM 渲染可接受；若未來卡片量大幅增長，可考慮虛擬化或 Canvas 渲染
- **[時間軸精度]** → 以「天」為最小刻度單位；若需「小時」粒度需重構刻度邏輯
- **[既有資料缺少 startDate]** → 使用 createdAt 回退，甘特圖可能不完全精確但仍提供有意義的時間線
- **[JSON 資料遷移]** → startDate 為 nullable 新欄位，既有 JSON 不需遷移，讀取時缺失即為 null
