# AI Study Planner - Project Description

## 🎯 Project Overview

**AI Study Planner** is an intelligent, AI-driven web application that helps learners create personalized study plans, manage learning schedules, and track academic progress. Powered by the Tambo AI framework, it enables natural language conversations with an AI assistant that generates custom study components in real-time.

## 🌟 Core Value Proposition

Instead of manually creating study schedules, users can **chat with an AI** that:
- Understands learning goals and constraints
- Generates structured study plans automatically
- Creates flexible weekly schedules
- Suggests learning resources
- Tracks focus sessions and progress
- Adapts recommendations in real-time

### Key Problems Solved

✅ **Eliminates manual planning** - AI generates plans instantly  
✅ **Personalized learning paths** - Adapts to goals, time, and preferences  
✅ **Smart scheduling** - Balances priority topics with available time  
✅ **Progress tracking** - Visual insights into study habits  
✅ **Resource curation** - Recommends relevant learning materials  

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **UI Components**: React with Tailwind CSS
- **Styling**: Custom components with CVA (Class Variance Authority)
- **Fonts**: Google Fonts (Space Grotesk, Fraunces)

### AI & State Management
- **Tambo AI Framework**: Powers generative UI and AI tools
- **Streaming**: Real-time AI responses with error boundaries
- **State**: React hooks (useState, useEffect) + localStorage
- **Validation**: Zod schemas for type-safe data

### Key Libraries
```json
{
  "@tambo-ai/react": "AI framework for generative UI",
  "recharts": "Data visualization (bar, line, pie charts)",
  "react-router": "Navigation between pages",
  "zod": "Runtime type validation",
  "class-variance-authority": "Component styling patterns"
}
```

---

## 📦 Core Components

### Tambo-Controlled Components

#### 1. **StudyPlanCard** 
*Structured study plan with modules and milestones*
- Module tracking with estimated hours
- Priority badges (high/medium/low)
- Progress bars for each module
- Milestone timeline
- Constraints & Notes section
- Textarea for personal notes and blockers

**Props:**
```typescript
{
  title: string;
  goal: string;
  targetDate: string;
  dailyMinutes: number;
  totalWeeks?: number;
  modules: Module[];
  milestones?: Milestone[];
}
```

#### 2. **WeekSchedule**
*Day-by-day focus blocks with timing*
- 7-day weekly view
- Time-based focus blocks for each day
- Study mode indicators (deep, review, practice)
- Duration tracking
- Timezone support

#### 3. **FocusSession**
*Single focus session template with objectives and checklist*
- Session title and objective
- Estimated duration (Pomodoro, deep, mixed)
- Checklist for completion
- Mode selection (focus, review, break)

#### 4. **ResourceBoard**
*Curated learning resources by subject*
- Resource categorization (articles, videos, books, etc.)
- Difficulty levels
- Links and descriptions
- Subject-based filtering

#### 5. **Graph (StudyProgressGraph)**
*Data visualization for study metrics*
- Multiple chart types: bar, line, pie
- Weekly study minutes tracking
- Task completion visualization
- Customizable colors and legends
- Responsive container with flex layout

---

## 🛠️ Tambo Tools (AI-Callable Functions)

### 1. **buildStudyPlan**
**Purpose**: Generate comprehensive study plans based on goals and constraints

**Input Schema:**
```typescript
{
  goal: string;           // e.g., "Master data structures in 6 weeks"
  targetDate: string;     // e.g., "May 30"
  dailyMinutes?: number;  // e.g., 90
  daysPerWeek?: number;   // e.g., 5
  subjects: [{
    name: string;
    priority: "high" | "medium" | "low"
  }]
}
```

**Output:** StudyPlanCard props with modules, milestones, progress tracking

---

### 2. **buildWeeklySchedule**
**Purpose**: Create focused weekly study schedules

**Input Schema:**
```typescript
{
  weekLabel: string;      // e.g., "Week 2: Deep focus cadence"
  dailyMinutes: number;   // Total focus time per day
  subjects: string[];     // Topics to cover
  days: string[];         // Days of the week
}
```

**Output:** Organized daily focus blocks with timing

---

### 3. **buildFocusSession**
**Purpose**: Create templates for single study sessions

**Input Schema:**
```typescript
{
  title: string;              // e.g., "Trees Deep Focus"
  objective: string;          // Learning goal
  availableMinutes: number;   // Session duration
  focusStyle: "pomodoro" | "deep" | "mixed"
}
```

**Output:** Structured focus session with checklist

---

### 4. **curateResources**
**Purpose**: Recommend learning resources for subjects

**Input Schema:**
```typescript
{
  subject: string;                    // e.g., "Data Structures"
  level: "intro" | "core" | "advanced"
}
```

**Output:** ResourceBoard with curated materials

---

## 📁 Project Structure

```
ai-study-planner/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── page.tsx                # Home/landing page
│   │   ├── chat/
│   │   │   └── page.tsx            # Chat interface with Tambo
│   │   └── interactables/
│   │       ├── page.tsx            # Demo page with all components
│   │       └── components/
│   │           ├── chat-panel.tsx
│   │           └── settings-panel.tsx
│   ├── components/
│   │   ├── tambo/                  # Tambo-controlled components
│   │   │   ├── study-plan-card.tsx
│   │   │   ├── week-schedule.tsx
│   │   │   ├── focus-session.tsx
│   │   │   ├── resource-board.tsx
│   │   │   ├── graph.tsx
│   │   │   ├── message-thread-full.tsx
│   │   │   ├── message-input.tsx
│   │   │   └── ... (20+ support components)
│   │   ├── StreamErrorBoundary.tsx
│   │   ├── ApiKeyCheck.tsx
│   │   └── crypto-polyfill.tsx
│   ├── lib/
│   │   ├── tambo.ts                # Tambo config (tools & components)
│   │   ├── thread-hooks.ts         # Chat state management
│   │   └── utils.ts
│   └── services/
│       ├── study-planner.ts        # Tool implementations
│       └── population-stats.ts
├── globals.css                      # Tailwind + custom styles
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── .env.local                       # API keys & config
```

