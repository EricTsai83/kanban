"use client";

import { useMemo } from "react";
import type { KanbanWorkItem, KanbanColumn } from "@/lib/kanban/types";
import type { AppDictionary } from "@/lib/i18n";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ── constants ─────────────────────────────────────────────────────────────────

const DAY_WIDTH = 40; // px per day column
const ROW_HEIGHT = 40; // px per item row
const LABEL_WIDTH = 256; // px for the left label panel
const PADDING_DAYS = 2; // days of padding on each side

// ── helpers ───────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "var(--priority-urgent)",
  high: "var(--priority-high)",
  medium: "var(--priority-medium)",
  low: "var(--priority-low)",
};

function effectiveStart(item: KanbanWorkItem): string {
  return item.startDate ?? item.createdAt.slice(0, 10);
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

// ── types ─────────────────────────────────────────────────────────────────────

type Props = {
  items: KanbanWorkItem[];
  columns: KanbanColumn[];
  onItemClick: (item: KanbanWorkItem) => void;
  copy: AppDictionary;
};

// ── component ─────────────────────────────────────────────────────────────────

export function GanttChart({ items, onItemClick, copy }: Props) {
  // Only items that have an effective start (always true via createdAt fallback).
  // Items are shown: bar if dueDate exists, milestone if not.
  const dated = useMemo(() => {
    return items.map((item) => ({
      item,
      start: parseDate(effectiveStart(item)),
      end: item.dueDate ? parseDate(item.dueDate) : null,
    }));
  }, [items]);

  const range = useMemo(() => {
    const allDates: Date[] = dated.flatMap(({ start, end }) =>
      end ? [start, end] : [start],
    );

    if (allDates.length === 0) return null;

    const earliest = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...allDates.map((d) => d.getTime())));

    return {
      start: addDays(earliest, -PADDING_DAYS),
      end: addDays(latest, PADDING_DAYS),
    };
  }, [dated]);

  if (!range || dated.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          {copy.views.ganttEmpty}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {copy.views.ganttEmptyHint}
        </p>
      </div>
    );
  }

  const totalDays = daysBetween(range.start, range.end) + 1;
  const timelineWidth = totalDays * DAY_WIDTH;

  // Generate day ticks for the header
  const ticks: Array<{ date: Date; label: string; offset: number }> = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(range.start, i);
    const showLabel = i === 0 || d.getDate() === 1 || i % 7 === 0;
    if (showLabel) {
      ticks.push({ date: d, label: formatLabel(d), offset: i * DAY_WIDTH });
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* ── scroll container ── */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 flex bg-background" style={{ minWidth: LABEL_WIDTH + timelineWidth }}>
          {/* ── header row ── */}
          <div
            className="sticky left-0 z-20 shrink-0 border-b border-r border-border bg-background"
            style={{ width: LABEL_WIDTH, height: ROW_HEIGHT }}
          />
          <div
            className="relative shrink-0 border-b border-border bg-background"
            style={{ width: timelineWidth, height: ROW_HEIGHT }}
          >
            {/* day grid lines */}
            {Array.from({ length: totalDays }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-y-0 border-r border-border/30"
                style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
              />
            ))}
            {/* date tick labels */}
            {ticks.map(({ date, label, offset }) => (
              <span
                key={formatDate(date)}
                className="absolute bottom-1 whitespace-nowrap text-[10px] text-muted-foreground"
                style={{ left: offset + 4 }}
              >
                {label}
              </span>
            ))}
            {/* today marker */}
            <TodayMarker rangeStart={range.start} totalDays={totalDays} height={ROW_HEIGHT} headerOnly />
          </div>
        </div>

        {/* ── item rows ── */}
        {dated.map(({ item, start, end }) => {
          const color = PRIORITY_COLORS[item.priority] ?? PRIORITY_COLORS.medium;
          const startOffset = Math.max(0, daysBetween(range.start, start));
          const endOffset = end
            ? Math.min(totalDays - 1, daysBetween(range.start, end))
            : startOffset;
          const barLeft = startOffset * DAY_WIDTH;
          const barWidth = Math.max(DAY_WIDTH, (endOffset - startOffset) * DAY_WIDTH);
          const isMilestone = !end;

          return (
            <div
              key={item.id}
              className="group flex hover:bg-accent/20"
              style={{ height: ROW_HEIGHT }}
            >
              {/* label panel */}
              <div
                className="sticky left-0 z-10 flex shrink-0 items-center gap-2 border-b border-r border-border bg-background px-3 group-hover:bg-accent/20"
                style={{ width: LABEL_WIDTH }}
              >
                {/* priority accent */}
                <div
                  className="h-5 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {/* assignee avatar */}
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                  style={{ backgroundColor: color }}
                >
                  {initials(item.assignee || "?")}
                </div>
                {/* title */}
                <span className="truncate text-xs text-foreground">
                  {item.title}
                </span>
              </div>

              {/* timeline lane */}
              <div
                className="relative shrink-0 border-b border-border"
                style={{ width: timelineWidth }}
              >
                {/* day grid lines */}
                {Array.from({ length: totalDays }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-y-0 border-r border-border/20"
                    style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                  />
                ))}

                <TodayMarker rangeStart={range.start} totalDays={totalDays} height={ROW_HEIGHT} />

                {isMilestone ? (
                  // ── milestone diamond ──
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          onClick={() => onItemClick(item)}
                          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ left: barLeft + DAY_WIDTH / 2 }}
                        />
                      }
                    >
                      <div
                        className={cn(
                          "h-3.5 w-3.5 rotate-45 rounded-sm border-2 border-white shadow-sm transition-opacity hover:opacity-80",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <ItemTooltip item={item} copy={copy} />
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // ── gantt bar ──
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type="button"
                          onClick={() => onItemClick(item)}
                          className="absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-md shadow-sm transition-opacity hover:opacity-80"
                          style={{
                            left: barLeft,
                            width: barWidth,
                            height: 20,
                            backgroundColor: color,
                            minWidth: DAY_WIDTH,
                          }}
                        />
                      }
                    >
                      <span className="sr-only">{item.title}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <ItemTooltip item={item} copy={copy} />
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function TodayMarker({
  rangeStart,
  totalDays,
  height,
  headerOnly = false,
}: {
  rangeStart: Date;
  totalDays: number;
  height: number;
  headerOnly?: boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const offset = daysBetween(rangeStart, today);

  if (offset < 0 || offset >= totalDays) return null;

  return (
    <div
      className="pointer-events-none absolute inset-y-0 w-px bg-primary/50"
      style={{ left: offset * DAY_WIDTH + DAY_WIDTH / 2 }}
    >
      {headerOnly && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 rounded-full bg-primary px-1 py-0.5 text-[9px] font-semibold text-primary-foreground">
          today
        </div>
      )}
    </div>
  );
}

function ItemTooltip({
  item,
  copy,
}: {
  item: KanbanWorkItem;
  copy: AppDictionary;
}) {
  return (
    <div className="flex flex-col gap-0.5 text-xs">
      <span className="font-medium">{item.title}</span>
      {item.assignee && (
        <span className="text-muted-foreground">
          {copy.itemEditor.assignee}: {item.assignee}
        </span>
      )}
      <span className="text-muted-foreground capitalize">
        {copy.itemEditor.priority}: {item.priority}
      </span>
      <span className="text-muted-foreground">
        {copy.itemEditor.startDate}: {item.startDate ?? item.createdAt.slice(0, 10)}
      </span>
      {item.dueDate && (
        <span className="text-muted-foreground">
          {copy.itemEditor.dueDate}: {item.dueDate}
        </span>
      )}
    </div>
  );
}
