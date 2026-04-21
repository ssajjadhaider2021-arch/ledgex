import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getBusinessProfile, saveBusinessProfileStep4 } from "../../api/businessProfile.api";

function validateFields(accountsStartDate, directors) {
  const errors = {};
  if (!String(accountsStartDate || "").trim()) {
    errors.accountsStartDate = "Choose the accounts start date.";
  }
  const names = directors.map((s) => String(s || "").trim()).filter(Boolean);
  if (names.length < 1) {
    errors.directors = "Add at least one director or partner.";
  }
  return errors;
}

export default function BusinessProfileStep4Page() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [accountsStartDate, setAccountsStartDate] = useState("");
  const [directors, setDirectors] = useState([]);
  const [directorDraft, setDirectorDraft] = useState("");
  const [hasFixedAssets, setHasFixedAssets] = useState(false);
  const [hasDirectorsLoanAccount, setHasDirectorsLoanAccount] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [priorStepsComplete, setPriorStepsComplete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const errs = validateFields(accountsStartDate, directors);
    return Object.keys(errs).length === 0;
  }, [accountsStartDate, directors]);

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
        const ok = Boolean(p?.clientType) && Number(p?.completedStep ?? 0) >= 4;
        setPriorStepsComplete(ok);
        if (!p) return;
        if (p.accountsStartDate) {
          const raw = String(p.accountsStartDate);
          setAccountsStartDate(raw.slice(0, 10));
        }
        if (Array.isArray(p.directors) && p.directors.length > 0) {
          setDirectors(p.directors.map((x) => String(x).trim()).filter(Boolean));
        }
        if (p.hasFixedAssets === true || p.hasFixedAssets === false) setHasFixedAssets(p.hasFixedAssets);
        if (p.hasDirectorsLoanAccount === true || p.hasDirectorsLoanAccount === false) {
          setHasDirectorsLoanAccount(p.hasDirectorsLoanAccount);
        }
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

  const commitDirector = () => {
    const name = directorDraft.trim();
    if (!name) return;
    setDirectors((list) => [...list, name]);
    setDirectorDraft("");
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.directors;
      return next;
    });
  };

  const removeDirectorAt = (index) => {
    setDirectors((list) => list.filter((_, i) => i !== index));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.directors;
      return next;
    });
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setFormError("");
      const errs = validateFields(accountsStartDate, directors);
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) return;

      const directorsPayload = directors.map((s) => String(s || "").trim()).filter(Boolean);

      setSubmitting(true);
      try {
        await saveBusinessProfileStep4({
          accountsStartDate,
          directors: directorsPayload,
          hasFixedAssets,
          hasDirectorsLoanAccount,
        });
        setFieldErrors({});
        navigate("/dashboard", { replace: true });
      } catch (err) {
        setFormError(err.response?.data?.message || err.message || "Could not save");
      } finally {
        setSubmitting(false);
      }
    },
    [accountsStartDate, directors, hasFixedAssets, hasDirectorsLoanAccount, navigate]
  );

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  if (loadingProfile || priorStepsComplete === null) return null;
  if (!priorStepsComplete) return <Navigate to="/business-profile/step3" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-16 text-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Business profile</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Step 4 — Bookkeeping</h1>
          <p className="mt-2 text-sm text-slate-600">
            Accounts period, directors or partners, and fixed assets / director loan disclosure.
          </p>
          <Link
            to="/business-profile/step3"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to step 3
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
            <div>
              <label htmlFor="accountsStartDate" className="block text-sm font-semibold text-slate-900">
                Accounts start date <span className="text-red-600">*</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">Start date of your accounting period.</p>
              <input
                id="accountsStartDate"
                type="date"
                value={accountsStartDate}
                onChange={(e) => {
                  setAccountsStartDate(e.target.value);
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.accountsStartDate;
                    return next;
                  });
                }}
                disabled={submitting || loadingProfile}
                className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60 ${
                  fieldErrors.accountsStartDate ? "border-red-300" : "border-slate-200 focus:border-blue-500"
                }`}
              />
              {fieldErrors.accountsStartDate ? (
                <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.accountsStartDate}</p>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Directors / partners <span className="text-red-600">*</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">Add each name, then press Add. At least one required.</p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                  id="directorDraft"
                  type="text"
                  value={directorDraft}
                  onChange={(e) => setDirectorDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitDirector();
                    }
                  }}
                  disabled={submitting || loadingProfile}
                  placeholder="Full name"
                  autoComplete="name"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={commitDirector}
                  disabled={submitting || loadingProfile || !directorDraft.trim()}
                  className="shrink-0 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                >
                  Add director / partner
                </button>
              </div>

              {directors.length > 0 ? (
                <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
                  {directors.map((name, index) => (
                    <li
                      key={`director-row-${index}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-slate-900 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <span className="min-w-0 truncate">{name}</span>
                      <button
                        type="button"
                        onClick={() => removeDirectorAt(index)}
                        disabled={submitting || loadingProfile}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-slate-400">No directors added yet.</p>
              )}

              {fieldErrors.directors ? (
                <p className="mt-2 text-xs font-medium text-red-600">{fieldErrors.directors}</p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
              <input
                type="checkbox"
                checked={hasFixedAssets}
                onChange={(e) => setHasFixedAssets(e.target.checked)}
                disabled={submitting || loadingProfile}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">Fixed assets</span>
                <span className="mt-1 block text-xs text-slate-600">
                  Tick if the business holds significant fixed assets (e.g. property, vehicles, machinery).
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
              <input
                type="checkbox"
                checked={hasDirectorsLoanAccount}
                onChange={(e) => setHasDirectorsLoanAccount(e.target.checked)}
                disabled={submitting || loadingProfile}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">Director&apos;s loan account</span>
                <span className="mt-1 block text-xs text-slate-600">
                  Tick if there is (or will be) a director&apos;s loan account.
                </span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || loadingProfile || !isValid}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Complete profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
