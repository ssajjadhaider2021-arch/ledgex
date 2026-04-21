import { Button, Tag } from "antd";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-28 pt-20 text-center sm:px-6 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-8 -z-10 mx-auto h-72 w-full max-w-4xl rounded-full bg-gradient-to-r from-blue-600/20 via-violet-600/25 to-indigo-500/20 blur-3xl" />
      <Tag color="processing" className="!rounded-full !border-white/20 !bg-white/10 !px-3 !py-1 !text-[11px] !uppercase !tracking-[0.2em]">
        UK Accounting SaaS
      </Tag>
      <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
        Automated Accounting &amp; Tax for UK Businesses
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
        Save hours every month with a single workspace for bookkeeping, compliance tracking, and tax-ready reporting
        built specifically for UK companies.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button type="primary" size="large" className="!h-11 !rounded-xl !border-0 !bg-gradient-to-r !from-violet-600 !to-blue-600 !px-7 !font-medium !shadow-xl !shadow-violet-900/40">
          <Link to="/register">Get Started</Link>
        </Button>
        <Button size="large" className="!h-11 !rounded-xl !border-white/20 !bg-white/5 !px-7 !text-zinc-200 hover:!border-white/35 hover:!text-white">
          <Link to="/login">How it Works</Link>
        </Button>
      </div>
    </section>
  );
}
