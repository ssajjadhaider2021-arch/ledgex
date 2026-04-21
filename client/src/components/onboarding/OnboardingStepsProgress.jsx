import React from "react";

const STEPS = [
  { step: 1, title: "Agreement", short: "1" },
  { step: 2, title: "Verification", short: "2" },
  { step: 3, title: "Compliance", short: "3" },
];

/**
 * High-level onboarding progress: Step 1 → 2 → 3.
 * @param {{ activeStep: 1 | 2 | 3 }} props
 */
export function OnboardingStepsProgress({ activeStep = 1 }) {
  const fillPct = (activeStep / 3) * 100;

  return (
    <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-4 shadow-sm shadow-slate-900/5 backdrop-blur-sm sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Onboarding</p>
        <p className="text-xs font-medium tabular-nums text-slate-600">
          Step {activeStep} of 3
        </p>
      </div>

      <div className="relative mb-4 pt-1">
        <div
          className="absolute left-[12.5%] right-[12.5%] top-[18px] h-0.5 bg-slate-100 sm:left-[14%] sm:right-[14%]"
          aria-hidden
        />
        <div className="relative flex justify-between px-1 sm:px-2">
          {STEPS.map((s) => {
            const done = activeStep > s.step;
            const current = activeStep === s.step;
            return (
              <div key={s.step} className="flex flex-col items-center gap-2">
                <div
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-all duration-500 ease-out ${
                    done
                      ? "scale-100 bg-blue-600 text-white shadow-blue-600/25"
                      : current
                        ? "scale-110 bg-blue-100 text-blue-800 ring-2 ring-blue-500/40 shadow-blue-500/10"
                        : "scale-100 bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="tabular-nums">{s.short}</span>
                  )}
                </div>
                <span
                  className={`max-w-[4.5rem] text-center text-[10px] font-semibold leading-tight sm:max-w-none sm:text-xs ${
                    current ? "text-blue-700" : done ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 transition-[width] duration-700 ease-out"
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}
