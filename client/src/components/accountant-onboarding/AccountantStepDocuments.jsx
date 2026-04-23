import { Form, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { MAX_FILE_MB } from "../../constants/accountantOnboarding";

const maxBytes = MAX_FILE_MB * 1024 * 1024;

function normFile(e) {
  if (Array.isArray(e)) return e;
  return e?.fileList ?? [];
}

export default function AccountantStepDocuments() {
  return (
    <Form.Item
      name="documents"
      label="Certificates & licenses"
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[
        {
          validator(_, list) {
            if (!list?.length) return Promise.reject(new Error("Upload at least one file"));
            return Promise.resolve();
          },
        },
      ]}
    >
      <Upload.Dragger
        multiple
        maxCount={10}
        beforeUpload={(file) => {
          if (file.size > maxBytes) {
            message.error(`${file.name} exceeds ${MAX_FILE_MB} MB`);
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files here</p>
        <p className="ant-upload-hint">PDF, JPG, PNG — max {MAX_FILE_MB} MB each</p>
      </Upload.Dragger>
    </Form.Item>
  );
}
