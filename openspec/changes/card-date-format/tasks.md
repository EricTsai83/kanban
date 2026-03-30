## 1. i18n — Add locale strings for relative date labels

- [x] 1.1 Add `today`, `tomorrow`, `yesterday` keys to the English locale dictionary in `lib/i18n.ts`
- [x] 1.2 Add `today` (今天), `tomorrow` (明天), `yesterday` (昨天) keys to the Traditional Chinese locale dictionary in `lib/i18n.ts`

## 2. Utility — Implement `formatDueDate` helper

- [x] 2.1 Write `formatDueDate(dateStr: string, locale: string, relativeLabels: { today: string; tomorrow: string; yesterday: string }): string` at the top of `components/kanban-app.tsx`
- [x] 2.2 Implement local-time date parsing (`new Date(y, m-1, d)`) to avoid UTC offset issues
- [x] 2.3 Return relative label if date is today, tomorrow, or yesterday
- [x] 2.4 Return `Intl.DateTimeFormat` short month+day for current year, and include year for past/future years

## 3. Utility — Implement `getDueDateUrgency` helper

- [x] 3.1 Write `getDueDateUrgency(dateStr: string): 'overdue' | 'today' | 'soon' | 'normal'` helper in `components/kanban-app.tsx`
- [x] 3.2 Map urgency to Tailwind className strings for badge and text variants

## 4. Kanban Card — Apply formatted date and urgency styling

- [x] 4.1 Replace the raw `{item.dueDate}` in the kanban card badge with `{formatDueDate(item.dueDate, locale, copy.shared)}`
- [x] 4.2 Apply urgency className to the card's due date `<Badge>` component

## 5. List View — Apply formatted date and urgency styling

- [x] 5.1 Replace the raw `{item.dueDate ?? ""}` in the list view row with the formatted label
- [x] 5.2 Apply urgency color class to the list row due date `<span>`

## 6. Verification

- [x] 6.1 Manually verify kanban card renders "Today" / "今天" when due date equals current date
- [x] 6.2 Manually verify overdue card badge appears in red, today in amber, soon in yellow
- [x] 6.3 Manually verify list view due date column shows formatted labels with correct urgency colors
- [x] 6.4 Switch locale to Traditional Chinese and confirm relative/formatted labels update correctly
