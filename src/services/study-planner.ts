export type StudySubject = {
  name: string;
  priority: "high" | "medium" | "low";
};

export type StudyPlanRequest = {
  goal: string;
  targetDate: string;
  dailyMinutes?: number;
  daysPerWeek?: number;
  subjects: StudySubject[];
};

export type StudyPlanModule = {
  name: string;
  hours: number;
  priority: "high" | "medium" | "low";
  status: "not-started" | "in-progress" | "done";
};

export type StudyPlanResponse = {
  title: string;
  goal: string;
  targetDate: string;
  dailyMinutes: number;
  totalWeeks: number;
  modules: StudyPlanModule[];
  milestones: {
    label: string;
    date: string;
    status: "upcoming" | "active" | "complete";
  }[];
};

const priorityWeights: Record<StudySubject["priority"], number> = {
  high: 1.4,
  medium: 1,
  low: 0.7,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const buildStudyPlan = async (
  request: StudyPlanRequest,
): Promise<StudyPlanResponse> => {
  const dailyMinutes = request.dailyMinutes ?? 90;
  const daysPerWeek = clamp(request.daysPerWeek ?? 5, 3, 7);
  const now = new Date();
  const target = new Date(request.targetDate);
  const daysUntilTarget = Math.max(
    7,
    Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const totalWeeks = Math.max(2, Math.ceil(daysUntilTarget / 7));
  const totalStudyDays = totalWeeks * daysPerWeek;
  const totalHours = (totalStudyDays * dailyMinutes) / 60;

  const weightTotal = request.subjects.reduce(
    (sum, subject) => sum + priorityWeights[subject.priority],
    0,
  );

  const modules: StudyPlanModule[] = request.subjects.map((subject) => {
    const hours = Math.max(
      2,
      Math.round((totalHours * priorityWeights[subject.priority]) / weightTotal),
    );
    return {
      name: `${subject.name} Core`,
      hours,
      priority: subject.priority,
      status: "not-started",
    };
  });

  const midPoint = new Date(now.getTime());
  midPoint.setDate(now.getDate() + Math.floor(daysUntilTarget * 0.5));

  return {
    title: `${request.goal} Master Plan`,
    goal: request.goal,
    targetDate: formatDate(target),
    dailyMinutes,
    totalWeeks,
    modules,
    milestones: [
      {
        label: "Foundation check-in",
        date: formatDate(midPoint),
        status: "upcoming",
      },
      {
        label: "Final review sprint",
        date: formatDate(target),
        status: "upcoming",
      },
    ],
  };
};

export type WeeklyScheduleRequest = {
  weekLabel: string;
  dailyMinutes: number;
  subjects: string[];
  days: string[];
};

export type WeeklyScheduleResponse = {
  weekLabel: string;
  timezone: string;
  days: {
    day: string;
    focusBlocks: {
      time: string;
      task: string;
      durationMinutes: number;
      mode: "deep" | "review" | "practice" | "light";
    }[];
  }[];
};

export const buildWeeklySchedule = async (
  request: WeeklyScheduleRequest,
): Promise<WeeklyScheduleResponse> => {
  const baseMinutes = Math.max(45, request.dailyMinutes);
  const deepMinutes = Math.round(baseMinutes * 0.6);
  const reviewMinutes = baseMinutes - deepMinutes;
  const subjects = request.subjects.length
    ? request.subjects
    : ["Core Concepts", "Practice Sets", "Review"];

  const days: Array<{
    day: string;
    focusBlocks: Array<{
      time: string;
      task: string;
      durationMinutes: number;
      mode: "practice" | "deep" | "review" | "light";
    }>;
  }> = request.days.map((day, index) => {
    const primary = subjects[index % subjects.length];
    const secondary = subjects[(index + 1) % subjects.length];
    return {
      day,
      focusBlocks: [
        {
          time: "7:30 PM",
          task: `${primary} deep focus`,
          durationMinutes: deepMinutes,
          mode: "deep",
        },
        {
          time: "9:00 PM",
          task: `${secondary} review`,
          durationMinutes: reviewMinutes,
          mode: "review",
        },
      ],
    };
  });

  return {
    weekLabel: request.weekLabel,
    timezone: "Local time",
    days,
  };
};

export type FocusSessionRequest = {
  title: string;
  objective: string;
  availableMinutes: number;
  focusStyle: "pomodoro" | "deep" | "mixed";
};

export type FocusSessionResponse = {
  title: string;
  objective: string;
  durationMinutes: number;
  breakMinutes: number;
  status: "ready";
  checklist: string[];
};

export const buildFocusSession = async (
  request: FocusSessionRequest,
): Promise<FocusSessionResponse> => {
  const durationMinutes =
    request.focusStyle === "deep"
      ? Math.min(90, request.availableMinutes)
      : Math.min(50, request.availableMinutes);
  const breakMinutes = request.focusStyle === "pomodoro" ? 10 : 15;
  const checklist = [
    "Close distractions",
    "Define the smallest win",
    "Capture questions for review",
  ];

  return {
    title: request.title,
    objective: request.objective,
    durationMinutes,
    breakMinutes,
    status: "ready",
    checklist,
  };
};

export type ResourceCurationRequest = {
  subject: string;
  level: "intro" | "core" | "advanced";
};

export type ResourceCurationResponse = {
  title: string;
  resources: {
    type: "video" | "article" | "practice" | "notes";
    name: string;
    description: string;
    url?: string;
    durationMinutes: number;
    difficulty: "intro" | "core" | "advanced";
  }[];
};

export const curateResources = async (
  request: ResourceCurationRequest,
): Promise<ResourceCurationResponse> => {
  return {
    title: `${request.subject} Sprint`,
    resources: [
      {
        type: "video",
        name: `${request.subject} concept walkthrough`,
        description: "Short overview to anchor the key concepts.",
        durationMinutes: 18,
        difficulty: request.level,
      },
      {
        type: "article",
        name: "Pattern summary notes",
        description: "Read-first summary with examples and pitfalls.",
        durationMinutes: 12,
        difficulty: request.level,
      },
      {
        type: "practice",
        name: "Targeted drills",
        description: "Hands-on exercises to lock in recall.",
        durationMinutes: 25,
        difficulty: request.level,
      },
      {
        type: "notes",
        name: "Flashcard queue",
        description: "Quick recall prompts for spaced repetition.",
        durationMinutes: 10,
        difficulty: request.level,
      },
    ],
  };
};

