## ADDED Requirements

### Requirement: Application supports light, dark, and system theme modes

The application SHALL provide three theme modes — light, dark, and system (OS preference) — managed by `next-themes`.

#### Scenario: Default theme follows system preference

- **WHEN** the application loads for the first time
- **THEN** the active theme SHALL match the user's operating system color scheme preference

#### Scenario: Theme persists across sessions

- **WHEN** user selects a theme (light, dark, or system) and refreshes the page
- **THEN** the previously selected theme SHALL be restored

#### Scenario: No flash of incorrect theme on load

- **WHEN** the page loads with a stored theme preference
- **THEN** the correct theme SHALL be applied before the first paint (no visible flash of the wrong theme)

### Requirement: CSS variables define light and dark palettes

The application SHALL use CSS custom properties under `:root` (light) and `.dark` (dark) selectors to define all color tokens consumed by Shadcn components and custom UI.

#### Scenario: Light palette applies by default

- **WHEN** no `.dark` class is present on the `<html>` element
- **THEN** the `:root` palette SHALL provide light-mode colors for `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--destructive`, `--ring`, and custom sidebar/priority tokens

#### Scenario: Dark palette activates via class

- **WHEN** the `.dark` class is added to the `<html>` element
- **THEN** the `.dark` selector SHALL override all CSS custom properties with dark-mode appropriate values

#### Scenario: Sidebar colors adapt in dark mode

- **WHEN** dark mode is active
- **THEN** the sidebar rail SHALL use a dark palette that is visually distinct from the content area's dark background

### Requirement: ThemeProvider wraps the application

A `ThemeProvider` component using `next-themes` SHALL wrap the application in `layout.tsx` with `attribute="class"`, `defaultTheme="system"`, and `enableSystem`.

#### Scenario: ThemeProvider is present in the component tree

- **WHEN** any page of the application renders
- **THEN** it SHALL be a descendant of the `ThemeProvider` component

#### Scenario: HTML element supports hydration warning suppression

- **WHEN** the app renders server-side
- **THEN** the `<html>` element SHALL include `suppressHydrationWarning` to prevent mismatch warnings from the `next-themes` injected script

### Requirement: Theme toggle is accessible from the sidebar

A theme toggle control SHALL be placed in the sidebar rail allowing users to cycle through light → dark → system themes.

#### Scenario: Toggle cycles through themes

- **WHEN** user clicks the theme toggle button
- **THEN** the active theme SHALL cycle: light → dark → system → light

#### Scenario: Toggle displays the current theme icon

- **WHEN** the current theme is light
- **THEN** a sun icon SHALL be displayed
- **WHEN** the current theme is dark
- **THEN** a moon icon SHALL be displayed
- **WHEN** the current theme is system
- **THEN** a monitor icon SHALL be displayed

#### Scenario: Toggle has a tooltip

- **WHEN** user hovers over the theme toggle button
- **THEN** a tooltip SHALL display the current theme name (e.g., "Theme: dark")
