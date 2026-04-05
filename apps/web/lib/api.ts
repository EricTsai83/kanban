export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${path}`;
}

export type DateField = "createdAt" | "updatedAt" | "dueDate" | "startDate";
export type GroupBy = "column" | "assignee";

export interface ReportWorkItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  labels: string[];
  estimate: number | null;
  startDate: string | null;
  dueDate: string | null;
  isBlocked: boolean;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportGroup {
  column: string;
  items: ReportWorkItem[];
}

export interface ReportSummary {
  total: number;
  byPriority: Record<string, number>;
  byColumn: Record<string, number>;
  byAssignee: Record<string, number>;
}

export interface ReportResponse {
  items: ReportGroup[];
  summary: ReportSummary;
}

export async function fetchReport(
  startDate: string,
  endDate: string,
  dateField: DateField = "updatedAt",
  groupBy: GroupBy = "column",
): Promise<ReportResponse> {
  const params = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    date_field: dateField,
    group_by: groupBy,
  });
  const url = apiUrl(`/kanban/report?${params}`);
  const r = await fetch(url, {
    headers: {
      ...(process.env.NEXT_PUBLIC_API_KEY
        ? { "X-API-Key": process.env.NEXT_PUBLIC_API_KEY }
        : {}),
    },
  });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.detail ?? body.error ?? "Failed to fetch report.");
  }
  return r.json();
}
