'use client';

import { Card, Typography, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const OrderTest = () => {
  const router = useRouter();

  return (
    <Card>
      <Title level={4}>订单管理测试</Title>
      <Paragraph>
        这是订单管理页面的内容。
      </Paragraph>
      <Space>
        <Button type="primary">主要操作</Button>
        <Button>次要操作</Button>
      </Space>
    </Card>
  );
};

export default OrderTest;
