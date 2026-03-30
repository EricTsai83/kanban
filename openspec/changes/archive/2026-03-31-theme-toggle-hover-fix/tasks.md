## 1. 修復 Sidebar Ghost Button Hover 樣式

- [x] 1.1 在 `components/kanban-app.tsx` 中，將 sidebar 所有 ghost button 的 hover class 從 `hover:bg-sidebar-muted hover:text-sidebar-foreground` 改為 `hover:!bg-sidebar-muted hover:!text-sidebar-foreground`，確保覆蓋 ghost variant 的預設 hover 樣式
- [x] 1.2 驗證 light mode 和 dark mode 下所有 sidebar 按鈕（Search、New Item、Settings、Theme Toggle）hover 時 icon 皆可見

## 2. 簡化 Theme Toggle 為二態切換

- [x] 2.1 修改 `cycleTheme()` 函式，從三態（light → dark → system）改為二態（light ↔ dark）
- [x] 2.2 修改 `themeIcon()` 函式，移除 `Monitor` icon 的回傳邏輯，未掛載時使用 `Sun` 或 `Moon` 作為預設
- [x] 2.3 移除 theme toggle 的 Tooltip 包裹與 `themeTooltip()` 函式
- [x] 2.4 從 lucide-react import 中移除 `Monitor`
