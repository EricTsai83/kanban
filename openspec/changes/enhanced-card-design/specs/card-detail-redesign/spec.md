## ADDED Requirements

### Requirement: Card detail dialog displays hero cover image

When a work item has a cover image, the detail dialog SHALL display it as a full-width hero banner at the top of the dialog, above the dialog header.

#### Scenario: Opening card with cover image
- **WHEN** a user clicks on a card that has a `coverImage` URL
- **THEN** the dialog SHALL render a hero banner image (approx. 200px tall, full dialog width, `object-cover`) as the first visual element, followed by the dialog title and form fields

#### Scenario: Opening card without cover image
- **WHEN** a user clicks on a card that has no cover image
- **THEN** the dialog SHALL render without the hero banner, starting with the dialog title directly

#### Scenario: Cover image load failure in dialog
- **WHEN** the dialog opens and the cover image URL fails to load
- **THEN** the hero banner area SHALL be hidden gracefully and the dialog SHALL render as if no cover image was set

### Requirement: Card detail dialog includes cover image URL input

The item editor form SHALL include a text input field for the cover image URL, allowing users to add, change, or remove the cover image.

#### Scenario: Adding a cover image URL
- **WHEN** a user enters a URL in the cover image input field and saves
- **THEN** the work item SHALL be updated with the new cover image and the hero banner SHALL appear immediately

#### Scenario: Removing a cover image
- **WHEN** a user clears the cover image input field and saves
- **THEN** the work item's cover image SHALL be set to null and the hero banner SHALL be removed

### Requirement: Card detail dialog displays structured metadata

The card detail dialog SHALL display work item metadata in a structured, readable layout with clear visual hierarchy.

#### Scenario: Full metadata display
- **WHEN** a card detail dialog opens for an item with all fields populated
- **THEN** the dialog SHALL display: hero image (if present), title prominently, description in a multi-line text area, assignee and priority in a two-column grid, column and estimate in a two-column grid, due date and labels in a two-column grid, and blocked status as a checkbox

#### Scenario: Priority is visually indicated
- **WHEN** the card detail dialog shows the priority field
- **THEN** the priority selector SHALL use priority-specific colors matching the card preview's priority color system
