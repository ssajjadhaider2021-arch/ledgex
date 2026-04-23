import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { getAccountantVerificationStatus } from "../api/accountant.api";

/** Paths accountants may access before verification documents are approved */
export function shouldBypassAccountantVerificationGate(pathname) {
  if (!pathname) return false;
  if (pathname === "/onboarding-status") return true;
  if (pathname.startsWith("/accountant")) return true;
  if (pathname.startsWith("/onboarding/accountant")) return true;
  return false;
}

/**
 * For accountants only: allows navigation when verification `status === "approved"`.
 * Otherwise redirects to `/onboarding-status`. Non-accountants pass through unchanged.
 */
export default function RequireAccountantVerificationApproved({ children }) {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [verificationApproved, setVerificationApproved] = useState(null);
  const isApprovedByUserFlag = user?.is_accountant_approved === true || user?.isAccountantApproved === true;

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "accountant") {
      setVerificationApproved(true);
      return;
    }

    // Admin approval should unlock dashboard access immediately.
    if (isApprovedByUserFlag) {
      setVerificationApproved(true);
      return;
    }

    if (shouldBypassAccountantVerificationGate(pathname)) {
      setVerificationApproved(true);
      return;
    }

    let cancelled = false;
    setVerificationApproved(null);

    (async () => {
      try {
        const { data } = await getAccountantVerificationStatus();
        if (cancelled) return;
        setVerificationApproved(data?.status === "approved");
      } catch {
        if (cancelled) return;
        setVerificationApproved(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, user, pathname, isApprovedByUserFlag]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || user.role !== "accountant") {
    return children;
  }

  if (isApprovedByUserFlag) {
    return children;
  }

  if (shouldBypassAccountantVerificationGate(pathname)) {
    return children;
  }

  if (verificationApproved === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!verificationApproved) {
    return <Navigate to="/onboarding-status" replace />;
  }

  return children;
}
