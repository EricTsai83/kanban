### Requirement: List view supports column header sorting
The system SHALL allow users to sort the list view by clicking on column headers. Supported sort fields SHALL be: priority, title, status, assignee, and due date.

#### Scenario: Click header to sort ascending
- **WHEN** the user clicks a column header that is not currently sorted
- **THEN** the list SHALL sort by that field in ascending order and the header SHALL show an ascending indicator

#### Scenario: Click same header to toggle direction
- **WHEN** the user clicks a column header that is already sorted ascending
- **THEN** the sort direction SHALL toggle to descending and the indicator SHALL update

#### Scenario: Click same header again to clear sort
- **WHEN** the user clicks a column header that is already sorted descending
- **THEN** the sort SHALL be cleared and items SHALL return to their default order

### Requirement: Sort state is independent of filter state
Sorting SHALL operate on top of the filtered result set. Changing filters SHALL preserve the current sort field and direction.

#### Scenario: Filter change preserves sort
- **WHEN** the user applies a filter while a sort is active
- **THEN** the filtered results SHALL remain sorted by the current sort field and direction

### Requirement: Sort state resets when switching away from list view
When the user switches from list view to board view, the sort state SHALL reset to default (no active sort).

#### Scenario: Switch to board clears sort
- **WHEN** the user switches from list view to board view
- **THEN** the sort field and direction SHALL reset to their default values
