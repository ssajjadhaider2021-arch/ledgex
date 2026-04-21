import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getBusinessProfile, saveBusinessProfileStep3 } from "../../api/businessProfile.api";

const YES_NO = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

function BoolChoice({ id, name, legend, hint, value, onChange, error, disabled }) {
  const legendId = `${id}-legend`;
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 sm:p-6">
      <p id={legendId} className="text-sm font-semibold text-slate-900">
        {legend}
      </p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
      <div role="radiogroup" aria-labelledby={legendId} className="mt-4 space-y-2.5">
        {YES_NO.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={`${name}-${String(o.value)}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition-all duration-200 ${
                selected
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/90 ring-2 ring-blue-500/35 shadow-md shadow-blue-600/10"
                  : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:bg-slate-50/90"
              } ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={String(o.value)}
                checked={selected}
                onChange={() => !disabled && onChange(o.value)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1">{o.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function validateFields(isPayrollActive, isCisRegistered) {
  const errors = {};
  if (isPayrollActive !== true && isPayrollActive !== false) {
    errors.isPayrollActive = "Please choose Yes or No.";
  }
  if (isCisRegistered !== true && isCisRegistered !== false) {
    errors.isCisRegistered = "Please choose Yes or No.";
  }
  return errors;
}

export default function BusinessProfileStep3Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isPayrollActive, setIsPayrollActive] = useState(null);
  const [payeReference, setPayeReference] = useState("");
  const [isCisRegistered, setIsCisRegistered] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [priorStepsComplete, setPriorStepsComplete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const errs = validateFields(isPayrollActive, isCisRegistered);
    return Object.keys(errs).length === 0;
  }, [isPayrollActive, isCisRegistered]);

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
        const ok = Boolean(p?.clientType) && Number(p?.completedStep ?? 0) >= 3;
        setPriorStepsComplete(ok);
        if (!p) return;
        if (p.isPayrollActive === true || p.isPayrollActive === false) setIsPayrollActive(p.isPayrollActive);
        if (p.payeReference) setPayeReference(String(p.payeReference));
        if (p.isCisRegistered === true || p.isCisRegistered === false) setIsCisRegistered(p.isCisRegistered);
      } catch {
        setPriorStepsComplete(false);
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
      const errs = validateFields(isPayrollActive, isCisRegistered);
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setSubmitting(true);
      try {
        await saveBusinessProfileStep3({
          isPayrollActive,
          payeReference: payeReference.trim() || undefined,
          isCisRegistered,
        });
        setFieldErrors({});
        navigate("/business-profile/step4", { replace: true });
      } catch (err) {
        setFormError(err.response?.data?.message || err.message || "Could not save");
      } finally {
        setSubmitting(false);
      }
    },
    [isPayrollActive, payeReference, isCisRegistered, navigate]
  );

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (loadingProfile || priorStepsComplete === null) return null;
  if (!priorStepsComplete) return <Navigate to="/business-profile/step2" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-16 text-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Business profile</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Step 3 — Other registration
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Payroll and CIS registration. Answer Yes or No for each question; PAYE reference is optional.
          </p>
          <Link
            to="/business-profile/step2"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to step 2
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
            <BoolChoice
              id="bp-payroll-active"
              name="isPayrollActive"
              legend="Payroll active"
              hint="Do you run payroll and operate PAYE for employees?"
              value={isPayrollActive}
              onChange={(v) => {
                setIsPayrollActive(v);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.isPayrollActive;
                  return next;
                });
              }}
              error={fieldErrors.isPayrollActive}
              disabled={submitting || loadingProfile}
            />

            <div>
              <label htmlFor="payeReference" className="block text-sm font-semibold text-slate-900">
                PAYE reference <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">Employer PAYE scheme reference, if you have one.</p>
              <input
                id="payeReference"
                type="text"
                autoComplete="off"
                value={payeReference}
                onChange={(e) => setPayeReference(e.target.value)}
                disabled={submitting || loadingProfile}
                placeholder="e.g. 123/AB45678"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60"
              />
            </div>

            <BoolChoice
              id="bp-cis-registered"
              name="isCisRegistered"
              legend="CIS registered"
              hint="Are you registered under the Construction Industry Scheme as a contractor or subcontractor?"
              value={isCisRegistered}
              onChange={(v) => {
                setIsCisRegistered(v);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.isCisRegistered;
                  return next;
                });
              }}
              error={fieldErrors.isCisRegistered}
              disabled={submitting || loadingProfile}
            />
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
