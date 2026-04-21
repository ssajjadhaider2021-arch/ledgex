import React from "react";
import { Card } from "antd";
import {
  BuildOutlined,
  CheckCircleOutlined,
  LockOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import MarketingShell from "./_MarketingShell";

const STEPS = [
  {
    step: "1",
    title: "Connect Business / Client",
    description:
      "Register your business or add clients to your multi-tenant workspace. Quick setup with Companies House integration and automatic HMRC linking.",
  },
  {
    step: "2",
    title: "Automate Bookkeeping & Filings",
    description:
      "Upload bank statements (CSV or PDF) and let LedgeX categorize transactions automatically. Smart AI categorization with rule-based learning for accurate bookkeeping.",
  },
  {
    step: "3",
    title: "Monitor, File, Store — Done",
    description:
      "Real-time dashboards, automated HMRC submissions, and lifetime document storage. Everything you need for compliance, all in one secure platform.",
  },
];

const GETTING_STARTED = [
  { icon: BuildOutlined, title: "Register", text: "Sign up in minutes with your business details" },
  { icon: CheckCircleOutlined, title: "Verify", text: "Quick identity verification for compliance" },
  { icon: RocketOutlined, title: "Start Using", text: "Begin managing your accounting immediately" },
];

const DIFFERENT = [
  { icon: SafetyCertificateOutlined, title: "HMRC-Aligned", text: "Built specifically for UK tax and compliance requirements" },
  { icon: ShopOutlined, title: "UK-Hosted Infrastructure", text: "Your data stays in the UK with enterprise-grade security" },
  { icon: CheckCircleOutlined, title: "GDPR & AML Compliant", text: "Full compliance with UK data protection and anti-money laundering regulations" },
  { icon: LockOutlined, title: "Secure, Encrypted Storage", text: "Bank-level encryption for all your sensitive documents and data" },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell
      title="How it Works"
      subtitle="Simple, automated accounting in 3 easy steps. From registration to filing, LedgeX handles everything automatically."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {STEPS.map((item) => (
          <Card key={item.step} className="rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">{item.step}</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Getting Started</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {GETTING_STARTED.map((item) => (
            <Card key={item.title} className="rounded-2xl border border-slate-200 shadow-sm">
              <item.icon className="text-2xl text-blue-600" />
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">What Makes LedgeX Different</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {DIFFERENT.map((item) => (
            <Card key={item.title} className="rounded-2xl border border-slate-200 shadow-sm">
              <item.icon className="text-2xl text-blue-600" />
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">No Lock-In, Total Flexibility</h2>
        <div className="mt-5 grid gap-2 text-sm font-medium text-slate-700 sm:grid-cols-3">
          <p>
            <CheckCircleOutlined className="mr-2 text-emerald-600" />
            Cancel anytime
          </p>
          <p>
            <CheckCircleOutlined className="mr-2 text-emerald-600" />
            No setup fees
          </p>
          <p>
            <CheckCircleOutlined className="mr-2 text-emerald-600" />
            No long-term contracts
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-600">Core compliance always included. Add-ons optional.</p>
      </section>
    </MarketingShell>
  );
}
