import React, { useEffect, useMemo, useState } from "react";
import { Alert, Card, Progress, Spin, Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  LockOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountantVerificationStatus } from "../../api/accountant.api";
import { writeAccountantVerificationStatus } from "../../utils/authStorage";

const POLL_MS = 30000;

export default function AccountantVerificationStatusPage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");

  // Hooks must run before any early return (fixes blank page from Rules of Hooks violation)
  const status = statusData?.status || "pending";

  const progressPercent = useMemo(() => {
    if (status === "under_review" || status === "rejected" || status === "approved") return 100;
    if (status === "pending") return 66;
    return 0;
  }, [status]);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return;

    if (user?.role !== "accountant") {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const { data } = await getAccountantVerificationStatus();
        if (!mounted) return;
        setStatusData(data);
        writeAccountantVerificationStatus(data?.status);
        setError("");
      } catch (e) {
        if (!mounted) return;
        if (e?.response?.status === 404) {
          setStatusData({ status: "pending" });
          writeAccountantVerificationStatus("pending");
          setError("");
        } else {
          setError(e?.response?.data?.message || "Could not load verification status");
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

  if (statusData?.status === "approved") {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  const rejectedReason =
    statusData?.rejection_reason || "Please review the reason provided and contact support if you need help.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/60 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 md:py-12">
        {error ? (
          <Alert type="error" showIcon className="!mb-6" message={error} />
        ) : null}

        <Card
          className="!mb-6 !rounded-2xl !border-slate-200/90 !bg-white/95 !shadow-xl !shadow-slate-900/5 !backdrop-blur-sm"
          styles={{ body: { padding: "1.5rem" } }}
        >
          <Typography.Text className="!text-xs !uppercase !tracking-wider !text-indigo-600">
            Onboarding Progress
          </Typography.Text>
          <div className="mb-2 mt-1 flex items-end justify-between gap-4">
            <Typography.Title level={3} className="!m-0 !font-bold !text-slate-900">
              {progressPercent === 100 ? "100% Complete" : `${progressPercent}%`}
            </Typography.Title>
            <Tag
              color="processing"
              icon={<ReloadOutlined spin />}
              className="!m-0 !border-indigo-200 !bg-indigo-50 !text-indigo-800"
            >
              Refreshes every 30s
            </Tag>
          </div>
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor={{ from: "#6366f1", to: "#8b5cf6" }}
            trailColor="rgba(148, 163, 184, 0.25)"
            className="!mb-4"
          />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
            <span className="text-emerald-700">Agreement Signed</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700">Documents Uploaded</span>
            <span className="text-slate-300">|</span>
            <span
              className={
                status === "under_review" || status === "pending"
                  ? "font-medium text-amber-800"
                  : "text-emerald-700"
              }
            >
              Identity Verification
            </span>
          </div>
        </Card>

        <div className="mb-2 text-center">
          <Typography.Title level={2} className="!mb-2 !text-balance !font-bold !text-slate-900 md:!text-2xl">
            AML/KYC Verification Status
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !text-slate-600">
            Track the progress of your identity verification and anti-money laundering checks.
          </Typography.Paragraph>
        </div>

        {status === "under_review" ? (
          <div className="mb-6 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-900/5 backdrop-blur-sm md:p-6">
            <div className="flex gap-3">
              <ClockCircleOutlined className="!text-2xl !text-amber-600" />
              <div>
                <Typography.Text strong className="!mb-1 !block !text-base !text-amber-950">
                  Manual Review Required
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !leading-relaxed !text-slate-600">
                  Your verification is under manual review. Our compliance team or provider will contact you if
                  anything else is needed.
                </Typography.Paragraph>
                <Typography.Paragraph className="!mb-0 !mt-3 !text-sm !leading-relaxed !text-slate-500">
                  Your application is being reviewed by our compliance team. This process typically takes 1-3 business
                  days. We will notify you via email once the review is complete.
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        ) : status === "rejected" ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/80 p-5 shadow-md md:p-6">
            <div className="flex gap-3">
              <StopOutlined className="!text-2xl !text-rose-600" />
              <div>
                <Typography.Text strong className="!mb-2 !block !text-rose-950">
                  Verification not approved
                </Typography.Text>
                <Alert type="error" showIcon className="!border-rose-200 !bg-white" message="Reason" description={rejectedReason} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-md md:p-6">
            <div className="flex gap-3">
              <SafetyCertificateOutlined className="!text-2xl !text-indigo-600" />
              <div>
                <Typography.Text strong className="!mb-1 !block !text-slate-900">
                  Awaiting document submission
                </Typography.Text>
                <Typography.Paragraph className="!mb-0 !text-slate-600">
                  Upload your verification documents to begin AML/KYC checks.
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        )}

        <Card
          className="!mb-6 !rounded-2xl !border-slate-200/90 !bg-white/95 !shadow-md !shadow-slate-900/5 !backdrop-blur-sm"
          styles={{ body: { padding: "1.25rem 1.5rem" } }}
        >
          <Typography.Title level={5} className="!m-0 !mb-3 !font-bold !text-slate-900">
            What happens next?
          </Typography.Title>
          <ol className="m-0 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            <li>Documents to LedgeX (AML step): firm and personal documents for our records.</li>
            <li>
              Complete onboarding so we can start the regulated check. Use <strong>Start identity verification</strong>{" "}
              below if you are stuck after uploads.
            </li>
            <li>
              <strong>Xama portal:</strong> when you see Open Xama portal, complete identity verification there. That is
              a separate step from uploading to LedgeX.
            </li>
            <li>
              <strong>Manual review</strong> means the provider or our team is reviewing your case — you will not see the
              same &quot;open portal&quot; step unless a link is still offered.
            </li>
            <li>
              This page refreshes every 30 seconds until verification passes or fails.
            </li>
          </ol>
        </Card>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-md backdrop-blur-sm md:p-6">
            <div className="mb-2 flex items-center gap-2">
              <LockOutlined className="!text-amber-600" />
              <Typography.Title level={5} className="!m-0 !font-bold !text-slate-900">
                Dashboard Locked
              </Typography.Title>
            </div>
            <Typography.Paragraph className="!mb-0 !text-slate-600">
              Your dashboard access is currently restricted. Please complete the required actions below.
            </Typography.Paragraph>
          </div>

          <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 p-5 md:p-6">
            <Typography.Text className="!mb-1 !block !font-semibold !text-amber-950">
              Compliance verification in progress
            </Typography.Text>
            <Typography.Paragraph className="!mb-0 !text-sm !text-amber-900/80">
              Your dashboard is locked until compliance verification is complete.
            </Typography.Paragraph>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Typography.Text className="!text-xs !uppercase !tracking-wide !text-slate-500">Required actions</Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-1 !text-sm !text-slate-600">
              {status === "under_review"
                ? "Your case is in manual review. We will notify you when verification is complete."
                : "Submit verification documents and complete any follow-up from our team."}
            </Typography.Paragraph>
          </div>

          <Typography.Paragraph className="!mb-0 !pt-2 !text-center !text-xs !leading-relaxed !text-slate-500">
            Dashboard access is restricted in accordance with our Terms of Service and regulatory compliance requirements.
            All actions are logged for audit purposes.
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  );
}
