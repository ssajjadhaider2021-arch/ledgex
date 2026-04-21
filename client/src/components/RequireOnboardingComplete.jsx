import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveClientOnboardingPath } from "../utils/onboardingPaths";

/** Belt-and-suspenders for post-onboarding routes (guard in `ProtectedRoute` usually handles this first). */
export default function RequireOnboardingComplete({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "client" && !user.onboardingCompleted) {
    const path = resolveClientOnboardingPath(user);
    if (path && path !== "/dashboard") return <Navigate to={path} replace />;
  }

  return children;
}
