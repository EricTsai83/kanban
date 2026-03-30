## Context

Due dates are stored as `YYYY-MM-DD` strings and rendered verbatim in two places:
1. Kanban card badge (`components/kanban-app.tsx` ~line 1673)
2. List view row date column (~line 1824)

The app supports English and Traditional Chinese via `lib/i18n.ts`. No external date library is currently in use; the project uses native `Intl` APIs available in the target browsers.

## Goals / Non-Goals

**Goals:**
- Render due dates as compact, human-readable labels (`Apr 15`, `15 Apr 2026`, `今天`, etc.)
- Surface overdue and near-due urgency through badge color
- Keep formatting locale-aware using existing i18n infrastructure
- Zero runtime dependency additions

**Non-Goals:**
- Changing the stored `YYYY-MM-DD` format
- Editing or input UX changes
- Start date formatting (out of scope for this change)

## Decisions

### 1. Use a shared `formatDueDate` utility, not inline logic

A single pure function `formatDueDate(dateStr: string, locale: Locale): string` is introduced (inside `components/kanban-app.tsx` or a small helper at the top of the file). Both the card badge and the list row call it, keeping behaviour consistent.

**Alternatives considered:** Duplicating format logic at each call site — rejected because the two sites must stay in sync.

### 2. Native `Intl.DateTimeFormat`, no date library

Formatting uses `new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })` (plus year when not current year). Relative labels (Today / Tomorrow / Yesterday) are resolved by comparing calendar dates in local time, not UTC, to avoid off-by-one errors near midnight.

**Alternatives considered:** Adding `date-fns` — rejected to avoid a new dependency for a small formatting task.

### 3. Locale string keys for relative labels

`lib/i18n.ts` gets three new keys per locale: `today`, `tomorrow`, `yesterday`. These are referenced in `formatDueDate` so Chinese users see `今天`, `明天`, `昨天`.

### 4. Color-coded urgency via Tailwind variants

The card badge className is conditionally set:
- **Overdue** (past today): `text-destructive border-destructive/40 bg-destructive/10`
- **Due today**: `text-amber-600 border-amber-400/40 bg-amber-50 dark:bg-amber-950/30`
- **Upcoming (≤ 3 days)**: `text-yellow-600 border-yellow-400/40 bg-yellow-50 dark:bg-yellow-950/30`
- **Default**: existing `secondary` variant

The list row date text uses the same color tokens without a badge wrapper.

**Alternatives considered:** Icon-only urgency — rejected because color alone is more immediately scannable on dense boards.

## Risks / Trade-offs

- **Timezone edge cases** → `formatDueDate` parses `YYYY-MM-DD` as a local-time date (`new Date(y, m, d)`) rather than using the ISO string directly, avoiding UTC midnight off-by-one shifts.
- **Locale fallback** → If a locale string key is missing (future locales), fall back to `Intl.DateTimeFormat` output, which is always available.
- **Color accessibility** → Amber/yellow may have low contrast in light mode; Tailwind `dark:` variants mitigate this in dark mode. Color is supplemented by the `Calendar` icon already present in the badge.
