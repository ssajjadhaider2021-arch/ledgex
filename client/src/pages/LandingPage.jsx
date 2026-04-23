import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  LockOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import MarketingHeader from "../components/MarketingHeader";
import { PRIMARY_BTN, SECONDARY_BTN } from "../constants/marketingUi";

const SECTION_EYEBROW = "text-xs font-semibold uppercase tracking-[0.12em] text-blue-600";

/** Pound via Unicode escape (ASCII-safe source; avoids mojibake on some Windows saves). */
const P = "\u00a3";

const FEATURES = [
  {
    title: "White-label portal",
    body: "Deliver LedgeX under your brand — firm onboarding, client experience, and a workspace that feels like yours.",
    icon: BgColorsOutlined,
  },
  {
    title: "HMRC-aligned workflows",
    body: "UK-oriented flows from filings to year-end — clear audit trails and the right people in the loop.",
    icon: FileTextOutlined,
  },
  {
    title: "Operating clarity",
    body: "Signals and activity built for busy finance teams — scannable, actionable, and light on noise.",
    icon: BarChartOutlined,
  },
  {
    title: "Smart document vault",
    body: "Encrypted, organised record-keeping so clients and practices can find what they need, when they need it.",
    icon: LockOutlined,
  },
];

/** Ecosystem: clients, practices, and partners — internal ops tools stay out of marketing focus. */
const WHOS_FOR = [
  {
    title: "Business owners & SMEs",
    body: "Stay on top of cash flow, compliance touchpoints, and your relationship with your accountant — without the clutter.",
    icon: ShopOutlined,
    accent: "from-sky-50 to-indigo-50 text-sky-700 ring-sky-200/80",
  },
  {
    title: "Accountants & bookkeepers",
    body: "One place to onboard clients, request documents, and run repeatable workflows as your book grows.",
    icon: TeamOutlined,
    accent: "from-violet-50 to-blue-50 text-violet-700 ring-violet-200/80",
  },
  {
    title: "Partners & white-label firms",
    body: "Scale a consistent experience across clients, protect your brand, and roll out with confidence at volume.",
    icon: BgColorsOutlined,
    accent: "from-amber-50 to-orange-50 text-amber-800 ring-amber-200/80",
  },
];

const TRUST = [
  { label: "HMRC-aligned", icon: CheckCircleOutlined },
  { label: "GDPR & AML aware", icon: CheckCircleOutlined },
  { label: "UK-oriented posture", icon: CheckCircleOutlined },
  { label: "Encrypted at rest", icon: LockOutlined },
];

const PRICING_PLANS = [
  {
    key: "sole",
    name: "Sole traders",
    price: `${P}29.99`,
    period: "/ month",
    planFor: "Plan for self-employed & micro businesses",
    cta: "Get started",
    featured: false,
  },
  {
    key: "small",
    name: "Small limited company",
    price: `${P}49.99`,
    period: "/ month",
    planFor: "Plan for non-VAT limited companies",
    cta: "Get started",
    featured: false,
  },
  {
    key: "vat",
    name: "VAT registered",
    price: `${P}99.99`,
    period: "/ month",
    planFor: "Plan for growing teams with VAT obligations",
    cta: "Get started",
    featured: true,
  },
  {
    key: "plus",
    name: "LedgeX+",
    price: `${P}129.99`,
    period: "/ month",
    planFor: "Plan for e-commerce & complex operations",
    cta: "Get started",
    featured: false,
  },
];

