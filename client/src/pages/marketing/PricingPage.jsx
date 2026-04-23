import React from "react";
import { Link } from "react-router-dom";
import { Card, Table } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import MarketingShell from "./_MarketingShell";
import { PRIMARY_BTN } from "../../constants/marketingUi";

/** Pound sign as escape so source stays ASCII-only (avoids U+FFFD on some Windows/OneDrive saves). */
const P = "\u00a3";

const MAIN_PLANS = [
  {
    title: "Sole Traders",
    subtitle: "Self-Assessment",
    price: `${P}29.99/month`,
    cta: "GET STARTED",
    featured: false,
    items: [
      "Self-Assessment (SA100)",
      "Automated bookkeeping tools",
      "Real-time tax estimate dashboard",
      "Unlimited document storage",
      "HMRC submission",
      "Chat support",
    ],
  },
  {
    title: "Small Limited Company",
    subtitle: "(non-VAT)",
    price: `${P}49.99/month`,
    cta: "GET STARTED",
    featured: false,
    items: [
      "Year-end accounts",
      "CT600 corporation tax return",
      "Director Self-Assessment",
      "Bookkeeping automation",
      "Cashflow dashboard",
      "Companies House filings",
    ],
  },
  {
    title: "VAT-Registered (Most Popular)",
    subtitle: "Limited Company",
    price: `${P}99.99/month`,
    cta: "JOIN LEDGEX",
    featured: true,
    items: [
      "VAT returns (MTD compliant)",
      "Year-end accounts",
      "CT600 corporation tax",
      "Full bookkeeping automation",
      "Real-time VAT + tax dashboard",
      "Companies House reminders",
    ],
  },
  {
    title: "LedgeX+",
    subtitle: "E-Commerce",
    price: `${P}129.99/month`,
    cta: "GET STARTED",
    featured: false,
    items: [
      "Everything in VAT plan",
      "High-volume transaction handling",
      "Marketplace imports (Amazon/eBay/Shopify)",
      "Priority support",
      "Dedicated account manager",
    ],
  },
];

const SPECIALIST = [
  ["Multi-Property Landlords", `${P}49.99/month`],
  ["Partnerships", `${P}44.99/month`],
  ["CIC / Non-Profit", `${P}54.99/month`],
  ["Dormant Companies", `${P}14.99/month`],
  ["Overseas-Owned UK Companies", `${P}89.99/month`],
];

const ADDONS = [
  ["Virtual Address", `${P}15/month`, "UK Registered Office + Director Address"],
  ["Business Website + Hosting", `${P}20/month`, "Professional website, email & hosting"],
  ["Document Vault", `${P}4.99/month`, "Secure lifetime storage"],
  ["Business health check", `${P}3.50/month`, "Business & personal credit alerts"],
  ["Priority Support", `${P}7.99/month`, "Same-day responses"],
];

const ONE_OFF = [
  ["Company Formation", `${P}40\u2013${P}60`, "Fast online setup"],
  ["Confirmation Statement", `${P}34.99`, "Filed annually"],
  ["VAT Registration", `${P}29.99`, "48-hour turnaround"],
  ["PAYE Registration", `${P}19.99`, "Complete setup"],
  ["UTR Registration", `${P}14.99`, "HMRC SA1 submission"],
  ["Director Appointment/Resignation", `${P}14.99`, "Companies House filing"],
  ["Registered Office Change", `${P}14.99`, "Instant update"],
];

const WHY = [
  ["Automated accounting", "No paperwork. No chasing. Everything happens automatically."],
  ["Low monthly prices", "No big year-end bills. Predictable monthly costs."],
  ["Smart compliance dashboard", "Real-time tax, VAT, deadlines & alerts in one place."],
  ["Execution-only protection", `We file exactly what you provide \u2014 you stay in control.`],
  ["Built for small businesses", "Simple, fast, predictable. No complexity."],
  ["Expert support", "Real humans ready to help when you need it."],
];

export default function PricingPage() {
  return (
    <MarketingShell
      title="Pricing"
      subtitle={`Simple monthly pricing. No surprises. No hidden fees. Everything your business needs \u2014 accounting, tax, compliance, and smart automation, all in one place.`}
    >
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Choose your plan</h2>
        <p className="mt-2 text-sm text-slate-600">All plans include a secure workspace. Upgrade or change anytime.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MAIN_PLANS.map((plan) => (
            <div
              key={plan.title}
              className={`relative flex h-full flex-col rounded-2xl p-6 transition duration-200 ${
                plan.featured
                  ? "z-[1] border-2 border-blue-500 bg-slate-900 text-white shadow-lg shadow-slate-900/25 ring-1 ring-blue-500/20"
                  : "border border-slate-800/90 bg-slate-900 text-white shadow-md shadow-slate-900/20"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-sm font-medium text-slate-300">{plan.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{plan.subtitle}</p>
              <p className="mt-4 text-2xl font-bold tracking-tight text-white">{plan.price}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">What&apos;s included</p>
              <ul className="mt-3 flex-1 space-y-2 text-sm text-slate-300">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircleOutlined className="mt-0.5 shrink-0 text-emerald-400/90" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={
                  plan.featured
                    ? `mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold text-white ${PRIMARY_BTN}`
                    : "mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-600 bg-slate-800/80 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Specialist Plans</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SPECIALIST.map(([name, price]) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">{name}</p>
              <p className="mt-2 text-lg font-bold text-blue-700">{price}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Add-Ons</h2>
        <p className="mt-2 text-sm text-slate-600">Customise your package with optional extras.</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table
            pagination={false}
            rowKey={(row) => row[0]}
            dataSource={ADDONS}
            columns={[
              { title: "Add-On", render: (_, row) => row[0] },
              { title: "Price", render: (_, row) => row[1] },
              { title: "Description", render: (_, row) => row[2] },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">One-Off Services</h2>
        <p className="mt-2 text-sm text-slate-600">Fixed-fee services you can add whenever needed.</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Table
            pagination={false}
            rowKey={(row) => row[0]}
            dataSource={ONE_OFF}
            columns={[
              { title: "Service", render: (_, row) => row[0] },
              { title: "Price", render: (_, row) => row[1] },
              { title: "Notes", render: (_, row) => row[2] },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why LedgeX</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map(([title, text]) => (
            <Card key={title} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
