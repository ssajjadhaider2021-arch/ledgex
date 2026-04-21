import React from "react";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "How it Works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Partner", to: "/partner" },
  { label: "Tool", to: "/tool" },
  { label: "Guides", to: "/guides" },
];

export default function MarketingShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
            LedgeX
          </Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} className="font-medium text-slate-600 hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/register"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-600">{subtitle}</p> : null}
        <div className="mt-12 space-y-12">{children}</div>
      </main>
    </div>
  );
}
