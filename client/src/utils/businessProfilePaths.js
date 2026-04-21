/**
 * Where to send the user to continue the business profile wizard.
 * @param {object | null} profile from GET /api/business-profile
 * @returns {string | null} path, or null if wizard is complete (completedStep >= 5)
 */
export function getBusinessProfileResumePath(profile) {
  if (!profile || !profile.clientType) {
    return "/business-profile/step1";
  }
  const cs = Number(profile.completedStep ?? 1);
  if (cs >= 5) return null;

  const stepPaths = {
    1: "/business-profile/step1",
    2: "/business-profile/step2",
    3: "/business-profile/step3",
    4: "/business-profile/step4",
  };
  return stepPaths[cs] || "/business-profile/step1";
}

export function businessProfileStepLabel(path) {
  if (!path) return "";
  const m = path.match(/step(\d)/);
  return m ? `Step ${m[1]}` : "";
}
