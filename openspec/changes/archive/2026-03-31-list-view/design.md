## Context

目前 `kanban-app.tsx` 以 `groupBy` state 控制看板的呈現方式：`workflow` 模式渲染欄位式看板，其他模式（assignee/priority/status）渲染分組卡片。所有視圖共用同一個 `WorkItemRow` 元件和 `visible` 篩選邏輯。目前沒有「視圖模式」的概念——只有密度切換（compact/detailed）。

## Goals / Non-Goals

**Goals:**
- 新增 `viewMode` state（`"board" | "list"`）控制整體視圖呈現
- 列表視圖以全寬度表格式渲染所有可見工作項目，每行顯示完整欄位資訊
- 列表支援欄位標題排序（點擊切換升序/降序）
- 現有篩選、搜尋、command palette 在列表模式下完全相容
- header 中新增視圖模式切換器，與現有密度切換並列

**Non-Goals:**
- 不做虛擬列表（virtual scroll）——項目數量在合理範圍內
- 不做列的寬度調整或欄位顯示/隱藏
- 不做列表行的拖拉排序
- 不做多選/批次操作

## Decisions

### Decision 1: viewMode 作為 component-level state

在 `KanbanApp` 中新增 `useState<"board" | "list">("board")` 管理視圖模式。不需要持久化到 URL 或 localStorage——這是 UI 偏好，保持簡單。

**替代方案**: 持久化到 localStorage → 增加複雜度，目前不值得。

### Decision 2: 列表視圖直接復用 `visible` 篩選結果

列表視圖使用和看板完全相同的 `visible` memoized array，只是渲染為表格行而非卡片。這確保篩選邏輯零重複。

### Decision 3: 排序邏輯獨立於篩選

新增 `sortField` 和 `sortDir` state，僅在 `viewMode === "list"` 時生效。排序透過 `useMemo` 在 `visible` 之上做第二層處理，不影響原始資料。

**替代方案**: 合併排序和篩選進同一個 pipeline → 會污染看板模式的 order。

### Decision 4: 列表行使用獨立的 `ListViewRow` 元件

雖然可以復用 `WorkItemRow`，但列表行的佈局是水平表格式（固定欄位寬度），與卡片式的垂直佈局差異太大。建立獨立元件更清晰。

### Decision 5: 視圖切換器置入 header 的密度切換旁邊

在 header 的密度切換左側新增 Kanban/List 圖示切換按鈕組。使用 Lucide 的 `Kanban` 和 `List` icon。切換到 list mode 時隱藏密度切換（列表模式固定為單行密度）。

## Risks / Trade-offs

- [列表視圖效能] 當項目超過數百個時表格渲染可能變慢 → 目前不做虛擬化，視實際使用狀況再決定
- [欄位寬度] 固定比例分配可能在極端內容下不夠靈活 → 使用 `min-w` + `truncate` 確保不破版
- [狀態同步] 在列表模式下排序和在看板模式下的 column order 是獨立的 → 切換回看板時排序重置，這是預期行為
