import React from "react";
import { Link } from "react-router-dom";
import { MARKETING_NAV, PRIMARY_BTN, SECONDARY_BTN } from "../constants/marketingUi";

/**
 * Sticky site header: matches Landing page — neutral premium shell, one primary CTA.
 */
export default function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-base font-semibold tracking-tight text-slate-900 transition hover:text-slate-700"
          >
            LedgeX
          </Link>
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/login"
              className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium ${SECONDARY_BTN}`}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className={`inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold ${PRIMARY_BTN}`}
            >
              Get started
            </Link>
          </div>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Marketing">
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600/40"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/login"
            className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium ${SECONDARY_BTN}`}
          >
            Log in
          </Link>
          <Link
            to="/register"
            className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold ${PRIMARY_BTN}`}
          >
            Get started
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-100/80 px-4 py-2 md:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-1">
          {MARKETING_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
