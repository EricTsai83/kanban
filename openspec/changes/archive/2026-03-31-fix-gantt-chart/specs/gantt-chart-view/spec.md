## MODIFIED Requirements

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

### Requirement: Gantt date header remains visible during vertical scroll
The system SHALL keep the date axis header row fixed at the top of the Gantt chart while the user scrolls vertically through item rows.

#### Scenario: Header stays visible when scrolling down
- **WHEN** the user scrolls down through a Gantt chart with many rows
- **THEN** the date header row remains visible at the top of the Gantt area

#### Scenario: Header scrolls horizontally with rows
- **WHEN** the user scrolls the Gantt chart horizontally
- **THEN** the date header row scrolls in sync with the item rows so column alignment is maintained