---

## 🔄 Key Workflows

### 1. **Chat to Study Plan**
```
User: "Help me create a 6-week plan to master algorithms"
  ↓
AI understands intent and calls buildStudyPlan()
  ↓
StudyPlanCard component renders with:
  - Modules (Arrays, Trees, DP, System Design)
  - Milestones (Mock interviews, drills)
  - Daily schedule (90 min/day)
  ↓
User sees plan and can edit constraints & notes
```

### 2. **Weekly Schedule Generation**
```
User: "Create a schedule for week 2"
  ↓
AI calls buildWeeklySchedule()
  ↓
WeekSchedule component displays:
  - Monday-Sunday with focus blocks
  - 7:30 PM Trees deep focus (55 min)
  - 9:00 PM Graphs review (35 min)
  ↓
User can see timing and adjust
```

### 3. **Resource Curation**
```
User: "Show me resources for data structures"
  ↓
AI calls curateResources("Data Structures", "core")
  ↓
ResourceBoard displays:
  - Video tutorials
  - Articles and blogs
  - Practice problems
  - Books and courses
  ↓
User bookmarks relevant resources
```

---

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Slate, amber, emerald, sky (Tailwind palette)
- **Typography**: Space Grotesk (sans), Fraunces (display)
- **Spacing**: 4px grid system
- **Radius**: 2xl-3xl for modern feel
- **Effects**: Glassmorphism, shadows, blur effects

### Interactive Elements
- Real-time chat with streaming responses
- Progress bars and visual indicators
- Collapsible sections
- Textarea for notes and constraints
- Badge system for priorities
- Milestone timeline view

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt
- Tailwind breakpoints (sm, md, lg)
- Full-screen chat experience

---

## 🔧 Configuration

### Environment Variables
```bash
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
NEXT_PUBLIC_TAMBO_URL=https://api.tambo.ai  # Optional custom URL
```

### Features
- ✅ Streaming enabled for real-time responses
- ✅ MCP Server support for extended capabilities
- ✅ Auto-save to localStorage
- ✅ Error boundaries for stability
- ✅ Hydration mismatch prevention

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

---

## 📊 Data Flow

```
┌─────────────────┐
│   User Input    │
│  (Chat Message) │
└────────┬────────┘
         ↓
┌─────────────────────────┐
│  Tambo AI Engine        │
│  (Processes intent)     │
└────────┬────────────────┘
         ↓
    ┌────┴────┐
    ↓         ↓
 Tool Call  Component Render
    ↓         ↓
┌──────────┐  ┌────────────────┐
│Function  │  │UI Component    │
│Execution │  │StudyPlanCard   │
│          │  │WeekSchedule    │
│Generate  │  │Graph, etc.     │
│Data      │  │                │
└──────┬───┘  └────────┬───────┘
       ↓               ↓
    ┌─────────────────────────┐
    │   Validate with Zod     │
    │   Schema Checking       │
    ├─────────────────────────┤
    │ Type Safety Guaranteed  │
    └─────────────────────────┘
         ↓
    ┌─────────────────┐
    │ Stream Response │
    │ to User         │
    └─────────────────┘
```

---

## 🔐 Error Handling

### Streaming Errors
- **StreamErrorBoundary**: Catches streaming failures
- **Retry mechanism**: Allows reconnection attempts
- **Fallback UI**: Shows helpful error messages

### Hydration Errors
- **Fixed**: Removed `Math.random()` from render
- **Use deterministic values**: Prevents SSR/client mismatch
- **localStorage sync**: Ensures state consistency

### Validation
- **Zod schemas**: All components & tools are validated
- **Type checking**: Full TypeScript coverage
- **Runtime checks**: Props validated before render

---

## 📈 Future Enhancements

- [ ] User accounts and plan persistence
- [ ] Multi-user collaboration on study plans
- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Progress analytics dashboard
- [ ] AI-powered feedback on plans
- [ ] Voice input for accessibility
- [ ] Study habit tracking with streaks
- [ ] Community study group features
- [ ] Gamification (badges, leaderboards)

---

## 📝 License

This project is built on the Tambo framework. See [Tambo Docs](https://tambo.co/docs) for more information.

---

## 🤝 Contributing

1. Create a new branch for features
2. Add Zod schemas for new components
3. Register in `src/lib/tambo.ts`
4. Test with the chat interface
5. Submit pull request

---

## 📞 Support

- **Tambo Docs**: https://docs.tambo.co
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zod Validation**: https://zod.dev

---

## 🎓 Learning Path

This project demonstrates:
1. **AI Integration**: How to use Tambo framework
2. **Generative UI**: Components controlled by AI
3. **Type Safety**: Zod schemas + TypeScript
4. **Real-time Streaming**: WebSocket communications
5. **React Best Practices**: Hooks, error boundaries, dynamic imports
6. **Modern CSS**: Tailwind utility classes
7. **Full-stack Next.js**: SSR, API routes, environment config

Perfect for learning AI-driven development patterns!

---

**Last Updated**: February 8, 2026  
**Version**: 1.0.0  
**Status**: Active Development
