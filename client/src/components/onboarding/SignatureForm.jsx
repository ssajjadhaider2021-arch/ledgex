import { Form, Input } from "antd";

export function SignatureForm({ fullName, onChange, showError }) {
  return (
    <Form layout="vertical" className="mt-6">
      <Form.Item
        label={<span className="text-sm text-zinc-200">Full name (digital signature)</span>}
        validateStatus={showError && !fullName ? "error" : ""}
        help={showError && !fullName ? "Name is required" : ""}
      >
        <Input
          value={fullName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Jane Doe"
          className="rounded-lg border-white/20 bg-black/30 text-zinc-100"
        />
      </Form.Item>
    </Form>
  );
}
