import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import { LoginParams } from '../types';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const { login, isAuthenticated } = useAuth();

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  // 处理表单提交
  const handleSubmit = async (values: LoginParams) => {
    setLoading(true);
    try {
      await login(values);
      // 登录成功后会通过useEffect自动重定向
    } catch {
      // 错误已在useAuth中处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="min-h-screen">
      <Col xs={24} sm={12} md={8}>
        <Card className="p-6">
          <Title level={2} className="text-center mb-6">
            系统登录
          </Title>
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="text-center text-gray-500 mt-4">
            测试账号: admin / 任意密码
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;