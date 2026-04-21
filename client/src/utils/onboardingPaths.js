/**
 * Canonical path for a client based on onboarding state.
 * @param {{ role: string; onboardingStep?: number; onboardingCompleted?: boolean }} user
 * @returns {string | null} null if not a client (caller should not redirect)
 */
export function resolveClientOnboardingPath(user) {
  if (!user || user.role !== "client") return null;
  /** Completed clients may use dashboard, business profile, etc. — do not lock them to one path. */
  if (user.onboardingCompleted) return null;
  const step = Number(user.onboardingStep);
  if (step === 2) return "/onboarding/step2";
  if (step === 3) return "/onboarding/step3";
  return "/onboarding/step1";
}
