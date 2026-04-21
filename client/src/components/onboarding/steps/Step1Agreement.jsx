import React, { useState } from "react";
import { onboardingStep1 } from "../../../api/onboarding.api";
import { AGREEMENT_CHECKBOX_KEYS } from "../../../constants/onboardingStep1Agreement";

const AGREEMENT_TEXT = `
Ledgex Client Agreement — Last updated: 2026

1. Services
You are engaging Ledgex for cloud-based accounting, compliance, and related workflow tools as described in your subscription plan.

2. Account & access
You must provide accurate registration information, keep credentials confidential, and notify us promptly of unauthorized use. We may suspend access for security or compliance reasons.

3. Acceptable use
You agree not to misuse the platform, attempt unauthorized access, interfere with other customers, or use the service for unlawful purposes. You remain responsible for your staff and delegates.

4. Data & privacy
We process personal and business data in line with our Privacy Policy. You warrant you have authority to submit data you upload. You are responsible for the accuracy of records you maintain in Ledgex.

5. AML / KYC
Where applicable, you agree to complete identity verification, provide requested documents, and answer risk questions truthfully. Failure may result in restricted access.

6. Fees & taxes
Fees are billed according to your plan. Taxes may apply where required by law.

7. Intellectual property
Ledgex retains all rights in the software, branding, and documentation. You receive a limited, non-exclusive licence to use the service during your subscription.

8. Disclaimers
The service is provided on an "as is" basis to the extent permitted by law. We do not guarantee uninterrupted operation or that outputs meet every regulatory requirement without your professional review.

9. Limitation of liability
To the maximum extent permitted by law, neither party is liable for indirect or consequential losses. Our aggregate liability arising from the agreement is capped at the fees paid in the twelve months before the claim.

10. Term & termination
Either party may terminate according to the plan terms. Provisions that reasonably should survive (e.g. confidentiality, liability limits) survive termination.

11. Governing law
This agreement is governed by the laws of England and Wales unless otherwise agreed in writing.

12. Electronic signature
By typing your full legal name and accepting below, you intend to sign this agreement electronically and consent to conduct business electronically.

If you do not agree, do not proceed.
`.trim();

/**
 * @param {object} props
 * @param {() => void | Promise<void>} [props.onSuccess] — after successful POST (e.g. wizard)
 * @param {() => void} [props.onContinue] — legacy: same as onSuccess for local steppers
 * @param {(msg: string) => void} [props.onError] — parent error banner
 */
export function Step1Agreement({ onSuccess, onContinue, onError }) {
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const canSubmit = agreed && fullName.trim().length > 0;
  const goNext = onSuccess ?? onContinue;

  const reportError = (msg) => {
    setLocalError(msg);
    onError?.(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!canSubmit) return;
    setBusy(true);
    try {
      setLocalError("");
      onError?.("");
      const trimmed = fullName.trim();
      const payload = {
        agreementVersion: "v1.0",
        fullName: trimmed,
        signature: trimmed,
      };
      for (const key of AGREEMENT_CHECKBOX_KEYS) {
        payload[key] = true;
      }
      await onboardingStep1(payload);
      await goNext?.();
    } catch (err) {
      reportError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Client agreement</h2>
        <p className="mt-1 text-sm text-slate-500">Review the terms, then sign with your full legal name.</p>
      </div>

      <div
        className="mb-6 max-h-56 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-inner"
        role="region"
        aria-label="Agreement text"
      >
        <div className="whitespace-pre-wrap">{AGREEMENT_TEXT}</div>
      </div>

      {localError && !onError && (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-3 transition hover:border-slate-200">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-800">I agree to all terms</span>
        </label>

        <div>
          <label htmlFor="step1-full-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name (signature)
          </label>
          <input
            id="step1-full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Type your full legal name"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || busy}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? "Submitting…" : "Accept & Continue"}
        </button>
      </form>
    </div>
  );
}
