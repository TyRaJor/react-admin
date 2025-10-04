'use client';

import { useState } from 'react';
import { Card, Form, Switch, Select, InputNumber, Slider, Button, Space, Divider, message } from 'antd';
import { SettingOutlined, BellOutlined, ClockCircleOutlined, LayoutOutlined } from '@ant-design/icons';
import useMessage from 'antd/es/message/useMessage';

const SystemSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('系统配置更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="system-settings">
      <Card title="系统配置" className="mb-4">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enableAutoSave: true,
            themeMode: 'light',
            pageSize: 20,
            timeout: 30,
            notificationSound: true,
            notificationDisplayTime: 5,
            sidebarCollapse: false,
            animateComponents: true,
          }}
          onFinish={handleSubmit}
        >
          <Card title="基础设置" className="mb-4">
            <Form.Item
              label="启用自动保存"
              name="enableAutoSave"
              valuePropName="checked"
              tooltip="开启后，表单数据将自动保存"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            <Form.Item
              label="主题模式"
              name="themeMode"
            >
              <Select placeholder="选择主题模式">
                <Select.Option value="light">浅色模式</Select.Option>
                <Select.Option value="dark">深色模式</Select.Option>
                <Select.Option value="auto">跟随系统</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="默认分页大小"
              name="pageSize"
              tooltip="表格默认每页显示的记录数"
            >
              <InputNumber min={10} max={100} step={10} />
            </Form.Item>
          </Card>

          <Card title="安全设置" className="mb-4">
            <Form.Item
              label="会话超时时间（分钟）"
              name="timeout"
              tooltip="超过此时间未操作将自动登出"
            >
              <Slider min={5} max={120} marks={{ 5: '5', 30: '30', 60: '60', 120: '120' }} />
            </Form.Item>
          </Card>

          <Card title="通知设置">
            <Form.Item
              label="通知声音"
              name="notificationSound"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>

            <Form.Item
              label="通知显示时间（秒）"
              name="notificationDisplayTime"
            >
              <Slider min={1} max={10} marks={{ 1: '1', 5: '5', 10: '10' }} />
            </Form.Item>
          </Card>

          <Card title="界面设置">
            <Form.Item
              label="侧边栏默认折叠"
              name="sidebarCollapse"
              valuePropName="checked"
            >
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>

            <Form.Item
              label="启用组件动画"
              name="animateComponents"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Card>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                恢复默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemSettings;