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
The system SHALL allow users to group board work items by assignee, priority, or status without changing the underlying stored workflow state. Grouping SHALL only be available in board view mode.

#### Scenario: Group board by assignee
- **WHEN** a user switches the board to an assignee-grouped view
- **THEN** the system presents the same work items organized by assignee while preserving each item's stored board column

#### Scenario: Grouping is disabled in list view
- **WHEN** the view mode is "list"
- **THEN** the group-by control SHALL not affect the list layout, and items SHALL be displayed in a flat list
