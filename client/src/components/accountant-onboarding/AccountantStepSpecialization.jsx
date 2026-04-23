import { Form, Select } from "antd";
import { SPEC_OPTIONS } from "../../constants/accountantOnboarding";

export default function AccountantStepSpecialization() {
  return (
    <Form.Item
      name="specializations"
      label="Specializations"
      rules={[
        { required: true, message: "Select at least one area" },
        { type: "array", min: 1, message: "Select at least one area" },
      ]}
    >
      <Select
        mode="multiple"
        placeholder="Tax, VAT, Payroll…"
        options={SPEC_OPTIONS}
        size="large"
        optionFilterProp="label"
      />
    </Form.Item>
  );
}
