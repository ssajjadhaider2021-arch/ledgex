import { Radio, Space } from "antd";

export function RiskPepCompliance({ pepStatus, complianceIssues, onPep, onCompliance }) {
  return (
    <Space direction="vertical" className="w-full">
      <p className="text-sm font-medium text-zinc-200">PEP & Compliance</p>
      <Radio.Group value={pepStatus} onChange={(e) => onPep(e.target.value)}>
        <Space><Radio value="no">No PEP</Radio><Radio value="yes">PEP Involved</Radio></Space>
      </Radio.Group>
      <Radio.Group value={complianceIssues} onChange={(e) => onCompliance(e.target.value)}>
        <Space><Radio value="none">No Compliance Issues</Radio><Radio value="present">Issues Present</Radio></Space>
      </Radio.Group>
    </Space>
  );
}
