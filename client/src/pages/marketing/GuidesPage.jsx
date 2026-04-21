import React from "react";
import MarketingShell from "./_MarketingShell";

export default function GuidesPage() {
  return (
    <MarketingShell
      title="Guides"
      subtitle="Practical guides for UK business owners, accountants, and finance teams using LedgeX."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Guides hub</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Guides page is ready for articles. We can add searchable guide cards and category filters in the next step.
        </p>
      </section>
    </MarketingShell>
  );
}
