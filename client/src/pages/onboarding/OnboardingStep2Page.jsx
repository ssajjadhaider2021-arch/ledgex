import React, { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { onboardingStep2 } from "../../api/onboarding.api";
import { OnboardingStepsProgress } from "../../components/onboarding/OnboardingStepsProgress";
import {
  OnboardingSuccessOverlay,
  InlineSubmitSpinner,
} from "../../components/onboarding/OnboardingSuccessOverlay";

const SUCCESS_HOLD_MS = 850;

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png";
const ACCEPT_EXT = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

const DOCS = [
  {
    key: "idDocument",
    label: "Passport / Driving licence",
    description: "Government-issued photo ID",
    icon: "id",
  },
  {
    key: "addressProof",
    label: "Proof of address",
    description: "Dated within the last 3 months where possible",
    icon: "home",
  },
  {
    key: "businessEvidence",
    label: "Business evidence",
    description: "Companies House extract, bank letter, or similar",
    icon: "briefcase",
  },
];

function DocIcon({ name }) {
  const cls = "h-10 w-10 text-slate-400";
  if (name === "id") {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25V6.75z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM7.5 15.75h9v-.75a3 3 0 00-3-3h-3a3 3 0 00-3 3v.75z" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.266-.333c-1.062 0-2.113.034-3.15.1m-3.15.1a48.114 48.114 0 00-3.266.333c-1.069.16-1.837 1.094-1.837 2.175v4.126c0 .654.293 1.254.768 1.661m13.5 0a2.18 2.18 0 01-.75 1.661m0 0a48.11 48.11 0 01-3.478.397m3.478-.397a48.11 48.11 0 00-3.478-.397m0 0A48.11 48.11 0 013.478 3.397M12 12h.008v.008H12V12z"
      />
    </svg>
  );
}

function validateFile(file) {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ACCEPT_EXT.has(ext)) {
    return "Use PDF, JPG, or PNG only.";
  }
  if (file.size > MAX_BYTES) {
    return "File must be 10MB or smaller.";
  }
  return "";
}

