## Context

The existing `/kanban/report` endpoint returns work items grouped by column with summary stats (`total`, `byPriority`, `byColumn`). The frontend Report Sheet lets users pick a date range and date field, then exports a CSV grouped by column. The `assignee` field exists on every work item but is not used in report grouping or summaries.

## Goals / Non-Goals

**Goals:**
- Allow users to toggle between "group by column" and "group by assignee" in the report
- Show per-assignee item counts in the summary regardless of grouping
- Keep backward compatibility — the default behavior remains grouping by column

**Non-Goals:**
- Multi-level grouping (e.g., by assignee then by column within each assignee)
- Filtering to specific assignees
- Visual charts or graphs

## Decisions

### 1. Add `group_by` query parameter to existing endpoint

The `/kanban/report` endpoint gets a new optional query parameter `group_by` with values `column` (default) or `assignee`. This reuses the existing `ReportGroup` model — when grouping by assignee, the `column` field in each group represents the assignee name instead.

**Alternatives considered:** Separate endpoint `/kanban/report/by-assignee` — rejected because the logic is 90% shared and a parameter is simpler.

**Alternatives considered:** Rename `ReportGroup.column` to a generic `groupKey` — rejected because it's a breaking change for existing consumers. The field semantics are clear from the `group_by` parameter.

### 2. Extend `ReportSummary` with `byAssignee`

Add `byAssignee: dict[str, int]` to `ReportSummary` so the summary always includes per-person counts regardless of the chosen grouping. This is cheap to compute and useful for quick overview.

### 3. Frontend group-by selector

Add a `Select` dropdown below the date field selector in the Report Sheet with options "Column" and "Assignee" (localized). The selected value is passed to `fetchReport` and also determines how `toCSV` structures its output.

When grouped by assignee:
- CSV header changes to: `Assignee,ID,Title,Priority,Column,Due Date,Estimate`
- Rows are grouped under each assignee name
- The first column shows the assignee instead of the workflow column

### 4. Backend grouping logic

In `store.py`, after fetching and filtering rows, branch on `group_by`:
- `column`: existing logic (group by `column_id`, keyed by column name)
- `assignee`: group by `row.assignee`, ordered alphabetically, with empty assignees grouped under "Unassigned"

Both paths share the same filtering, summary computation, and response model.

## Risks / Trade-offs

- **Reusing `ReportGroup.column` for assignee name** — slightly confusing field name when grouping by assignee, but avoids a breaking API change. The frontend already knows which grouping is active.
- **Empty assignee handling** — items with blank assignee are grouped under "Unassigned" to avoid empty group keys.
- **No pagination** — same as current implementation; acceptable for typical kanban board sizes.
