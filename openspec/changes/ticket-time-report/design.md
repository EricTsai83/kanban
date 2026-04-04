## Context

Work items are stored with `createdAt` and `updatedAt` as ISO datetime strings, and `startDate`/`dueDate` as `YYYY-MM-DD` strings. The backend uses SQLAlchemy async with PostgreSQL. The frontend uses Next.js with Shadcn UI components and supports English and Traditional Chinese locales.

There is no existing reporting or filtering infrastructure — all current endpoints return the full board state.

## Goals / Non-Goals

**Goals:**
- Provide a backend endpoint that efficiently queries work items by date range
- Build a frontend report UI with date range selection, grouped results, and export
- Keep the implementation simple — a dialog/sheet accessible from the toolbar
- Support locale-aware date formatting consistent with the existing i18n system

**Non-Goals:**
- Persistent saved reports or report templates
- Visual charts or analytics dashboards
- Real-time or auto-refreshing reports

## Decisions

### 1. New GET endpoint `/kanban/report` with query parameters

The endpoint accepts `start_date`, `end_date`, and `date_field` (one of `createdAt`, `updatedAt`, `dueDate`, `startDate`) as query parameters. It returns matching work items grouped by column.

**Alternatives considered:** POST with a request body — rejected because this is a read-only query and GET is more appropriate and cacheable.

### 2. Server-side filtering with SQLAlchemy

Filtering is done at the database level using SQLAlchemy `between()` on the selected date field. For `createdAt`/`updatedAt` (datetime strings), we compare using string prefix matching against `YYYY-MM-DD` range. For `dueDate`/`startDate` (date strings), direct string comparison works since the format is lexicographically sortable.

**Alternatives considered:** Client-side filtering of full board data — rejected because it doesn't scale and wastes bandwidth.

### 3. Report UI as a Sheet/Dialog triggered from toolbar

A "Report" button is added to the existing toolbar. Clicking it opens a `Sheet` (Shadcn) from the right side with:
- Date range picker (two date inputs or a range picker component)
- Date field selector (dropdown: Created / Updated / Due / Start)
- "Generate" button
- Results area showing tickets grouped by column, with summary counts

**Alternatives considered:** Separate page route — rejected because the report is a secondary feature and a sheet keeps the user in context.

### 4. Export as CSV and Markdown copy

Two export options:
- **CSV download**: Generates a CSV blob with columns (ID, Title, Priority, Assignee, Column, Date) and triggers a browser download
- **Copy as Markdown**: Formats the grouped results as a markdown table and copies to clipboard

Both are client-side operations using the already-fetched report data.

### 5. Response model includes summary statistics

The report response includes:
- `items`: work items grouped by column (array of `{ column: string, items: WorkItem[] }`)
- `summary`: `{ total: number, byPriority: { low: N, medium: N, high: N, urgent: N }, byColumn: { [name]: N } }`

This avoids the frontend having to compute aggregates.

## Risks / Trade-offs

- **Date field type mismatch** → `createdAt`/`updatedAt` are ISO datetimes while `dueDate`/`startDate` are `YYYY-MM-DD`. The query logic handles both by comparing the date portion only.
- **Large result sets** → No pagination in v1. Acceptable for a kanban board (typically <500 items). Can add pagination later if needed.
- **Timezone handling** → Date range boundaries use the date string as-is (local date semantics), consistent with how dates are stored and displayed elsewhere in the app.
