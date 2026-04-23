import { Form, Input } from "antd";

export default function AccountantStepPersonal() {
  const req = { required: true, message: "Required" };
  return (
    <>
      <Form.Item name="fullName" label="Full name" rules={[req]}>
        <Input placeholder="Jane Smith" size="large" />
      </Form.Item>
      <Form.Item name="phoneNumber" label="Phone number" rules={[req]}>
        <Input placeholder="+44 …" size="large" />
      </Form.Item>
      <Form.Item name="address" label="Address" rules={[req]}>
        <Input.TextArea rows={2} placeholder="Street, building" />
      </Form.Item>
      <Form.Item name="city" label="City" rules={[req]}>
        <Input size="large" />
      </Form.Item>
      <Form.Item name="country" label="Country" rules={[req]}>
        <Input size="large" />
      </Form.Item>
    </>
  );
}
