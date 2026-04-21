import React from "react";
import { Button, Card, Table } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import MarketingShell from "./_MarketingShell";

const MAIN_PLANS = [
  {
    title: "Sole Traders",
    subtitle: "Self-Assessment",
    price: "£29.99/month",
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
    price: "£49.99/month",
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
    price: "£99.99/month",
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
    price: "£129.99/month",
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
  ["Multi-Property Landlords", "£49.99/month"],
  ["Partnerships", "£44.99/month"],
  ["CIC / Non-Profit", "£54.99/month"],
  ["Dormant Companies", "£14.99/month"],
  ["Overseas-Owned UK Companies", "£89.99/month"],
];

const ADDONS = [
  ["Virtual Address", "£15/month", "UK Registered Office + Director Address"],
  ["Business Website + Hosting", "£20/month", "Professional website, email & hosting"],
  ["Document Vault", "£4.99/month", "Secure lifetime storage"],
  ["Business health check", "£3.50/month", "Business & personal credit alerts"],
  ["Priority Support", "£7.99/month", "Same-day responses"],
];

const ONE_OFF = [
  ["Company Formation", "£40–60", "Fast online setup"],
  ["Confirmation Statement", "£34.99", "Filed annually"],
  ["VAT Registration", "£29.99", "48-hour turnaround"],
  ["PAYE Registration", "£19.99", "Complete setup"],
  ["UTR Registration", "£14.99", "HMRC SA1 submission"],
  ["Director Appointment/Resignation", "£14.99", "Companies House filing"],
  ["Registered Office Change", "£14.99", "Instant update"],
];

const WHY = [
  ["Automated accounting", "No paperwork. No chasing. Everything happens automatically."],
  ["Low monthly prices", "No big year-end bills. Predictable monthly costs."],
  ["Smart compliance dashboard", "Real-time tax, VAT, deadlines & alerts in one place."],
  ["Execution-only protection", "We file exactly what you provide — you stay in control."],
  ["Built for small businesses", "Simple, fast, predictable. No complexity."],
  ["Expert support", "Real humans ready to help when you need it."],
];

export default function PricingPage() {
  return (
    <MarketingShell
      title="Pricing"
      subtitle="Simple monthly pricing. No surprises. No hidden fees. Everything your business needs — accounting, tax, compliance, and smart automation, all in one place."
    >
      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Choose Your Plan</h2>
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {MAIN_PLANS.map((plan) => (
            <Card
              key={plan.title}
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                plan.featured ? "border-blue-300 ring-2 ring-blue-200" : "border-slate-200"
              }`}
            >
              <p className="text-lg font-bold text-slate-900">{plan.title}</p>
              <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{plan.price}</p>
              <p className="mt-4 text-sm font-semibold text-slate-700">What&apos;s included:</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item}>
                    <CheckCircleOutlined className="mr-2 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button type="primary" className="mt-6">
                {plan.cta}
              </Button>
            </Card>
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
