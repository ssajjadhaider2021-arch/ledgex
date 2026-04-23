import { Form, Input, InputNumber } from "antd";

export default function AccountantStepProfessional() {
  const req = { required: true, message: "Required" };
  return (
    <>
      <Form.Item name="firmName" label="Firm name" rules={[req]}>
        <Input placeholder="Your practice name" size="large" />
      </Form.Item>
      <Form.Item name="qualification" label="Qualification" rules={[req]}>
        <Input placeholder="e.g. ACCA, ICAEW" size="large" />
      </Form.Item>
      <Form.Item
        name="yearsOfExperience"
        label="Years of experience"
        rules={[
          req,
          { type: "number", min: 0, max: 80, message: "Enter 0–80" },
        ]}
      >
        <InputNumber className="w-full" min={0} max={80} size="large" />
      </Form.Item>
      <Form.Item name="registrationNumber" label="Registration number" rules={[req]}>
        <Input placeholder="Professional body registration" size="large" />
      </Form.Item>
    </>
  );
}
