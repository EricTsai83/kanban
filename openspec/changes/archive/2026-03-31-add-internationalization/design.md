## Context

The current app is a single-route, client-heavy kanban workspace where most user-facing copy is hardcoded directly inside `components/kanban-app.tsx`, while `app/layout.tsx` fixes the document language to English. There is no existing locale model, translation dictionary, or helper for resolving UI copy, so adding English and Traditional Chinese support is a cross-cutting change that touches layout metadata, global app shell controls, onboarding, forms, commands, filters, empty states, and status labels.

Because the product currently behaves more like an authenticated dashboard than a marketing site, the implementation should favor a lightweight application-level i18n system over route-prefixed localization. The design also needs to keep user-authored board content unchanged, since translating work item titles or descriptions would alter data the user entered.

## Goals / Non-Goals

**Goals:**

- Introduce a reusable localization layer that can serve all existing UI copy in English and Traditional Chinese.
- Let users explicitly switch languages from the app shell and see copy update immediately.
- Persist the selected locale across reloads and apply matching document language metadata for accessibility.
- Provide a deterministic fallback to the default locale when a translation key is missing.

**Non-Goals:**

- Translating user-entered board names, work item titles, descriptions, or labels.
- Adding locale-prefixed URLs, server-side locale negotiation, or CMS-managed translation content.
- Expanding support beyond English and Traditional Chinese in this first pass.

## Decisions

### Decision 1: Add an app-scoped i18n provider with typed dictionaries

**Choice**: Introduce a small shared i18n module (for locale types, dictionaries, lookup helpers, and default locale constants) plus a client provider/hook that exposes the active locale, setter, and translated strings to the React tree.

**Why**: Most copy lives in one large client component today, but more UI surface is likely to grow. A provider keeps string lookup consistent, avoids prop-drilling, and gives implementation code one place to enforce fallback behavior and key coverage.

**Alternatives considered**:
- Inline `const copy = { ... }` maps inside `KanbanApp` only: fast initially, but it would not scale past one page and would mix structure, state, and translations in the same file.
- Adopting a full external i18n framework immediately: more powerful, but unnecessary for a two-locale single-route app and adds integration overhead before the requirements justify it.

### Decision 2: Keep a single route and switch locale client-side

**Choice**: Keep the current route structure unchanged and make locale selection an in-app preference stored on the client. On load, the app resolves locale from persisted preference, falling back to the default locale when none exists.

**Why**: The current app has one primary page and no SEO-driven localized routes. Client-side locale switching minimizes routing churn and keeps the first implementation focused on UX and maintainability.

**Alternatives considered**:
- Locale-prefixed routes such as `/en` and `/zh-TW`: useful for SEO and server metadata, but introduces routing and navigation complexity the current dashboard does not need.
- Browser-language auto-detection as the primary source: convenient, but less predictable than an explicit saved preference and harder to reason about during QA.

### Decision 3: Update runtime document language metadata from the active locale

**Choice**: The i18n layer will update `document.documentElement.lang` to match the active locale and provide localized page title/description values for the current experience. The server-rendered default remains the default locale, and client hydration updates the runtime metadata after the user preference resolves.

**Why**: This satisfies accessibility and screen-reader expectations while staying compatible with a local preference model.

**Alternatives considered**:
- Leave `lang` static in English: simpler, but incorrect once the user switches to Chinese.
- Rework the app around cookies or route params so metadata is fully localized on first response: more correct for multi-page public sites, but overkill for this dashboard-style app.

### Decision 4: Organize translation keys by product surface, with English as the fallback source

**Choice**: Structure dictionaries around UI domains such as onboarding, board shell, commands/filters, item editor, settings, statuses, and shared labels. English serves as the fallback baseline; missing keys in Traditional Chinese resolve to English rather than rendering blank or breaking.

**Why**: Domain-oriented keys are easier to maintain than one flat file, and English already represents the existing product wording.

### Decision 5: Treat persisted board data as content, not translatable UI copy

**Choice**: Only product-owned copy becomes localized. Stored board data continues to render exactly as authored.

**Why**: User-entered content is not guaranteed to have equivalent translations and must remain stable across sessions and collaborators.

## Risks / Trade-offs

- SSR metadata starts in the default locale before client preference is applied -> Acceptable for the current single-page dashboard; mitigate by updating `lang` and title/description immediately after locale resolution.
- Hardcoded strings are scattered through one large component -> Mitigate with a string inventory pass and by grouping translation keys by UI surface before replacing literals.
- Missing dictionary keys could cause mixed-language UI -> Mitigate with typed dictionaries and English fallback lookup.
- Adding a language control increases shell density -> Mitigate by placing it near existing global controls such as theme/settings, not inside task forms.

## Migration Plan

- Ship with English as the default locale so existing users see the current experience unless they explicitly choose Chinese.
- Persist locale choice in client storage, so the feature is additive and does not require data migration.
- If issues appear after release, fall back to the default locale and keep the language switcher hidden or disabled while preserving the shared dictionary structure.

## Open Questions

- None for the initial implementation; the first pass will support `en` and `zh-TW` only, with English as the default locale.
