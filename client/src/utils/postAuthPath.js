export function postAuthPath(user) {
  if (!user) return "/register";
  if (!user.isVerified) return "/verify";

  if (user.role === "client" && !user.onboardingCompleted) {
    const step = Math.min(Math.max(Number(user.onboardingStep) || 1, 1), 3);
    return `/onboarding/step${step}`;
  }

  return "/dashboard";
}
