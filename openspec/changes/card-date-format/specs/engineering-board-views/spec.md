## MODIFIED Requirements

### Requirement: Board supports execution-focused filtering
The system SHALL allow users to filter board work items by assignee, priority, label, and workflow status. Filters SHALL apply consistently across both board and list view modes.

#### Scenario: Filter board by assignee and status
- **WHEN** a user applies assignee and status filters on the board
- **THEN** the system shows only work items that match all selected filters

#### Scenario: Filters apply in list view mode
- **WHEN** a user applies filters while in list view mode
- **THEN** the list view shows only work items that match all selected filters, identical to board mode filtering

### Requirement: Board supports grouped team views
The system SHALL allow users to group board work items by assignee, priority, or status without changing the underlying workflow state. Grouping SHALL only be available in board view mode.

#### Scenario: Group board by assignee
- **WHEN** a user switches the board to an assignee-grouped view
- **THEN** the system presents the same work items organized by assignee while preserving each item's stored board column

#### Scenario: Grouping is disabled in list view
- **WHEN** the view mode is "list"
- **THEN** the group-by control SHALL not affect the list layout, and items SHALL be displayed in a flat list

### Requirement: Team health indicators are visible from the board
The system MUST show lightweight board-level indicators for work in progress and blocked items so engineering leads can identify delivery bottlenecks.

#### Scenario: Show blocked and WIP indicators
- **WHEN** a user views the engineering board
- **THEN** the system displays counts or summary indicators for blocked work items and in-progress work items

### Requirement: Board supports Gantt chart as a view mode
The system SHALL allow users to switch to a Gantt chart view mode from the board header view controls, alongside the existing compact and detailed density modes.

#### Scenario: Switch to Gantt chart view
- **WHEN** a user clicks the Gantt chart view toggle button in the board header
- **THEN** the system replaces the column-based board display with a horizontal Gantt chart timeline

#### Scenario: Switch back from Gantt chart view
- **WHEN** a user clicks the compact or detailed view toggle while in Gantt chart mode
- **THEN** the system returns to the column-based board display with the selected density

### Requirement: List view due date column renders formatted labels
The due date column in list view SHALL display formatted, locale-aware date labels (as defined in the card-date-display capability) rather than raw `YYYY-MM-DD` strings. Urgency color styling SHALL be consistent with kanban card date badges.

#### Scenario: List view due date shows human-readable label
- **WHEN** a work item with a due date is displayed in list view
- **THEN** the due date column shows a formatted label (e.g. "Apr 15", "今天") instead of "2026-04-15"

#### Scenario: List view overdue due date uses destructive color
- **WHEN** a work item's due date is before today and displayed in list view
- **THEN** the due date text uses the destructive color token
