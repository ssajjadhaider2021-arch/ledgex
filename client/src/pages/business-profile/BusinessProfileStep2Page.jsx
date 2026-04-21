import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getBusinessProfile, saveBusinessProfileStep2 } from "../../api/businessProfile.api";

const VAT_FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

function validateFields(isVatRegistered, vatNumber, vatFilingFrequency) {
  const errors = {};
  if (isVatRegistered) {
    const vn = String(vatNumber || "").trim();
    if (!vn) {
      errors.vatNumber = "VAT number is required when you are VAT registered.";
    }
    if (!vatFilingFrequency || !VAT_FREQUENCY_OPTIONS.some((o) => o.value === vatFilingFrequency)) {
      errors.vatFilingFrequency = "Select how often you file VAT returns.";
    }
  }
  return errors;
}

export default function BusinessProfileStep2Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isVatRegistered, setIsVatRegistered] = useState(false);
  const [vatNumber, setVatNumber] = useState("");
  const [vatFilingFrequency, setVatFilingFrequency] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [step1Complete, setStep1Complete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const errs = validateFields(isVatRegistered, vatNumber, vatFilingFrequency);
    return Object.keys(errs).length === 0;
  }, [isVatRegistered, vatNumber, vatFilingFrequency]);

  useEffect(() => {
    if (!user || user.role !== "client") {
      setLoadingProfile(false);
      return;
    }
    let cancelled = false;
    setLoadingProfile(true);
    (async () => {
      try {
        const { data } = await getBusinessProfile();
        if (cancelled) return;
        const p = data.profile;
        setStep1Complete(Boolean(p?.clientType));
        if (!p) return;
        if (p.isVatRegistered === true || p.isVatRegistered === false) {
          setIsVatRegistered(p.isVatRegistered);
        }
        if (p.vatNumber) setVatNumber(String(p.vatNumber));
        if (p.vatFilingFrequency) setVatFilingFrequency(p.vatFilingFrequency);
      } catch {
        setStep1Complete(false);
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError("");
      const errs = validateFields(isVatRegistered, vatNumber, vatFilingFrequency);
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setSubmitting(true);
      try {
        await saveBusinessProfileStep2({
          isVatRegistered,
          ...(isVatRegistered
            ? {
                vatNumber: vatNumber.trim(),
                vatFilingFrequency,
              }
            : {}),
        });
        setFieldErrors({});
        navigate("/business-profile/step3", { replace: true });
      } catch (err) {
        setFormError(err.response?.data?.message || err.message || "Could not save");
      } finally {
        setSubmitting(false);
      }
    },
    [isVatRegistered, vatNumber, vatFilingFrequency, navigate]
  );

  const toggleVat = (checked) => {
    setIsVatRegistered(checked);
    if (!checked) {
      setVatNumber("");
      setVatFilingFrequency("");
    }
    setFieldErrors({});
    setFormError("");
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (loadingProfile || step1Complete === null) return null;
  if (!step1Complete) return <Navigate to="/business-profile/step1" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-16 text-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Business profile</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Step 2 — VAT</h1>
          <p className="mt-2 text-sm text-slate-600">
            VAT registration details for your business. You can change this later if your situation changes.
          </p>
          <Link
            to="/business-profile/step1"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to step 1
          </Link>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/[0.06] ring-1 ring-slate-900/5 sm:p-8"
        >
          {formError ? (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {formError}
            </div>
          ) : null}

          <div className="space-y-6">
            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-slate-300 sm:p-5">
              <input
                type="checkbox"
                checked={isVatRegistered}
                onChange={(e) => toggleVat(e.target.checked)}
                disabled={submitting || loadingProfile}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">VAT registered</span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                  Tick if your business is registered for VAT with HMRC.
                </span>
              </span>
            </label>

            {isVatRegistered ? (
              <>
                <div>
                  <label htmlFor="vatNumber" className="block text-sm font-semibold text-slate-900">
                    VAT number <span className="text-red-600">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500">As shown on your VAT certificate or HMRC account.</p>
                  <input
                    id="vatNumber"
                    type="text"
                    autoComplete="off"
                    value={vatNumber}
                    onChange={(e) => {
                      setVatNumber(e.target.value);
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.vatNumber;
                        return next;
                      });
                    }}
                    disabled={submitting || loadingProfile}
                    placeholder="e.g. GB123456789"
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                      fieldErrors.vatNumber ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                    }`}
                  />
                  {fieldErrors.vatNumber ? (
                    <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.vatNumber}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="vatFilingFrequency" className="block text-sm font-semibold text-slate-900">
                    VAT filing frequency <span className="text-red-600">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500">How often you submit VAT returns.</p>
                  <div className="relative mt-2">
                    <select
                      id="vatFilingFrequency"
                      value={vatFilingFrequency}
                      onChange={(e) => {
                        setVatFilingFrequency(e.target.value);
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.vatFilingFrequency;
                          return next;
                        });
                      }}
                      disabled={submitting || loadingProfile}
                      className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                        fieldErrors.vatFilingFrequency ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                      }`}
                    >
                      <option value="">Select frequency…</option>
                      {VAT_FREQUENCY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                  {fieldErrors.vatFilingFrequency ? (
                    <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.vatFilingFrequency}</p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting || loadingProfile || !isValid}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
