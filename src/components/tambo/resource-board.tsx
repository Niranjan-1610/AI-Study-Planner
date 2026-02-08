"use client";

import { cn } from "@/lib/utils";
import { z } from "zod";

const resourceSchema = z.object({
  type: z
    .enum(["video", "article", "practice", "notes"])
    .describe("Resource type"),
  name: z.string().describe("Resource name"),
  description: z.string().optional().describe("Short summary"),
  url: z.string().optional().describe("Optional link"),
  durationMinutes: z.number().optional().describe("Estimated time in minutes"),
  difficulty: z
    .enum(["intro", "core", "advanced"])
    .optional()
    .describe("Difficulty level"),
});

export const resourceBoardSchema = z.object({
  title: z.string().describe("Section title"),
  resources: z.array(resourceSchema).describe("Resources to display"),
  className: z.string().optional(),
});

export type ResourceBoardProps = z.infer<typeof resourceBoardSchema>;

const typeStyles: Record<string, string> = {
  video: "bg-rose-100 text-rose-900 border-rose-200",
  article: "bg-sky-100 text-sky-900 border-sky-200",
  practice: "bg-amber-100 text-amber-900 border-amber-200",
  notes: "bg-emerald-100 text-emerald-900 border-emerald-200",
};

const difficultyStyles: Record<string, string> = {
  intro: "bg-slate-100 text-slate-600 border-slate-200",
  core: "bg-indigo-100 text-indigo-900 border-indigo-200",
  advanced: "bg-violet-100 text-violet-900 border-violet-200",
};

export function ResourceBoard({
  title,
  resources,
  className,
}: ResourceBoardProps) {
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
            Curated Resources
          </p>
          <h3 className="mt-2 text-2xl font-display text-slate-900">{title}</h3>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {resources.map((resource, index) => (
          <article
            key={`${resource.name}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 uppercase tracking-[0.2em]",
                  typeStyles[resource.type],
                )}
              >
                {resource.type}
              </span>
              {resource.durationMinutes && (
                <span className="text-slate-500">
                  {resource.durationMinutes} min
                </span>
              )}
            </div>
            <h4 className="mt-3 text-base font-semibold text-slate-900">
              {resource.name}
            </h4>
            {resource.description && (
              <p className="mt-2 text-sm text-slate-600">
                {resource.description}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {resource.difficulty && (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.2em]",
                    difficultyStyles[resource.difficulty],
                  )}
                >
                  {resource.difficulty}
                </span>
              )}
              {resource.url && (
                <span className="text-xs text-slate-500 truncate">
                  {resource.url}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

