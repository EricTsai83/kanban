## ADDED Requirements

### Requirement: Application supports light, dark, and system theme modes

The application SHALL provide three theme modes — light, dark, and system (OS preference) — managed by `next-themes`.

#### Scenario: Theme persists across sessions

- **WHEN** user selects a theme (light, dark, or system) and refreshes the page
- **THEN** the previously selected theme SHALL be restored

#### Scenario: No flash of incorrect theme on load

- **WHEN** the page loads with a stored theme preference
- **THEN** the correct theme SHALL be applied before the first paint (no visible flash of the wrong theme)

### Requirement: CSS variables define light and dark palettes

The application SHALL use CSS custom properties under `:root` (light) and `.dark` (dark) selectors to define all color tokens. The dark mode palette SHALL include 8+ distinct grayscale levels providing uniform perceptual spacing. Sidebar variables SHALL use a flat solid color with optional minimal cool-tone tint (oklch chroma ~0.01) for depth differentiation. No gradient, glow, or transparency variables SHALL be defined.

#### Scenario: Light palette applies by default

- **WHEN** no `.dark` class is present on the `<html>` element
- **THEN** the `:root` palette SHALL provide light-mode colors with an equivalent number of grayscale surface levels as dark mode

#### Scenario: Dark palette activates via class

- **WHEN** the `.dark` class is added to the `<html>` element
- **THEN** the `.dark` selector SHALL override all CSS custom properties with dark-mode values featuring 8+ grayscale levels and near-invisible border colors (3-6% white opacity)

#### Scenario: Sidebar colors adapt in dark mode

- **WHEN** dark mode is active
- **THEN** the sidebar rail SHALL use a solid flat color that is perceptibly darker or lighter than the content area background, without any transparency or blur effects

### Requirement: Application defaults to dark theme

The application SHALL use `defaultTheme="dark"` in the ThemeProvider configuration, making dark mode the initial experience for new users. Theme switching to light and system modes SHALL remain fully functional.

#### Scenario: First-time user sees dark mode

- **WHEN** a new user loads the application with no stored theme preference
- **THEN** the application SHALL render in dark mode

#### Scenario: Theme switching still works

- **WHEN** a user switches to light or system theme via the toggle
- **THEN** the selected theme SHALL apply correctly and persist across sessions
