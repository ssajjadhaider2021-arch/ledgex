import { Col, Row } from "antd";
import { FeatureCard } from "@/components/demo-landing/FeatureCard";

const items = [
  ["HMRC-ready workflows", "Submission flows with consistent audit trails."],
  ["Secure document vault", "Role-based access for sensitive files."],
  ["OCR receipt intake", "Fast extraction for accounting operations."],
  ["Real-time collaboration", "Shared visibility for teams and advisors."],
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">Everything in one premium surface</h2>
        <p className="mt-5 text-lg text-zinc-300">Simple modules designed for speed, trust, and operational clarity.</p>
      </div>
      <Row gutter={[18, 18]} className="mt-12">
        {items.map(([title, description]) => (
          <Col key={title} xs={24} sm={12} lg={6}><FeatureCard title={title} description={description} /></Col>
        ))}
      </Row>
    </section>
  );
}
