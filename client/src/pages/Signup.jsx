import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

function Signup() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await axios.post("/api/auth/signup", {
        ...values,
        role: "client",
      });

      message.success("Verification email sent");
    } catch (err) {
      message.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <Form onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true }]}>
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default Signup;