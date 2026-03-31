## ADDED Requirements

### Requirement: Delete work item via API
The system SHALL expose a `DELETE /kanban/items/{item_id}` endpoint that permanently removes the specified work item from the board and returns the updated full board state.

#### Scenario: Successful deletion
- **WHEN** a valid `item_id` is provided
- **THEN** the work item is removed from the database and the response contains the full board without that item

#### Scenario: Item not found
- **WHEN** the `item_id` does not exist
- **THEN** the server SHALL return HTTP 404

### Requirement: Delete button in card editor
The card editor modal SHALL include a Delete option that requires a two-step confirmation before sending the delete request.

#### Scenario: First click shows confirmation
- **WHEN** the user clicks the Delete button
- **THEN** the button changes to a red confirmation state ("確認刪除？" or equivalent)

#### Scenario: Second click confirms deletion
- **WHEN** the user clicks the confirmation button
- **THEN** the API DELETE request is sent, the modal closes, and the card is removed from the board

#### Scenario: Clicking away cancels deletion
- **WHEN** the user clicks elsewhere or closes the modal without confirming
- **THEN** the card is NOT deleted and the board state is unchanged
