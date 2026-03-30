## ADDED Requirements

### Requirement: Work items support an optional cover image URL

The `KanbanWorkItem` type SHALL include a `coverImage` field of type `string | null`. When provided, it SHALL contain a valid image URL. When omitted or null, the work item SHALL render without a cover image.

#### Scenario: Work item created without cover image
- **WHEN** a work item is created without specifying `coverImage`
- **THEN** the `coverImage` field SHALL default to `null`

#### Scenario: Work item created with a cover image URL
- **WHEN** a work item is created with `coverImage` set to `"https://example.com/image.jpg"`
- **THEN** the work item SHALL store the URL and the cover image SHALL be rendered in card preview and detail views

#### Scenario: Cover image URL is updated
- **WHEN** a work item's `coverImage` is updated from null to a valid URL via PATCH
- **THEN** the card SHALL immediately display the cover image in both preview and detail views

#### Scenario: Cover image is removed
- **WHEN** a work item's `coverImage` is set to `null` or empty string via PATCH
- **THEN** the card SHALL render without a cover image area, and layout SHALL collapse gracefully

### Requirement: Cover image handles load failures gracefully

The system SHALL handle external image loading failures without breaking the card layout.

#### Scenario: Image URL returns 404
- **WHEN** a cover image URL fails to load (network error, 404, etc.)
- **THEN** the cover image area SHALL be hidden and the card SHALL render as if no cover image was set

#### Scenario: Image loads slowly
- **WHEN** a cover image is loading
- **THEN** the card SHALL display a placeholder area with the correct dimensions to prevent layout shift

### Requirement: Cover image in preview uses half-height display

In the card preview (board column view), the cover image SHALL display at the top of the card with a fixed height of approximately 120px using `object-cover` to maintain aspect ratio.

#### Scenario: Landscape image in preview
- **WHEN** a card with a landscape cover image is rendered in the board column
- **THEN** the image SHALL fill the full card width and 120px height, cropping vertically as needed with `object-cover`

#### Scenario: Portrait image in preview
- **WHEN** a card with a portrait cover image is rendered in the board column
- **THEN** the image SHALL fill the full card width and 120px height, cropping horizontally as needed with `object-cover`

### Requirement: Cover image in dialog uses hero banner display

In the card detail dialog, the cover image SHALL display as a full-width hero banner at the top of the dialog, approximately 200px tall, rendered outside the dialog's content padding.

#### Scenario: Dialog opens with cover image
- **WHEN** a user clicks on a card that has a cover image
- **THEN** the dialog SHALL display the cover image as a full-width banner above the dialog header and form content

#### Scenario: Dialog opens without cover image
- **WHEN** a user clicks on a card that has no cover image
- **THEN** the dialog SHALL render without the hero banner area, starting directly with the header

### Requirement: API accepts coverImage in create and update payloads

The `/api/kanban/items` endpoint SHALL accept `coverImage` as an optional string field in both POST (create) and PATCH (update) request bodies.

#### Scenario: Create item with coverImage
- **WHEN** a POST request includes `coverImage: "https://example.com/img.jpg"`
- **THEN** the created work item SHALL have the specified cover image URL stored

#### Scenario: Update item coverImage
- **WHEN** a PATCH request includes `coverImage: "https://example.com/new.jpg"`
- **THEN** the work item's cover image SHALL be updated to the new URL
