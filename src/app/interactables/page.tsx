"use client";

import dynamic from "next/dynamic";
import { components, tools } from "@/lib/tambo";
import { cn } from "@/lib/utils";
import { TamboProvider } from "@tambo-ai/react";
import { useState, useEffect } from "react";
import { SettingsPanel } from "./components/settings-panel";
import { StreamErrorBoundary } from "@/components/StreamErrorBoundary";

interface SavedPlanData {
  goal?: string;
  targetDate?: string;
  dailyMinutes?: number;
  focusStyle?: "pomodoro" | "deep" | "mixed";
  subjects?: Array<{ name: string; priority: string }>;
}

const ChatPanel = dynamic(() => import("./components/chat-panel"), {
  ssr: false,
  loading: () => (
    <div className="p-6 text-sm text-slate-500">Loading chat panel...</div>
  ),
});

const StudyPlanCard = dynamic(
  () =>
    import("@/components/tambo/study-plan-card").then(
      (mod) => mod.StudyPlanCard,
    ),
  {
    loading: () => (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
        Loading study plan...
      </div>
    ),
  },
);

const FocusSession = dynamic(
  () =>
    import("@/components/tambo/focus-session").then(
      (mod) => mod.FocusSession,
    ),
  {
    loading: () => (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
        Loading focus session...
      </div>
    ),
  },
);

const Graph = dynamic(
  () => import("@/components/tambo/graph").then((mod) => mod.Graph),
  {
    loading: () => (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
        Loading chart...
      </div>
    ),
  },
);

const WeekSchedule = dynamic(
  () =>
    import("@/components/tambo/week-schedule").then(
      (mod) => mod.WeekSchedule,
    ),
  {
    loading: () => (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
        Loading schedule...
      </div>
    ),
  },
);

const ResourceBoard = dynamic(
  () =>
    import("@/components/tambo/resource-board").then(
      (mod) => mod.ResourceBoard,
    ),
  {
    loading: () => (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
        Loading resources...
      </div>
    ),
  },
);

