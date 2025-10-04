'use client';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, FileTextOutlined, BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
const Dashboard = () => {
  const theme = useAppSelector((state: RootState) => state.theme?.theme);
  // 模拟统计数据
  const stats = [
    {
      title: '用户总数',
      value: 1280,
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: '今日新增',
      value: 24,
      icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
    },
    {
      title: '活跃用户',
      value: 856,
      icon: <BarChartOutlined style={{ color: '#faad14' }} />,
    },
    {
      title: '系统配置',
      value: 12,
      icon: <SettingOutlined style={{ color: '#f5222d' }} />,
    },
  ];

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card className={theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                className={theme === 'dark' ? 'text-white' : ''}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Card className={`mt-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>欢迎使用 React Admin 系统</h2>
        <p className={theme === 'dark' ? 'text-gray-300' : ''}>这是一个基于 Next.js、React、Ant Design 和 TypeScript 构建的管理系统模板。</p>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : ''}`}>功能特点：</p>
        <ul className={`list-disc pl-6 mt-2 ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          <li>用户认证与授权</li>
          <li>用户管理</li>
          <li>响应式布局</li>
          <li>深色/浅色主题切换</li>
          <li>状态持久化</li>
          <li>模拟数据支持</li>
        </ul>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
