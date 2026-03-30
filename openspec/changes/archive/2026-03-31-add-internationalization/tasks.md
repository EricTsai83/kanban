## 1. I18n Foundation

- [x] 1.1 Add a shared i18n module with locale types, default locale constants, dictionary helpers, and English/Traditional Chinese translation resources
- [x] 1.2 Add a client i18n provider and hook that resolves the active locale, persists user preference, and exposes translated copy to the app tree
- [x] 1.3 Update the app shell bootstrap so runtime document language metadata follows the resolved locale

## 2. Localize Current Kanban UI

- [x] 2.1 Replace hardcoded onboarding, shell, metrics, filter, grouping, tooltip, and empty-state strings in `components/kanban-app.tsx` with dictionary lookups
- [x] 2.2 Localize the item create/edit form labels, placeholders, action buttons, and validation or fallback copy without translating user-authored field values
- [x] 2.3 Localize settings drawer copy, workflow controls, priority/status helper text, and any remaining product-owned labels surfaced by the board UI

## 3. Language Selection Experience

- [x] 3.1 Add an explicit language switcher to the app shell so users can toggle between English and Traditional Chinese during a session
- [x] 3.2 Restore the saved locale on reload and ensure missing translation keys fall back to the default locale without breaking the interface

## 4. Verification

- [x] 4.1 Verify the English and Traditional Chinese experiences manually across onboarding, board view, commands, item editing, and settings
- [x] 4.2 Run `npm run lint` and `npm run build` and fix any issues introduced by the localization changes
