## Why

Kanban 看板目前存在幾個互動體驗問題：工作項目只有單一顯示密度、編輯面板從側邊滑出而非居中呈現不符合直覺、捲軸過粗破壞視覺整潔、主題切換按鈕在亮色模式下 hover 時 icon 不可見。這些問題共同拉低了產品的精緻度。

## What Changes

- 新增卡片顯示密度切換：在 header 區域加入 compact / detailed 模式切換，compact 只顯示標題和 priority，detailed 展開完整 metadata
- 工作項目編輯改為居中 Dialog：點擊工作項目後以居中 Dialog 呈現編輯表單，取代目前從右側滑出的 Sheet 面板
- Scrollbar 美化：全站捲軸改為 3-4px 細線樣式，idle 時半隱藏，hover 時才完整顯示
- Theme toggle hover 修正：修正亮色模式下 sidebar theme toggle 按鈕 hover 時背景變黑導致 icon 不可見的 bug

## Non-goals

- 不改動卡片的資料結構或 API
- 不改動 Dialog/Sheet 元件本身的底層實作
- 不新增第三方套件

## Capabilities

### New Capabilities
- `card-display-density`: 工作項目行的 compact/detailed 顯示模式切換功能
- `centered-item-editor`: 以居中 Dialog 取代右側 Sheet 的工作項目編輯體驗
- `custom-scrollbar`: 全站細線捲軸樣式定義

### Modified Capabilities
- `theme-toggle-behavior`: 修正 theme toggle 按鈕在亮色模式 sidebar 中 hover 時的可見性問題

## Impact

- `components/kanban-app.tsx`：新增密度切換狀態與 UI、將 Sheet 替換為 Dialog、修正 theme toggle class
- `app/globals.css`：新增 scrollbar 自訂樣式
- `components/ui/dialog.tsx`：可能需要調整 `max-w` 以容納編輯表單
