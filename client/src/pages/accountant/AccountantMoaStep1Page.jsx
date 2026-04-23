import React from "react";
import { Navigate } from "react-router-dom";
import { Card, Spin, Steps, Tag, Typography } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { accountantMOA_v1 } from "../../content/moa_accountant_v1";
import { useAgreementScrolledToEnd } from "../../hooks/useAgreementScrolledToEnd";
import AccountantMoaAgreementBody from "../../components/accountant-moa/AccountantMoaAgreementBody";
import AccountantMoaSignForm from "../../components/accountant-moa/AccountantMoaSignForm";

export default function AccountantMoaStep1Page() {
  const { user, loading } = useAuth();
  const { scrollRef, reachedEnd, onScroll } = useAgreementScrolledToEnd();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  if (!user || user.role !== "accountant") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Typography.Title level={3} className="mb-6 text-center">
          Accountant onboarding
        </Typography.Title>
        <Steps
          current={0}
          items={[{ title: "Agreement" }, { title: "Details" }, { title: "Review" }]}
          className="mb-8 px-2"
        />
        <Card className="rounded-2xl border-slate-200/90 shadow-lg">
          <Typography.Text type="secondary" className="mb-4 block text-center">
            Step 1 of 3 · Master Accountant Onboarding Agreement
          </Typography.Text>
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              reachedEnd ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="font-medium">
                Please read this agreement carefully. You will be able to proceed after scrolling to the bottom.
              </span>
              <Tag color={reachedEnd ? "green" : "orange"} className="!mr-0">
                {reachedEnd ? "Unlocked" : "Locked"}
              </Tag>
            </div>
            <Typography.Text className={reachedEnd ? "!text-emerald-700" : "!text-amber-700"}>
              {reachedEnd
                ? "Great, you can now complete the checklist and sign."
                : "Checklist and signing are disabled until you reach the end of the agreement."}
            </Typography.Text>
          </div>
          <AccountantMoaAgreementBody moa={accountantMOA_v1} scrollRef={scrollRef} onScroll={onScroll} />
          <AccountantMoaSignForm scrollComplete={reachedEnd} />
        </Card>
      </div>
    </div>
  );
}
