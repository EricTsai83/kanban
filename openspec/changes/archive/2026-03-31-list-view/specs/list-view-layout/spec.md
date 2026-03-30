## ADDED Requirements

### Requirement: List view renders all visible work items as flat rows
The system SHALL render all filtered work items in a full-width, single-column table layout when list view mode is active. Each work item SHALL occupy exactly one row.

#### Scenario: All visible items appear as rows
- **WHEN** the user switches to list view mode
- **THEN** every work item that passes the current filters SHALL be displayed as a single row in a vertical list

### Requirement: Each list row displays essential work item fields
Each list row SHALL display the following fields in a fixed horizontal layout: priority indicator, title, status (column name), assignee, labels, due date, and estimate.

#### Scenario: Row displays all fields
- **WHEN** a work item is rendered in list view
- **THEN** the row SHALL show a priority color indicator, the item title, the column name as status, the assignee name or placeholder, up to 2 labels with overflow count, the due date if set, and the estimate if set

#### Scenario: Row handles missing optional fields
- **WHEN** a work item has no assignee, no labels, no due date, and no estimate
- **THEN** the row SHALL show placeholder text for assignee and leave other optional fields empty without breaking layout

### Requirement: List rows are clickable to open item editor
Each list row SHALL be clickable. Clicking a row SHALL open the existing item editor dialog pre-filled with that item's data.

#### Scenario: Click row to edit
- **WHEN** the user clicks a row in list view
- **THEN** the item editor dialog SHALL open with that work item's data loaded

### Requirement: List view shows a table header with column labels
The list view SHALL display a header row above the item rows showing the field names: Priority, Title, Status, Assignee, Labels, Due Date, Estimate.

#### Scenario: Header row is visible
- **WHEN** the list view is active
- **THEN** a header row SHALL be displayed at the top with labels for each column

### Requirement: Blocked items show a visual indicator in list view
When a work item is blocked, the list row SHALL display a blocked indicator (icon or badge) alongside the title.

#### Scenario: Blocked item indicator
- **WHEN** a blocked work item is rendered in list view
- **THEN** the row SHALL show a warning icon or blocked badge next to the title
