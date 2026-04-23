import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { postAuthPath } from "../../utils/postAuthPath";
import MarketingHeader from "../../components/MarketingHeader";
import { PRIMARY_BTN } from "../../constants/marketingUi";

const VERIFY_EMAIL_STORAGE_KEY = "ledgeX_pending_verify_email";

function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  const safeLocal = local.trim();
  if (!safeLocal) return `•••@${domain}`;
  if (safeLocal.length <= 2) return `•••@${domain}`;
  return `${safeLocal.slice(0, 2)}•••@${domain}`;
}

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();

  const emailFromNav = location.state?.email;
  const emailFromStorage = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(VERIFY_EMAIL_STORAGE_KEY) : null;
  const resolvedEmail = (typeof emailFromNav === "string" && emailFromNav.trim()) || (emailFromStorage || "").trim() || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const masked = useMemo(() => maskEmail(resolvedEmail), [resolvedEmail]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const trimmed = code.trim().replace(/\D/g, "");
    if (!resolvedEmail) {
      setError("We couldn’t find your email. Please register again.");
      return;
    }
    if (!trimmed) {
      setError("Enter the verification code from your email.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await verifyEmail({
        email: resolvedEmail,
        verificationCode: trimmed,
      });
      sessionStorage.removeItem(VERIFY_EMAIL_STORAGE_KEY);
      const u = data.user;
      navigate(postAuthPath(u), { replace: true });
    } catch (err) {
      setError(err.message || "Verification failed. Check the code and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50">
      <MarketingHeader />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-20">
        <header className="mb-10 max-w-xl lg:mb-0 lg:flex-1 lg:pr-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Almost there</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Verify your email
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Enter the code we sent you to finish setting up your Ledgex account. It may take a minute to arrive.
          </p>
          <ul className="mt-10 hidden space-y-3 text-sm text-slate-600 sm:block">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                1
              </span>
              Check your inbox and spam folder for the email from Ledgex.
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                2
              </span>
              Type the six-digit code below — no spaces needed.
            </li>
          </ul>
        </header>

        <div className="w-full lg:max-w-md lg:flex-1">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.04] sm:p-10">
            <h2 className="sr-only">Verification code</h2>

            {resolvedEmail ? (
              <p className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-center text-sm text-slate-700">
                Code sent to{" "}
                <span className="font-semibold text-slate-900" title={resolvedEmail}>
                  {masked}
                </span>
              </p>
            ) : (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                role="status"
              >
                We couldn&apos;t restore your email from this session.{" "}
                <Link to="/register" className="font-semibold text-blue-600 underline hover:text-blue-700">
                  Register again
                </Link>{" "}
                or{" "}
                <Link to="/login" className="font-semibold text-blue-600 underline hover:text-blue-700">
                  log in
                </Link>{" "}
                if you already verified.
              </div>
            )}

            {error ? (
              <div
                className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="verify-code" className="block text-sm font-semibold text-slate-800">
                  Verification code
                </label>
                <input
                  id="verify-code"
                  name="verificationCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={12}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, ""))}
                  placeholder="000000"
                  disabled={submitting || !resolvedEmail}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-center font-mono text-2xl tracking-[0.35em] text-slate-900 shadow-inner shadow-slate-900/5 outline-none transition placeholder:text-slate-300 placeholder:tracking-normal focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60 sm:text-3xl"
                />
                <p className="mt-2 text-xs text-slate-500">Usually 6 digits from the email we sent.</p>
              </div>

              <button
                type="submit"
                disabled={submitting || !resolvedEmail}
                className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${PRIMARY_BTN}`}
              >
                {submitting ? "Verifying…" : "Verify & continue"}
              </button>
            </form>

            <p className="mt-8 border-t border-slate-100 pt-8 text-center text-sm text-slate-600">
              Wrong address?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Start over
              </Link>
              {" · "}
              <Link to="/login" className="font-semibold text-slate-700 hover:text-slate-900">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
