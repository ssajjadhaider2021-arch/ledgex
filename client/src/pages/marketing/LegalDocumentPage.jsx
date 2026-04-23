import React from "react";
import { Link, useParams } from "react-router-dom";
import { LEGAL_PAGE_TITLES } from "../../constants/footerLinks";
import MarketingShell from "./_MarketingShell";

export default function LegalDocumentPage() {
  const { slug } = useParams();
  const title = LEGAL_PAGE_TITLES[slug] || "Legal information";

  return (
    <MarketingShell
      eyebrow="Legal"
      title={title}
      subtitle="Official policy and legal copy will be published here. If you need this document in the meantime, contact support."
    >
      <section className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02]">
        <p className="text-sm leading-relaxed text-slate-600">
          We&apos;re preparing the full text for this page. Thank you for your patience.
        </p>
        <p className="mt-6 text-sm text-slate-500">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </p>
      </section>
    </MarketingShell>
  );
}
