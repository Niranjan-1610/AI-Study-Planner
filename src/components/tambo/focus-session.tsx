"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";

export const focusSessionSchema = z.object({
  title: z.string().describe("Session title"),
  objective: z.string().describe("Main objective for the focus session"),
  durationMinutes: z.number().describe("Focus duration in minutes"),
  breakMinutes: z.number().describe("Break duration in minutes"),
  status: z
    .enum(["ready", "active", "complete"])
    .optional()
    .describe("Current session status"),
  checklist: z.array(z.string()).optional().describe("Checklist items"),
  className: z.string().optional(),
});

export type FocusSessionProps = z.infer<typeof focusSessionSchema>;

const statusLabels: Record<string, string> = {
  ready: "Ready",
  active: "In Session",
  complete: "Complete",
};

const statusProgress: Record<string, number> = {
  ready: 20,
  active: 70,
  complete: 100,
};

export function FocusSession({
  title,
  objective,
  durationMinutes,
  breakMinutes,
  status = "ready",
  checklist = [],
  className,
}: FocusSessionProps) {
  const progress = statusProgress[status] ?? 20;

  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 md:p-8",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Session
          </p>
          <h3 className="mt-2 text-2xl font-display text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{objective}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600">
          {statusLabels[status]}
        </span>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl font-semibold text-slate-900">
              {durationMinutes}
            </p>
            <p className="text-sm text-slate-500">min focus</p>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Break: {breakMinutes} min
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Checklist
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {checklist.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

