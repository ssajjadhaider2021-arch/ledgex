import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountantProfile, getAccountantVerificationStatus } from "../../api/accountant.api";
import { writeAccountantVerificationStatus } from "../../utils/authStorage";

const POLL_MS = 30000;

export default function OnboardingStatusPage() {
  const { user, loading: authLoading, loadUser } = useAuth();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileApproved, setProfileApproved] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return undefined;

    if (user?.role !== "accountant") {
      setLoading(false);
      return undefined;
    }

    const load = async () => {
      try {
        await loadUser();
        const [verificationRes, profileRes] = await Promise.allSettled([
          getAccountantVerificationStatus(),
          getAccountantProfile(),
        ]);

        const verificationData =
          verificationRes.status === "fulfilled" ? verificationRes.value?.data : null;
        const profileData = profileRes.status === "fulfilled" ? profileRes.value?.data : null;

        if (!mounted) return;
        setStatusData(verificationData);
        writeAccountantVerificationStatus(verificationData?.status);
        setProfileApproved(profileData?.profile?.status === "APPROVED");

        if (verificationRes.status === "rejected") {
          const e = verificationRes.reason;
          if (e?.response?.status === 404) {
            setStatusData({ status: "pending" });
            writeAccountantVerificationStatus("pending");
            setError("");
          } else {
            setError(e?.response?.data?.message || "Could not load status");
          }
        } else {
          setError("");
        }
      } catch (e) {
        if (!mounted) return;
        if (e?.response?.status === 404) {
          setStatusData({ status: "pending" });
          writeAccountantVerificationStatus("pending");
          setError("");
        } else {
          setError(e?.response?.data?.message || "Could not load status");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [authLoading, user?.role]);

  const status = (statusData?.status || "").toLowerCase();
  const isApprovedByUserFlag = user?.is_accountant_approved === true || user?.isAccountantApproved === true;

  useEffect(() => {
    if (status === "approved" || profileApproved || isApprovedByUserFlag) {
      // Refresh auth payload so is_accountant_approved updates immediately after admin action.
      loadUser();
    }
  }, [status, profileApproved, isApprovedByUserFlag, loadUser]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || user.role !== "accountant") {
    return <Navigate to="/login" replace />;
  }

  if (status === "approved" || profileApproved || isApprovedByUserFlag) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  const isRejected = status === "rejected";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/60">
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 md:py-24">
        <Card className="w-full rounded-2xl border-slate-200/90 shadow-lg shadow-slate-900/5">
          <div className="flex flex-col items-center px-2 py-6 text-center md:px-6 md:py-10">
            <ClockCircleOutlined
              className={isRejected ? "text-rose-500" : "text-indigo-500"}
              style={{ fontSize: 56 }}
            />
            <Typography.Title level={3} className="!mt-6 !mb-3">
              {isRejected ? "Verification update" : "Under Review"}
            </Typography.Title>
            <Typography.Paragraph type="secondary" className="!mb-0 max-w-md text-base leading-relaxed">
              {error
                ? error
                : isRejected
                  ? "Your verification could not be approved at this time. Please check any message from compliance or upload new documents when requested."
                  : "Your documents are being reviewed. This page refreshes automatically every 30 seconds. You will be redirected when verification is complete."}
            </Typography.Paragraph>
            {!error && !isRejected ? (
              <Typography.Paragraph type="secondary" className="!mt-4 !mb-0 text-sm">
                Last checked: auto-refresh active
              </Typography.Paragraph>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
