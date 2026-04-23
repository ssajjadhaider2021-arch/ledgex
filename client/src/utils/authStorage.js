export const AUTH_USER_STORAGE_KEY = "ledgeX_auth_user";
export const ACCOUNTANT_VERIFICATION_STATUS_KEY = "ledgeX_accountant_verification_status";

export function readStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredUser(user) {
  if (!user || typeof user !== "object") {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function readAccountantVerificationStatus() {
  return localStorage.getItem(ACCOUNTANT_VERIFICATION_STATUS_KEY);
}

export function writeAccountantVerificationStatus(status) {
  if (!status) {
    localStorage.removeItem(ACCOUNTANT_VERIFICATION_STATUS_KEY);
    return;
  }
  localStorage.setItem(ACCOUNTANT_VERIFICATION_STATUS_KEY, String(status).toLowerCase());
}
