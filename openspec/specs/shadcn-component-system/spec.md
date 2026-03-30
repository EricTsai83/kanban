## ADDED Requirements

### Requirement: All interactive elements use Shadcn UI components

Every button, input, textarea, select, badge, label, tooltip, sheet (slide-over), and command palette in the kanban workspace SHALL be rendered using a Shadcn UI component from `components/ui/`.

#### Scenario: Buttons render as Shadcn Button

- **WHEN** a clickable action is displayed (e.g., "Create board", "New", "Save", "Cancel", sidebar icons)
- **THEN** it SHALL be rendered as a `<Button>` component with the appropriate `variant` and `size` props

#### Scenario: Text inputs use Shadcn Input

- **WHEN** a single-line text field is displayed (e.g., board name, title, assignee, labels, estimate, new column name)
- **THEN** it SHALL be rendered as a `<Input>` component from `components/ui/input`

#### Scenario: Multi-line inputs use Shadcn Textarea

- **WHEN** a multi-line text field is displayed (e.g., description)
- **THEN** it SHALL be rendered as a `<Textarea>` component from `components/ui/textarea`

#### Scenario: Dropdowns use Shadcn Select

- **WHEN** a dropdown selection is displayed (e.g., priority, column)
- **THEN** it SHALL be rendered using Shadcn's `<Select>`, `<SelectTrigger>`, `<SelectContent>`, and `<SelectItem>` components

#### Scenario: Labels use Shadcn Label

- **WHEN** a form field label is displayed
- **THEN** it SHALL be rendered as a `<Label>` component from `components/ui/label`

### Requirement: Slide-over panels use Shadcn Sheet

The work item detail panel and settings drawer SHALL be implemented using Shadcn's `Sheet` component instead of the custom `Overlay` wrapper.

#### Scenario: Item detail opens as a right-side Sheet

- **WHEN** user clicks a work item or the "New Item" action
- **THEN** a `<Sheet>` with `side="right"` SHALL open, containing the item form

#### Scenario: Settings drawer opens as a right-side Sheet

- **WHEN** user clicks the Settings action in the sidebar
- **THEN** a `<Sheet>` with `side="right"` SHALL open, containing the column configuration UI

#### Scenario: Sheets include standard close behavior

- **WHEN** user clicks the overlay backdrop, presses Escape, or clicks the close button
- **THEN** the `<Sheet>` SHALL close and focus SHALL return to the previously focused element

### Requirement: Command bar uses Shadcn CommandDialog

The filter and search overlay SHALL be implemented using Shadcn's `CommandDialog` component (built on cmdk + Dialog).

#### Scenario: Command bar opens via keyboard shortcut

- **WHEN** user presses `Cmd+K` (or `Ctrl+K`)
- **THEN** a `<CommandDialog>` SHALL open with a search input, filter groups, and group-by options

#### Scenario: Command bar supports search filtering

- **WHEN** user types in the command bar's search input
- **THEN** the displayed options SHALL filter to match the query text

### Requirement: Priority and status indicators use Shadcn Badge

Visual indicators for priority level, blocked status, and item labels SHALL be rendered using Shadcn's `Badge` component with appropriate variant styling.

#### Scenario: Priority displayed as a Badge

- **WHEN** a work item row displays its priority
- **THEN** it SHALL render a `<Badge>` with a variant or className that maps to the priority color

#### Scenario: Blocked status shown as a destructive Badge

- **WHEN** a work item is marked as blocked and its hover-expand metadata is visible
- **THEN** a `<Badge variant="destructive">Blocked</Badge>` SHALL be displayed

### Requirement: Sidebar icon buttons use Shadcn Button with Tooltip

Each sidebar action icon SHALL be rendered as a `<Button variant="ghost" size="icon">` wrapped in a Shadcn `<Tooltip>` that displays the action label on hover.

#### Scenario: Sidebar buttons show tooltip on hover

- **WHEN** user hovers over a sidebar icon button (Search, New Item, Settings, Theme Toggle)
- **THEN** a `<Tooltip>` SHALL appear displaying the action name

### Requirement: Custom sub-components are removed

The hand-built `Overlay`, `SidebarBtn`, `SheetField`, `CmdGroup`, and `CmdItem` component functions and the `<style jsx global>` block SHALL be deleted from `kanban-app.tsx` after migration.

#### Scenario: No custom UI primitives remain

- **WHEN** the migration is complete
- **THEN** `kanban-app.tsx` SHALL NOT contain definitions for `Overlay`, `SidebarBtn`, `SheetField`, `CmdGroup`, `CmdItem`, or any `<style jsx global>` block
