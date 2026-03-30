## Why

目前看板只提供工作流欄位視圖和分組視圖，無法在時間軸上直觀呈現每張卡片的排程。當團隊需要評估交付時程、識別時程重疊或追蹤截止日期分佈時，必須逐一檢視卡片的到期日欄位，效率極低。新增甘特圖視圖可以讓使用者一目了然地看到所有工作項目的時間跨度，快速發現排程瓶頸。

## What Changes

- 在卡片資料模型中新增 `startDate` 欄位，配合既有的 `dueDate` 構成時間區間
- 新增甘特圖（Gantt Chart）視圖模式，以水平時間軸呈現每張卡片的排程
- 在標題列的視圖切換器中加入甘特圖切換按鈕
- 卡片編輯表單中新增開始日期欄位
- 甘特圖橫條依優先級顯示對應顏色，並顯示指派者與截止狀態

## Non-goals

- 不實作甘特圖上的拖曳調整日期功能（此階段為唯讀視圖）
- 不實作任務依賴關係的連線顯示
- 不支援匯出甘特圖為圖片或 PDF
- 不引入外部甘特圖套件，使用純 CSS/React 實作

## Capabilities

### New Capabilities
- `gantt-chart-view`: 甘特圖視圖元件，以水平時間軸渲染卡片時間區間，包含時間軸刻度、橫條渲染、顏色編碼與互動提示
- `work-item-start-date`: 為工作項目擴充 `startDate` 欄位，支援建立與編輯時設定開始日期

### Modified Capabilities
- `engineering-board-views`: 新增甘特圖作為第三種視圖模式，擴充視圖切換邏輯

## Impact

- **資料模型**: `KanbanWorkItem` 型別新增 `startDate: string | null` 欄位
- **API**: `/api/kanban/items` 的 POST/PATCH 需支援 `startDate` 參數
- **元件**: `kanban-app.tsx` 新增視圖切換狀態與甘特圖渲染區域
- **UI 元件**: 新增 `GanttChart` 元件（純前端，不需外部依賴）
- **國際化**: 新增甘特圖相關的 i18n 文案
