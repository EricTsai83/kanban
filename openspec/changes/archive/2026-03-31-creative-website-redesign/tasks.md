## 1. 精密灰階系統 (globals.css)

- [x] 1.1 重新定義 `.dark` 灰階變數：建立 8+ 層級的均勻灰度階梯（background, sidebar, card, hover, active, border, disabled-text, secondary-text, dimmed-text, bright-text）
- [x] 1.2 重新定義 `:root` 亮色灰階變數：對應暗色系統建立等效的亮色灰度層級
- [x] 1.3 更新 sidebar 變數為純色平面值（移除任何半透明或過高 chroma），保留微量冷色偏移 (chroma ~0.01)
- [x] 1.4 更新 `--border` 和 `--input` 為極淡值：暗色 `oklch(1 0 0 / 6%)`、亮色 `oklch(0 0 0 / 8%)`

## 2. 圓角與基礎調整 (globals.css)

- [x] 2.1 將 `--radius` 從 `0.625rem` 改為 `0.375rem` (6px)
- [x] 2.2 新增全局 transition 變數：`--transition-fast: 120ms`、`--transition-normal: 150ms`
- [x] 2.3 在 `@theme inline` 中註冊新增的 transition 變數

## 3. 暗色優先 (layout.tsx)

- [x] 3.1 將 ThemeProvider 的 `defaultTheme` 從 `"system"` 改為 `"dark"`

## 4. Sidebar 精修 (kanban-app.tsx)

- [x] 4.1 更新 sidebar `<nav>` 的 class：移除任何半透明/特效 class，確保使用純色 `bg-sidebar`
- [x] 4.2 更新 sidebar 按鈕 hover class：改為 `hover:bg-white/[0.04]`，移除任何 scale/glow 效果
- [x] 4.3 統一所有 sidebar 按鈕的 transition duration 為 120ms

## 5. Header 與欄位精修 (kanban-app.tsx)

- [x] 5.1 更新 header 底部 border：改為極淡值 `border-b border-white/[0.06]`（暗色），或使用 CSS 變數 `border-border`
- [x] 5.2 更新欄位分隔：將 `border-l` 替換為純 spacing 分隔（移除 border，使用 gap 或 padding）
- [x] 5.3 更新欄位標題排版：11px、uppercase、font-medium、letter-spacing 0.05-0.08em

## 6. 工作項目行精修 (kanban-app.tsx)

- [x] 6.1 更新 WorkItemRow hover class：改為 `hover:bg-muted/50` 或 `hover:bg-white/[0.03]`，移除任何 lift/glow/shadow
- [x] 6.2 統一 WorkItemRow transition 為 `transition-colors duration-[120ms]`
- [x] 6.3 調整工作項目標題字體為 `text-[13px]`
- [x] 6.4 調整 metadata 字體為 `text-[11px]` 搭配降低 opacity
- [x] 6.5 確保空欄位 placeholder 為純文字提示，無裝飾性元素

## 7. Onboarding 頁面精修 (kanban-app.tsx)

- [x] 7.1 移除任何裝飾性背景元素，保持純色背景
- [x] 7.2 精修表單區域排版：確保符合 4px grid spacing 和精確的字體階層

## 8. 全局一致性驗證

- [x] 8.1 驗證所有 hover 效果統一為 background-color only，無任何 transform/shadow/filter
- [x] 8.2 驗證暗色模式下所有灰階層級可視覺區分
- [x] 8.3 驗證亮色模式下所有灰階層級品質對等
- [x] 8.4 驗證所有 border 不超過 6% opacity 或已被 spacing 替代
