'use client';

import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Checkbox, TreeSelect, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { User } from '@/types';

const PermissionManagement = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟角色数据
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['read', 'write', 'delete', 'manage'],
      createTime: '2024-01-01',
      status: 'active',
    },
    {
      id: '2',
      name: '编辑',
      description: '可以编辑和查看内容',
      permissions: ['read', 'write'],
      createTime: '2024-01-02',
      status: 'active',
    },
    {
      id: '3',
      name: '查看者',
      description: '只能查看内容',
      permissions: ['read'],
      createTime: '2024-01-03',
      status: 'inactive',
    },
  ]);

  // 权限树数据
  const permissionTreeData = [
    {
      title: '用户管理',
      value: 'user_manage',
      children: [
        { title: '查看用户', value: 'user_view' },
        { title: '创建用户', value: 'user_create' },
        { title: '编辑用户', value: 'user_edit' },
        { title: '删除用户', value: 'user_delete' },
      ],
    },
    {
      title: '产品管理',
      value: 'product_manage',
      children: [
        { title: '查看产品', value: 'product_view' },
        { title: '创建产品', value: 'product_create' },
        { title: '编辑产品', value: 'product_edit' },
        { title: '删除产品', value: 'product_delete' },
      ],
    },
    {
      title: '系统设置',
      value: 'system_manage',
      children: [
        { title: '个人设置', value: 'profile_setting' },
        { title: '系统配置', value: 'system_setting' },
        { title: '权限管理', value: 'permission_manage' },
      ],
    },
  ];

  const handleCreateRole = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      status: role.status === 'active',
    });
    setIsModalVisible(true);
  };

  const handleDeleteRole = (role: any) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除角色「${role.name}」吗？`,
      onOk() {
        setRoles(roles.filter(r => r.id !== role.id));
        message.success('角色删除成功');
      },
    });
  };

  const handleSaveRole = async (values: any) => {
    if (editingRole) {
      // 编辑现有角色
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...values, status: values.status ? 'active' : 'inactive' }
          : role
      ));
      message.success('角色更新成功');
    } else {
      // 创建新角色
      const newRole = {
        id: String(Date.now()),
        ...values,
        createTime: new Date().toISOString().split('T')[0],
        status: values.status ? 'active' : 'inactive',
      };
      setRoles([...roles, newRole]);
      message.success('角色创建成功');
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '权限数量',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => permissions.length,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_:any, record: User) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRole(record)}>
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteRole(record)}
            disabled={record.id === '1'} // 超级管理员不可删除
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys :any) => setSelectedRowKeys(newSelectedRowKeys),
  };

  return (
    <div className="permission-management">
      <Card title="权限管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>新增角色</Button>}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={roles as any[]}
          rowKey="id"
        />
      </Card>

      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveRole}
          initialValues={{
            status: true,
            permissions: [],
          }}
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="角色名称" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="角色描述" />
          </Form.Item>

          <Form.Item
            label="权限设置"
            name="permissions"
          >
            <TreeSelect
              placeholder="选择权限"
              treeData={permissionTreeData}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item
            label="启用角色"
            name="status"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagement;