import React from "react";
import { Navigate } from "react-router-dom";
import { Form, Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useAccountantOnboardingWizard } from "../../hooks/useAccountantOnboardingWizard";
import AccountantOnboardingWizard from "../../components/accountant-onboarding/AccountantOnboardingWizard";

export default function AccountantOnboardingPage() {
  const { user, loading } = useAuth();
  const [form] = Form.useForm();
  const wizard = useAccountantOnboardingWizard(form);

  if (loading) {
    return <Spin className="mx-auto mt-24 block" size="large" />;
  }
  if (user?.role !== "accountant") {
    return <Navigate to="/dashboard" replace />;
  }

  return <AccountantOnboardingWizard form={form} {...wizard} />;
}
