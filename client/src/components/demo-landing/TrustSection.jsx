import { Card, Col, Row } from "antd";

const trust = [
  ["GDPR aligned", "Privacy-first controls and disciplined retention."],
  ["UK data posture", "Low-latency architecture for UK workflows."],
];

export function TrustSection() {
  return (
    <section id="trust" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/25 sm:p-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">Trust by design</h2>
          <p className="mt-4 text-lg text-zinc-300">Security and reliability as a product principle, not an add-on.</p>
        </div>
        <Row gutter={[18, 18]} className="mt-10">
          {trust.map(([title, desc]) => (
            <Col key={title} xs={24} sm={12}>
              <Card bordered={false} className="!rounded-2xl !bg-black/30 !shadow-xl !shadow-indigo-950/20 ring-1 ring-white/10">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
