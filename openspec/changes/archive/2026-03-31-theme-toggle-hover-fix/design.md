## Context

Sidebar 使用深色背景（light 和 dark mode 皆為深色），其中的 ghost button 透過自訂 class 設定 `hover:bg-sidebar-muted hover:text-sidebar-foreground` 以確保 hover 時在深色背景上可見。但 shadcn Button 的 ghost variant 自帶 `hover:bg-muted hover:text-foreground`，在 light mode 下 `foreground` 為深色 oklch(0.145 0 0)，因 CSS 優先順序覆蓋了自訂的 sidebar-foreground（淺色），導致 icon hover 時不可見。

另外，theme toggle 目前有三態（light → dark → system），使用者希望簡化為二態切換。

## Goals / Non-Goals

**Goals:**
- 確保 sidebar 中所有 ghost button 在 hover 時 icon 保持可見
- 移除 system theme 選項，簡化為 light ↔ dark 切換
- 移除未使用的 Monitor icon import

**Non-Goals:**
- 不修改 ghost button variant 的全域定義
- 不改變 sidebar 配色方案
- 不影響 sidebar 以外區域的 button 行為

## Decisions

### 1. 使用 Tailwind 的 `!` modifier 強制覆蓋 hover 樣式

在 sidebar 的 ghost button 上使用 `hover:!bg-sidebar-muted hover:!text-sidebar-foreground`，透過 `!important` 確保覆蓋 ghost variant 自帶的 hover 樣式。

**替代方案考慮：**
- 建立自訂 `sidebar-ghost` variant：過度工程，只為了 sidebar 幾個按鈕新增 variant 不值得
- 使用 inline style：失去 Tailwind 的 hover 偽類支援
- 修改 ghost variant 加入 sidebar 條件：影響全域，不符合非目標

### 2. 二態 theme 切換

將 `cycleTheme()` 從 light → dark → system 改為 light ↔ dark 簡單切換。移除 `Monitor` icon 和 system 相關的 tooltip 文字。

## Risks / Trade-offs

- [風險] `!important` 可能在未來其他樣式覆蓋場景中造成困擾 → 僅在 sidebar 的 ghost button 上使用，影響範圍有限
- [風險] 移除 system 選項後無法自動跟隨 OS 偏好 → 使用者可手動切換，且 next-themes 預設 system 仍可在程式碼中恢復
