## Why

Teams need visibility into what work was completed, in progress, or created during a specific time period. Currently there is no way to generate a summary report of tickets — users must manually scan the board or remember what happened. A time-based report feature lets team leads review sprint progress, prepare standups, and share status updates efficiently.

## What Changes

- Add a new API endpoint that returns work items filtered by a date range (based on `createdAt`, `updatedAt`, or `dueDate`)
- Add a report page/dialog in the frontend where users can select a date range, choose which date field to filter on, and view a formatted summary of matching tickets
- Support grouping results by column (workflow status) and priority
- Allow exporting the report as a downloadable CSV or copying as markdown

## Capabilities

### New Capabilities

- `ticket-report-api`: Backend endpoint to query work items within a date range, with filtering by date field type and optional grouping
- `ticket-report-ui`: Frontend report view with date range picker, filter controls, grouped ticket list, and export options

### Modified Capabilities

- `engineering-board-views`: Add a "Report" entry point in the toolbar/sidebar to access the report feature

## Impact

- `apps/api/main.py` — new `/kanban/report` GET endpoint with query params for date range and field
- `apps/api/store.py` — new query function to filter work items by date range
- `apps/api/models.py` — new response model for report data
- `apps/web/components/` — new report dialog/page component with date pickers and result table
- `apps/web/lib/` — API client function for fetching report data

## Non-goals

- Scheduled/automated report generation or email delivery
- Charts or visual analytics (bar charts, burndown, etc.)
- Filtering by assignee, label, or other non-date fields (can be added later)
- Persisting saved report configurations
