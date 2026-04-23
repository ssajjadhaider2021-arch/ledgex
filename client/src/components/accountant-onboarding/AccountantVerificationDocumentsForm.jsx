import React, { useCallback, useMemo, useState } from "react";
import { Button, Card, Form, Tag, Typography, Upload, message } from "antd";
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { submitAccountantVerificationDocuments } from "../../api/accountant.api";

const REQUIRED_FIELDS = [
  "passport_or_license",
  "proof_of_address",
  "qualification_certificate",
  "insurance_certificate",
  "firm_registration_doc",
  "bank_statement",
  "aml_supervision_doc",
];

const FILE_HINT = "Accepted formats: .pdf, .jpg, .jpeg, .png  ·  Max size: 10 MB";

const UPLOAD_FIELDS = [
  {
    key: "passport_or_license",
    title: "Passport or Driving License",
    required: true,
    help: "Valid government-issued photo ID (passport, driving license, or national ID card)",
  },
  {
    key: "proof_of_address",
    title: "Proof of Address",
    required: true,
    help: "Utility bill, bank statement, or council tax bill (dated within last 3 months)",
  },
  {
    key: "qualification_certificate",
    title: "Professional Qualification Certificate",
    required: true,
    help: "AAT, ACCA, ICAEW, CIMA, or equivalent accounting qualification certificate",
  },
  {
    key: "insurance_certificate",
    title: "Professional Indemnity Insurance",
    required: true,
    help: "Current professional indemnity insurance certificate (must be in force)",
  },
  {
    key: "firm_registration_doc",
    title: "Firm Registration Documents",
    required: true,
    help: "Companies House certificate of incorporation, or sole trader registration if applicable",
  },
  {
    key: "practice_license",
    title: "Practice Licence",
    required: false,
    help: "ACCA/ICAEW practice licence or practising certificate (if applicable to your practice type)",
  },
  {
    key: "bank_statement",
    title: "Business Bank Statement",
    required: true,
    help: "Recent business bank statement showing firm name (dated within last 3 months)",
  },
  {
    key: "aml_supervision_doc",
    title: "AML Supervision Registration",
    required: true,
    help: "Evidence of registration with an AML supervisory body (HMRC, ACCA, ICAEW, etc.)",
  },
];

const REQUIREMENTS = [
  "All documents must be in PDF, JPG, or PNG format",
  "Maximum file size is 10MB per document",
  "Ensure all text is clearly visible and readable",
  "Proof of address and bank statement must be dated within the last 3 months",
  "Professional qualifications and PI insurance must be current and valid",
  "Firm registration documents must match your Companies House records",
  "AML supervision registration must show your supervisory body membership",
];

function normFile(e) {
  if (Array.isArray(e)) return e;
  return e?.fileList ?? [];
}

function hasAtLeastOneFile(list) {
  return Array.isArray(list) && list.length > 0;
}

export default function AccountantVerificationDocumentsForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [watchedValues, setWatchedValues] = useState({});
  const navigate = useNavigate();

  /** Form.useWatch([], form) does not reliably re-render when Upload fileList changes; read after store updates. */
  const syncValuesFromForm = useCallback(() => {
    requestAnimationFrame(() => {
      setWatchedValues(form.getFieldsValue(true));
    });
  }, [form]);

  const canSubmit = useMemo(() => {
    const currentValues = watchedValues || {};
    return REQUIRED_FIELDS.every((field) => hasAtLeastOneFile(currentValues[field]));
  }, [watchedValues]);

  const uploadProps = {
    accept: ".pdf,.jpg,.jpeg,.png",
    maxCount: 1,
    listType: "text",
    beforeUpload: (file) => {
      const filename = (file.name || "").toLowerCase();
      const hasValidExt = [".pdf", ".jpg", ".jpeg", ".png"].some((ext) => filename.endsWith(ext));
      const isValidType = ["application/pdf", "image/jpeg", "image/png"].includes(file.type) || hasValidExt;
      if (!isValidType) {
        message.error("Only PDF, JPG, JPEG, and PNG files are allowed");
        return Upload.LIST_IGNORE;
      }
      const isUnder10Mb = file.size <= 10 * 1024 * 1024;
      if (!isUnder10Mb) {
        message.error("Each file must be 10MB or smaller");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
  };

  const onSubmit = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue(true);
      const fd = new FormData();
      for (const field of UPLOAD_FIELDS) {
        const f = formValues[field.key]?.[0]?.originFileObj;
        if (f) fd.append(field.key, f);
      }
      setLoading(true);
      await submitAccountantVerificationDocuments(fd);
      message.success("Verification documents submitted successfully");
      navigate("/onboarding-status");
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || err?.message || "Could not submit documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/60 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-96 w-96 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="mb-8 text-center">
          <Tag className="!mb-4 !border-indigo-200 !bg-indigo-50 !px-3 !text-indigo-700">
            Step 3 of onboarding
          </Tag>
          <Typography.Title
            level={2}
            className="!mb-3 !text-balance !font-bold !tracking-tight !text-slate-900 md:!text-3xl"
          >
            Accountant Onboarding Step 3: Identity Verification and AML Check
          </Typography.Title>
          <Typography.Paragraph className="!mb-0 !text-base !text-slate-600 md:!text-lg">
            Complete document upload to proceed with compliance verification.
          </Typography.Paragraph>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-900/5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
            <SafetyCertificateOutlined className="!text-2xl !text-amber-600 md:!mt-1" />
            <div>
              <Typography.Text strong className="!mb-2 !block !text-base !text-amber-950">
                Identity Verification Required
              </Typography.Text>
              <Typography.Paragraph className="!mb-0 !leading-relaxed !text-slate-600">
                To comply with AML regulations, we need to verify your identity and professional qualifications. Please
                upload the required documents below. All documents must be clear, legible, and dated within the specified
                timeframes.
              </Typography.Paragraph>
            </div>
          </div>
        </div>

        <Card
          className="!mb-6 !rounded-2xl !border-slate-200/90 !bg-white/95 !shadow-xl !shadow-slate-900/5 !backdrop-blur-sm"
          styles={{ body: { padding: "1.5rem 1.25rem" } }}
        >
          <div className="mb-6 border-b border-slate-100 pb-5">
            <div className="mb-1 flex items-center gap-2">
              <FileProtectOutlined className="!text-indigo-600" />
              <Typography.Title level={4} className="!m-0 !font-bold !text-slate-900">
                Required Documents
              </Typography.Title>
            </div>
            <Typography.Text className="!text-slate-500">Document Upload</Typography.Text>
            <Typography.Paragraph className="!mb-0 !mt-2 !text-slate-600">
              Please upload the required documents for verification. All documents marked with{" "}
              <span className="font-semibold text-amber-700">*</span> are mandatory.
            </Typography.Paragraph>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            onValuesChange={syncValuesFromForm}
            className="verification-upload-form"
            requiredMark={false}
          >
            {UPLOAD_FIELDS.map((field) => (
              <Form.Item
                key={field.key}
                className="!mb-6 last:!mb-0"
                label={
                  <span className="!font-semibold !text-slate-800">
                    {field.title}
                    {field.required ? <span className="text-amber-700"> *</span> : null}
                  </span>
                }
              >
                <div className="w-full">
                  <Typography.Paragraph className="!-mt-1 !mb-2 !text-sm !leading-relaxed !text-slate-600">
                    {field.help}
                  </Typography.Paragraph>
                  <Typography.Text className="!mb-3 !block !text-xs !text-slate-500">{FILE_HINT}</Typography.Text>
                  {/* Upload must be the only child of the named Form.Item so fileList binds correctly */}
                  <Form.Item
                    name={field.key}
                    noStyle
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={
                      field.required
                        ? [
                            {
                              validator: (_, list) =>
                                hasAtLeastOneFile(list) ? Promise.resolve() : Promise.reject(new Error("Required")),
                            },
                          ]
                        : []
                    }
                  >
                    <Upload {...uploadProps}>
                      <Button
                        type="default"
                        size="large"
                        icon={<CloudUploadOutlined />}
                        className="!border-slate-200 !bg-white !text-slate-700 !shadow-sm hover:!border-indigo-300 hover:!text-indigo-800"
                      >
                        Choose file
                      </Button>
                    </Upload>
                  </Form.Item>
                </div>
              </Form.Item>
            ))}

            <div className="!mt-8">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={!canSubmit || loading}
                icon={<CheckCircleOutlined />}
                className="!h-12 !border-0 !bg-gradient-to-r !from-indigo-600 !to-violet-600 !font-semibold !shadow-lg !shadow-indigo-500/25 hover:!from-indigo-500 hover:!to-violet-500"
              >
                Continue to Verification
              </Button>
            </div>
          </Form>
        </Card>

        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-md shadow-slate-900/5 backdrop-blur-sm md:p-6">
          <Typography.Title level={5} className="!m-0 !mb-3 !font-bold !text-slate-900">
            Document Requirements
          </Typography.Title>
          <ul className="m-0 list-none space-y-2 p-0">
            {REQUIREMENTS.map((line) => (
              <li key={line} className="flex gap-2 text-sm text-slate-600">
                <span className="shrink-0 text-indigo-500">•</span>
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
