import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingComplete } from "../../../api/onboarding.api";
import { useAuth } from "../../../contexts/AuthContext";

function SuccessIcon() {
  return (
    <div
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-50"
      aria-hidden
    >
      <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

/**
 * @param {object} [props]
 * @param {(msg: string) => void} [props.onError]
 */
export function Step3Complete({ onError }) {
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleGoToDashboard = async () => {
    setLocalError("");
    onError?.("");
    setBusy(true);
    try {
      await onboardingComplete();
      await loadUser();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Request failed";
      setLocalError(msg);
      onError?.(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-emerald-100/80 bg-white p-8 text-center shadow-lg shadow-emerald-900/5 sm:p-10">
      <SuccessIcon />

      <h2 className="mt-8 text-2xl font-bold tracking-tight text-slate-900">Onboarding Complete 🎉</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Your profile is ready. Continue to your dashboard to get started.
      </p>

      {localError && !onError && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {localError}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoToDashboard}
        disabled={busy}
        className="mt-8 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Opening dashboard…" : "Go to Dashboard"}
      </button>
    </div>
  );
}
