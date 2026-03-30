## MODIFIED Requirements

### Requirement: CSS variables define light and dark palettes

The application SHALL use CSS custom properties under `:root` (light) and `.dark` (dark) selectors to define all color tokens consumed by Shadcn components and custom UI.

#### Scenario: Light palette applies by default

- **WHEN** no `.dark` class is present on the `<html>` element
- **THEN** the `:root` palette SHALL provide light-mode colors for `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`, `--destructive`, `--ring`, and custom sidebar/priority tokens

#### Scenario: Dark palette activates via class

- **WHEN** the `.dark` class is added to the `<html>` element
- **THEN** the `.dark` selector SHALL override all CSS custom properties with dark-mode appropriate values

#### Scenario: Sidebar colors adapt to light mode

- **WHEN** light mode is active (no `.dark` class)
- **THEN** the sidebar rail SHALL use a light palette where `--sidebar` is a light background color (e.g., `oklch(0.97 ...)`) and `--sidebar-foreground` is a dark text color (e.g., `oklch(0.25 ...)`), visually consistent with the overall light theme while maintaining subtle contrast with the main content area

#### Scenario: Sidebar colors adapt in dark mode

- **WHEN** dark mode is active
- **THEN** the sidebar rail SHALL use a dark palette that is visually distinct from the content area's dark background

#### Scenario: Sidebar interactive elements follow theme

- **WHEN** the theme changes between light and dark
- **THEN** sidebar buttons, icons, hover states, and accent colors SHALL adapt to maintain readable contrast ratios against the sidebar background in both modes
