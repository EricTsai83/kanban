## ADDED Requirements

### Requirement: Engineering team can create a kanban board
The system SHALL allow an engineering team to create a kanban board with a board name and a default workflow appropriate for software delivery.

#### Scenario: Create board with default engineering workflow
- **WHEN** a user creates a new engineering kanban board
- **THEN** the system creates a board with ordered columns for backlog, ready, in progress, in review, blocked, testing, and done

### Requirement: Board workflow columns can be configured
The system SHALL allow authorized users to add, rename, reorder, and remove workflow columns on an engineering kanban board.

#### Scenario: Reorder workflow columns
- **WHEN** an authorized user changes the order of columns on a board
- **THEN** the system persists the new column order and renders future board loads in that order

#### Scenario: Remove an empty workflow column
- **WHEN** an authorized user removes a workflow column that has no work items
- **THEN** the system removes the column from the board configuration

### Requirement: Board configuration must preserve work tracking integrity
The system MUST prevent board configuration changes that would leave work items without a valid workflow column.

#### Scenario: Reject removal of non-empty column
- **WHEN** an authorized user attempts to remove a column that still contains work items
- **THEN** the system rejects the change and explains that items must be moved first