export default function OnboardingStep2Page() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState({ idDocument: null, addressProof: null, businessEvidence: null });
  const [slotErrors, setSlotErrors] = useState({ idDocument: "", addressProof: "", businessEvidence: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const inputRefs = {
    idDocument: useRef(null),
    addressProof: useRef(null),
    businessEvidence: useRef(null),
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "client") {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (user.onboardingStep < 2) {
      navigate("/onboarding/step1", { replace: true });
      return;
    }
    if (user.onboardingStep >= 3) {
      navigate("/onboarding/step3", { replace: true });
    }
  }, [user, navigate]);

  const uploadedCount = useMemo(
    () => Object.values(files).filter((f) => f instanceof File).length,
    [files]
  );

  const allReady = uploadedCount === 3;

  const setFileFor = (key, file) => {
    setSlotErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      return;
    }
    const msg = validateFile(file);
    if (msg) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      setSlotErrors((prev) => ({ ...prev, [key]: msg }));
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!allReady) {
      setFormError("Please upload all three documents to continue.");
      return;
    }
    const fd = new FormData();
    fd.append("idDocument", files.idDocument);
    fd.append("addressProof", files.addressProof);
    fd.append("businessEvidence", files.businessEvidence);
    fd.append("riskAssessment", JSON.stringify({}));

    setSubmitting(true);
    setUploadPct(0);
    try {
      await onboardingStep2(fd, {
        onUploadProgress: (ev) => {
          if (ev.total) setUploadPct(Math.round((ev.loaded * 100) / ev.total));
        },
      });
      await loadUser();
      setSubmitting(false);
      setUploadPct(0);
      setShowSuccess(true);
      await new Promise((r) => setTimeout(r, SUCCESS_HOLD_MS));
      navigate("/onboarding/step3");
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setSubmitting(false);
      setUploadPct(0);
    }
  };

  if (!user) return null;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;

  const busy = submitting || showSuccess;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-28 text-slate-900">
      <OnboardingSuccessOverlay visible={showSuccess} message="Documents uploaded" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Ledgex</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Step 2: Identity Verification &amp; AML
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Upload your documents securely. We accept PDF, JPG, or PNG up to 10MB each.
          </p>
        </header>

        <OnboardingStepsProgress activeStep={2} />

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5">
          <div className="border-b border-slate-100 px-6 py-4 sm:px-8">
            <h2 className="text-sm font-semibold text-slate-800">Document upload</h2>
            <p className="mt-1 text-xs text-slate-500">Each slot accepts one file. Replace a file by choosing again.</p>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-800">
                <span className="tabular-nums text-blue-700">{uploadedCount}</span> of 3 documents uploaded
              </p>
              {submitting && !showSuccess && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-medium text-blue-700">{uploadPct}%</span>
                  <span className="hidden sm:inline">Sending to server…</span>
                </div>
              )}
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {formError}
              </div>
            )}

            <div className="space-y-5">
              {DOCS.map((doc) => {
                const f = files[doc.key];
                const err = slotErrors[doc.key];
                const inputId = `step2-${doc.key}`;
                return (
                  <div key={doc.key} className="rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                      <div className="flex shrink-0 justify-center pt-2 sm:pl-2">
                        <DocIcon name={doc.icon} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2 pb-2 sm:pb-4 sm:pr-4 sm:pt-2">
                        <div>
                          <label htmlFor={inputId} className="text-sm font-semibold text-slate-900">
                            {doc.label}
                          </label>
                          <p className="text-xs text-slate-500">{doc.description}</p>
                        </div>

                        <input
                          ref={inputRefs[doc.key]}
                          id={inputId}
                          type="file"
                          accept={ACCEPT_ATTR}
                          className="sr-only"
                          onChange={(e) => {
                            const picked = e.target.files?.[0];
                            setFileFor(doc.key, picked || null);
                            e.target.value = "";
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => inputRefs[doc.key].current?.click()}
                          disabled={busy}
                          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg
                            className="mb-2 h-8 w-8 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.25}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                          <span className="text-sm font-medium text-blue-700">Choose file</span>
                          <span className="mt-1 text-xs text-slate-500">PDF, JPG, PNG · max 10MB</span>
                        </button>

                        {f ? (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm">
                            <p className="font-medium text-emerald-900">Ready</p>
                            <p className="truncate text-xs text-emerald-800" title={f.name}>
                              {f.name}
                            </p>
                            <p className="text-xs text-emerald-700/90">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500">No file selected yet.</p>
                        )}

                        {err && (
                          <p className="text-xs font-medium text-red-600" role="alert">
                            {err}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 px-6 py-5 sm:px-8">
            <button
              type="submit"
              disabled={!allReady || busy}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none sm:w-auto sm:min-w-[220px]"
            >
              {submitting ? (
                <>
                  <InlineSubmitSpinner />
                  Uploading…
                </>
              ) : (
                "Submit & continue"
              )}
            </button>
            {!allReady && (
              <p className="mt-3 text-xs text-slate-500">All three documents are required before you can submit.</p>
            )}
          </div>
        </form>

        <div className="mt-6 space-y-6">
          <section
            className="rounded-2xl border border-slate-200/80 bg-white px-6 py-6 shadow-lg shadow-slate-900/5 sm:px-8 sm:py-7"
            aria-labelledby="step2-doc-guidelines-heading"
          >
            <h2 id="step2-doc-guidelines-heading" className="text-base font-semibold text-slate-900">
              Document Guidelines
            </h2>
            <ul className="mt-4 list-none space-y-2.5 text-sm leading-relaxed text-slate-700">
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>All documents must be in PDF, JPG, or PNG format</span>
              </li>
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>Maximum file size is 10MB per document</span>
              </li>
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>Ensure all text is clearly visible and readable</span>
              </li>
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>Proof of address must be dated within the last 3 months</span>
              </li>
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>Business evidence should show your company registration or trading status</span>
              </li>
              <li className="flex gap-2">
                <span className="-mt-[2px] shrink-0 text-slate-400" aria-hidden>
                  •
                </span>
                <span>
                  After uploading documents, you will complete a risk assessment questionnaire
                </span>
              </li>
            </ul>
          </section>

          <section
            className="rounded-2xl border border-slate-200/80 bg-white px-6 py-6 shadow-lg shadow-slate-900/5 sm:px-8 sm:py-7"
            aria-labelledby="step2-privacy-heading"
          >
            <h2 id="step2-privacy-heading" className="text-base font-semibold text-slate-900">
              Privacy &amp; Security
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">
              All documents are encrypted and stored securely. We only use your information for identity verification and
              compliance purposes. Your data is protected in accordance with GDPR and our Privacy Policy.
            </p>
          </section>
        </div>
      </div>

      {submitting && !showSuccess && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/90 bg-white/95 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-[width] duration-150"
                style={{ width: `${Math.max(uploadPct, 8)}%` }}
              />
            </div>
            <span className="text-xs font-medium tabular-nums text-slate-600">{uploadPct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
