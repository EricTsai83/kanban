"use client";

import { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";
import type { AppDictionary } from "@/lib/i18n";
import {
  fetchReport,
  type DateField,
  type GroupBy,
  type ReportResponse,
} from "@/lib/api";

interface ReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: AppDictionary;
}

const DATE_FIELDS: DateField[] = [
  "updatedAt",
  "createdAt",
  "dueDate",
  "startDate",
];

function dateFieldLabel(field: DateField, copy: AppDictionary): string {
  const map: Record<DateField, string> = {
    createdAt: copy.report.fieldCreatedAt,
    updatedAt: copy.report.fieldUpdatedAt,
    dueDate: copy.report.fieldDueDate,
    startDate: copy.report.fieldStartDate,
  };
  return map[field];
}

function toCSV(report: ReportResponse, groupBy: GroupBy): string {
  if (groupBy === "assignee") {
    const header = "Assignee,ID,Title,Priority,Column,Due Date,Estimate";
    const rows = report.items.flatMap((g) =>
      g.items.map(
        (item) =>
          [
            `"${g.column}"`,
            `"${item.id}"`,
            `"${item.title.replace(/"/g, '""')}"`,
            item.priority,
            `"${item.columnId}"`,
            item.dueDate ?? "",
            item.estimate ?? "",
          ].join(","),
      ),
    );
    return [header, ...rows].join("\n");
  }
  const header = "Column,ID,Title,Priority,Assignee,Due Date,Estimate";
  const rows = report.items.flatMap((g) =>
    g.items.map(
      (item) =>
        [
          `"${g.column}"`,
          `"${item.id}"`,
          `"${item.title.replace(/"/g, '""')}"`,
          item.priority,
          `"${item.assignee}"`,
          item.dueDate ?? "",
          item.estimate ?? "",
        ].join(","),
    ),
  );
  return [header, ...rows].join("\n");
}

export function ReportSheet({ open, onOpenChange, copy }: ReportSheetProps) {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [dateField, setDateField] = useState<DateField>("updatedAt");
  const [groupBy, setGroupBy] = useState<GroupBy>("column");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await fetchReport(startDate, endDate, dateField, groupBy);
      const blob = new Blob([toCSV(report, groupBy)], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${startDate}-${endDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.errors.generic);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, dateField, groupBy, copy]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>{copy.report.title}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 text-xs">{copy.report.startDate}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1 text-xs">{copy.report.endDate}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-1 text-xs">{copy.report.dateField}</Label>
            <Select
              value={dateField}
              onValueChange={(v) => setDateField(v as DateField)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_FIELDS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {dateFieldLabel(f, copy)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1 text-xs">{copy.report.groupBy}</Label>
            <Select
              value={groupBy}
              onValueChange={(v) => setGroupBy(v as GroupBy)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="column">
                  {copy.report.groupByColumn}
                </SelectItem>
                <SelectItem value="assignee">
                  {copy.report.groupByAssignee}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleDownload} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {loading ? copy.report.generating : copy.report.exportCsv}
          </Button>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
