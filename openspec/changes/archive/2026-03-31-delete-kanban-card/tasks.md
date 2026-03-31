## 1. Backend — Store & Validation

- [x] 1.1 Add `delete_work_item(board_id: str, item_id: str)` async function to `apps/api/store.py` that deletes the row and returns the updated board
- [x] 1.2 Add `DeleteWorkItemRequest` Pydantic model to `apps/api/models.py` (fields: `item_id: str`)

## 2. Backend — API Endpoint

- [x] 2.1 Add `DELETE /kanban/items/{item_id}` route in `apps/api/main.py` that calls `delete_work_item` and returns `BoardResponse`
- [x] 2.2 Return HTTP 404 if `item_id` does not exist

## 3. Frontend — API Call

- [x] 3.1 Add `deleteWorkItem(itemId: string)` fetch function in `apps/web/lib/kanban` (or wherever API calls live) that calls `DELETE /kanban/items/{itemId}`

## 4. Frontend — UI

- [x] 4.1 Add `confirmDelete` boolean state to the card editor in `apps/web/components/kanban-app.tsx`
- [x] 4.2 Render a Delete button (using the existing `Trash2` icon) in the card editor modal footer
- [x] 4.3 First click sets `confirmDelete = true` and changes the button to a red "確認刪除？" state
- [x] 4.4 Second click calls `deleteWorkItem`, closes the modal, and updates board state with the server response
- [x] 4.5 Reset `confirmDelete` to `false` when the modal closes without confirming
