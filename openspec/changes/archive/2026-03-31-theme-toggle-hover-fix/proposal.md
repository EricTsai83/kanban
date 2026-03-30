## Why

Theme toggle 按鈕位於深色 sidebar 上，但使用了 `variant="ghost"` 的 Button 元件。Ghost variant 自帶 `hover:bg-muted hover:text-foreground`，在 light mode 下 `foreground` 是深色，覆蓋了自訂的 `hover:text-sidebar-foreground`（淺色），導致 hover 時 icon 在深色背景上變成深色而不可見。此外，theme 切換目前包含 system 選項（Monitor icon），使用者希望簡化為只在 light/dark 之間切換。

## What Changes

- 修復 sidebar 中所有 ghost button 的 hover 樣式，確保 icon 在深色 sidebar 背景上 hover 時保持可見
- 移除 theme toggle 的 system 選項及對應的 Monitor icon
- Theme 切換邏輯簡化為 light ↔ dark 二態切換

## Non-goals

- 不改變 sidebar 的整體配色方案
- 不改變 ghost button variant 本身的定義
- 不影響非 sidebar 區域的 button hover 行為

## Capabilities

### New Capabilities
- `sidebar-button-hover-fix`: 修正 sidebar ghost button 的 hover 樣式，確保 icon 在深色 sidebar 上始終可見
- `theme-toggle-simplify`: 移除 system theme 選項，簡化為 light/dark 二態切換

### Modified Capabilities

## Impact

- `components/kanban-app.tsx` — sidebar 按鈕的 className、`cycleTheme()`、`themeIcon()`、`themeTooltip()` 函式
- `lucide-react` — 移除 `Monitor` icon 的 import