function DashboardPreview() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/[0.04]"
      aria-hidden
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div className="h-2 w-32 rounded-full bg-slate-100" />
        <div className="h-7 w-7 rounded-lg bg-slate-50 ring-1 ring-slate-200/80" />
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200/60">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Overview</p>
          <div className="h-2 w-24 rounded-full bg-slate-200/90" />
          <div className="h-16 rounded-lg bg-white ring-1 ring-slate-200/70" />
          <div className="h-2 w-full rounded-full bg-slate-200/70" />
          <div className="h-2 w-2/3 rounded-full bg-slate-200/50" />
        </div>
        <div className="space-y-3 rounded-xl bg-slate-50/80 p-4 ring-1 ring-slate-200/60 sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Activity</p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200/60 transition duration-200 hover:ring-slate-300/80"
              >
                <div className="h-2 w-40 rounded-full bg-slate-200/80" />
                <div className="h-2 w-16 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-900 focus:shadow-md focus:ring-2 focus:ring-blue-600/30"
      >
        Skip to content
      </a>

      <MarketingHeader />

      <main id="main-content">
        <section className="border-b border-slate-200/50 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
            <div className="landing-animate-hero max-w-xl">
              <p className="text-sm font-medium text-slate-500">UK accounting & tax platform</p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                A calmer way to run finance operations
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                LedgeX connects business owners and accounting practices in one high-trust workspace — structured
                workflows, clear permissions, and documentation built for real-world compliance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition duration-200 ${PRIMARY_BTN}`}
                >
                  Get started
                  <ArrowRightOutlined className="ml-2 text-xs opacity-90" />
                </Link>
                <Link
                  to="/how-it-works"
                  className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium transition duration-200 ${SECONDARY_BTN}`}
                >
                  How it works
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-500">No long-term contract required. Cancel anytime.</p>
            </div>
            <div className="landing-animate-delayed mt-12 lg:mt-0">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200/50 bg-slate-50">
          <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
            {[
              { k: "Who we serve", v: "SMEs, practices & partner firms" },
              { k: "Focus", v: "Compliance-minded workflows" },
              { k: "Experience", v: "Clear dashboards & secure docs" },
            ].map((row) => (
              <div
                key={row.k}
                className="rounded-xl border border-slate-200/60 bg-white/80 px-5 py-4 shadow-sm shadow-slate-900/[0.03] ring-1 ring-slate-900/[0.02]"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.k}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{row.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-slate-200/50 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={SECTION_EYEBROW}>Platform features</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything your business needs</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                A quiet, deliberate interface so finance work stays legible at a glance — no template clutter, no
                dashboard theatre.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.04] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-md hover:shadow-slate-900/[0.07]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700">
                    <f.icon className="text-base" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200/50 bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={SECTION_EYEBROW}>Pricing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
              <p className="mt-4 text-base text-slate-600">Monthly plans with no surprises. Full breakdown on the pricing page.</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRICING_PLANS.map((p) => (
                <div
                  key={p.key}
                  className={`relative flex h-full flex-col rounded-2xl p-6 transition duration-200 ${
                    p.featured
                      ? "z-[1] border-2 border-blue-500 bg-slate-900 text-white shadow-lg shadow-slate-900/25 ring-1 ring-blue-500/20"
                      : "border border-slate-800/90 bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  }`}
                >
                  {p.featured ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="text-sm font-medium text-slate-300">{p.name}</h3>
                  <p className="mt-4 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold tracking-tight text-white">{p.price}</span>
                    <span className="text-sm text-slate-400">{p.period}</span>
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.planFor}</p>
                  <Link
                    to="/register"
                    className={
                      p.featured
                        ? "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        : "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-600 bg-slate-800/80 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                    }
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Compare all plans
                <ArrowRightOutlined className="ml-1.5 text-xs" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200/50 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className={SECTION_EYEBROW}>Who it&apos;s for</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Built for everyone in the ecosystem</h2>
              <p className="mt-4 text-base text-slate-600">
                LedgeX is for the people in front of the work — not internal operator tooling, which we keep out of the
                spotlight.
              </p>
            </div>
            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {WHOS_FOR.map((r) => (
                <article
                  key={r.title}
                  className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02] transition duration-200 hover:shadow-md hover:shadow-slate-900/[0.07]"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.accent} ring-1`}
                  >
                    <r.icon className="text-xl" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200/50 bg-slate-50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Trust, without theatre</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Financial software should feel responsible. LedgeX is built to support disciplined processes — not
              one-click promises.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm shadow-slate-900/[0.03]"
                >
                  <t.icon className="text-base text-emerald-600" aria-hidden />
                  {t.label}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500">Cancel anytime · No setup fees · Core compliance always included</p>
          </div>
        </section>

        <section className="border-t border-slate-200/50 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Start automating your accounting today
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Create an account, verify your email, and move your first workflow in minutes.
              </p>
              <Link
                to="/register"
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-semibold ${PRIMARY_BTN}`}
              >
                Get started free
                <ArrowRightOutlined className="ml-2 text-xs opacity-90" />
              </Link>
            </div>
            <p className="mt-10 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
              Trusted by teams who take compliance seriously
            </p>
            <ul
              className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-8 sm:gap-10"
              aria-label="Industries and practices"
            >
              {["SMEs", "Accountancy practices", "Bookkeeping firms", "Partner networks"].map((label) => (
                <li
                  key={label}
                  className="h-8 min-w-[5.5rem] rounded-lg border border-slate-200/80 bg-slate-50/80 px-4 py-1.5 text-center text-xs font-semibold text-slate-500 shadow-sm"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

    </div>
  );
}
