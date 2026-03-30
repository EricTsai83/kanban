## Why

目前看板的卡片 preview 資訊過於精簡，僅顯示標題、優先度色條和指派人頭像，與 Trello 等成熟產品的豐富卡片體驗相比差距明顯。此外卡片不支援封面圖片，無法滿足需要視覺化呈現的使用場景。最後 sidebar 在 Light Mode 下仍維持暗色背景，與整體配色方案脫節。

## What Changes

- **卡片 Preview 升級**：重新設計 `WorkItemRow` 為真正的卡片式佈局（參考 Trello），在 preview 狀態下展示封面圖片、標題、描述摘要、標籤、指派人、到期日、估時、以及進度指示
- **封面圖片支援**：為 `KanbanWorkItem` 新增 `coverImage` 欄位（URL），卡片 preview 可顯示半高或全高封面圖，打開卡片 dialog 時圖片以 hero banner 形式展示
- **卡片詳情 Dialog 升級**：在現有 Dialog 基礎上加入封面圖片區域、更完整的 metadata 展示、以及更精緻的視覺層次
- **Sidebar 主題適應**：Light Mode 下 sidebar 使用淺色背景和深色文字，Dark Mode 下維持現有深色風格

## Capabilities

### New Capabilities
- `card-cover-image`: 卡片封面圖片的新增、顯示、以及在 preview / dialog 兩種模式下的呈現規則
- `rich-card-preview`: Trello 風格的豐富卡片 preview，包含封面圖、描述摘要、多種 metadata badge、到期日指示器
- `card-detail-redesign`: 卡片詳情 dialog 的重新設計，包含 hero 封面圖、結構化 metadata 展示

### Modified Capabilities
- `dark-mode-theming`: Sidebar CSS 變數需在 `:root`（light）模式下改用淺色系，使 sidebar 跟隨主題切換
- `card-display-density`: compact/detailed 模式需適應新的卡片佈局，compact 隱藏封面圖和描述

## Impact

- **Types**: `KanbanWorkItem` 新增 `coverImage?: string` 欄位
- **API**: `/api/kanban/items` 的 POST/PATCH 需支援 `coverImage` 參數
- **Components**: `WorkItemRow` 重寫為卡片佈局、`DialogContent` 加入 hero 圖片區域
- **CSS**: `:root` 下的 sidebar 變數需改為淺色值
- **Data**: JSON 資料結構新增 `coverImage` 欄位（向下相容，可為 null）

## Non-goals

- 不做圖片上傳功能，coverImage 僅接受 URL 字串
- 不做圖片裁切或編輯功能
- 不新增 sticker 或自訂背景色功能
- 不做 checklist 或進度條（本次聚焦在視覺呈現）
