## Why

The kanban app currently ships with English-only UI copy hardcoded across the client and layout, which prevents bilingual teams from using the product comfortably and blocks a localized onboarding experience. Adding internationalization now creates a clean foundation before more screens, commands, and settings expand the amount of user-facing text.

## What Changes

- Add a reusable internationalization layer for application chrome, forms, commands, empty states, status labels, and theme/settings copy.
- Add English and Traditional Chinese translation dictionaries for the current kanban experience.
- Add an explicit language switcher so users can toggle between English and Chinese without reloading into a different route structure.
- Persist the selected language and update document metadata such as the HTML `lang` attribute to match the active locale.
- Define fallback behavior so missing translations degrade safely to the default locale instead of breaking the UI.

## Capabilities

### New Capabilities

- `localized-ui-copy`: Defines how user-facing product copy is sourced from locale dictionaries and rendered in English or Traditional Chinese.
- `language-selection`: Defines how users choose the active locale, how that choice persists, and how document language metadata follows the selection.

### Modified Capabilities

None.

## Impact

- `components/kanban-app.tsx` and related UI primitives will move visible copy out of hardcoded strings and into translation lookups.
- `app/layout.tsx` will need locale-aware document metadata such as `lang`, title, and description handling.
- New i18n support code and locale dictionaries will be added under shared app utilities.
- No backend API contract changes and no translation of user-authored board/item content.

## Non-goals

- Machine-translating board names, work item titles, descriptions, labels, or other user-entered content.
- Introducing locale-prefixed routes or a CMS-backed translation workflow in this change.
- Supporting languages beyond English and Traditional Chinese in the first iteration.
