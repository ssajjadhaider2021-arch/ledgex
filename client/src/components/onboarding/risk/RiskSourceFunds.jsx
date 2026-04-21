import { Radio, Space } from "antd";

export function RiskSourceFunds({ value, onChange }) {
  return (
    <Space direction="vertical" className="w-full">
      <p className="text-sm font-medium text-zinc-200">Source of Funds</p>
      <Radio.Group value={value} onChange={(e) => onChange(e.target.value)}>
        <Space direction="vertical">
          <Radio value="business_income">Business Income</Radio>
          <Radio value="investment">Investment Returns</Radio>
          <Radio value="mixed">Mixed Sources</Radio>
        </Space>
      </Radio.Group>
    </Space>
  );
}
