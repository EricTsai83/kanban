## Context

目前的 Kanban 看板使用 `WorkItemRow` 元件以精簡的一行式佈局呈現卡片。每張卡片僅顯示優先度色條、標題、priority badge 和指派人頭像。相比 Trello 等產品提供封面圖片、描述摘要、多種 metadata badge 的豐富卡片體驗，目前的 preview 資訊不足。

Sidebar 在 CSS 變數層級硬編碼為深色（`:root` 中 `--sidebar: oklch(0.14 ...)`），導致切換到 Light Mode 時 sidebar 仍保持暗色。

資料結構 `KanbanWorkItem` 不包含圖片欄位。API 層和 JSON 持久化需要擴展。

## Goals / Non-Goals

**Goals:**
- 將 `WorkItemRow` 重構為 Trello 風格的卡片元件，支援封面圖、描述摘要、豐富 metadata
- 擴展 `KanbanWorkItem` 類型加入 `coverImage` 欄位
- 重新設計卡片詳情 Dialog，加入 hero 封面圖區域
- 修復 sidebar 在 Light Mode 下使用適當的淺色配色

**Non-Goals:**
- 圖片上傳 / 裁切 / 編輯功能
- Sticker 或自訂背景色
- Checklist 或進度條

## Decisions

### 1. 卡片佈局採用 Trello 風格的垂直堆疊卡片

**選擇**: 將 `WorkItemRow` 從水平行式改為垂直卡片式佈局，包含可選的封面圖區域、標題區、metadata 區。

**替代方案**: 
- 維持行式佈局 + hover 展開更多資訊 → 不直觀，用戶反映 preview 資訊不足
- 使用 popover 顯示詳細資訊 → 增加操作步驟，不符合「一眼掃描」的需求

**理由**: 卡片式佈局能在有限空間內垂直堆疊更多資訊，封面圖也有自然的放置位置。

### 2. 封面圖片僅支援 URL 字串

**選擇**: `coverImage` 欄位為 `string | null`，僅接受圖片 URL。

**替代方案**:
- 支援 base64 內嵌圖片 → JSON 檔案會過大
- 支援檔案上傳 + 本地儲存 → 超出本次改動範圍，需要 file storage 架構

**理由**: 最小改動量，向下相容，用戶可使用外部圖床。

### 3. 封面圖片在 preview 採用半高顯示

**選擇**: preview 卡片中封面圖以固定高度（約 120px）的半高形式顯示在卡片頂部，下方繼續顯示標題和 metadata。

**替代方案**:
- 全高封面覆蓋整張卡片 → 隱藏重要 metadata
- 縮圖模式 → 太小不具視覺衝擊力

**理由**: 平衡視覺效果和資訊密度，與 Trello 的半高 cover 一致。

### 4. Sidebar 使用主題感知的 CSS 變數

**選擇**: 在 `:root` 中將 sidebar 變數改為淺色系（如 `oklch(0.97 ...)`），`.dark` 中維持現有深色。

**替代方案**:
- 保持 sidebar 永遠深色 → 用戶明確反映這不合理
- sidebar 使用完全透明背景 → 失去層次感

**理由**: 符合用戶期望，與主流應用（Notion、Linear）的 Light Mode sidebar 設計一致。

### 5. Dialog 中封面圖以 Hero Banner 形式展示

**選擇**: 打開卡片詳情 Dialog 時，封面圖以全寬 hero banner 方式顯示在 dialog 頂部（DialogContent 的 padding 之外），高度約 200px，使用 `object-cover`。

**替代方案**:
- 圖片放在表單內部 → 缺乏視覺層次
- 單獨的圖片瀏覽 modal → 過度設計

**理由**: 給予圖片最大視覺衝擊力，同時不影響表單操作。

## Risks / Trade-offs

- **[風險] 外部圖片載入失敗** → 使用 `onError` fallback 隱藏圖片區域，卡片退化為無封面狀態
- **[風險] 圖片尺寸不一致** → 使用 `object-cover` + 固定高度容器確保一致的視覺效果
- **[取捨] 卡片高度增加** → 每列可見卡片數減少，但資訊密度提升抵消了這個問題；compact 模式仍可隱藏封面圖
- **[取捨] Sidebar 淺色可能降低品牌識別度** → 透過保留微妙的背景色差異（sidebar 比 content area 略暗）來維持層次感
