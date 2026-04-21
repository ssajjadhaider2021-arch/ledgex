import { Radio, Space } from "antd";

export function RiskBusinessActivity({ value, onChange }) {
  return (
    <Space direction="vertical" className="w-full">
      <p className="text-sm font-medium text-zinc-200">Business Activity</p>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value="consulting">Consulting</Radio>
          <Radio value="ecommerce">E-commerce</Radio>
          <Radio value="manufacturing">Manufacturing</Radio>
        </Space>
      </Radio.Group>
    </Space>
  );
}
