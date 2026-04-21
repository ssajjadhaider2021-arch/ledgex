import { Card, Col, Row } from "antd";

const personas = [
  ["Business Owners", "Cashflow visibility and clean tax readiness."],
  ["Accountants", "Standardized client delivery in one place."],
  ["Finance Partners", "Shared context across operations and advisory."],
];

export function WhoItsFor() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">Who it&apos;s for</h2>
        <p className="mt-5 text-lg text-zinc-300">Built for teams that want calm, modern financial operations.</p>
      </div>
      <Row gutter={[18, 18]} className="mt-12">
        {personas.map(([title, desc]) => (
          <Col key={title} xs={24} md={8}>
            <Card bordered={false} className="!rounded-2xl !bg-zinc-900/70 !shadow-xl !shadow-violet-950/25 ring-1 ring-white/10">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{desc}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
