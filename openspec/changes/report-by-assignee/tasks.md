## 1. Backend — Models and types

- [x] 1.1 Add `GroupBy = Literal["column", "assignee"]` to `apps/api/models.py`
- [x] 1.2 Add `byAssignee: dict[str, int]` field to `ReportSummary` in `apps/api/models.py`

## 2. Backend — Report query logic

- [x] 2.1 Update `generate_report` in `apps/api/store.py` to accept a `group_by` parameter (default `"column"`)
- [x] 2.2 Add assignee grouping branch: when `group_by == "assignee"`, group rows by `assignee` field (use `"Unassigned"` for empty values), ordered alphabetically
- [x] 2.3 Compute `byAssignee` summary counts for all requests regardless of `group_by` value

## 3. Backend — API endpoint

- [x] 3.1 Add `group_by: GroupBy = Query("column")` parameter to `GET /kanban/report` in `apps/api/main.py`
- [x] 3.2 Pass `group_by` to `generate_report` call

## 4. Frontend — API client

- [x] 4.1 Add `GroupBy` type (`"column" | "assignee"`) and update `ReportSummary` interface with `byAssignee` in `apps/web/lib/api.ts`
- [x] 4.2 Update `fetchReport` to accept and pass `groupBy` parameter

## 5. Frontend — Report Sheet UI

- [x] 5.1 Add "Group by" `Select` dropdown to `ReportSheet` component with options Column / Assignee
- [x] 5.2 Pass selected `groupBy` value to `fetchReport` call
- [x] 5.3 Update `toCSV` function to handle assignee grouping — change header and first column based on active grouping

## 6. Frontend — i18n

- [x] 6.1 Add i18n strings for group-by labels in both English and Traditional Chinese (`report.groupBy`, `report.groupByColumn`, `report.groupByAssignee`) in `apps/web/lib/i18n.ts`
