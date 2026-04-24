import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage, login as loginRequest } from "../../api/auth.api";
import { useAuth } from "../../contexts/AuthContext";
import { postAuthPath } from "../../utils/postAuthPath";
import MarketingHeader from "../../components/MarketingHeader";
import { PRIMARY_BTN } from "../../constants/marketingUi";

export default function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { hydrateFromLoginData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    const form = formRef.current;
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await loginRequest({ email: email.trim(), password });
      hydrateFromLoginData(data);
      navigate(postAuthPath(data.user), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err) || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50">
      <MarketingHeader />

      <div className="relative mx-auto flex max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-20">
        <header className="mb-10 max-w-xl lg:mb-0 lg:flex-1 lg:pr-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Welcome back</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Sign in to Ledgex</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Access your dashboard, documents, and business profile in one secure place.
          </p>
          <div className="mt-10 hidden rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm sm:block">
            <p className="text-sm font-medium text-slate-800">Tip</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Use the email you verified at registration. Need an account? You can sign up in seconds.
            </p>
          </div>
        </header>

        <div className="w-full lg:max-w-md lg:flex-1">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.04] sm:p-10">
            <h2 className="sr-only">Sign in form</h2>

            {error ? (
              <div
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form
              ref={formRef}
              id="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                void handleLogin();
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={submitting}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={submitting}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                />
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleLogin()}
                className={`mt-2 w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${PRIMARY_BTN}`}
              >
                {submitting ? "Signing in…" : "Log in"}
              </button>
            </form>

            <p className="mt-8 border-t border-slate-100 pt-8 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


