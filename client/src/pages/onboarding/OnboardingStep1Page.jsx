import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { onboardingStep1 } from "../../api/onboarding.api";
import { OnboardingStepsProgress } from "../../components/onboarding/OnboardingStepsProgress";
import {
  OnboardingSuccessOverlay,
  InlineSubmitSpinner,
} from "../../components/onboarding/OnboardingSuccessOverlay";
import {
  AGREEMENT_CHECKBOX_KEYS,
  MANDATORY_CONFIRMATION_ITEMS,
} from "../../constants/onboardingStep1Agreement";
import { MOA_CONTENT } from "../../content/moa_v1";

const SUCCESS_HOLD_MS = 820;
/** px tolerance for “at bottom” / subpixel layouts */
const SCROLL_BOTTOM_THRESHOLD = 12;

const INITIAL_MANDATORY = Object.fromEntries(
  MANDATORY_CONFIRMATION_ITEMS.map(({ id }) => [id, false])
);

function allMandatoryConfirmed(mandatory) {
  return MANDATORY_CONFIRMATION_ITEMS.every(({ id }) => mandatory[id] === true);
}

function buildStep1Payload(mandatory, fullNameTrimmed) {
  const accepted = allMandatoryConfirmed(mandatory);
  const payload = {
    agreementVersion: "v1.0",
    fullName: fullNameTrimmed,
    signature: fullNameTrimmed,
  };
  for (const key of AGREEMENT_CHECKBOX_KEYS) {
    payload[key] = accepted;
  }
  return payload;
}

export default function OnboardingStep1Page() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [mandatory, setMandatory] = useState(INITIAL_MANDATORY);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const agreementScrollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "client") {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (user.onboardingStep >= 2) {
      navigate("/onboarding/step2", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const el = agreementScrollRef.current;
    if (!el) return;

    const syncScrollState = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const fitsWithoutScrolling = scrollHeight <= clientHeight + SCROLL_BOTTOM_THRESHOLD;
      const reachedBottom =
        fitsWithoutScrolling || scrollHeight - scrollTop - clientHeight <= SCROLL_BOTTOM_THRESHOLD;
      if (reachedBottom) setScrolledToBottom(true);
    };

    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    const ro = new ResizeObserver(() => syncScrollState());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      ro.disconnect();
    };
  }, []);

  const allMandatoryTrue = useMemo(() => allMandatoryConfirmed(mandatory), [mandatory]);

  const fullNameOk = fullName.trim().length > 0;
  const fieldsReady = allMandatoryTrue && fullNameOk;
  const disableSubmit = !fieldsReady || submitting || showSuccess;

  if (!user) return null;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;

  const toggleMandatory = (id) => {
    setMandatory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!scrolledToBottom) {
      setError("Please scroll to the bottom of the agreement before accepting.");
      return;
    }
    if (!allMandatoryTrue) {
      setError("Please tick every mandatory confirmation before continuing.");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full legal name.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildStep1Payload(mandatory, fullName.trim());
      await onboardingStep1(payload);
      await loadUser();
      setSubmitting(false);
      setShowSuccess(true);
      await new Promise((r) => setTimeout(r, SUCCESS_HOLD_MS));
      navigate("/onboarding/step2");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Request failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-36 text-slate-900">
      <OnboardingSuccessOverlay visible={showSuccess} message="Agreement saved" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Ledgex</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Onboarding — Step 1: Agreement
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Review the agreement, confirm each declaration, then enter your full legal name to continue.
          </p>
        </header>

        <OnboardingStepsProgress activeStep={1} />

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5">
          <div className="border-b border-slate-100 px-6 py-4 sm:px-8">
            <h2 className="text-sm font-semibold text-slate-800">Master Onboarding Agreement</h2>
            <p className="mt-0.5 text-xs text-slate-500">Scroll to read all sections before accepting.</p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div
              ref={agreementScrollRef}
              className="max-h-[400px] overflow-y-scroll whitespace-pre-wrap rounded-lg border bg-white p-4 text-sm leading-relaxed text-slate-700"
              role="region"
              aria-label="Master Onboarding Agreement full text"
            >
              {MOA_CONTENT}
            </div>
          </div>

          <form
            id="step1-main-form"
            onSubmit={handleSubmit}
            className="border-t border-slate-100 px-6 py-6 sm:px-8 sm:py-8"
          >
            {error && (
              <div
                className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            )}

            <fieldset disabled={!scrolledToBottom || submitting || showSuccess}>
              <legend className="mb-3 text-base font-semibold text-slate-900">Mandatory Confirmations</legend>
              {!scrolledToBottom && (
                <p className="mb-3 text-xs text-amber-800">
                  Scroll to the bottom of the agreement above to enable these checkboxes.
                </p>
              )}
              <ul className="list-none space-y-3 p-0">
                {MANDATORY_CONFIRMATION_ITEMS.map(({ id, label }) => (
                  <li key={id}>
                    <label
                      className={`flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-slate-200 hover:bg-slate-50 ${
                        scrolledToBottom && !submitting && !showSuccess
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={mandatory[id] === true}
                        onChange={() => toggleMandatory(id)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm leading-snug text-slate-800">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>

            <div className="mt-8 border-t border-slate-100 pt-8">
              <h2 className="text-sm font-semibold text-slate-900">Full name</h2>
              <p className="mt-1 text-xs text-slate-500">
                Enter your full legal name as it appears on official documents.
              </p>
              <label htmlFor="step1-full-name" className="mt-4 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="step1-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="e.g. Jane Alice Smith"
                disabled={submitting || showSuccess}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/90 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <p className="text-center text-xs text-slate-500 sm:flex-1 sm:text-left">
            {showSuccess
              ? "Success — continuing…"
              : submitting
                ? "Saving your agreement…"
                : !scrolledToBottom
                  ? "Scroll to the end of the agreement to enable confirmations."
                  : fieldsReady
                    ? "Ready to continue to Step 2."
                    : "Complete every mandatory confirmation and enter your full name to enable submit."}
          </p>
          <button
            type="submit"
            form="step1-main-form"
            disabled={disableSubmit}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto sm:min-w-[200px]"
          >
            {submitting ? (
              <>
                <InlineSubmitSpinner />
                Saving…
              </>
            ) : (
              "Accept & Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
