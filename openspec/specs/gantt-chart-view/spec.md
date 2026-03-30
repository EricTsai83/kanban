### Requirement: System renders a horizontal Gantt timeline for work items
The system SHALL display work items as horizontal bars on a time axis, where each bar spans from the item's start date to its due date. The Gantt chart container SHALL fill the available viewport height without collapsing.

#### Scenario: Display work item as a time bar
- **WHEN** a user switches to the Gantt chart view and a work item has both a start date (or createdAt fallback) and a due date
- **THEN** the system renders a horizontal bar spanning from the start date to the due date on the timeline

#### Scenario: Display work item without due date as milestone marker
- **WHEN** a user views the Gantt chart and a work item has no due date
- **THEN** the system renders a diamond-shaped milestone marker at the item's start date (or createdAt fallback) position

#### Scenario: Gantt chart fills available viewport height
- **WHEN** the user switches to the Gantt chart view
- **THEN** the chart container fills the available height and does not collapse to zero height

### Requirement: Gantt bars are color-coded by priority
The system SHALL render each Gantt bar using the priority color of the corresponding work item (urgent, high, medium, low).

#### Scenario: Urgent item bar uses urgent color
- **WHEN** a work item with urgent priority is displayed on the Gantt chart
- **THEN** the bar uses the `--priority-urgent` color

### Requirement: Gantt chart timeline auto-calculates visible date range
The system SHALL automatically compute the timeline range from the earliest start date to the latest due date among visible items, with 2 days of padding on each side.

#### Scenario: Auto range from item dates
- **WHEN** visible items span from 2026-04-01 to 2026-04-20
- **THEN** the timeline displays from 2026-03-30 to 2026-04-22

#### Scenario: No items with dates
- **WHEN** no visible items have valid date information
- **THEN** the system displays an empty state message instead of the timeline

### Requirement: Gantt chart displays a day-level time axis header
The system SHALL render a header row showing date labels along the time axis at day granularity.

#### Scenario: Date labels in header
- **WHEN** the Gantt chart timeline is rendered
- **THEN** the header row displays date markers at regular intervals with month and day labels

### Requirement: Gantt date header remains visible during vertical scroll
The system SHALL keep the date axis header row fixed at the top of the Gantt chart while the user scrolls vertically through item rows.

#### Scenario: Header stays visible when scrolling down
- **WHEN** the user scrolls down through a Gantt chart with many rows
- **THEN** the date header row remains visible at the top of the Gantt area

#### Scenario: Header scrolls horizontally with rows
- **WHEN** the user scrolls the Gantt chart horizontally
- **THEN** the date header row scrolls in sync with the item rows so column alignment is maintained

### Requirement: Hovering a Gantt bar shows item details
The system SHALL display a tooltip with the work item's title, assignee, priority, start date, and due date when the user hovers over a Gantt bar.

#### Scenario: Hover tooltip content
- **WHEN** a user hovers over a Gantt bar
- **THEN** a tooltip appears showing the item's title, assignee, priority, start date, and due date

### Requirement: Clicking a Gantt bar opens the item editor
The system SHALL open the work item editor dialog when a user clicks on a Gantt bar.

#### Scenario: Click to edit
- **WHEN** a user clicks a Gantt bar
- **THEN** the system opens the item editor dialog pre-populated with the clicked item's data

### Requirement: Gantt chart respects active filters
The system SHALL apply the same filter criteria (assignee, priority, label, status) to the Gantt chart view as used in other board views.

#### Scenario: Filter applied in Gantt view
- **WHEN** a user applies an assignee filter while in the Gantt chart view
- **THEN** only work items matching that assignee are shown on the timeline

### Requirement: Gantt chart rows display item metadata
The system SHALL display each item's title, assignee avatar, and priority indicator in the left-side row label area of the Gantt chart.

#### Scenario: Row label content
- **WHEN** the Gantt chart renders a work item row
- **THEN** the row label area shows the item title, assignee initial avatar, and a priority color indicator
