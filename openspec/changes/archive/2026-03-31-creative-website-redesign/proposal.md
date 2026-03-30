## Why

目前的 Kanban 介面使用 Shadcn UI 預設外觀，視覺上與大量同質化後台工具無異。我們參考 Linear 的設計哲學——透過精密的灰階系統、極致克制的色彩運用、以及超短微動畫，打造一個「工具消失、內容浮現」的專業級體驗。不靠裝飾取勝，靠精確度取勝。

## What Changes

- 建立精密灰階系統：暗色模式下 8+ 層級的灰度階梯，每一級之間的跳躍均勻且有功能意義
- 暗色優先體驗：將 `defaultTheme` 設為 `dark`，暗色模式為主要設計對象
- 色彩功能化：移除裝飾性色彩，accent color 僅出現在 priority indicators、active states、CTA 上
- 超短微動畫：全局統一為 120-150ms ease-out transitions，快到幾乎不被注意但少了會覺得卡
- Hover 極簡化：所有 hover 效果僅為微妙的背景色變化（`bg-white/[0.04]`），無 lift、無 glow、無 shadow
- Border 極簡化：以空間分隔和極淡 border（`border-white/[0.06]`）取代明顯邊線
- 排版精修：精確的 letter-spacing、行高、字重控制，建立清晰的資訊階層
- 圓角收斂：從目前的 10px 收到 4-6px，更銳利的現代感

## Non-goals

- 不改動任何功能邏輯、API、或資料模型
- 不新增第三方動畫庫或任何 npm 套件
- 不改動 i18n 架構或翻譯內容
- 不重構元件結構
- 不加入任何裝飾性元素（漸層背景、glow、glassmorphism、float 動畫）

## Capabilities

### New Capabilities
- `precision-color-system`: 精密灰階系統 + accent-only 色彩策略，8+ 層級灰度定義
- `micro-transitions`: 極短動畫系統——全局 120-150ms transitions、hover 背景色變化、無任何位移或陰影效果
- `linear-density`: 資訊密度與排版精修——字體大小微調、letter-spacing、行高、元素間距的精確控制

### Modified Capabilities
- `kanban-visual-system`: sidebar 純色化、border 極簡化、欄位分隔以空間取代線條
- `dark-mode-theming`: 暗色優先體驗，精密灰階覆蓋所有明度層級，accent 色降低飽和度

## Impact

- `app/globals.css`：CSS 變數全面重新定義（灰階系統、圓角縮小、transition 標準）
- `components/kanban-app.tsx`：所有視覺類別精修——hover 效果簡化、spacing 調整、border 極簡化
- `app/layout.tsx`：`defaultTheme` 改為 `"dark"`
- 無外部依賴變動
