## Context

The kanban API follows a pattern where every mutation endpoint accepts a request body and returns the full `BoardResponse` (complete board state). The frontend replaces its local board state with the server response after each operation. Delete should follow the same pattern.

Currently: `POST /kanban/items` (create) and `PATCH /kanban/items` (update) both return `BoardResponse`. There is no delete endpoint or store function.

## Goals / Non-Goals

**Goals:**
- Add `DELETE /kanban/items/{item_id}` endpoint returning `BoardResponse`
- Add `delete_work_item(board_id, item_id)` in `store.py`
- Add a Delete button in the card editor modal with a confirmation step
- Reuse the existing `Trash2` icon (already imported in `kanban-app.tsx`)

**Non-Goals:**
- Bulk delete
- Soft delete / undo
- Order re-normalization after delete (existing items keep their `order` values)

## Decisions

### 1. REST verb: `DELETE /kanban/items/{item_id}` (not request body)
Item ID goes in the path — standard REST. Board ID is resolved server-side from the item record (same as current update flow).

### 2. Return full `BoardResponse` (not 204 No Content)
Consistent with create and update. Frontend can replace state in one step without a separate fetch.

### 3. Confirmation via inline state, not a dialog component
The editor modal already has a two-step action pattern for destructive ops. Add a `confirmDelete` boolean state; first click shows a red confirmation button, second click fires the API. No new Dialog dependency needed.

### 4. Optimistic UI: no
The current create/update flow is not optimistic (it awaits the server response before updating state). Delete will follow the same pattern for consistency.

## Risks / Trade-offs

- **Accidental deletion** → Mitigated by the two-click confirmation pattern in the UI
- **Race condition (delete while another user edits)** → Not in scope; single-user board assumed for now
- **Order gaps after deletion** → Acceptable; the board drag-and-drop re-orders on move, not on delete

## Migration Plan

No database migrations needed. The change is additive (new endpoint + function) and the delete is a straightforward `DELETE FROM kanban_work_items WHERE id = $1`.

Rollback: remove the new endpoint and store function; frontend falls back to no delete button (no data loss risk).
