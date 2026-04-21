import React from "react";
import MarketingShell from "./_MarketingShell";

export default function PartnerPage() {
  return (
    <MarketingShell
      title="Partner"
      subtitle="Partner with LedgeX to deliver modern UK accounting and compliance services under your own proposition."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Partner programme</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Partner information page is now ready for content. We can add referral tiers, onboarding flow, white-label packs,
          and commercial terms next.
        </p>
      </section>
    </MarketingShell>
  );
}
