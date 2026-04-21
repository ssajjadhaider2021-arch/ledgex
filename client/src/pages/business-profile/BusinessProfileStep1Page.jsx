import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getBusinessProfile, saveBusinessProfileStep1 } from "../../api/businessProfile.api";

const CLIENT_TYPE_OPTIONS = [
  { value: "ltd", label: "Limited Company LTD" },
  { value: "llp", label: "Limited Liability Partnership LLP" },
  { value: "sole_trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "landlord", label: "Landlord" },
];

const COMPANIES_HOUSE_REGEX = /^[A-Z]{2}[0-9]{6}$/;
const UTR_REGEX = /^[0-9]{10}$/;

function normalizeCompaniesHouseNumber(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function normalizeUtrDigits(raw) {
  return String(raw || "").replace(/\D/g, "").slice(0, 10);
}

function validateFields(clientType, companiesHouseNumber, utrDigits) {
  const errors = {};
  if (!clientType) {
    errors.clientType = "Select a business type.";
  }
  if (!UTR_REGEX.test(utrDigits)) {
    errors.utrNumber = "Enter exactly 10 digits.";
  }
  if (clientType === "ltd") {
    const ch = normalizeCompaniesHouseNumber(companiesHouseNumber);
    if (!ch) {
      errors.companiesHouseNumber = "Companies House number is required for a limited company.";
    } else if (!COMPANIES_HOUSE_REGEX.test(ch)) {
      errors.companiesHouseNumber = "Use format SC123456 (two letters then six digits).";
    }
  }
  return errors;
}

export default function BusinessProfileStep1Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [clientType, setClientType] = useState("");
  const [companiesHouseNumber, setCompaniesHouseNumber] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const showCompaniesHouse = clientType === "ltd";

  const utrDigits = useMemo(() => normalizeUtrDigits(utrNumber), [utrNumber]);

  const isValid = useMemo(() => {
    const errs = validateFields(clientType, companiesHouseNumber, utrDigits);
    return Object.keys(errs).length === 0;
  }, [clientType, companiesHouseNumber, utrDigits]);

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
        if (!p) return;
        if (p.clientType) setClientType(p.clientType);
        if (p.companiesHouseNumber) setCompaniesHouseNumber(p.companiesHouseNumber);
        if (p.utrNumber) setUtrNumber(String(p.utrNumber));
      } catch {
        /* ignore */
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
      const errs = validateFields(clientType, companiesHouseNumber, utrDigits);
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setSubmitting(true);
      try {
        const chNormalized = normalizeCompaniesHouseNumber(companiesHouseNumber);
        await saveBusinessProfileStep1({
          clientType,
          utrNumber: utrDigits,
          ...(clientType === "ltd" ? { companiesHouseNumber: chNormalized } : {}),
        });
        setFieldErrors({});
        navigate("/business-profile/step2", { replace: true });
      } catch (err) {
        setFormError(err.response?.data?.message || err.message || "Could not save");
      } finally {
        setSubmitting(false);
      }
    },
    [clientType, companiesHouseNumber, utrDigits, navigate]
  );

  const onChangeClientType = (v) => {
    setClientType(v);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.clientType;
      if (v !== "ltd") delete next.companiesHouseNumber;
      return next;
    });
    setFormError("");
    if (v !== "ltd") setCompaniesHouseNumber("");
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-16 text-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Business profile</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Step 1 — Business type &amp; company details
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Tell us how your business is structured. Fields marked required must be completed before you continue.
          </p>
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
            <div>
              <label htmlFor="clientType" className="block text-sm font-semibold text-slate-900">
                Business type <span className="text-red-600">*</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">How your business is registered with HMRC and Companies House.</p>
              <div className="relative mt-2">
                <select
                  id="clientType"
                  value={clientType}
                  onChange={(e) => onChangeClientType(e.target.value)}
                  disabled={submitting || loadingProfile}
                  className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                    fieldErrors.clientType ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select business type…</option>
                  {CLIENT_TYPE_OPTIONS.map((o) => (
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
              {fieldErrors.clientType ? (
                <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.clientType}</p>
              ) : null}
            </div>

            {showCompaniesHouse ? (
              <div>
                <label htmlFor="companiesHouseNumber" className="block text-sm font-semibold text-slate-900">
                  Companies House number <span className="text-red-600">*</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Two letters followed by six digits (e.g. SC123456).
                </p>
                <input
                  id="companiesHouseNumber"
                  type="text"
                  autoComplete="off"
                  value={companiesHouseNumber}
                  onChange={(e) => {
                    setCompaniesHouseNumber(e.target.value.toUpperCase());
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next.companiesHouseNumber;
                      return next;
                    });
                  }}
                  disabled={submitting || loadingProfile}
                  placeholder="SC123456"
                  className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm uppercase text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                    fieldErrors.companiesHouseNumber ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
                {fieldErrors.companiesHouseNumber ? (
                  <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.companiesHouseNumber}</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="utrNumber" className="block text-sm font-semibold text-slate-900">
                Unique Taxpayer Reference (UTR) <span className="text-red-600">*</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">Exactly 10 digits.</p>
              <input
                id="utrNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(normalizeUtrDigits(e.target.value));
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.utrNumber;
                    return next;
                  });
                }}
                disabled={submitting || loadingProfile}
                placeholder="1234567890"
                maxLength={10}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm tracking-widest text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                  fieldErrors.utrNumber ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {fieldErrors.utrNumber ? (
                <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.utrNumber}</p>
              ) : null}
            </div>
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
