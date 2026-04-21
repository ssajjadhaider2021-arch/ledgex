import { Button, Col, Row } from "antd";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d1b]/75 backdrop-blur-xl">
      <Row align="middle" justify="space-between" className="mx-auto h-16 max-w-6xl px-4 sm:px-6">
        <Col>
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-2 py-1 text-sm font-bold shadow-lg shadow-violet-700/40">L</span>
            <span className="text-lg font-semibold tracking-tight">Ledgex</span>
          </Link>
        </Col>
        <Col className="flex items-center gap-2">
          <Button type="text" className="!rounded-xl !text-zinc-300 hover:!bg-white/5 hover:!text-white">
            <Link to="/login">Login</Link>
          </Button>
          <Button type="primary" className="!h-10 !rounded-xl !border-0 !bg-gradient-to-r !from-violet-600 !to-blue-600 !px-5 !font-medium !shadow-xl !shadow-violet-900/40">
            <Link to="/register">Start Trial</Link>
          </Button>
        </Col>
      </Row>
    </header>
  );
}
