## ADDED Requirements

### Requirement: Work item editor opens as a centered Dialog
When a user clicks on a work item to edit it, the editor form SHALL open as a centered Dialog overlay instead of a side-sliding Sheet panel. The Dialog SHALL be horizontally and vertically centered on the viewport.

#### Scenario: Clicking a work item opens centered dialog
- **WHEN** the user clicks on a work item row
- **THEN** a Dialog SHALL appear centered on the screen containing the edit form, with a semi-transparent backdrop behind it

#### Scenario: Creating a new work item opens centered dialog
- **WHEN** the user clicks the "New" button to create a work item
- **THEN** a Dialog SHALL appear centered on the screen containing the creation form

### Requirement: Item editor Dialog has sufficient width for the form
The item editor Dialog SHALL have a maximum width of approximately 512px (lg) to comfortably display the two-column form layout (assignee/priority, column/estimate, due date/labels).

#### Scenario: Form layout fits within dialog
- **WHEN** the item editor Dialog is open on a desktop viewport
- **THEN** the two-column grid layout SHALL render properly without horizontal scrolling or cramped inputs

### Requirement: Settings panel remains as a Sheet
The workflow settings panel (column editor) SHALL continue to use the Sheet (side panel) component. Only the work item editor is changed to Dialog.

#### Scenario: Settings opens as side panel
- **WHEN** the user opens the settings/workflow columns editor
- **THEN** the settings SHALL continue to slide in from the right as a Sheet panel
