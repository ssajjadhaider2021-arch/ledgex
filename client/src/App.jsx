import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/login" element={<LoginPage />} />
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
                      <DashboardLayout />
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
