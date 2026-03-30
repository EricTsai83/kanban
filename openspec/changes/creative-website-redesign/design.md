## Context

這是一個使用 Next.js 16 + Tailwind CSS v4 + Shadcn UI 建構的 Kanban 看板應用。目前視覺為 Shadcn 預設風格，灰階層級不足、hover 效果不夠精緻、border 過於明顯。

我們將以 Linear 的設計哲學為藍本——精密灰階、功能性色彩、極短動畫、暗色優先——對全站視覺進行精修。核心理念：**不加東西，調準已有的東西**。

## Goals / Non-Goals

**Goals:**
- 建立 8+ 層級的精密灰階系統，讓每個 UI 面（surface）都有正確的深度位置
- 暗色為主要設計體驗，亮色模式同等品質
- 色彩純粹功能化：只在 priority、active state、CTA 上出現
- 全局 transitions 統一為 120-150ms，快到不被注意
- 達到「工具消失，內容浮現」的視覺感受

**Non-Goals:**
- 不加裝飾效果（漸層、glow、glassmorphism、背景動畫）
- 不改動元件結構或 API
- 不新增 npm 套件
- 不處理行動裝置響應式（後續議題）

## Decisions

### 1. 灰階策略：oklch 零彩度階梯

**選擇**：使用 oklch 的 lightness 軸建立精密灰階（chroma = 0），從 0.11 到 0.92 共 10+ 層級。Sidebar 保留微量冷色偏移（chroma ~0.01, hue ~260）維持深度區分。

**替代方案**：使用 Tailwind 內建灰階（slate/zinc）。
**理由**：oklch 已是專案慣例，且能精確控制感知亮度的均勻分佈。自定義灰階比 Tailwind preset 更能匹配 Linear 的精密度。

### 2. 暗色優先

**選擇**：將 `layout.tsx` 中的 `defaultTheme` 從 `"system"` 改為 `"dark"`。暗色模式為主要設計對象，亮色模式為對等但次要的體驗。

**替代方案**：維持 system 偵測。
**理由**：Linear 式的精密灰階在暗色下最能展現層次感。且工程團隊大多偏好暗色模式。

### 3. 動畫策略：CSS transition-duration 統一

**選擇**：在 globals.css 定義 `--transition-fast: 120ms` 和 `--transition-normal: 150ms`，所有互動統一使用。Hover 僅改變 background-color，不使用 transform、box-shadow、或 filter。

**替代方案**：使用 spring-based 動畫（Framer Motion）。
**理由**：Linear 的動畫感來自「快」而非「物理正確」。純 CSS transition 搭配正確的 duration 和 easing 已足夠。

### 4. Border 與分隔策略

**選擇**：大部分 border 替換為空間分隔（margin/padding）。必要的 border 使用 `oklch(1 0 0 / 6%)` (暗色) 或 `oklch(0 0 0 / 8%)` (亮色)，比目前的 10% 更淡。

**替代方案**：保留現有 border 只改顏色。
**理由**：Linear 幾乎不使用可見的 border。Column 之間靠空間而非線條區分。

### 5. 圓角收斂

**選擇**：`--radius` 從 `0.625rem` (10px) 縮小到 `0.375rem` (6px)。

**替代方案**：維持或加大。
**理由**：Linear 使用 4-6px 圓角。小圓角配合精密灰階產生「精密工具」的感覺，大圓角偏向「友善消費品」。

## Risks / Trade-offs

- **[灰階層級過多難維護]** → 使用語義化命名（`--surface-0` 到 `--surface-4`）而非數值，減輕認知負擔
- **[暗色預設可能不符部分使用者習慣]** → 保留完整的亮色模式支援和主題切換功能
- **[動畫過短可能感覺「沒有動畫」]** → 這正是目標。使用者不該注意到動畫，只該感覺到「流暢」
- **[移除裝飾可能顯得「沒有設計」]** → 這是 Linear 哲學的核心挑戰。美感來自精確度，不來自裝飾
