import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Layout,
  Result,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import {
  AuditOutlined,
  ClockCircleOutlined,
  StopOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountantProfile } from "../../api/accountant.api";

const { Header, Content } = Layout;

export default function AccountantPendingPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(undefined);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { token } = theme.useToken();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data } = await getAccountantProfile();
        if (!cancelled) setProfile(data.profile ?? null);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    }

    if (!authLoading && user?.role === "accountant") load();
    else if (!authLoading) setLoadingProfile(false);

    return () => {
      cancelled = true;
    };
  }, [authLoading, user?.role]);

  if (authLoading || loadingProfile || (user?.role === "accountant" && profile === undefined)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!user || user.role !== "accountant") {
    return <Navigate to="/login" replace />;
  }

  if (profile === null) {
    return <Navigate to="/accountant/onboarding" replace />;
  }

  const status = profile.status;
  if (status === "APPROVED") {
    return <Navigate to="/dashboard" replace />;
  }

  const isRejected = status === "REJECTED";

  const titleText = isRejected ? "Application not approved" : "Your account is under review";
  const subtitleText = isRejected
    ? "Your accountant application did not meet our criteria at this time."
    : "Thank you for submitting your application. We’ll notify you when there is an update.";

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <Header
        className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-sm"
        style={{ lineHeight: token.lineHeightLG }}
      >
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <AuditOutlined className="text-indigo-600" />
          Ledgex
        </Link>
        <Button type="default" icon={<LogoutOutlined />} onClick={() => logout()}>
          Sign out
        </Button>
      </Header>

      <Content className="flex flex-1 flex-col items-center px-4 py-16">
        <Card className="w-full max-w-lg rounded-2xl border-slate-200/90 shadow-xl shadow-slate-900/[0.06]" bordered={false}>
          <Result
            icon={
              isRejected ? (
                <StopOutlined className="text-amber-500" style={{ fontSize: 72 }} />
              ) : (
                <ClockCircleOutlined className="text-indigo-500" style={{ fontSize: 72 }} />
              )
            }
            title={<span className="text-slate-900">{titleText}</span>}
            subTitle={
              <Typography.Paragraph type="secondary" className="mx-auto mb-4 max-w-md">
                {subtitleText}
              </Typography.Paragraph>
            }
          >
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Typography.Text type="secondary">Status:</Typography.Text>
                <Tag color={isRejected ? "orange" : "processing"}>{status}</Tag>
              </div>

              {isRejected && profile.rejectionReason ? (
                <Alert type="warning" showIcon message="Reason" description={profile.rejectionReason} />
              ) : null}

              <Typography.Paragraph type="secondary" className="mb-0 text-center text-xs">
                Dashboard access is disabled until your application is approved.
              </Typography.Paragraph>

              <Typography.Link href="mailto:support@example.com" className="mx-auto block text-center">
                Contact support
              </Typography.Link>
            </div>
          </Result>
        </Card>
      </Content>
    </Layout>
  );
}
