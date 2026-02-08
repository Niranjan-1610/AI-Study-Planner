/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { FocusSession, focusSessionSchema } from "@/components/tambo/focus-session";
import { Graph, graphSchema } from "@/components/tambo/graph";
import { ResourceBoard, resourceBoardSchema } from "@/components/tambo/resource-board";
import { StudyPlanCard, studyPlanCardSchema } from "@/components/tambo/study-plan-card";
import { WeekSchedule, weekScheduleSchema } from "@/components/tambo/week-schedule";
import {
  buildFocusSession,
  buildStudyPlan,
  buildWeeklySchedule,
  curateResources,
} from "@/services/study-planner";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "buildStudyPlan",
    description:
      "Generate a structured study plan based on goals, target date, and subject priorities.",
    tool: buildStudyPlan,
    inputSchema: z.object({
      goal: z.string(),
      targetDate: z.string(),
      dailyMinutes: z.number().optional(),
      daysPerWeek: z.number().optional(),
      subjects: z.array(
        z.object({
          name: z.string(),
          priority: z.enum(["high", "medium", "low"]),
        }),
      ),
    }),
    outputSchema: studyPlanCardSchema,
  },
  {
    name: "buildWeeklySchedule",
    description:
      "Generate a focused weekly schedule with blocks for each day.",
    tool: buildWeeklySchedule,
    inputSchema: z.object({
      weekLabel: z.string(),
      dailyMinutes: z.number(),
      subjects: z.array(z.string()),
      days: z.array(z.string()),
    }),
    outputSchema: weekScheduleSchema,
  },
  {
    name: "buildFocusSession",
    description:
      "Create a single focus session template with checklist and timing.",
    tool: buildFocusSession,
    inputSchema: z.object({
      title: z.string(),
      objective: z.string(),
      availableMinutes: z.number(),
      focusStyle: z.enum(["pomodoro", "deep", "mixed"]),
    }),
    outputSchema: focusSessionSchema,
  },
  {
    name: "curateResources",
    description:
      "Curate a quick set of learning resources for a given subject.",
    tool: curateResources,
    inputSchema: z.object({
      subject: z.string(),
      level: z.enum(["intro", "core", "advanced"]),
    }),
    outputSchema: resourceBoardSchema,
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "StudyPlanCard",
    description:
      "A structured study plan card with modules, milestones, and daily targets.",
    component: StudyPlanCard,
    propsSchema: studyPlanCardSchema,
  },
  {
    name: "WeekSchedule",
    description:
      "A weekly schedule view with day-by-day focus blocks.",
    component: WeekSchedule,
    propsSchema: weekScheduleSchema,
  },
  {
    name: "FocusSession",
    description:
      "A focus session card with timing, objectives, and checklist items.",
    component: FocusSession,
    propsSchema: focusSessionSchema,
  },
  {
    name: "ResourceBoard",
    description:
      "A curated list of learning resources with types and difficulty.",
    component: ResourceBoard,
    propsSchema: resourceBoardSchema,
  },
  {
    name: "StudyProgressGraph",
    description:
      "Use Graph to visualize weekly study minutes or task completion.",
    component: Graph,
    propsSchema: graphSchema,
  },
  // Add more components here
];
