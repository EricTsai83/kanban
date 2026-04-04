## 1. Backend — Report query function

- [ ] 1.1 Add `ReportRequest` query model and `ReportResponse` / `ReportGroup` response models to `apps/api/models.py`
- [ ] 1.2 Implement `generate_report(start_date, end_date, date_field, db)` in `apps/api/store.py` that queries work items filtered by date range on the specified field, grouped by column
- [ ] 1.3 Include summary statistics (total count, count by priority, count by column) in the response

## 2. Backend — Report API endpoint

- [ ] 2.1 Add `GET /kanban/report` endpoint in `apps/api/main.py` with query params: `start_date`, `end_date`, `date_field` (default `updatedAt`)
- [ ] 2.2 Validate that `start_date` <= `end_date` and `date_field` is one of the allowed values
- [ ] 2.3 Return `ReportResponse` with grouped items and summary

## 3. Frontend — API client for report

- [ ] 3.1 Add `fetchReport(startDate, endDate, dateField)` function to the frontend API client / fetch utility
- [ ] 3.2 Handle error states (invalid date range, network errors)

## 4. Frontend — Report Sheet UI

- [ ] 4.1 Create a `ReportSheet` component using Shadcn `Sheet` with date range inputs and date field selector dropdown
- [ ] 4.2 Add "Generate Report" button that calls the report API and displays results
- [ ] 4.3 Display results grouped by column with item count badges per group
- [ ] 4.4 Show summary section with total items, breakdown by priority, breakdown by column
- [ ] 4.5 Support locale-aware labels (English / 繁體中文) using the existing i18n system

## 5. Frontend — Export functionality

- [ ] 5.1 Implement CSV export: generate CSV blob from report data and trigger browser download
- [ ] 5.2 Implement "Copy as Markdown" button: format grouped results as markdown table and copy to clipboard
- [ ] 5.3 Add export buttons to the report sheet UI

## 6. Frontend — Toolbar integration

- [ ] 6.1 Add a "Report" button to the toolbar that opens the `ReportSheet`
- [ ] 6.2 Add i18n strings for all report-related UI labels (button, headers, field names, export labels)

## 7. Verification

- [ ] 7.1 Test report endpoint with various date ranges and date fields, verify correct filtering
- [ ] 7.2 Test report UI: select date range, generate report, verify grouped results display
- [ ] 7.3 Test CSV export downloads correctly formatted file
- [ ] 7.4 Test markdown copy produces valid markdown table
- [ ] 7.5 Test locale switching shows translated labels in report UI
