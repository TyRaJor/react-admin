'use client';
import { Card, Table, Button, Space, Typography, Modal, Form, Input, Select, InputNumber } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

// 用户类型定义
interface User {
  key: string;
  name: string;
  age: number;
  address: string;
  role: string;
  status: string;
}

// 初始模拟用户数据
const initialUsers: User[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市海淀区',
    role: '管理员',
    status: '启用',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
    role: '编辑',
    status: '启用',
  },
  {
    key: '3',
    name: '王五',
    age: 32,
    address: '广州市天河区',
    role: '查看者',
    status: '禁用',
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 显示新增用户模态框
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 显示编辑用户模态框
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  // 删除用户
  const handleDeleteUser = (key: string) => {
    setUsers(users.filter(user => user.key !== key));
  };

  // 保存用户数据（新增或编辑）
  const handleSaveUser = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑现有用户
        setUsers(users.map(user => 
          user.key === editingUser.key ? { ...user, ...values } : user
        ));
      } else {
        // 添加新用户
        const newUser: User = {
          ...values,
          key: String(Date.now()), // 使用时间戳作为唯一key
        };
        setUsers([...users, newUser]);
      }
      
      // 关闭模态框
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button size="small" onClick={() => handleEditUser(record)}>编辑</Button>
          <Button size="small" danger onClick={() => handleDeleteUser(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <Title level={4} className="m-0">用户管理</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              loading={loading}
            >
              新增用户
            </Button>
            <Button icon={<SearchOutlined />}>搜索用户</Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table columns={columns} dataSource={users} rowKey="key"
      />
      </Card>

      {/* 添加/编辑用户模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={isModalVisible}
        onOk={handleSaveUser}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            age: 0,
            address: '',
            role: '查看者',
            status: '启用',
          }}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="年龄"
            name="age"
            rules={[{ required: true, message: '请输入年龄' }]}
          >
            <InputNumber min={1} max={150} style={{ width: '100%' }} placeholder="请输入年龄" />
          </Form.Item>

          <Form.Item
            label="地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="管理员">管理员</Option>
              <Option value="编辑">编辑</Option>
              <Option value="查看者">查看者</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}