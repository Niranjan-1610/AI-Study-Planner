import { ApiKeyCheck } from "@/components/ApiKeyCheck";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-amber-200/40 blur-[130px]" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-[150px]" />
        </div>

        <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-16">
          <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.5em] text-slate-500">
                Tambo AI Study Planner
              </p>
              <h1 className="text-4xl font-display leading-tight text-slate-900 md:text-5xl">
                Turn study chaos into a calm, adaptive plan.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                Plan sessions, track progress, and let Tambo co-design your
                schedule in real time. This workspace is wired to generative
                components, so the assistant can build study blocks directly in
                the UI.
              </p>
              <ApiKeyCheck>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/interactables"
                    className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Open planner
                  </a>
                  <a
                    href="/chat"
                    className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    Open chat
                  </a>
                </div>
              </ApiKeyCheck>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Today
                </p>
                <h2 className="mt-3 text-2xl font-display text-slate-900">
                  3 focused blocks
                </h2>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    7:30 PM - Graph traversal deep focus
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    9:00 PM - DP recap and review
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    10:00 PM - Flashcards and summary
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Tambo Actions
                </p>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>Generate a new study plan from your goals.</li>
                  <li>Fill the week schedule with focus blocks.</li>
                  <li>Curate resources for each subject.</li>
                  <li>Build a focus session checklist.</li>
                </ul>
              </div>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Adaptive planning
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Tambo adjusts your plan based on time and priority, so you never
                guess what to study next.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Visual schedules
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Weekly maps and focus cards make your plan tangible and easy to
                execute.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                AI plus UI together
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Ask the assistant to create components directly inside your
                planner workspace.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
