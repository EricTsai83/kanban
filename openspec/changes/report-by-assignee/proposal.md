## Why

The current report groups work items by column (workflow status) and exports a flat CSV. When a team lead downloads the report, there is no easy way to see each person's contributions — you have to manually scan or filter the CSV by assignee. This makes it hard to answer questions like "What did Alice complete this sprint?" or "How is work distributed across the team?"

Adding a "group by assignee" option to the report gives immediate visibility into individual contributions without requiring external spreadsheet work.

## What Changes

- Add a new `group_by` query parameter to the existing `/kanban/report` endpoint, supporting `column` (current default) and `assignee`
- When grouped by assignee, the response groups work items under each person's name instead of column name, with per-assignee summary stats
- Update the frontend Report Sheet to include a "Group by" selector (Column / Assignee)
- Update CSV export to reflect the chosen grouping — when grouped by assignee, the first column becomes "Assignee" and items are sorted by person
- Add a `byAssignee` field to the report summary for quick item-count-per-person overview regardless of grouping

## Capabilities

### Modified Capabilities

- `ticket-report-api`: Add `group_by` parameter to report endpoint; extend response model with assignee grouping and `byAssignee` summary
- `ticket-report-ui`: Add "Group by" dropdown to Report Sheet; update CSV export to respect selected grouping

## Impact

- `apps/api/models.py` — add `GroupBy` literal type; add `byAssignee` to `ReportSummary`
- `apps/api/store.py` — update `generate_report` to accept `group_by` param and build groups accordingly
- `apps/api/main.py` — add `group_by` query parameter to `/kanban/report`
- `apps/web/lib/api.ts` — add `GroupBy` type; update `fetchReport` signature and `ReportSummary` interface
- `apps/web/components/report-sheet.tsx` — add group-by selector; update `toCSV` to handle assignee grouping
- `apps/web/lib/i18n.ts` — add i18n strings for new UI labels

## Non-goals

- Per-assignee charts or visual analytics
- Filtering the report to specific assignees (show all or nothing)
- Assignee-based permissions or access control on reports
- Historical assignee tracking (uses current assignee only)
