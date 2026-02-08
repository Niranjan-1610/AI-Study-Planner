"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";
import { useState } from "react";

const moduleSchema = z.object({
  name: z.string().describe("Module or topic name"),
  hours: z.number().describe("Estimated hours for the module"),
  priority: z.enum(["high", "medium", "low"]).describe("Priority level"),
  status: z
    .enum(["not-started", "in-progress", "done"])
    .optional()
    .describe("Current completion status"),
});

const milestoneSchema = z.object({
  label: z.string().describe("Milestone label"),
  date: z.string().describe("Target date for the milestone"),
  status: z
    .enum(["upcoming", "active", "complete"])
    .optional()
    .describe("Milestone status"),
});

export const studyPlanCardSchema = z.object({
  title: z.string().describe("Plan title"),
  goal: z.string().describe("Primary study goal"),
  targetDate: z.string().describe("Final target date"),
  dailyMinutes: z.number().describe("Daily study minutes"),
  totalWeeks: z.number().optional().describe("Total weeks in the plan"),
  modules: z.array(moduleSchema).describe("Modules included in the plan"),
  milestones: z.array(milestoneSchema).optional().describe("Key milestones"),
  className: z.string().optional().describe("Optional container className"),
});

export type StudyPlanCardProps = z.infer<typeof studyPlanCardSchema>;

const priorityBadge: Record<"high" | "medium" | "low", string> = {
  high: "bg-amber-100 text-amber-900 border-amber-200",
  medium: "bg-emerald-100 text-emerald-900 border-emerald-200",
  low: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusStyle: Record<string, string> = {
  "not-started": "bg-slate-100 text-slate-600 border-slate-200",
  "in-progress": "bg-sky-100 text-sky-900 border-sky-200",
  done: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

const statusProgress: Record<string, number> = {
  "not-started": 15,
  "in-progress": 60,
  done: 100,
};

export function StudyPlanCard({
  title,
  goal,
  targetDate,
  dailyMinutes,
  totalWeeks,
  modules,
  milestones = [],
  className,
}: StudyPlanCardProps) {
  const [notes, setNotes] = useState("");

  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)]",
        "p-6 md:p-8",
        className,
      )}
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Study Plan
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-display text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{goal}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Target
          </p>
          <p className="mt-1 font-medium">{targetDate}</p>
          <p className="mt-2 text-xs text-slate-500">
            {dailyMinutes} min per day
            {totalWeeks ? ` - ${totalWeeks} weeks` : ""}
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-3">
        {modules.map((module, index) => {
          const status = module.status ?? "not-started";
          const progress = statusProgress[status] ?? 15;
          return (
            <div
              key={`${module.name}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {module.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {module.hours} hours estimated
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-1",
                      priorityBadge[module.priority],
                    )}
                  >
                    {module.priority} priority
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-1 capitalize",
                      statusStyle[status],
                    )}
                  >
                    {status.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-900 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {milestones.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Milestones
          </h3>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {milestones.map((milestone, index) => (
              <div
                key={`${milestone.label}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <p className="text-xs text-slate-500">{milestone.date}</p>
                <p className="text-sm font-medium text-slate-900">
                  {milestone.label}
                </p>
                {milestone.status && (
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    {milestone.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-200/70">
        <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">
          Constraints & Notes
        </h3>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <div>
                <p className="font-semibold text-slate-900 mb-1">Time Constraints:</p>
                <p className="text-slate-600">
                  {dailyMinutes} minutes per day available for focused study sessions
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">Study Duration:</p>
                <p className="text-slate-600">
                  {totalWeeks ? `${totalWeeks} weeks` : "Custom timeline"} to completion by <span className="font-semibold text-slate-900">{targetDate}</span>
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">Key Notes:</p>
                <p className="text-slate-600 italic">
                  Add your personal notes, blockers, or special considerations for this study plan here...
                </p>
              </div>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your constraints, notes, and personal reminders..."
            className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 resize-none"
          />
        </div>
      </div>
    </section>
  );
}
