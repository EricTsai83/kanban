## ADDED Requirements

### Requirement: UI copy MUST be localized through locale dictionaries
The system SHALL source product-owned user interface copy from locale dictionaries instead of hardcoded English strings. The current kanban experience SHALL provide complete dictionary coverage for English and Traditional Chinese across onboarding, board shell actions, filter and grouping controls, item editor fields, settings text, empty states, and status or helper labels.

#### Scenario: Render English copy
- **WHEN** the active locale is `en`
- **THEN** the UI renders English text for product-owned labels, buttons, tooltips, headings, commands, and helper copy

#### Scenario: Render Traditional Chinese copy
- **WHEN** the active locale is `zh-TW`
- **THEN** the UI renders Traditional Chinese text for the same product-owned interface elements without requiring a different route

### Requirement: Missing translations MUST fall back safely
The system SHALL fall back to the default locale when a translation key is unavailable in the active locale, and it MUST continue rendering the interface without blank labels or runtime errors.

#### Scenario: Fallback for missing Chinese key
- **WHEN** the active locale is `zh-TW` and a requested key is missing from the Traditional Chinese dictionary
- **THEN** the interface renders the default-locale value for that key and the rest of the page remains usable

### Requirement: User-authored content MUST remain unchanged
The system SHALL not translate or rewrite persisted board names, work item titles, work item descriptions, labels, or assignee values that were entered by users.

#### Scenario: Display persisted work item content
- **WHEN** a work item title or description was authored in any language
- **THEN** the application displays the stored content as-is while translating only surrounding product-owned UI copy
