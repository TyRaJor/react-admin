'use client';

import { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, Select, Switch, message } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const ProfileSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('个人设置更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = ({ file }: any) => {
    // 模拟上传
    setTimeout(() => {
      message.success('头像上传成功');
    }, 1000);
    return false; // 阻止默认上传行为
  };

  const handlePasswordChange = (values: any) => {
    message.success('密码修改成功');
  };

  return (
    <div className="profile-settings">
      <Card title="个人设置" className="mb-4">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: 'admin',
            email: 'admin@example.com',
            phone: '13800138000',
            department: '技术部',
            enableNotifications: true,
          }}
          onFinish={handleSubmit}
        >
          <div className="flex items-center mb-6">
            <Avatar size={80} icon={<UserOutlined />} className="mr-4" />
            <Upload.Dragger accept="image/*" customRequest={handleUpload} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽头像到此处上传</p>
            </Upload.Dragger>
          </div>

          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item
            label="部门"
            name="department"
          >
            <Select placeholder="请选择部门">
              <Select.Option value="技术部">技术部</Select.Option>
              <Select.Option value="市场部">市场部</Select.Option>
              <Select.Option value="销售部">销售部</Select.Option>
              <Select.Option value="人事部">人事部</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="启用通知"
            name="enableNotifications"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="修改密码">
        <Form layout="vertical" onFinish={handlePasswordChange}>
          <Form.Item
            label="旧密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入旧密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="旧密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, min: 6, message: '密码长度至少6位' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileSettings;