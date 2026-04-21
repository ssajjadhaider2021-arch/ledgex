import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OnboardingRouteGuard from "./OnboardingRouteGuard";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <OnboardingRouteGuard>{children}</OnboardingRouteGuard>;
}
