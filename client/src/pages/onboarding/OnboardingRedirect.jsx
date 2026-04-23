import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { resolveClientOnboardingPath } from "../../utils/onboardingPaths";
import { postAuthPath } from "../../utils/postAuthPath";

export default function OnboardingRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") {
    return <Navigate to={postAuthPath(user)} replace />;
  }
  const path = resolveClientOnboardingPath(user);
  return <Navigate to={path || "/dashboard"} replace />;
}
