export function postAuthPath(user) {
  if (!user) return "/register";
  if (!user.isVerified) return "/verify";

  if (user.role === "client" && !user.onboardingCompleted) {
    const step = Math.min(Math.max(Number(user.onboardingStep) || 1, 1), 3);
    return `/onboarding/step${step}`;
  }

  if (user.role === "accountant") {
    const approved = user.is_accountant_approved === true || user.isAccountantApproved === true;
    if (approved) return "/dashboard";
    return "/onboarding/accountant/step1";
  }

  return "/dashboard";
}
