## Context

Kanban 看板使用單一 `KanbanApp` 元件處理所有 UI 邏輯。工作項目編輯目前使用 `Sheet`（右側滑出面板），工作項目列只有一種固定密度的顯示模式。Scrollbar 使用瀏覽器預設樣式。Theme toggle 按鈕在 sidebar 中使用 `hover:bg-sidebar-muted!` 覆蓋，但在亮色模式下 ghost variant 的預設 hover 樣式優先級可能更高，導致 icon 不可見。

## Goals / Non-Goals

**Goals:**
- 讓使用者可以在 compact/detailed 兩種卡片密度之間切換
- 工作項目編輯以居中 Dialog 呈現，更符合 focus-on-content 的體驗
- Scrollbar 細化到 3-4px，融入整體設計語言
- 修正 theme toggle 在亮色模式下的 hover 可見性 bug

**Non-Goals:**
- 不改動 Dialog/Sheet 底層元件實作
- 不改動 API 或資料模型
- 不新增套件

## Decisions

### 1. 密度切換：React state + conditional rendering

**選擇**：在 `KanbanApp` 中新增 `density` state（`"compact" | "detailed"`），預設 `"detailed"`（目前行為）。在 header 區域放置一個 toggle 控制項。`WorkItemRow` 接收 `density` prop，compact 模式隱藏第二行 metadata。

**替代方案**：使用 CSS-only 的 class 切換。
**理由**：部分 metadata 元素（badges、labels）在 compact 模式下應完全不 render 而非僅隱藏，避免 DOM 膨脹。

### 2. Sheet → Dialog 替換

**選擇**：將 item editor 從 `Sheet` 改為 `Dialog`。需調整 Dialog 的 `max-w` 從 `sm` (384px) 到 `lg` (512px) 以容納表單的 2-column grid。保留 settings drawer 繼續使用 `Sheet`（因為設定面板適合 side panel 形式）。

**替代方案**：自訂 modal 元件。
**理由**：專案已有 `Dialog` 元件，API 相似（都基於 `@base-ui/react/dialog`），替換成本低。

### 3. Scrollbar 樣式

**選擇**：在 `globals.css` 使用 `::-webkit-scrollbar` 系列偽元素定義 thin scrollbar（3-4px），搭配 `scrollbar-gutter: stable` 避免內容跳動。

**替代方案**：使用 `scrollbar-width: thin`（Firefox 原生）。
**理由**：webkit scrollbar 提供更精確的寬度和顏色控制。同時加入 Firefox 的 `scrollbar-width: thin` 作為 fallback。

### 4. Theme toggle hover 修正

**選擇**：在 theme toggle 的 Button 上使用更明確的 hover 樣式：改用 inline style 或更具體的 Tailwind class 組合，確保在 sidebar 深色背景上 icon 始終可見。

**替代方案**：修改 Button ghost variant 的全局樣式。
**理由**：問題僅出現在 sidebar 內的按鈕，修改全局樣式影響範圍過大。

## Risks / Trade-offs

- **[密度偏好不持久化]** → 初版使用 React state，頁面重整後回到預設值。後續可加 localStorage 持久化
- **[Dialog max-w 在小螢幕上可能過寬]** → Dialog 元件已有 `max-w-[calc(100%-2rem)]` 的安全約束
- **[webkit scrollbar 不影響 Firefox]** → 加入 `scrollbar-width: thin` 和 `scrollbar-color` 作為 Firefox fallback
