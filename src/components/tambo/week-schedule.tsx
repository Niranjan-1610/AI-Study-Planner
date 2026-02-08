"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";

const focusBlockSchema = z.object({
  time: z.string().describe("Start time for the block"),
  task: z.string().describe("Primary task"),
  durationMinutes: z.number().describe("Duration in minutes"),
  mode: z
    .enum(["deep", "review", "practice", "light"])
    .describe("Focus mode"),
});

const daySchema = z.object({
  day: z.string().describe("Day label"),
  focusBlocks: z.array(focusBlockSchema).describe("Blocks for the day"),
});

export const weekScheduleSchema = z.object({
  weekLabel: z.string().describe("Label for this week"),
  timezone: z.string().optional().describe("Optional timezone"),
  days: z.array(daySchema).describe("Schedule for the week"),
  className: z.string().optional(),
});

export type WeekScheduleProps = z.infer<typeof weekScheduleSchema>;

const modeStyles: Record<string, string> = {
  deep: "bg-indigo-100 text-indigo-900 border-indigo-200",
  review: "bg-emerald-100 text-emerald-900 border-emerald-200",
  practice: "bg-amber-100 text-amber-900 border-amber-200",
  light: "bg-slate-100 text-slate-700 border-slate-200",
};

export function WeekSchedule({
  weekLabel,
  timezone,
  days,
  className,
}: WeekScheduleProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 md:p-8",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Weekly Map
          </p>
          <h3 className="mt-2 text-2xl font-display text-slate-900">
            {weekLabel}
          </h3>
        </div>
        {timezone && (
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {timezone}
          </span>
        )}
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day, index) => (
          <article
            key={`${day.day}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h4 className="text-sm font-semibold text-slate-900">{day.day}</h4>
            <div className="mt-3 space-y-2">
              {day.focusBlocks.map((block, blockIndex) => (
                <div
                  key={`${block.task}-${blockIndex}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{block.time}</span>
                    <span>{block.durationMinutes} min</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {block.task}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.2em]",
                      modeStyles[block.mode],
                    )}
                  >
                    {block.mode}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

