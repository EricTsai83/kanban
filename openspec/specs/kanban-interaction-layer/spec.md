## ADDED Requirements

### Requirement: Clicking a work item opens a slide-over detail panel
The system SHALL open a slide-over panel from the right when a user clicks a work item row. The panel MUST contain the full edit form for the item and close when dismissed.

#### Scenario: Open detail panel for a work item
- **WHEN** a user clicks on a work item row in a board column
- **THEN** a slide-over panel appears from the right showing the item's full editable details

#### Scenario: Close detail panel
- **WHEN** a user dismisses the slide-over panel (via close button, escape key, or clicking outside)
- **THEN** the panel closes and the board is fully visible again

### Requirement: Filters and grouping are accessible through a command-bar overlay
The system SHALL provide a command-bar overlay (triggered by a keyboard shortcut or toolbar icon) that combines search, filter, and group-by controls in a single interface. The permanent filter bar MUST be removed from the board surface.

#### Scenario: Open command-bar overlay
- **WHEN** a user presses the keyboard shortcut or clicks the filter icon
- **THEN** a command-bar overlay appears allowing the user to search items, set filters, and change group-by mode

#### Scenario: Apply filter from command-bar
- **WHEN** a user selects a filter option in the command-bar and confirms
- **THEN** the board updates to show only matching work items and the command-bar closes

### Requirement: Column configuration is accessible through a settings drawer
The system SHALL move the column configuration UI (add, rename, reorder, remove) into a slide-in settings drawer, accessible from a sidebar settings icon. Column config MUST NOT be visible on the main board surface by default.

#### Scenario: Open settings drawer to manage columns
- **WHEN** a user clicks the settings icon in the sidebar
- **THEN** a settings drawer slides in from the right showing column configuration controls

### Requirement: Drag-and-drop provides visual feedback with smooth transitions
The system SHALL provide visible drop-zone highlighting when dragging a work item over a column, and the item MUST animate smoothly into its new position after being dropped.

#### Scenario: Column highlights on drag-over
- **WHEN** a user drags a work item over a different column
- **THEN** the destination column shows a visible highlight to indicate it is a valid drop target

### Requirement: Work item rows reveal metadata on hover
The system SHALL reveal additional metadata (labels, estimate, due date, blocked badge) when the user hovers over a work item row, without requiring a click.

#### Scenario: Hover reveals item metadata
- **WHEN** a user hovers over a work item row
- **THEN** the row expands slightly to show labels, estimate, due date, and blocked status below the title line
