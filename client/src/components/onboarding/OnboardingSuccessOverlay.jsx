import React from "react";

/**
 * Brief success state before navigation.
 * @param {{ visible: boolean; message?: string; subMessage?: string }} props
 */
export function OnboardingSuccessOverlay({
  visible,
  message = "You're all set",
  subMessage = "Taking you to the next step…",
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/25 px-4 backdrop-blur-[3px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="onboarding-success-card flex max-w-sm flex-col items-center rounded-2xl border border-emerald-200/90 bg-white px-10 py-9 text-center shadow-2xl shadow-emerald-900/15">
        <div className="onboarding-success-icon mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold tracking-tight text-slate-900">{message}</p>
        <p className="mt-1 text-sm text-slate-500">{subMessage}</p>
      </div>
    </div>
  );
}

/** Spinner for primary (blue / gradient) buttons */
export function InlineSubmitSpinner({ variant = "onLight" }) {
  const ring =
    variant === "onLight"
      ? "border-white/35 border-t-white"
      : "border-slate-200 border-t-blue-600";
  return (
    <span
      className={`me-2 inline-block h-4 w-4 shrink-0 rounded-full border-2 ${ring} animate-spin`}
      aria-hidden
    />
  );
}