export default function InteractablesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [savedPlanData, setSavedPlanData] = useState<SavedPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data from localStorage and listen for changes
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const stored = localStorage.getItem("studyPlanData");
        if (stored) {
          const parsed: SavedPlanData = JSON.parse(stored);
          setSavedPlanData(parsed);
        }
      } catch (error) {
        console.error("Failed to load saved plan data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load on mount
    loadSavedData();

    // Listen for changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studyPlanData") {
        loadSavedData();
      }
    };

    // Also listen for custom storage events from the same window
    const handleCustomStorageEvent = () => {
      loadSavedData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("studyPlanUpdated", handleCustomStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("studyPlanUpdated", handleCustomStorageEvent);
    };
  }, []);

  // Build studyPlan from saved data or use defaults
  const studyPlan = {
    title: savedPlanData?.goal || "Algorithms Interview Sprint",
    goal: savedPlanData?.goal || "Build confidence across core data structures and timed drills.",
    targetDate: savedPlanData?.targetDate || "May 30",
    dailyMinutes: savedPlanData?.dailyMinutes || 90,
    totalWeeks: 6,
    modules: (savedPlanData?.subjects || [
      { name: "Arrays and Strings", priority: "high" },
      { name: "Trees and Graphs", priority: "high" },
      { name: "Dynamic Programming", priority: "medium" },
      { name: "System Design", priority: "low" },
    ]).map((subject: { name: string; priority: string }, index: number) => {
      const statuses = ["done", "in-progress", "not-started"] as const;
      // Use deterministic calculation based on index instead of Math.random()
      // to avoid hydration mismatch errors
      const baseHours = [18, 20, 16, 14];
      return {
        name: subject.name || `Module ${index + 1}`,
        hours: baseHours[index % baseHours.length],
        priority: (subject.priority || "medium") as "high" | "medium" | "low",
        status: statuses[index % 3],
      };
    }),
    milestones: [
      { label: "Mock interview #1", date: "Apr 20", status: "active" as const },
      { label: "Timed drills week", date: savedPlanData?.targetDate || "May 10", status: "upcoming" as const },
      { label: "Final review", date: savedPlanData?.targetDate || "May 28", status: "upcoming" as const },
    ],
  };

  const weekSchedule = {
    weekLabel: "Week 2: Deep focus cadence",
    timezone: "Local time",
    days: [
      {
        day: "Monday",
        focusBlocks: [
          {
            time: "7:30 PM",
            task: "Trees deep focus",
            durationMinutes: 55,
            mode: "deep" as const,
          },
          {
            time: "9:00 PM",
            task: "Graphs review",
            durationMinutes: 35,
            mode: "review" as const,
          },
        ],
      },
      {
        day: "Tuesday",
        focusBlocks: [
          {
            time: "7:30 PM",
            task: "DP pattern drills",
            durationMinutes: 50,
            mode: "practice" as const,
          },
          {
            time: "9:00 PM",
            task: "LeetCode recap",
            durationMinutes: 40,
            mode: "review" as const,
          },
        ],
      },
      {
        day: "Wednesday",
        focusBlocks: [
          {
            time: "7:30 PM",
            task: "Graph BFS/DFS",
            durationMinutes: 60,
            mode: "deep" as const,
          },
          {
            time: "9:00 PM",
            task: "Flashcard review",
            durationMinutes: 30,
            mode: "light" as const,
          },
        ],
      },
      {
        day: "Thursday",
        focusBlocks: [
          {
            time: "7:30 PM",
            task: "DP sequences",
            durationMinutes: 55,
            mode: "deep" as const,
          },
          {
            time: "9:00 PM",
            task: "Whiteboard walkthrough",
            durationMinutes: 35,
            mode: "practice" as const,
          },
        ],
      },
      {
        day: "Friday",
        focusBlocks: [
          {
            time: "7:00 PM",
            task: "Mock interview",
            durationMinutes: 75,
            mode: "practice" as const,
          },
          {
            time: "8:45 PM",
            task: "Post-mock review",
            durationMinutes: 25,
            mode: "review" as const,
          },
        ],
      },
      {
        day: "Saturday",
        focusBlocks: [
          {
            time: "10:00 AM",
            task: "System design basics",
            durationMinutes: 60,
            mode: "deep" as const,
          },
          {
            time: "11:30 AM",
            task: "Case study notes",
            durationMinutes: 30,
            mode: "review" as const,
          },
        ],
      },
    ],
  };

  const focusSession = {
    title: savedPlanData?.goal ? `${savedPlanData.goal} Deep focus` : "Trees deep focus",
    objective: `Complete pattern drills for ${(savedPlanData?.subjects?.[0]?.name || "current topic")} and log mistakes.`,
    durationMinutes: savedPlanData?.dailyMinutes || 55,
    breakMinutes: 10,
    status: "active" as const,
    checklist: [
      `Warm up with 1 easy ${(savedPlanData?.focusStyle || "mixed")} session`,
      "Solve 2 mediums without hints",
      "Note 2 mistakes + fix pattern",
      "Queue 1 follow-up problem",
    ],
  };

  const weeklyFocusLabels = weekSchedule.days.map((day) => day.day.slice(0, 3));
  const weeklyFocusMinutes = weekSchedule.days.map((day) =>
    day.focusBlocks.reduce((total, block) => total + block.durationMinutes, 0),
  );

  const resources = {
    title: savedPlanData?.subjects?.[0]?.name || "Trees and Graphs",
    resources: [
      {
        type: "video" as const,
        name: `${(savedPlanData?.subjects?.[0]?.name || "Topic")} overview`,
        description: "Quick refresher and fundamentals review.",
        durationMinutes: 16,
        difficulty: "core" as const,
      },
      {
        type: "practice" as const,
        name: "Targeted drill set",
        description: "Practice problems for your focus area.",
        durationMinutes: 28,
        difficulty: "advanced" as const,
      },
      {
        type: "article" as const,
        name: "Common mistakes",
        description: "Checklist for edge cases and complexity traps.",
        durationMinutes: 12,
        difficulty: "core" as const,
      },
      {
        type: "notes" as const,
        name: "Spaced repetition",
        description: "Flashcard queue for key concepts.",
        durationMinutes: 10,
        difficulty: "intro" as const,
      },
    ],
  };

  return (
    <StreamErrorBoundary>
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        streaming={true}
        autoGenerateThreadName={false}
      >
        <div className="min-h-screen bg-[#f8f5ef] text-slate-900 flex flex-col">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-amber-200/40 blur-[120px]" />
              <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-[140px]" />
            </div>

            <header className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between px-6 py-8">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Tambo Study Planner
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <h1 className="text-3xl font-display font-bold text-slate-900">
                    Plan room
                  </h1>
                  {!isLoading && savedPlanData && (
                    <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                      ✓ Updated
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setIsChatOpen((open) => !open)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isChatOpen
                      ? "border border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                      : "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  )}
                >
                  {isChatOpen ? "Hide copilot" : "Show copilot"}
                </button>
                <a
                  href="/chat"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Full chat
                </a>
              </div>
            </header>
          </div>

          <main className="flex-1 mx-auto w-full max-w-7xl px-6 pb-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
              <section className="space-y-8">
                <SettingsPanel />
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                  <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Adaptive planning
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 flex-1">
                      Tambo adjusts your plan based on time and priority, so you
                      never guess what to study next.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Visual schedules
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 flex-1">
                      Weekly maps and focus cards make your plan tangible and easy
                      to execute.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                    <h3 className="text-lg font-semibold text-slate-900">
                      AI plus UI together
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 flex-1">
                      Ask the assistant to create components directly inside your
                      planner workspace.
                    </p>
                  </div>
                </section>
                <StudyPlanCard {...studyPlan} />
                <div className="grid gap-6 sm:grid-cols-2 auto-rows-fr">
                  <FocusSession {...focusSession} className="h-full" />
                  <Graph
                    title="Weekly focus minutes"
                    data={{
                      type: "line",
                      labels: weeklyFocusLabels,
                      datasets: [
                        {
                          label: "Minutes",
                          data: weeklyFocusMinutes,
                          color: "hsl(223, 64%, 50%)",
                        },
                      ],
                    }}
                    variant="solid"
                    size="default"
                    className="h-full"
                  />
                </div>
                <WeekSchedule {...weekSchedule} />
                <ResourceBoard {...resources} />
              </section>

              <aside className={cn(
                "fixed inset-y-0 right-0 z-40 w-full sm:w-[420px] lg:relative lg:inset-auto lg:z-auto lg:w-auto",
                "bg-white/90 backdrop-blur-xl lg:backdrop-blur-none",
                "transform transition-transform duration-300 ease-in-out",
                "lg:translate-x-0 lg:transform-none",
                isChatOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
              )}>
                <div className="h-full flex flex-col rounded-none lg:rounded-3xl border-0 lg:border border-slate-200/70 shadow-xl lg:shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)]">
                  {/* Mobile header */}
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 lg:hidden">
                    <h2 className="text-base font-semibold text-slate-900">Planner Copilot</h2>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="rounded p-1 hover:bg-slate-100"
                      aria-label="Close copilot"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <ChatPanel />
                </div>
              </aside>
              
              {/* Mobile overlay */}
              {isChatOpen && (
                <div
                  className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                  onClick={() => setIsChatOpen(false)}
                  aria-hidden="true"
                />
              )}
            </div>          </main>
        </div>
      </TamboProvider>
    </StreamErrorBoundary>
  );
}