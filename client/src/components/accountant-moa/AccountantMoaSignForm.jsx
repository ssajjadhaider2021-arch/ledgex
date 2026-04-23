import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
import { signAccountantMoa } from "../../api/accountant.api";
import { moaSignChecklist } from "./moaSignChecklistConfig";

const mustCheck = {
  validator: (_, v) =>
    v ? Promise.resolve() : Promise.reject(new Error("Please confirm to continue")),
};

export default function AccountantMoaSignForm({ scrollComplete }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signAccountantMoa({
        fullName: values.fullName.trim(),
        firmName: values.firmName.trim(),
        accepted: true,
      });
      message.success("Agreement signed successfully");
      navigate("/accountant/onboarding");
    } catch (err) {
      message.error(err?.response?.data?.message || "Could not save signature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="mt-10">
      {moaSignChecklist.map(({ name, label }) => (
        <Form.Item key={name} name={name} valuePropName="checked" rules={[mustCheck]}>
          <Checkbox disabled={!scrollComplete}>{label}</Checkbox>
        </Form.Item>
      ))}
      <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
        <Input size="large" placeholder="As registered" disabled={!scrollComplete} />
      </Form.Item>
      <Form.Item name="firmName" label="Firm name" rules={[{ required: true }]}>
        <Input size="large" placeholder="Practice / firm name" disabled={!scrollComplete} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block loading={loading} disabled={!scrollComplete}>
          Sign Agreement
        </Button>
      </Form.Item>
    </Form>
  );
}
