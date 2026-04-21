import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Table } from "antd";
import {
  BgColorsOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  LineChartOutlined,
  LockOutlined,
} from "@ant-design/icons";

const FEATURE_BLOCKS = [
  {
    title: "White-Label Ready",
    description:
      "Use LedgeX under your own brand. Custom domains, logos, colour palettes and firm-specific onboarding flows.",
    icon: BgColorsOutlined,
  },
  {
    title: "Full HMRC-Ready Filings",
    description:
      "Complete tax compliance built in. CT600, Self Assessment, VAT returns, year-end accounts — all HMRC-ready and automated.",
    icon: FileTextOutlined,
  },
  {
    title: "Business Health Check",
    description:
      "Real-time business credit reporting and monitoring. Get instant alerts on credit changes and risk signals to protect your business.",
    icon: LineChartOutlined,
  },
  {
    title: "Secure Document Vault",
    description:
      "Permanent encrypted storage for all your records. Keep certificates, accounts, tax returns and ID documents safe in one secure location.",
    icon: LockOutlined,
  },
];

const NAV_ITEMS = [
  { label: "How it Works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Partner", to: "/partner" },
  { label: "Tool", to: "/tool" },
  { label: "Guides", to: "/guides" },
];

const AUDIENCE = [
  {
    title: "Business Owners & SMEs",
    description:
      "Automate your accounting, stay compliant, and focus on growing your business.",
  },
  {
    title: "Accountants & Bookkeepers",
    description:
      "Manage multiple clients efficiently with powerful multi-tenant tools.",
  },
  {
    title: "Partners / White-Label Firms",
    description:
      "Deliver accounting services under your own brand with full customization.",
  },
];

const HOME_PRICING_ROWS = [
  { key: "sole", plan: "Sole Traders", price: "£29.99/month", bestFor: "Self-Assessment" },
  { key: "small-ltd", plan: "Small Limited Company", price: "£49.99/month", bestFor: "Non-VAT businesses" },
  { key: "vat", plan: "VAT-Registered Limited Company", price: "£99.99/month", bestFor: "Most popular" },
  { key: "ledgex-plus", plan: "LedgeX+", price: "£129.99/month", bestFor: "E-Commerce" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
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
            <Link to="/register">
              <Button>Register</Button>
            </Link>
            <Link to="/login">
              <Button type="primary">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Automated Accounting & Tax
            <br />
            for UK Businesses and Accountants
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            From accounting and tax to company formation, credit scoring and lifetime document storage — LedgeX brings
            everything into one secure, automated platform.
          </p>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
          {FEATURE_BLOCKS.map((item) => (
            <Card key={item.title} className="rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                <item.icon className="mr-2 text-blue-600" />
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Pricing</h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Simple monthly pricing. No surprises. No hidden fees.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Table
              pagination={false}
              dataSource={HOME_PRICING_ROWS}
              columns={[
                { title: "Plan", dataIndex: "plan", key: "plan" },
                { title: "Price", dataIndex: "price", key: "price" },
                { title: "Best For", dataIndex: "bestFor", key: "bestFor" },
              ]}
            />
          </div>
          <div className="mt-5">
            <Link to="/pricing">
              <Button type="primary">View full pricing</Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Who&apos;s it for?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {AUDIENCE.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">* {item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white/90">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built by UK accountants & engineers
            </h2>
            <div className="mt-6 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
              <p>
                <CheckCircleOutlined className="mr-2 text-emerald-600" />
                HMRC-aligned
              </p>
              <p>
                <BuildOutlined className="mr-2 text-blue-600" />
                UK-hosted infrastructure
              </p>
              <p>
                <CheckCircleOutlined className="mr-2 text-emerald-600" />
                GDPR & AML compliant
              </p>
              <p>
                <LockOutlined className="mr-2 text-blue-600" />
                Secure, encrypted storage
              </p>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-slate-600">
              Cancel anytime • No setup fees • No long-term contracts
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Core compliance always included. Add-ons optional.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
