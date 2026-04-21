import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];
const MAX_SIZE_MB = 5;

export function FileUploadField({ label, value, onChange }) {
  const beforeUpload = (file) => {
    if (!ALLOWED.includes(file.type)) return message.error("Only PDF/PNG/JPG allowed"), Upload.LIST_IGNORE;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return message.error("Max file size is 5MB"), Upload.LIST_IGNORE;
    return false;
  };
  
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-zinc-200">{label}</p>
      <Upload
        maxCount={1}
        beforeUpload={beforeUpload}
        customRequest={({ onSuccess }) => onSuccess?.("ok")}
        fileList={value ? [value] : []}
        onChange={({ fileList }) => onChange(fileList[0] || null)}
      >
        <button type="button" className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-left text-zinc-200">
          <UploadOutlined className="mr-2" /> Upload file
        </button>
      </Upload>
    </div>
  );
}
