# Contributing to AI Study Planner

Thank you for your interest in contributing to AI Study Planner! We welcome contributions from everyone, whether it's bug reports, feature requests, code improvements, or documentation enhancements.

## 🎯 How to Contribute

### Reporting Bugs

If you've found a bug, please create an issue with:
- **Clear title** describing the bug
- **Detailed description** of what happened
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment info**: Node version, OS, browser (if applicable)
- **Screenshots or logs** if relevant

### Suggesting Features

Feature suggestions are welcome! Please include:
- **Feature description**: What should the feature do?
- **Use case**: Why is this feature needed?
- **Example usage**: How should users interact with it?
- **Potential alternatives**: Other approaches considered

### Code Contributions

#### Setting Up Your Environment

1. **Fork the repository**
   ```bash
   # Visit https://github.com/yourusername/ai-study-planner/fork
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/ai-study-planner.git
   cd ai-study-planner
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/ai-study-planner.git
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```

5. **Install dependencies**
   ```bash
   npm install
   ```

6. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your Tambo API key
   ```

#### Development Workflow

1. **Make your changes**
   - Follow the existing code style
   - Keep commits atomic and descriptive
   - Add Zod schemas for any new components
   - Register new components/tools in `src/lib/tambo.ts`

2. **Run tests and linting**
   ```bash
   # Check for code issues
   npm run lint
   
   # Auto-fix fixable issues
   npm run lint:fix
   
   # Build the project
   npm run build
   ```

3. **Test your changes**
   ```bash
   # Start development server
   npm run dev
   
   # Visit http://localhost:3000
   # Test your changes on /chat or /interactables pages
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: describe your feature or fix"
   # Use conventional commits:
   # feat: new feature
   # fix: bug fix
   # docs: documentation
   # style: formatting
   # refactor: code refactoring
   # test: test additions
   # chore: maintenance
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "Compare & pull request"
   - Fill in the PR template with:
     - What does this PR do?
     - Why is this change needed?
     - How has this been tested?
     - Screenshots (if UI changes)
   - Review any CI checks
   - Respond to review feedback

#### Pull Request Guidelines

Before submitting a PR, ensure:
- ✅ Your branch is up to date with `upstream/main`
  ```bash
  git fetch upstream
  git rebase upstream/main
  ```
- ✅ All tests pass: `npm run build`
- ✅ Linting passes: `npm run lint`
- ✅ Code is formatted properly: `npm run lint:fix`
- ✅ Commit messages follow conventions
- ✅ No unrelated changes included
- ✅ PR description is clear and complete

### Code Style Guidelines

#### TypeScript
- Use strict mode (no `any` types without justification)
- Add proper type annotations for function parameters and returns
- Use interfaces/types for component props
- Example:
  ```typescript
  interface MyComponentProps {
    title: string;
    onClick: (id: string) => void;
  }
  ```

#### Components
- Create Zod schemas for all props
- Use React hooks properly (no unnecessary re-renders)
- Keep components pure and reusable
- Add meaningful comments for complex logic
- Example:
  ```typescript
  import { z } from "zod";
  
  const MyComponentSchema = z.object({
    title: z.string(),
    onClick: z.function(),
  });
  
  type MyComponentProps = z.infer<typeof MyComponentSchema>;
  
  export function MyComponent({ title, onClick }: MyComponentProps) {
    return <button onClick={() => onClick("id")}>{title}</button>;
  }
  ```

#### Styling
- Use Tailwind CSS utility classes
- Leverage CVA for component variants
- Mobile-first responsive design
- Example:
  ```tsx
  <div className="p-4 md:p-6 lg:p-8 rounded-lg bg-white shadow-md">
    {/* content */}
  </div>
  ```

#### Files & Folders
- Use kebab-case for file names: `my-component.tsx`
- Organize by feature: `components/tambo/`
- Keep related files together
- Add index files for easier imports

### Adding New Features

#### Tambo Components
1. **Create component file**: `src/components/tambo/my-component.tsx`
2. **Add Zod schema** for props validation
3. **Export component** with proper TypeScript types
4. **Register in `src/lib/tambo.ts`**:
   ```typescript
   export const components: TamboComponent[] = [
     {
       name: "MyComponent",
       description: "What this component does",
       component: MyComponent,
       propsSchema: MyComponentSchema,
     },
     // ... existing components
   ];
   ```
5. **Test on `/interactables` page**

#### Tambo Tools
1. **Implement tool function**: `src/services/study-planner.ts`
2. **Add Zod schemas** for input/output validation
3. **Register in `src/lib/tambo.ts`**:
   ```typescript
   export const tools: TamboTool[] = [
     {
       name: "myTool",
       description: "What this tool does",
       tool: myToolFunction,
       inputSchema: MyToolInputSchema,
       outputSchema: MyToolOutputSchema,
     },
     // ... existing tools
   ];
   ```
4. **Test via chat interface**

### Documentation

- Update [README.md](README.md) for user-facing changes
- Update [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) for architecture changes
- Add comments for complex logic
- Include examples in PR description

## 📋 Review Process

1. **Maintainers review** your PR for:
   - Code quality and style compliance
   - Test coverage
   - Documentation completeness
   - Compatibility with existing code

2. **Address feedback**: Update your PR based on review comments

3. **Merge**: Once approved, your PR will be merged!

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [Tambo Documentation](https://docs.tambo.co)

## 🎓 Project Structure

```
src/
├── app/                  # Next.js app routes
├── components/
│   ├── tambo/           # Tambo-controlled components (20+)
│   └── ui/              # Reusable UI components
├── lib/
│   ├── tambo.ts         # Tools & components registration
│   └── thread-hooks.ts  # Chat state management
└── services/
    └── study-planner.ts # Tool implementations
```

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- Open an issue with the `question` label
- Check existing discussions
- Comment on relevant PRs

Thank you for contributing! We appreciate your effort in making AI Study Planner better. 🙌
