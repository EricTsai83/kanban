## 1. Type 與 State 基礎

- [x] 1.1 在 `lib/kanban/types.ts` 新增 `KanbanViewMode = "board" | "list"` 和 `KanbanSortField`、`KanbanSortDir` type
- [x] 1.2 在 `KanbanApp` 新增 `viewMode`、`sortField`、`sortDir` state，預設 `viewMode = "board"`

## 2. 視圖模式切換器

- [x] 2.1 在 header 新增 view mode switcher 按鈕組（Kanban icon / List icon），置於密度切換左側
- [x] 2.2 切換到 list mode 時隱藏密度切換（compact/detailed toggle）
- [x] 2.3 active mode 使用 `secondary` variant 高亮，非 active 使用 `ghost`

## 3. 列表視圖佈局

- [x] 3.1 建立 `ListViewHeader` 元件：渲染表格標題行（Priority / Title / Status / Assignee / Labels / Due Date / Estimate）
- [x] 3.2 建立 `ListViewRow` 元件：單行渲染工作項目——priority indicator、title（含 blocked icon）、column name、assignee、labels（最多 2 個 + overflow）、due date、estimate
- [x] 3.3 在 `KanbanApp` 的 content area 中，當 `viewMode === "list"` 時渲染列表視圖取代看板欄位
- [x] 3.4 列表行點擊呼叫 `openEdit(item)` 開啟既有的 item editor dialog

## 4. 列表排序

- [x] 4.1 新增 `sortedItems` useMemo：在 `visible` 之上根據 `sortField` 和 `sortDir` 排序
- [x] 4.2 `ListViewHeader` 的欄位標題可點擊，點擊時切換排序（無排序 → 升序 → 降序 → 無排序）
- [x] 4.3 排序中的欄位標題顯示方向指示器（ChevronUp / ChevronDown icon）
- [x] 4.4 切換回 board mode 時重置 `sortField` 和 `sortDir`

## 5. 篩選相容性

- [x] 5.1 確認列表視圖使用與看板相同的 `visible` 篩選結果
- [x] 5.2 確認 command palette 的篩選和 group-by 操作在 list mode 下正常運作（groupBy 不影響列表佈局）

## 6. i18n 支援

- [x] 6.1 在 i18n dictionary 中新增列表視圖相關文案（欄位名稱、排序提示、view mode labels）
