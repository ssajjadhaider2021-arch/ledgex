import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  readAccountantVerificationStatus,
  readStoredUser,
} from "../utils/authStorage";

function isAccountantApproved(user) {
  const status = readAccountantVerificationStatus();
  // Fresh status from polling should override stale cached user flags.
  if (status === "approved") return true;

  const fromUser =
    user?.is_accountant_approved ??
    user?.isAccountantApproved ??
    user?.accountantApproved ??
    user?.verification_status;
  if (typeof fromUser === "string") {
    return fromUser.toLowerCase() === "approved" || fromUser.toLowerCase() === "true";
  }
  if (typeof fromUser === "boolean") return fromUser;

  return false;
}

export default function RoleRouteGuard({ children }) {
  const { pathname } = useLocation();
  const user = readStoredUser();

  if (!user?.role) return children;

  if (user.role === "admin") {
    const isAdminPage = pathname.startsWith("/admin");
    if (!isAdminPage) return <Navigate to="/admin/accountants" replace />;
    return children;
  }

  if (user.role === "client") {
    const isRoleMismatchPath = pathname.startsWith("/admin") || pathname.startsWith("/accountant");
    if (isRoleMismatchPath) return <Navigate to="/dashboard" replace />;
    return children;
  }

  if (user.role === "accountant") {
    const bypass =
      pathname === "/onboarding-status" ||
      pathname.startsWith("/accountant") ||
      pathname.startsWith("/onboarding/accountant");

    if (bypass) return children;
    if (!isAccountantApproved(user)) return <Navigate to="/onboarding-status" replace />;
  }

  return children;
}
