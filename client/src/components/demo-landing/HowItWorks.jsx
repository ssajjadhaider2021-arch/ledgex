import { Card, Col, Row } from "antd";
import { CloudUploadOutlined, UserSwitchOutlined, TagsOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

const steps = [
  { title: "Upload documents", text: "Drag invoices and receipts into your secure workspace.", icon: CloudUploadOutlined },
  { title: "Get assigned an accountant", text: "A matched accountant is assigned to your business profile.", icon: UserSwitchOutlined },
  { title: "Automatic categorisation", text: "Transactions and documents are organised for clean reporting.", icon: TagsOutlined },
  { title: "HMRC submission", text: "Finalised records are prepared for compliant HMRC filing.", icon: SafetyCertificateOutlined },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">How it works</h2>
        <p className="mt-5 text-lg text-zinc-300">A simple four-step flow from document upload to compliant submission.</p>
      </div>
      <Row gutter={[18, 18]} className="mt-12">
        {steps.map(({ title, text, icon: Icon }) => (
          <Col key={title} xs={24} sm={12} lg={6}>
            <Card bordered={false} className="!h-full !rounded-2xl !bg-white/5 !shadow-xl !shadow-blue-950/20 ring-1 ring-white/10">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-3 text-xl text-blue-200 ring-1 ring-white/10">
                <Icon />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{text}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}
