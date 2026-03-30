## ADDED Requirements

### Requirement: Board supports Gantt chart as a view mode
The system SHALL allow users to switch to a Gantt chart view mode from the board header view controls, alongside the existing compact and detailed density modes.

#### Scenario: Switch to Gantt chart view
- **WHEN** a user clicks the Gantt chart view toggle button in the board header
- **THEN** the system replaces the column-based board display with a horizontal Gantt chart timeline

#### Scenario: Switch back from Gantt chart view
- **WHEN** a user clicks the compact or detailed view toggle while in Gantt chart mode
- **THEN** the system returns to the column-based board display with the selected density
