## Why

目前看板只有 workflow 欄位視圖和分組視圖，缺少一個扁平化的列表模式。當工作項目數量增多時，使用者需要像筆記軟體那樣以一行一行的方式快速掃描所有項目，方便排序、篩選和批次檢閱——而不需要在多個欄位之間橫向滾動。

## What Changes

- 新增「列表視圖」模式：將所有工作項目以扁平的表格式列表呈現，每個項目佔一行
- 在 header 新增視圖切換器：可在 Kanban（看板）與 List（列表）之間切換
- 列表行顯示：priority indicator、標題、狀態欄位（所屬 column 名稱）、assignee、labels、due date、estimate
- 支援點擊列排序：可按 priority、title、status、assignee、due date 排序
- 現有的篩選（filter）和搜尋（command palette）在列表模式下同樣生效
- 點擊列表行打開既有的 item editor dialog

## Non-goals

- 不改動資料模型或 API
- 不新增任何 npm 套件
- 不改動看板拖拉排序邏輯
- 不做多選或批次操作（未來可擴充）
- 列表視圖不支援拖拉

## Capabilities

### New Capabilities
- `list-view-layout`: 列表視圖的佈局與渲染——扁平化表格式列表、欄位定義、行元件
- `list-view-sorting`: 列表視圖排序——點擊欄位標題切換排序方式（升序/降序）
- `view-mode-switcher`: 視圖模式切換器——header 中的 Kanban/List 切換控制

### Modified Capabilities
- `engineering-board-views`: 擴充視圖模式定義，新增 list 模式，現有篩選和 groupBy 在 list 模式下也能運作

## Impact

- `components/kanban-app.tsx`：新增 view mode state、視圖切換 UI、列表渲染區塊
- `lib/kanban/types.ts`：新增 `KanbanViewMode` type
- 無外部依賴變動
