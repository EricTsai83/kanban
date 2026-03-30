## ADDED Requirements

### Requirement: Header provides a view mode switcher
The system SHALL display a view mode switcher in the board header that allows toggling between "board" (kanban) and "list" view modes.

#### Scenario: Switcher is visible in header
- **WHEN** the board is loaded
- **THEN** a view mode switcher with board and list options SHALL be displayed in the header area

### Requirement: View mode switcher uses icon buttons
The switcher SHALL use icon buttons (Kanban icon for board mode, List icon for list mode) with the active mode visually highlighted.

#### Scenario: Active mode is highlighted
- **WHEN** the current view mode is "list"
- **THEN** the list icon button SHALL appear highlighted (e.g., secondary variant) and the board icon SHALL appear as ghost

### Requirement: Density toggle is hidden in list view mode
When the view mode is "list", the density toggle (compact/detailed) SHALL be hidden since list view has a fixed single-row layout.

#### Scenario: Density toggle hidden in list mode
- **WHEN** the user switches to list view mode
- **THEN** the density toggle SHALL not be visible

#### Scenario: Density toggle visible in board mode
- **WHEN** the user switches back to board view mode
- **THEN** the density toggle SHALL be visible again

### Requirement: Default view mode is board
The application SHALL default to "board" view mode on initial load.

#### Scenario: Initial load shows board
- **WHEN** the application loads for the first time
- **THEN** the view mode SHALL be "board" and the kanban layout SHALL be displayed
