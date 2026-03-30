## ADDED Requirements

### Requirement: Board supports execution-focused filtering
The system SHALL allow users to filter board work items by assignee, priority, label, and workflow status.

#### Scenario: Filter board by assignee and status
- **WHEN** a user applies assignee and status filters on the board
- **THEN** the system shows only work items that match all selected filters

### Requirement: Board supports grouped team views
The system SHALL allow users to group board work items by assignee, priority, or status without changing the underlying stored workflow state.

#### Scenario: Group board by assignee
- **WHEN** a user switches the board to an assignee-grouped view
- **THEN** the system presents the same work items organized by assignee while preserving each item's stored board column

### Requirement: Team health indicators are visible from the board
The system MUST show lightweight board-level indicators for work in progress and blocked items so engineering leads can identify delivery bottlenecks.

#### Scenario: Show blocked and WIP indicators
- **WHEN** a user views the engineering board
- **THEN** the system displays counts or summary indicators for blocked work items and in-progress work items
