import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/auth.api";
import { useAuth } from "../contexts/AuthContext";
import { Step1Agreement } from "../components/onboarding/steps/Step1Agreement";
import { Step2AML } from "../components/onboarding/steps/Step2AML";
import { Step3Complete } from "../components/onboarding/steps/Step3Complete";

function clampStep(n) {
  return Math.min(Math.max(Number(n) || 1, 1), 3);
}

function ProgressBar({ step }) {
  const items = [
    { n: 1, label: "Step 1" },
    { n: 2, label: "Step 2" },
    { n: 3, label: "Step 3" },
  ];
  return (
    <div className="mb-10 flex w-full max-w-md flex-wrap items-start justify-center gap-2 sm:flex-nowrap">
      {items.map(({ n, label }, i) => (
        <React.Fragment key={n}>
          <div className="flex min-w-[4.5rem] flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                step >= n
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {n}
            </div>
            <span
              className={`text-center text-xs font-medium ${
                step >= n ? "text-indigo-700" : "text-slate-500"
              }`}
            >
              {label}
            </span>
          </div>
          {i < 2 && (
            <div
              className={`mt-5 hidden h-0.5 w-10 rounded-full sm:block sm:w-12 ${
                step > n ? "bg-indigo-500" : "bg-slate-200"
              }`}
              aria-hidden
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  const refreshStepFromServer = useCallback(async () => {
    const { data } = await getMe();
    if (data.onboardingCompleted) {
      navigate("/dashboard", { replace: true });
      return;
    }
    setStep(clampStep(data.onboardingStep));
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const { data } = await getMe();
        if (cancelled) return;
        if (data.role && data.role !== "client") {
          navigate("/dashboard", { replace: true });
          return;
        }
        if (data.onboardingCompleted) {
          navigate("/dashboard", { replace: true });
          return;
        }
        setStep(clampStep(data.onboardingStep));
      } catch {
        if (!cancelled) navigate("/login", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const afterSubStep = useCallback(async () => {
    await loadUser();
    await refreshStepFromServer();
  }, [loadUser, refreshStepFromServer]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/70 to-sky-100">
        <p className="text-sm font-medium text-slate-600">Loading onboarding…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/70 to-sky-100 px-4 py-12 text-slate-900">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600/90">Ledgex</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Client onboarding</h1>
        </div>

        <div className="w-full rounded-2xl border border-white/60 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-md">
          <ProgressBar step={step} />

          {error && (
            <div
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}

          {step === 1 && <Step1Agreement onSuccess={afterSubStep} onError={(msg) => setError(msg)} />}
          {step === 2 && <Step2AML onSuccess={afterSubStep} onError={(msg) => setError(msg)} />}
          {step === 3 && <Step3Complete onError={(msg) => setError(msg)} />}
        </div>
      </div>
    </div>
  );
}
