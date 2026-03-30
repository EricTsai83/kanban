## ADDED Requirements

### Requirement: Dark mode defines 8+ grayscale levels with uniform perceptual spacing
The dark mode palette SHALL define at minimum 8 distinct grayscale levels using oklch lightness values (chroma 0), spaced uniformly in perceptual brightness. These levels MUST cover: deepest background, sidebar, elevated surface, hover surface, active/pressed surface, subtle border, disabled content, secondary content, dimmed primary content, and bright primary content.

#### Scenario: Grayscale levels are visually distinguishable
- **WHEN** the application renders in dark mode
- **THEN** each UI surface (background, sidebar, card, hover state) SHALL use a distinct grayscale level, and adjacent surfaces SHALL be visually distinguishable without relying on borders

#### Scenario: Grayscale spacing is perceptually uniform
- **WHEN** comparing adjacent grayscale levels in the palette
- **THEN** the lightness difference between consecutive levels SHALL be roughly uniform (within oklch 0.03-0.05 per step)

### Requirement: Light mode defines a complementary grayscale system
The light mode palette SHALL define an equivalent set of grayscale levels inverted for light backgrounds, maintaining the same number of distinct surface levels and perceptual uniformity.

#### Scenario: Light mode surfaces are distinguishable
- **WHEN** the application renders in light mode
- **THEN** each UI surface SHALL use a distinct grayscale level comparable in hierarchy to the dark mode system

### Requirement: Accent color is used exclusively for functional purposes
The primary/accent color (violet) SHALL appear ONLY in functional contexts: priority indicators, active/selected states, interactive element focus rings, and primary CTA buttons. It MUST NOT appear as decorative backgrounds, gradients, or ambient effects.

#### Scenario: No decorative accent color usage
- **WHEN** scanning the entire UI in its default state (no interactions)
- **THEN** the accent color SHALL only be visible on priority indicator bars, the sidebar brand icon, and primary action buttons

#### Scenario: Active state uses accent color
- **WHEN** a user selects or activates an interactive element
- **THEN** the accent color SHALL indicate the active state through a focus ring or background tint

### Requirement: Priority colors are the only non-grayscale semantic colors
The priority colors (urgent, high, medium, low) SHALL be the only saturated colors in the regular UI. They MUST be used consistently for priority indicators and badges only.

#### Scenario: Priority colors appear on work item rows
- **WHEN** a work item row renders
- **THEN** the priority color SHALL appear on the left accent bar and the priority badge, and nowhere else on that row
