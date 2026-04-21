import { Radio, Space } from "antd";

export function RiskTransactionVolume({ value, onChange }) {
  return (
    <Space direction="vertical" className="w-full">
      <p className="text-sm font-medium text-zinc-200">Transaction Volume</p>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value="low">Below £10,000 / month</Radio>
          <Radio value="medium">£10,000 - £100,000 / month</Radio>
          <Radio value="high">Above £100,000 / month</Radio>
        </Space>
      </Radio.Group>
    </Space>
  );
}
