## 1. 卡片顯示密度切換

- [x] 1.1 在 `KanbanApp` 新增 `density` state：`"compact" | "detailed"`，預設 `"detailed"`
- [x] 1.2 在 header 區域新增密度切換 toggle 控制項（compact/detailed）
- [x] 1.3 將 `density` prop 傳入 `WorkItemRow` 元件
- [x] 1.4 在 `WorkItemRow` 中根據 `density` 條件渲染：compact 模式不 render metadata 行，僅保留標題行（priority bar、title、blocked icon、priority badge、assignee avatar）

## 2. 居中 Dialog 取代 Sheet

- [x] 2.1 在 `kanban-app.tsx` 中將 item editor 的 `Sheet`/`SheetContent` 替換為 `Dialog`/`DialogContent`
- [x] 2.2 調整 `DialogContent` 的 `className` 加入 `sm:max-w-lg` 以容納表單 2-column layout
- [x] 2.3 將 `SheetHeader`/`SheetTitle` 替換為 `DialogHeader`/`DialogTitle`
- [x] 2.4 調整表單底部按鈕區域樣式以適配 Dialog layout
- [x] 2.5 確認 settings drawer 繼續使用 `Sheet`，不受影響

## 3. Scrollbar 美化

- [x] 3.1 在 `globals.css` 新增 `::-webkit-scrollbar` 樣式：width/height 4px
- [x] 3.2 新增 `::-webkit-scrollbar-thumb` 樣式：rounded、muted-foreground 色、20-30% opacity idle、40-50% opacity hover
- [x] 3.3 新增 `::-webkit-scrollbar-track` 樣式：transparent background
- [x] 3.4 新增 Firefox fallback：`scrollbar-width: thin` 和 `scrollbar-color`
- [x] 3.5 確保暗色和亮色模式下 scrollbar 色彩都正確

## 4. Theme Toggle Hover 修正

- [x] 4.1 診斷亮色模式下 theme toggle hover 的具體原因（ghost variant vs sidebar class 優先級）
- [x] 4.2 修正 theme toggle Button 的 hover class，確保在 dark sidebar 背景上 icon 始終可見
- [x] 4.3 驗證修正後在亮色和暗色模式下 hover 效果皆正確
