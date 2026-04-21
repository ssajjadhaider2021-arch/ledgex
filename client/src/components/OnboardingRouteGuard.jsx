import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resolveClientOnboardingPath } from "../utils/onboardingPaths";

/** Alternate wizard — not driven by server `onboardingStep` URLs */
const BYPASS_PREFIXES = ["/onboarding-page"];

function shouldBypass(pathname) {
  return BYPASS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * For authenticated clients: keep them on the onboarding URL that matches
 * `onboardingStep`, send completed users to the dashboard, and block access
 * to the dashboard (and other app routes) until onboarding is finished.
 */
export default function OnboardingRouteGuard({ children }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return null;
  if (!user) return null;

  if (user.role !== "client") return children;

  if (shouldBypass(pathname)) return children;

  const required = resolveClientOnboardingPath(user);
  if (!required) return children;

  if (pathname === required) return children;

  if (pathname === "/onboarding") return children;

  return <Navigate to={required} replace />;
}
