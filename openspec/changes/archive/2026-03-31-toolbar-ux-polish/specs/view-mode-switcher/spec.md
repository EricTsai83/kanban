## MODIFIED Requirements

### Requirement: View mode switcher uses icon buttons
The switcher SHALL use icon buttons (Kanban icon for board mode, List icon for list mode) with the active mode visually highlighted. Each button SHALL display a tooltip on hover with the view mode name.

#### Scenario: Active mode is highlighted
- **WHEN** the current view mode is "list"
- **THEN** the list icon button SHALL appear highlighted (secondary variant) and the board icon SHALL appear as ghost

#### Scenario: Tooltip identifies each button
- **WHEN** a user hovers over the board or list icon button
- **THEN** a tooltip SHALL display "Board" or "List" respectively
