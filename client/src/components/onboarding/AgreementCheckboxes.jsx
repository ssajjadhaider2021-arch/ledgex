import { Checkbox, Space } from "antd";

export function AgreementCheckboxes({ value, onChange }) {
  const update = (field) => (e) => {
    onChange({ ...value, [field]: e.target.checked });
  };

  return (
    <Space direction="vertical" className="mt-4 w-full text-sm text-zinc-200">
      <Checkbox checked={value.acceptedTerms} onChange={update("acceptedTerms")}>
        I agree to the Terms of Service.
      </Checkbox>
      <Checkbox checked={value.acceptedPrivacy} onChange={update("acceptedPrivacy")}>
        I have read the Privacy Policy.
      </Checkbox>
      <Checkbox checked={value.acceptedMoa} onChange={update("acceptedMoa")}>
        I accept the MOA on behalf of the business.
      </Checkbox>
    </Space>
  );
}
