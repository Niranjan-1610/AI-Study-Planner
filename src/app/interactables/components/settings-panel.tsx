"use client";

import { cn } from "@/lib/utils";
import { withInteractable } from "@tambo-ai/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

const studyBriefSchema = z.object({
  studentName: z.string(),
  goal: z.string(),
  targetDate: z.string(),
  dailyMinutes: z.number(),
  focusStyle: z.enum(["pomodoro", "deep", "mixed"]),
  subjects: z.array(
    z.object({
      name: z.string(),
      priority: z.enum(["high", "medium", "low"]),
    }),
  ),
  constraints: z.array(z.string()).optional(),
});

type StudyBriefProps = z.infer<typeof studyBriefSchema>;

const SubjectRow = ({
  name,
  priority,
  onChange,
}: {
  name: string;
  priority: "high" | "medium" | "low";
  onChange: (next: { name?: string; priority?: "high" | "medium" | "low" }) => void;
}) => (
  <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 md:grid-cols-[1.5fr_1fr]">
    <input
      value={name}
      onChange={(event) => onChange({ name: event.target.value })}
      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      placeholder="Subject name"
    />
    <select
      value={priority}
      onChange={(event) =>
        onChange({
          priority: event.target.value as "high" | "medium" | "low",
        })
      }
      aria-label="Subject priority"
      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
    >
      <option value="high">High priority</option>
      <option value="medium">Medium priority</option>
      <option value="low">Low priority</option>
    </select>
  </div>
);

function StudyBriefPanelBase(props: StudyBriefProps) {
  const [brief, setBrief] = useState<StudyBriefProps>(props);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const prevPropsRef = useRef<StudyBriefProps>(props);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const prev = prevPropsRef.current;
    const changed = new Set<string>();

    if (prev.goal !== props.goal) changed.add("goal");
    if (prev.targetDate !== props.targetDate) changed.add("targetDate");
    if (prev.dailyMinutes !== props.dailyMinutes) changed.add("dailyMinutes");
    if (prev.focusStyle !== props.focusStyle) changed.add("focusStyle");
    if (prev.studentName !== props.studentName) changed.add("studentName");

    setBrief(props);
    prevPropsRef.current = props;

    if (changed.size > 0) {
      setUpdatedFields(changed);
      const timer = setTimeout(() => setUpdatedFields(new Set()), 1000);
      return () => clearTimeout(timer);
    }
  }, [props]);

  const constraintsText = useMemo(
    () => (brief.constraints ?? []).join("\n"),
    [brief.constraints],
  );

  const handleSubjectChange = (
    index: number,
    next: { name?: string; priority?: "high" | "medium" | "low" },
  ) => {
    setBrief((prev) => {
      const updated = [...prev.subjects];
      updated[index] = { ...updated[index], ...next };
      return { ...prev, subjects: updated };
    });
    setHasUnsavedChanges(true);
  };

  const handleFieldChange = (updates: Partial<StudyBriefProps>) => {
    setBrief((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      const planData = {
        ...brief,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("studyPlanData", JSON.stringify(planData));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("studyPlanUpdated"));
      
      // Show success message
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      
      // Clear success message after 3 seconds
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save plan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Study Brief
          </p>
          <h2 className="mt-2 text-2xl font-display text-slate-900">
            Personalize the plan
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          {saveSuccess && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full animate-in fade-in duration-200">
              ✓ Saved
            </span>
          )}
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Editable
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-600">
            Student name
            <input
              value={brief.studentName}
              onChange={(event) =>
                handleFieldChange({ studentName: event.target.value })
              }
              className={cn(
                "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                updatedFields.has("studentName") ? "animate-flash" : "",
              )}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Goal
            <input
              value={brief.goal}
              onChange={(event) =>
                handleFieldChange({ goal: event.target.value })
              }
              className={cn(
                "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                updatedFields.has("goal") ? "animate-flash" : "",
              )}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Target date
            <input
              value={brief.targetDate}
              onChange={(event) =>
                handleFieldChange({ targetDate: event.target.value })
              }
              className={cn(
                "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                updatedFields.has("targetDate") ? "animate-flash" : "",
              )}
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-600">
            Daily minutes
            <input
              type="number"
              value={brief.dailyMinutes}
              onChange={(event) =>
                handleFieldChange({
                  dailyMinutes: Number(event.target.value),
                })
              }
              className={cn(
                "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                updatedFields.has("dailyMinutes") ? "animate-flash" : "",
              )}
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-slate-600">
          Focus style
          <select
            value={brief.focusStyle}
            onChange={(event) =>
              handleFieldChange({
                focusStyle: event.target.value as "pomodoro" | "deep" | "mixed",
              })
            }
            className={cn(
              "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20",
              updatedFields.has("focusStyle") ? "animate-flash" : "",
            )}
          >
            <option value="pomodoro">Pomodoro sprints</option>
            <option value="deep">Deep focus blocks</option>
            <option value="mixed">Mixed cadence</option>
          </select>
        </label>

        <div className="grid gap-3">
          <p className="text-sm font-medium text-slate-700">Subjects</p>
          {brief.subjects.map((subject, index) => (
            <SubjectRow
              key={`${subject.name}-${index}`}
              name={subject.name}
              priority={subject.priority}
              onChange={(next) => handleSubjectChange(index, next)}
            />
          ))}
        </div>

        <label className="grid gap-2 text-sm text-slate-600">
          Constraints and notes
          <textarea
            value={constraintsText}
            onChange={(event) =>
              handleFieldChange({
                constraints: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            rows={3}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            placeholder="Evenings only, exam includes essays, needs weekly mock tests"
          />
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-sm transition duration-200",
              hasUnsavedChanges && !isSaving
                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-95"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            )}
          >
            {isSaving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const InteractableStudyBrief = withInteractable(StudyBriefPanelBase, {
  componentName: "StudyBriefForm",
  description:
    "Editable study brief for goals, time budget, and subject priorities",
  propsSchema: studyBriefSchema,
});

export function SettingsPanel() {
  const [savedData, setSavedData] = useState<StudyBriefProps | null>(null);

  useEffect(() => {
    // Load saved data from localStorage on mount
    try {
      const stored = localStorage.getItem("studyPlanData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedData(parsed);
      }
    } catch (error) {
      console.error("Failed to load saved plan:", error);
    }
  }, []);

  return (
    <InteractableStudyBrief
      studentName={savedData?.studentName ?? "Nina Patel"}
      goal={savedData?.goal ?? "Data Structures prep"}
      targetDate={savedData?.targetDate ?? "May 20"}
      dailyMinutes={savedData?.dailyMinutes ?? 90}
      focusStyle={savedData?.focusStyle ?? "mixed"}
      subjects={savedData?.subjects ?? [
        { name: "Arrays and Strings", priority: "high" },
        { name: "Trees and Graphs", priority: "high" },
        { name: "Dynamic Programming", priority: "medium" },
        { name: "System Design", priority: "low" },
      ]}
      constraints={savedData?.constraints ?? ["Weekdays after 7 PM", "Two mock interviews per week"]}
      onPropsUpdate={(next) => {
        console.log("Study brief updated from Tambo:", next);
      }}
    />
  );
}
