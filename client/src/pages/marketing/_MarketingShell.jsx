import React from "react";
import MarketingHeader from "../../components/MarketingHeader";

export default function MarketingShell({ title, subtitle, children, eyebrow = "LedgeX" }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-md focus:ring-2 focus:ring-blue-600/30"
      >
        Skip to content
      </a>

      <MarketingHeader />

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{subtitle}</p> : null}
        <div className="mt-12 space-y-14">{children}</div>
      </main>
    </div>
  );
}
