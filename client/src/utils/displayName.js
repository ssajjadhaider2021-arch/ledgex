/** Prefer full name from onboarding, then email local-part. */
export function getUserDisplayName(user) {
  if (!user) return "there";
  const n = typeof user.fullName === "string" ? user.fullName.trim() : "";
  if (n) return n;
  const email = typeof user.email === "string" ? user.email.trim() : "";
  if (email.includes("@")) return email.split("@")[0];
  return email || "there";
}
