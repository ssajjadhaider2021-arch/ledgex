import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import AccountantVerificationDocumentsForm from "../../components/accountant-onboarding/AccountantVerificationDocumentsForm";

export default function AccountantVerificationDocumentsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spin className="mx-auto mt-24 block" size="large" />;
  }
  if (user?.role !== "accountant") {
    return <Navigate to="/dashboard" replace />;
  }

  return <AccountantVerificationDocumentsForm />;
}
