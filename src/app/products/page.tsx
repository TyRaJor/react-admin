'use client';
import { Card, Typography, Button, Space, Table } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

// 产品类型定义
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductManagement() {
  const [loading, setLoading] = useState(false);

  // 模拟产品数据
  const products: Product[] = [
    { id: 1, name: '产品A', price: 100, stock: 1000, category: '电子产品' },
    { id: 2, name: '产品B', price: 200, stock: 500, category: '办公用品' },
    { id: 3, name: '产品C', price: 300, stock: 2000, category: '家居用品' },
  ];

  // 表格列定义
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button size="small">编辑</Button>
          <Button size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAddProduct = () => {
    // 添加产品的逻辑
    console.log('添加产品');
  };

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <Title level={4} className="m-0">产品管理</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddProduct}
              loading={loading}
            >
              新增产品
            </Button>
            <Button icon={<SearchOutlined />}>搜索产品</Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={products} 
          rowKey="id" 
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
}