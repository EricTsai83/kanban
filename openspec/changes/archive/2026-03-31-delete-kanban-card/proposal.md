## Why

Kanban cards can be created and edited but cannot be deleted — users must manually clear all fields or leave stale cards on the board. This is the only missing CRUD operation and blocks basic board hygiene.

## What Changes

- Add a **Delete** button to the card editor modal (with confirmation prompt)
- Add `DELETE /kanban/items/{item_id}` endpoint to the FastAPI backend
- Add `delete_work_item()` function to `store.py`
- Add frontend API call and optimistic state update on deletion

## Capabilities

### New Capabilities
- `delete-work-item`: Delete a single kanban card by ID; updates column item lists and preserves order of remaining items

### Modified Capabilities
*(none — no existing spec-level requirements are changing)*

## Non-goals

- Bulk deletion of multiple cards at once
- Soft delete / archiving cards (permanent delete only)
- Undo / restore after deletion

## Impact

- **Backend**: `apps/api/main.py` (new endpoint), `apps/api/store.py` (new function), `apps/api/models.py` (new request model)
- **Frontend**: `apps/web/components/kanban-app.tsx` (delete button + API call)
- **No schema migrations** required (delete is a row removal, no new columns)
