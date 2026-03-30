## 1. 資料模型擴充 - startDate 欄位

- [ ] 1.1 在 `lib/kanban/types.ts` 的 `KanbanWorkItem` 新增 `startDate: string | null` 欄位
- [ ] 1.2 在 `CreateWorkItemInput` 和 `UpdateWorkItemInput` 型別新增 `startDate` 可選欄位
- [ ] 1.3 更新 `/api/kanban/items` POST handler，支援接收與儲存 `startDate` 參數
- [ ] 1.4 更新 `/api/kanban/items` PATCH handler，支援更新 `startDate` 參數
- [ ] 1.5 新增 `startDate` 的驗證邏輯（格式為 YYYY-MM-DD 或 null）

## 2. 卡片編輯器 - startDate UI

- [ ] 2.1 在 `kanban-app.tsx` 的 `ItemFormState` 新增 `startDate` 欄位
- [ ] 2.2 更新 `createEmptyForm`、`buildItemForm`、`buildPayload` 函式以包含 `startDate`
- [ ] 2.3 在卡片編輯表單中新增開始日期 (Start Date) 輸入欄位，與 Due Date 並排
- [ ] 2.4 新增 i18n 文案：開始日期欄位標籤

## 3. 視圖切換機制

- [ ] 3.1 擴充視圖模式狀態，從 `density: "compact" | "detailed"` 改為支援 `"compact" | "detailed" | "gantt"` 三種模式
- [ ] 3.2 在標題列視圖切換器中新增甘特圖按鈕（使用 Lucide `GanttChart` 圖示）
- [ ] 3.3 當切換到甘特圖模式時，隱藏看板欄位區域，顯示甘特圖元件
- [ ] 3.4 新增 i18n 文案：甘特圖視圖標籤

## 4. 甘特圖元件核心

- [ ] 4.1 建立 `components/gantt-chart.tsx` 檔案，定義元件 props 介面（items, columns, onItemClick）
- [ ] 4.2 實作時間軸範圍自動計算邏輯（最早 startDate 到最晚 dueDate，±2 天 padding）
- [ ] 4.3 實作日期軸 header 渲染（顯示月份與日期刻度標記）
- [ ] 4.4 實作左側列標籤區域（顯示卡片標題、指派者頭像、優先級色條）
- [ ] 4.5 實作甘特橫條渲染（依 startDate/dueDate 計算位置與寬度，使用優先級顏色）
- [ ] 4.6 實作無 dueDate 卡片的里程碑菱形標記
- [ ] 4.7 實作無日期資料時的空狀態提示

## 5. 甘特圖互動

- [ ] 5.1 實作橫條 hover tooltip（顯示標題、指派者、優先級、開始日期、截止日期）
- [ ] 5.2 實作橫條點擊開啟卡片編輯器
- [ ] 5.3 確保甘特圖視圖與現有篩選機制（assignee, priority, label, status）正確配合

## 6. 國際化與收尾

- [ ] 6.1 在 i18n 字典中新增甘特圖相關所有文案（en + zh-TW）
- [ ] 6.2 確認甘特圖在深色/淺色主題下正確顯示
- [ ] 6.3 確認空看板或全部卡片都無日期時的邊界情境處理
