'use client';

import { Card, Typography, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const 测试页面 = () => {
  const router = useRouter();

  return (
    <Card>
      <Title level={4}>测试页面</Title>
      <Paragraph>
        这是测试页面页面的内容。
      </Paragraph>
      <Space>
        <Button type="primary">主要操作</Button>
        <Button>次要操作</Button>
      </Space>
    </Card>
  );
};

export default 测试页面;
