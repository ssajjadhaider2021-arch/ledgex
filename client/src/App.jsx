import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAdmin from "./components/RequireAdmin";
import RequireAccountantVerificationApproved from "./components/RequireAccountantVerificationApproved";
import RequireOnboardingComplete from "./components/RequireOnboardingComplete";
import GlobalFooter from "./components/GlobalFooter";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyPage from "./pages/auth/VerifyPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardPlaceholder from "./pages/dashboard/DashboardPlaceholder";
import OnboardingRedirect from "./pages/onboarding/OnboardingRedirect";
import OnboardingStep1Page from "./pages/onboarding/OnboardingStep1Page";
import OnboardingStep2Page from "./pages/onboarding/OnboardingStep2Page";
import OnboardingStep3Page from "./pages/onboarding/OnboardingStep3Page";
import OnboardingPage from "./pages/OnboardingPage";
import BusinessProfileStep1Page from "./pages/business-profile/BusinessProfileStep1Page";
import BusinessProfileStep2Page from "./pages/business-profile/BusinessProfileStep2Page";
import BusinessProfileStep3Page from "./pages/business-profile/BusinessProfileStep3Page";
import BusinessProfileStep4Page from "./pages/business-profile/BusinessProfileStep4Page";
import BusinessProfileRedirect from "./pages/business-profile/BusinessProfileRedirect";
import HowItWorksPage from "./pages/marketing/HowItWorksPage";
import PricingPage from "./pages/marketing/PricingPage";
import PartnerPage from "./pages/marketing/PartnerPage";
import ToolPage from "./pages/marketing/ToolPage";
import GuidesPage from "./pages/marketing/GuidesPage";
import LegalDocumentPage from "./pages/marketing/LegalDocumentPage";
import AccountantOnboardingPage from "./pages/accountant/AccountantOnboardingPage";
import AccountantPendingPage from "./pages/accountant/AccountantPendingPage";
import AccountantMoaStep1Page from "./pages/accountant/AccountantMoaStep1Page";
import AccountantVerificationDocumentsPage from "./pages/accountant/AccountantVerificationDocumentsPage";
import AccountantVerificationStatusPage from "./pages/accountant/AccountantVerificationStatusPage";
import AdminAccountantsPage from "./pages/admin/AdminAccountantsPage";
import OnboardingStatusPage from "./pages/onboarding/OnboardingStatusPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/partner" element={<PartnerPage />} />
              <Route path="/tool" element={<ToolPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/legal/:slug" element={<LegalDocumentPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin/accountants"
                element={
                  <ProtectedRoute>
                    <RequireAdmin>
                      <AdminAccountantsPage />
                    </RequireAdmin>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accountant/onboarding"
                element={
                  <ProtectedRoute>
                    <AccountantOnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accountant/pending"
                element={
                  <ProtectedRoute>
                    <AccountantPendingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/accountant/step1"
                element={
                  <ProtectedRoute>
                    <AccountantMoaStep1Page />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accountant/verification-documents"
                element={
                  <ProtectedRoute>
                    <AccountantVerificationDocumentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accountant/verification-status"
                element={
                  <ProtectedRoute>
                    <AccountantVerificationStatusPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding-status"
                element={
                  <ProtectedRoute>
                    <OnboardingStatusPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/step1"
                element={
                  <ProtectedRoute>
                    <OnboardingStep1Page />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/step2"
                element={
                  <ProtectedRoute>
                    <OnboardingStep2Page />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding/step3"
                element={
                  <ProtectedRoute>
                    <OnboardingStep3Page />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding-page"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <RequireAccountantVerificationApproved>
                        <DashboardLayout />
                      </RequireAccountantVerificationApproved>
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<DashboardPlaceholder title="Profile" />} />
                <Route path="accountant" element={<DashboardPlaceholder title="Accountant" />} />
                <Route path="complaints" element={<DashboardPlaceholder title="Complaints" />} />
                <Route path="companies" element={<DashboardPlaceholder title="Companies" />} />
                <Route path="settings" element={<DashboardPlaceholder title="Settings" />} />
              </Route>
              <Route
                path="/business-profile"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <BusinessProfileRedirect />
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-profile/step1"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <BusinessProfileStep1Page />
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-profile/step2"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <BusinessProfileStep2Page />
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-profile/step3"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <BusinessProfileStep3Page />
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-profile/step4"
                element={
                  <ProtectedRoute>
                    <RequireOnboardingComplete>
                      <BusinessProfileStep4Page />
                    </RequireOnboardingComplete>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <GlobalFooter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
