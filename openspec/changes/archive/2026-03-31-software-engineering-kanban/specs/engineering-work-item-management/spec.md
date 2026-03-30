## ADDED Requirements

### Requirement: Team members can create and edit engineering work items
The system SHALL allow team members to create and edit work items with title, description, assignee, priority, labels, estimate, due date, and blocker state.

#### Scenario: Create work item with engineering metadata
- **WHEN** a team member creates a new work item and provides engineering metadata
- **THEN** the system stores the item and displays the metadata on the board card or detail view

### Requirement: Work items can move through the engineering workflow
The system SHALL allow users to move a work item from one board column to another while preserving its order within the destination column.

#### Scenario: Move work item to another column
- **WHEN** a user moves a work item from one workflow column to another
- **THEN** the system updates the item's current column and displays it in the destination column at the persisted order

### Requirement: Blocked work must be visible
The system MUST allow a work item to be marked as blocked and MUST visually distinguish blocked work from non-blocked work on the board.

#### Scenario: Mark work item as blocked
- **WHEN** a user marks a work item as blocked
- **THEN** the system stores the blocked state and renders a visible blocked indicator on the card

### Requirement: Work item changes must persist across sessions
The system MUST persist edits and movement of work items so that the latest state is shown when the board is reloaded.

#### Scenario: Reload board after work item update
- **WHEN** a user reloads the board after editing or moving a work item
- **THEN** the system shows the updated work item fields and current workflow position
