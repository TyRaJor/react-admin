import { Layout, Menu, Avatar, Dropdown, Button, Typography, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined, UsergroupAddOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/features/themeSlice';
import useAuth from '../hooks/useAuth';
import type { RootState } from '../store';
import { protectedRoutes } from '../routes';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 图标映射
const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  UsergroupAddOutlined: <UsergroupAddOutlined />,
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth?.user);
  const theme = useAppSelector((state: RootState) => state.theme?.theme);
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 根据当前路径获取选中的菜单项
  const getSelectedKey = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const route = protectedRoutes.find(r => r.path === path || path.startsWith(r.path + '/'));
      return route?.key || '1';
    }
    return '1';
  };

  // 根据路由配置生成菜单项
  const menuItems = protectedRoutes.map(route => ({
    key: route.key,
    icon: iconMap[route.icon || ''],
    label: route.name,
    onClick: () => {
      router.push(route.path);
      setMobileMenuOpen(false);
    },
  }));

  // 用户菜单
  const userMenu = [
    {
      key: '1',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => router.push('/settings'),
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: logout,
    },
  ];

  // 切换主题
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // 切换侧边栏折叠状态
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 响应式布局 - 移动端菜单
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <Layout className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`} style={{ height: '100vh' }}>
      <Header className={`flex items-center justify-between px-4 shadow-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`} style={{ padding: '0 24px', height: 64 }}>
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            className="lg:hidden mr-2"
          />
          <Button 
            type="text" 
            icon={<MenuFoldOutlined />}
            onClick={toggleMobileMenu}
            className="md:hidden mr-2"
          />
          <Title level={3} className="m-0 text-blue-600">React Admin</Title>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleToggleTheme}
            type="default"
            className={theme === 'dark' ? 'text-white border-white/20' : ''}
          >
            {theme === 'light' ? '切换暗色' : '切换亮色'}
          </Button>
          <Dropdown menu={{ items: userMenu }}>
            <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <Avatar 
                src={user?.avatar} 
                icon={<UserOutlined />}
                className={theme === 'dark' ? 'bg-blue-500' : ''}
              />
              <span className="hidden md:inline">{user?.name || '未登录'}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      
      {/* 主要内容区域 - 自动填充剩余空间 */}
      <Layout className="flex-1 overflow-hidden">
        <Sider 
          width={250}
          theme={theme === 'dark' ? 'dark' : 'light'}
          className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-all duration-300`}
          collapsedWidth={0}
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={(broken) => {
            if (broken) {
              setCollapsed(true);
            }
          }}
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          style={{ height: '100%', minHeight: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            className={`h-full border-right-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
            style={{
              paddingTop: '20px',
            }}
          />
        </Sider>
        
        <Content 
          className={`flex-1 overflow-auto p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}
          style={{ flexShrink: 0 }}
        >
          {children}
        </Content>
      </Layout>
      
      {/* 移动端菜单抽屉 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className={theme === 'dark' ? 'dark' : ''}
        styles={{
          content: {
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
          },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            height: '100%',
            borderRight: 0,
            backgroundColor: 'transparent',
          }}
        />
      </Drawer>
    </Layout>
  );
};

export default MainLayout;