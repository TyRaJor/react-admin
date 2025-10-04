'use client';
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Popconfirm, Typography, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types';
import userService from '../services/userService';

const { Title } = Typography;
const { Column } = Table;

interface FormData {
  username: string;
  email: string;
  role: 'admin' | 'user';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // 适配新的接口，不再需要分页参数
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch {
      message.error('获取用户列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 显示添加用户模态框
  const showAddModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 显示编辑用户模态框
  const showEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 处理保存用户
  const handleSave = async (values: FormData) => {
    setIsLoading(true);
    try {
      if (editingUser) {
        // 编辑现有用户
        await userService.updateUser({
          username: values.username,
          email: values.email,
          role: values.role,
          id: editingUser.id,
        });
        message.success('用户更新成功');
      } else {
        // 添加新用户
        const newUserData = {
          username: values.username,
          email: values.email,
          role: values.role,
        };
        await userService.addUser(newUserData as Omit<User, 'id'>);
        message.success('用户添加成功');
      }
      
      // 重新获取用户列表
      fetchUsers();
      // 关闭模态框
      setIsModalVisible(false);
    } catch (error: unknown) {
      message.error(
        error instanceof Error ? error.message : '操作失败，请重试'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      // 调用服务删除用户
      await userService.deleteUser(id);
      
      // 更新本地状态
      setUsers(users.filter(user => user.id !== id));
      message.success('用户删除成功');
    } catch {
      message.error('删除失败');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>用户管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          添加用户
        </Button>
      </div>

      <Table
        dataSource={users}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      >
        <Column title="用户名" dataIndex="username" key="username" />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="角色" dataIndex="role" key="role" />
        <Column
          title="操作"
          key="action"
          render={(_, record: User) => (
            <Space size="middle">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定要删除这个用户吗?"
                onConfirm={() => handleDelete(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            role: 'user',
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Input placeholder="请输入角色" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;