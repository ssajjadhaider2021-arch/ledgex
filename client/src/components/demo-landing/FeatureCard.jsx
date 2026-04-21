import { Card } from "antd";

export function FeatureCard({ title, description }) {
  return (
    <Card bordered={false} className="!rounded-2xl !bg-white/5 !p-1 !shadow-xl !shadow-indigo-950/25 ring-1 ring-white/10">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">{description}</p>
    </Card>
  );
}
