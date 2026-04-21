import { Col, Row } from "antd";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <Row gutter={[16, 16]} align="middle" justify="space-between" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Col xs={24} md={12}>
          <p className="text-base font-semibold text-white">Ledgex</p>
          <p className="mt-2 text-sm text-zinc-400">Modern accounting UX for premium UK client experiences.</p>
        </Col>
        <Col xs={24} md={12} className="flex gap-6 text-sm text-zinc-400 md:justify-end">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#trust" className="hover:text-white">Security</a>
          <a href="#" className="hover:text-white">Contact</a>
        </Col>
      </Row>
    </footer>
  );
}
