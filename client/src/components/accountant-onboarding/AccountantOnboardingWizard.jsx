import React from "react";
import { Button, Card, Checkbox, Form, Input, Progress, Select, Steps, Typography, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export default function AccountantOnboardingWizard({
  form,
  step,
  loading,
  canProceed,
  onValuesChange,
  checkStepValidity,
  next,
  back,
  submit,
}) {
  const items = [
    { title: "Identity & Legal Status" },
    { title: "Professional Standing" },
    { title: "AML & Regulatory" },
    { title: "Insurance" },
    { title: "Data Protection" },
    { title: "Declarations" },
  ];
  const progressPercent = Math.round(((step + 1) / items.length) * 100);
  const req = { required: true, message: "Required" };
  const phoneIntlRule = {
    pattern: /^\+[1-9]\d{7,14}$/,
    message: "Enter a valid international phone number (e.g. +447700900123)",
  };

  React.useEffect(() => {
    checkStepValidity();
  }, [step, checkStepValidity]);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList ?? [];
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const filename = (file.name || "").toLowerCase();
      const hasValidExt = [".pdf", ".jpg", ".jpeg", ".png"].some((ext) => filename.endsWith(ext));
      const isValidType = ["application/pdf", "image/jpeg", "image/png"].includes(file.type) || hasValidExt;
      if (!isValidType) {
        message.error("Only PDF, JPG, and PNG files are allowed");
        return Upload.LIST_IGNORE;
      }
      const isUnder10Mb = file.size <= 10 * 1024 * 1024;
      if (!isUnder10Mb) {
        message.error("File must be 10MB or smaller");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    accept: ".pdf,.jpg,.jpeg,.png",
    maxCount: 1,
  };

  const sectionTitle = (text) => (
    <Typography.Title level={4} className="!mb-1 !text-base !font-bold">
      {text}
    </Typography.Title>
  );

  const sectionSub = (text) => (
    <Typography.Paragraph className="!mb-5 !text-sm !text-slate-600">{text}</Typography.Paragraph>
  );

  const warningBox = (text) => (
    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{text}</div>
  );

  const fileHint = "Accepted formats: PDF, JPEG, PNG • Max size: 10MB";

  const renderStep = () => {
    if (step === 0) {
      return (
        <>
          {sectionTitle("Section 1: Identity & Legal Status")}
          {sectionSub("Provide your legal identity and contact information")}
          <Form.Item name="legal_name" label={<span className="font-semibold">Legal Name</span>} rules={[req]}>
            <Input placeholder="LedgerX Accounting Ltd" />
          </Form.Item>
          <Form.Item name="trading_name" label={<span className="font-semibold">Trading Name</span>}>
            <Input placeholder="LedgerX Tax Advisors" />
          </Form.Item>
          <Form.Item
            name="company_number_or_utr"
            label={<span className="font-semibold">Company Number / UTR</span>}
            rules={[req, { max: 10, message: "Company number/UTR must be at most 10 characters" }]}
          >
            <Input placeholder="12345678 or 1234567890" />
          </Form.Item>
          <Form.Item name="address_line1" label={<span className="font-semibold">Registered Address</span>} rules={[req]}>
            <Input placeholder="10 Bishopsgate" />
          </Form.Item>
          <Form.Item name="address_line2" label="Address line 2">
            <Input placeholder="Floor 4, Suite 12" />
          </Form.Item>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item name="city" label={<span className="font-semibold">City</span>} rules={[req]}>
              <Input placeholder="London" />
            </Form.Item>
            <Form.Item name="postcode" label={<span className="font-semibold">Postcode</span>} rules={[req]}>
              <Input placeholder="EC2N 4BQ" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item name="contact_name" label={<span className="font-semibold">Principal Contact Name</span>} rules={[req]}>
              <Input placeholder="Jane Smith" />
            </Form.Item>
            <Form.Item name="contact_phone" label={<span className="font-semibold">Contact Phone</span>} rules={[req, phoneIntlRule]}>
              <Input placeholder="+447700900123" />
            </Form.Item>
          </div>
          <Form.Item
            name="contact_email"
            label={<span className="font-semibold">Contact Email</span>}
            rules={[req, { type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="compliance@ledgerx.co.uk" />
          </Form.Item>
        </>
      );
    }
    if (step === 1) {
      return (
        <>
          {sectionTitle("Section 2: Professional Standing")}
          {sectionSub("Confirm your professional qualifications and scope of services")}
          <Form.Item name="professional_body" label={<span className="font-semibold">Professional Body</span>} rules={[req]}>
            <Select
              placeholder="Select professional body"
              options={[
                { value: "ICAEW", label: "ICAEW - Institute of Chartered Accountants in England and Wales" },
                { value: "ACCA", label: "ACCA - Association of Chartered Certified Accountants" },
                { value: "AAT", label: "AAT - Association of Accounting Technicians" },
                { value: "CIMA", label: "CIMA - Chartered Institute of Management Accountants" },
                { value: "OTHER", label: "Other" },
              ]}
            />
          </Form.Item>
          <Form.Item name="membership_number" label={<span className="font-semibold">Membership Number</span>} rules={[req]}>
            <Input placeholder="Professional Body Membership Number" />
          </Form.Item>
          <Form.Item
            name="is_good_standing"
            valuePropName="checked"
            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Please confirm")))}]}
          >
            <Checkbox className="!font-semibold">I confirm that I am in current good standing with my professional body</Checkbox>
          </Form.Item>
          <Form.Item
            name="services"
            label={<span className="font-semibold">Scope of Services Authorized</span>}
            rules={[{ required: true, type: "array", min: 1, message: "Select at least one service" }]}
          >
            <Checkbox.Group className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Checkbox value="bookkeeping">Bookkeeping</Checkbox>
              <Checkbox value="vat">VAT Returns</Checkbox>
              <Checkbox value="ct">Corporation Tax</Checkbox>
              <Checkbox value="sa">Self Assessment</Checkbox>
              <Checkbox value="payroll">Payroll</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </>
      );
    }
    if (step === 2) {
      return (
        <>
          {sectionTitle("Section 3: AML & Regulatory")}
          {sectionSub("Upload AML compliance documentation (mandatory)")}
          {warningBox("All AML & Regulatory requirements are mandatory with NO EXCEPTIONS for compliance.")}
          <Form.Item
            name="aml_supervision_file"
            label={<span className="font-semibold">Proof of AML Supervision</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload AML supervision file" }]}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Choose file</p>
              <p className="ant-upload-hint">{fileHint}</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item name="aml_registration_number" label={<span className="font-semibold">AML Registration Number</span>} rules={[req]}>
            <Input placeholder="AML-REG-2026-00123" />
          </Form.Item>
          <Form.Item
            name="aml_policy_file"
            label={<span className="font-semibold">AML Policy Document (PDF)</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload AML policy file" }]}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Choose file</p>
              <p className="ant-upload-hint">{fileHint}</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            name="risk_assessment_file"
            label={<span className="font-semibold">Risk Assessment Template</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload risk assessment file" }]}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Choose file</p>
              <p className="ant-upload-hint">{fileHint}</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            name="mlr_compliant"
            valuePropName="checked"
            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Please confirm")))}]}
          >
            <Checkbox className="!font-semibold">I confirm compliance with MLR 2017 and all subsequent updates</Checkbox>
          </Form.Item>
          <Form.Item
            name="sanctions_pep_check"
            valuePropName="checked"
            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Please confirm")))}]}
          >
            <Checkbox className="!font-semibold">I confirm that sanctions and PEP screening procedures are in place</Checkbox>
          </Form.Item>
        </>
      );
    }
    if (step === 3) {
      return (
        <>
          {sectionTitle("Section 4: Insurance")}
          {sectionSub("Provide proof of professional indemnity insurance")}
          <Form.Item
            name="insurance_certificate_file"
            label={<span className="font-semibold">Professional Indemnity Insurance Certificate</span>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload insurance certificate" }]}
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Choose file</p>
              <p className="ant-upload-hint">{fileHint}</p>
            </Upload.Dragger>
          </Form.Item>
          <Typography.Paragraph className="!mb-0 !text-sm !text-slate-600">
            Please upload a valid Professional Indemnity Insurance certificate showing current coverage.
          </Typography.Paragraph>
        </>
      );
    }
    if (step === 4) {
      return (
        <>
          {sectionTitle("Section 5: Data Protection")}
          {sectionSub("Confirm data protection compliance")}
          <Form.Item name="ico_registration_number" label={<span className="font-semibold">ICO Registration Number</span>} rules={[req]}>
            <Input placeholder="ZA123456" />
          </Form.Item>
          <Form.Item
            name="gdpr_compliant"
            valuePropName="checked"
            rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Please confirm")))}]}
          >
            <Checkbox className="!font-semibold">I confirm GDPR compliance and appropriate data protection measures are in place</Checkbox>
          </Form.Item>
        </>
      );
    }
    return (
      <>
        {sectionTitle("Section 6: Declarations")}
        {sectionSub("Accept all mandatory declarations")}
        {warningBox("All declarations must be accepted to complete onboarding.")}
        <Form.Item
          name="accept_moa"
          valuePropName="checked"
          rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Required")))}]}
        >
          <Checkbox className="!font-semibold">I accept all terms and conditions of the Master Accountant Onboarding Agreement</Checkbox>
        </Form.Item>
        <Form.Item
          name="accept_dpa"
          valuePropName="checked"
          rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Required")))}]}
        >
          <Checkbox className="!font-semibold">
            I accept the Data Processing Agreement and will handle all client data in accordance with GDPR
          </Checkbox>
        </Form.Item>
        <Form.Item
          name="accept_regulatory"
          valuePropName="checked"
          rules={[{ validator: (_, v) => (v ? Promise.resolve() : Promise.reject(new Error("Required")))}]}
        >
          <Checkbox className="!font-semibold">
            I commit to maintaining professional standards and complying with all regulatory requirements
          </Checkbox>
        </Form.Item>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Typography.Title level={2} className="!mb-1 !font-bold text-center">
          Accountant document upload onboarding
        </Typography.Title>
        <Typography.Paragraph type="secondary" className="mb-8 text-center">
          Complete all 6 steps and submit to finish onboarding.
        </Typography.Paragraph>
        <Card className="rounded-2xl border-slate-200/80 shadow-xl shadow-slate-900/5">
          <Progress percent={progressPercent} className="mb-6" />
          <Steps current={step} items={items} className="mb-10" responsive />
          <Form
            form={form}
            layout="vertical"
            size="large"
            onValuesChange={onValuesChange}
            initialValues={{ services: [] }}
          >
            {renderStep()}
          </Form>
          <div className="mt-8 flex justify-between gap-3">
            <Button size="large" disabled={step === 0 || loading} onClick={back}>
              Back
            </Button>
            {step < 5 ? (
              <Button type="primary" size="large" onClick={next} loading={loading} disabled={!canProceed || loading}>
                Next
              </Button>
            ) : (
              <Button type="primary" size="large" loading={loading} onClick={submit} disabled={!canProceed || loading}>
                Submit Documents
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
