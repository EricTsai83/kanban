## 1. 資料層擴展 — coverImage 欄位

- [x] 1.1 在 `lib/kanban/types.ts` 中為 `KanbanWorkItem` 新增 `coverImage: string | null` 欄位，同時更新 `CreateWorkItemInput` 和 `UpdateWorkItemInput` 加入 `coverImage?: string | null`
- [x] 1.2 更新 `data/engineering-kanban-board.json` 中現有的 items，為每個 item 加入 `"coverImage": null` 欄位
- [x] 1.3 更新 API route (`app/api/kanban/items/route.ts`) 的 POST 和 PATCH handler，使其接受並處理 `coverImage` 參數，包含驗證（必須是 string 或 null）

## 2. Sidebar Light Mode 主題修復

- [x] 2.1 修改 `app/globals.css` 中 `:root` 下的 sidebar CSS 變數，將 `--sidebar` 改為淺色背景（如 `oklch(0.97 0.005 260)`），`--sidebar-foreground` 改為深色文字，以及其他 sidebar 相關變數（muted, accent, border 等）
- [x] 2.2 更新 `components/kanban-app.tsx` 中 sidebar rail 的 hover/interactive 樣式，將硬編碼的 `hover:bg-white/4` 等暗色互動狀態改為主題感知的 class（如 `hover:bg-sidebar-accent`）

## 3. 卡片 Preview 重新設計 — WorkItemCard

- [x] 3.1 在 `components/kanban-app.tsx` 中將 `WorkItemRow` 重構為垂直卡片佈局 `WorkItemCard`，結構為：可選封面圖區域（120px, object-cover）→ 標題行（priority 色條 + 標題 + blocked icon）→ 描述摘要（line-clamp-2）→ metadata footer（labels badges, due date, estimate, assignee avatar）
- [x] 3.2 為卡片加入視覺效果：靜態時有 subtle border/shadow，hover 時增強 shadow 和背景變化
- [x] 3.3 實作封面圖片的 error handling：使用 `onError` 隱藏圖片區域，載入中顯示佔位區域防止 layout shift
- [x] 3.4 確保卡片保持 draggable，drag/drop 行為與原 `WorkItemRow` 一致

## 4. Compact / Detailed 密度模式適配

- [x] 4.1 更新 compact 模式：隱藏封面圖、描述摘要和 metadata footer，僅顯示單行佈局（priority 色條 + 標題 + priority badge + assignee avatar），不在 DOM 中渲染隱藏的元素
- [x] 4.2 更新 detailed 模式：顯示完整卡片佈局，包含封面圖（如有）、描述摘要、完整 metadata footer

## 5. 卡片詳情 Dialog 重新設計

- [x] 5.1 修改 Dialog（item editor）加入 hero 封面圖區域：當有 coverImage 時在 DialogContent 頂部（padding 外）渲染全寬 200px 高的 hero banner，使用 `object-cover`
- [x] 5.2 在 item editor form 中新增 coverImage URL 輸入欄位，允許用戶新增、修改或移除封面圖
- [x] 5.3 實作 hero 圖片的 error handling，載入失敗時優雅隱藏 banner 區域
- [x] 5.4 更新 `buildItemForm` 和 `buildPayload` 函數以處理 coverImage 欄位

## 6. 整合測試與微調

- [x] 6.1 測試完整流程：建立含封面圖的卡片 → preview 顯示 → 打開 dialog 查看 hero banner → 修改/移除封面圖
- [x] 6.2 測試 Light / Dark mode 切換：確認 sidebar、卡片、dialog 在兩種模式下的視覺效果一致
- [x] 6.3 測試 compact / detailed 切換：確認封面圖和描述在 compact 下隱藏、detailed 下顯示
- [x] 6.4 測試 drag & drop：確認新卡片佈局的拖放功能正常運作
