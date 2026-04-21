import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cleaned = email.trim();
    if (!cleaned || !password || !role) {
      setError("Email, password, and role are required.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ email: cleaned, password, role });
      sessionStorage.setItem("ledgeX_pending_verify_email", cleaned);
      navigate("/verify", { state: { email: cleaned } });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(99, 102, 241, 0.12), transparent)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-10 lg:py-16">
        <header className="mb-10 max-w-xl lg:mb-0 lg:flex-1 lg:pr-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Welcome</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Sign up to Ledgex
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 sm:text-xl">
            Create your account to continue to Ledgex — bookkeeping and compliance built for clarity.
          </p>
          <ul className="mt-10 hidden space-y-3 text-sm text-slate-600 sm:block">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                ✓
              </span>
              Secure client workspace after email verification
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                ✓
              </span>
              Guided onboarding for agreements and risk checks
            </li>
          </ul>
        </header>

        <div className="w-full lg:max-w-md lg:flex-1">
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-8 shadow-2xl shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.04] backdrop-blur-sm sm:p-10">
            <h2 className="sr-only">Registration form</h2>

            {error ? (
              <div
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="register-email" className="block text-sm font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 outline-none ring-slate-900/5 transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  disabled={submitting}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner shadow-slate-900/5 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="register-role" className="block text-sm font-semibold text-slate-800">
                  Account type
                </label>
                <div className="relative mt-2">
                  <select
                    id="register-role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={submitting}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-60"
                  >
                    <option value="client">Client</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Admin</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Sign up"}
              </button>
            </form>

            <p className="mt-8 border-t border-slate-100 pt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
