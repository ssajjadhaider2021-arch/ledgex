import React from "react";
import MarketingShell from "./_MarketingShell";

export default function ToolPage() {
  return (
    <MarketingShell
      title="Tool"
      subtitle="Explore LedgeX tools for accounting automation, tax compliance, and business operations."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Tools directory</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Tool page is set up. Next we can list calculators, filing assistants, and data import utilities.
        </p>
      </section>
    </MarketingShell>
  );
}
