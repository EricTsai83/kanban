### Requirement: Sidebar ghost button icons remain visible on hover
All ghost-variant buttons in the sidebar rail SHALL display their icon with sufficient contrast against the sidebar background in both hover and non-hover states, across all theme modes (light and dark).

The hover styles MUST use sidebar-specific color tokens (`sidebar-muted` for background, `sidebar-foreground` for text) and MUST override the ghost variant's default `hover:text-foreground` to prevent the icon from becoming invisible on a dark sidebar.

#### Scenario: Light mode hover on sidebar button
- **WHEN** the app is in light mode and the user hovers over any sidebar ghost button (Search, New Item, Settings, Theme Toggle)
- **THEN** the button background changes to `sidebar-muted` and the icon color changes to `sidebar-foreground`, both of which provide visible contrast against the dark sidebar

#### Scenario: Dark mode hover on sidebar button
- **WHEN** the app is in dark mode and the user hovers over any sidebar ghost button
- **THEN** the button background changes to `sidebar-muted` and the icon color changes to `sidebar-foreground`, maintaining visible contrast

#### Scenario: Non-hover state preserves muted appearance
- **WHEN** the user is not hovering over a sidebar ghost button
- **THEN** the icon SHALL display at `sidebar-foreground/60` opacity, providing a subtler appearance that becomes more prominent on hover
