# 🎓 AI Study Planner

[![Next.js](https://img.shields.io/badge/Next.js-15.5.12-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An intelligent, AI-driven web application that helps learners create personalized study plans, manage learning schedules, and track academic progress using the Tambo AI framework. The application provides real-time AI chatting, adaptive scheduling, progress tracking, and intelligent resource curation.

**For detailed technical information, see [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md)**

## ✨ Key Features

- 🤖 **Chat with AI** to create personalized study plans
- 📚 **Smart Components**: StudyPlanCard, WeekSchedule, FocusSession, Graph
- 📊 **Progress Tracking**: Visual insights with charts and progress bars
- 📅 **Weekly Scheduling**: AI-generated daily focus blocks
- 🎯 **Resource Curation**: Recommended learning materials by subject
- ⚡ **Real-time Streaming**: Live AI responses with error handling
- 🔒 **Type-Safe**: Full TypeScript with Zod validation

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.17+ ([Download](https://nodejs.org/))
- **npm** or **yarn**: Latest version
- **Tambo API Key**: Free from [tambo.co/dashboard](https://tambo.co/dashboard)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-study-planner.git
cd ai-study-planner

# Install dependencies
npm install
```

### Environment Configuration

1. Get a free Tambo API key at [tambo.co/dashboard](https://tambo.co/dashboard)

2. Create `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

3. (Optional) Configure additional environment variables:
```bash
# Next.js configuration
NODE_ENV=development
```

### Running Locally

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Linting with auto-fix
npm run lint:fix
```

Visit `http://localhost:3000` to get started!

**Available Routes:**
- `/` - Home page
- `/chat` - AI chat interface for creating study plans
- `/interactables` - Interactive demo page with all components

## 📋 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15.5.12 |
| **UI Library** | React 19.1.1 |
| **Language** | TypeScript 5 |
| **AI Framework** | Tambo AI |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts 3.5.0 |
| **Validation** | Zod |
| **Styling Utils** | Class Variance Authority (CVA) |
| **Fonts** | Next.js Google Fonts (Space Grotesk, Fraunces) |
| **Linting** | ESLint |

### Tambo Components

All AI-controlled components are registered in `src/lib/tambo.ts`:

| Component | Purpose |
|-----------|---------|
| **StudyPlanCard** | Structured plans with modules, milestones, constraints |
| **WeekSchedule** | Weekly focus blocks and daily schedules |
| **FocusSession** | Single session templates with checklists |
| **ResourceBoard** | Curated learning resources by subject |
| **Graph** | Data visualization (bar, line, pie charts) |

### Tambo Tools

AI can call these functions to generate data:

| Tool | Purpose |
|------|---------|
| `buildStudyPlan` | Generate comprehensive study plans |
| `buildWeeklySchedule` | Create weekly schedules with focus blocks |
| `buildFocusSession` | Create focus session templates |
| `curateResources` | Recommend learning resources |

## 📁 Project Structure

```
src/
├── app/
│   ├── chat/           # Chat interface with Tambo
│   └── interactables/  # Demo page with all components
├── components/tambo/   # 20+ Tambo-controlled components
├── lib/
│   ├── tambo.ts       # Tools & components registration
│   └── thread-hooks.ts # Chat state management
└── services/
    └── study-planner.ts # Tool implementations
```

## 🔧 Customization

### Registering New Components

Edit `src/lib/tambo.ts`:

```tsx
export const components: TamboComponent[] = [
  {
    name: "YourComponent",
    description: "What this component does",
    component: YourComponent,
    propsSchema: yourComponentSchema,
  },
  // ...existing components
];
```

### Adding New Tools

```tsx
export const tools: TamboTool[] = [
  {
    name: "myTool",
    description: "What this tool does",
    tool: myToolFunction,
    inputSchema: z.object({ /* ... */ }),
    outputSchema: z.object({ /* ... */ }),
  },
  // ...existing tools
];
```

All components and tools use **Zod schemas** for type-safe validation!

## 🎨 Design & Styling

- **Framework**: Tailwind CSS with custom utilities
- **Typography**: Space Grotesk (sans) + Fraunces (display)
- **Components**: Built with CVA (Class Variance Authority)
- **Responsive**: Mobile-first design approach

## 📡 Advanced Features

### Voice Input
The `DictationButton` component provides speech-to-text input using the `useTamboVoice` hook.

### MCP Support
Model Context Protocol integration for external tools:
- `useTamboMcpPromptList` - List available prompts
- `useTamboMcpPrompt` - Execute MCP prompts
- `useTamboMcpResourceList` - List resources

See `src/components/tambo/mcp-components.tsx` for examples.

### Real-time Streaming
- ✅ Streaming responses enabled
- ✅ Error boundaries for stability
- ✅ Retry mechanisms for failures

### State Management
- localStorage for plan persistence
- React hooks for UI state
- Thread-based chat management

## 🧪 Testing Components

Visit `/interactables` to see all components in action:
```
http://localhost:3000/interactables
```

This page displays:
- Study Plan Cards with modules
- Weekly schedules
- Focus sessions
- Resource boards  
- Progress graphs

## ⚠️ Troubleshooting

### Build Issues
- **"Chart width/height should be greater than 0"**: This is a Recharts warning during static builds. Charts render correctly in the browser. No action needed.
- **TypeScript errors**: Run `npm run lint:fix` to auto-fix fixable issues.

### Runtime Issues
- **Hydration mismatches**: Clear browser cache or hard refresh (`Ctrl+Shift+R`)
- **Missing API key**: Verify `NEXT_PUBLIC_TAMBO_API_KEY` is set in `.env.local`
- **Streaming errors**: Check browser console, enable `StreamErrorBoundary`

### Development Issues
- **Port 3000 already in use**: Run on different port: `npm run dev -- -p 3001`
- **Dependencies not installed**: Run `npm install` again
- **Cache issues**: Delete `.next` folder and rebuild: `rm -r .next && npm run build`

For detailed debugging, see [STREAMING_DEBUG_GUIDE.md](STREAMING_DEBUG_GUIDE.md)

## 📖 Documentation

- **Project Details**: [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md)
- **Tambo Framework**: [https://docs.tambo.co](https://docs.tambo.co)
- **Next.js Guide**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
   ```bash
   git clone https://github.com/yourusername/ai-study-planner.git
   cd ai-study-planner
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Create Zod schemas for new components
   - Register components/tools in `src/lib/tambo.ts`
   - Test with the chat interface

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

5. **Submit pull request** with description of changes

### Code Guidelines
- ✅ Follow existing code style (TypeScript, Tailwind classes)
- ✅ Add Zod schemas for prop validation
- ✅ Keep components pure and reusable
- ✅ Test components on `/interactables` page
- ✅ Run `npm run lint:fix` before committing

## 📄 License

This project is licensed under the MIT License - See the [LICENSE](LICENSE) file for details.

Built with ❤️ using [Tambo](https://tambo.co) - The AI framework for generative UI.

---

## 📞 Support

- 📖 **Documentation**: [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ai-study-planner/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-study-planner/discussions)
- 🔗 **Tambo Docs**: [https://docs.tambo.co](https://docs.tambo.co)

---

**Version**: 1.0.0  
**Last Updated**: February 8, 2026  
**Status**: Production Ready ✅
