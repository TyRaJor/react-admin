'use client';
import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Drawer, ConfigProvider, Breadcrumb } from 'antd';
import { theme } from 'antd';
import { UserOutlined, LogoutOutlined,SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleTheme } from '../store/features/themeSlice';
import useAuth from '../hooks/useAuth';
import type { RootState } from '../store';
import { routes, findRouteByKey } from '../routes';
import type { RouteObject } from '../types';
import { subPageMap, breadcrumbConfig } from '../config/pageConfig';
import { iconMap, componentMap } from '@/config/componentConfig';
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { darkAlgorithm, defaultAlgorithm } = theme;
  const { Header, Sider, Content } = Layout;
  const { Title } = Typography;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const currentTheme = useAppSelector((state: RootState) => state.theme?.theme);
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('1');
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 新增状态跟踪展开的菜单项
  // 设置文档主题类名
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    }
  }, [currentTheme]);

  // 获取选中菜单项
  const getSelectedKey = () => {
    return currentPage;
  };

  // 获取打开的子菜单
  const getOpenKeys = () => {
    return openKeys;
  };

  // 处理子菜单展开/折叠
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 生成菜单项
  const generateMenuItems = (routes: RouteObject[]) => {
    return routes.filter(route => {
      // 过滤掉登录页面
      return route.path !== '/login';
    }).map(route => {
      const menuItem: any = {
        key: route.key,
        icon: iconMap[route.icon || ''],
        label: route.name,
      };

      // 递归处理子菜单
      if (route.children && route.children.length > 0) {
        menuItem.children = generateMenuItems(route.children);
      }

      return menuItem;
    });
  };

  const menuItems = generateMenuItems(routes);

  // 用户菜单
  const userMenu = [
    {
      key: '1',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => setCurrentPage('4-1')
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: logout
    }
  ];


  // 切换主题
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  // 切换侧边栏折叠
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // 面包屑导航生成函数
  const getBreadcrumbItems = () => {
    // 首页
    if (currentPage === '1') {
      return [{
        key: '1',
        title: '首页',
        onClick: () => setCurrentPage('1'),
      }];
    }

    // 检查是否有配置的面包屑导航
    const config = breadcrumbConfig[currentPage];

    // 如果有配置的面包屑导航（二级页面）
    if (config && config.parentKey && config.parentTitle) {
      const breadcrumbItems = [
        {
          key: config.parentKey,
          title: config.parentTitle,
          onClick: () => config.parentKey && setCurrentPage(config.parentKey),
        }
      ];

      // 添加子页面（如果在subPageMap中有定义）
      if (subPageMap[currentPage]) {
        breadcrumbItems.push({
          key: currentPage,
          title: subPageMap[currentPage]
        } as any);
      }

      return breadcrumbItems;
    }

    // 其他顶级页面
    const route = findRouteByKey(currentPage);
    if (route) {
      return [{
        key: currentPage,
        title: route.name,
        onClick: () => setCurrentPage(currentPage),
      }];
    }

    return [];
  };

  // 自定义主题
  const customTheme = {
    token: {
      colorPrimary: '#1677ff',
    },
  };

  // 渲染页面内容
  const renderPageContent = () => {
    if (currentPage === '1') {
      return children;
    }

    const Component = componentMap[currentPage];
    if (!Component) {
      return <div>页面未找到</div>;
    }

    return (
      <Suspense fallback={<div>加载中...</div>}>
        <Component />
      </Suspense>
    );
  };

  return (
    <ConfigProvider theme={{ ...customTheme, algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm }}>
      <Layout className={`min-h-screen flex flex-col ${currentTheme === 'dark' ? 'dark bg-gray-900' : 'bg-white'}`} style={{ height: '100vh' }}>
        <Header
          className={`flex shadow-sm transition-colors duration-200 ${currentTheme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}
          style={{
            padding: '0 24px',
            height: 64,
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            flexDirection: 'row', // 改为水平布局
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? iconMap.MenuUnfoldOutlined : iconMap.MenuFoldOutlined}
              onClick={toggleCollapsed}
              className={`hidden lg:block ${currentTheme === 'dark' ? 'text-white' : ''}`}
            />
            <div className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Logo" className="h-8 w-8 rounded-lg shadow-md transition-transform duration-300 hover:scale-110" />
              <Title 
                level={3} 
                className={`m-3 font-bold tracking-tight transition-all duration-300 ${currentTheme === 'dark' ? 'text-blue-400 drop-shadow-[0_0_3px_rgba(96,165,250,0.5)]' : 'text-blue-700 drop-shadow-[0_0_2px_rgba(29,78,216,0.3)]'} 
                hover:scale-105 hover:tracking-wide `}
              >
                React Admin
              </Title>
            </div>

            {/* 面包屑导航移到标题旁边 */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
              <Breadcrumb
                items={getBreadcrumbItems()}
                className={`${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleToggleTheme}
              type="default"
              className={currentTheme === 'dark' ? 'text-white border-white/20 bg-gray-700' : ''}
            >
              {currentTheme === 'dark' ? '浅色' : '深色'}
            </Button>
            <Dropdown menu={{ items: userMenu }} trigger={['click']}>
              <div className="flex items-center cursor-pointer" onClick={(e) => e.preventDefault()}>
                <Avatar
                  size="small"
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  className={currentTheme === 'dark' ? 'bg-blue-500' : ''}
                />
                <span className={`hidden md:inline ${currentTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user?.name || '未登录'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Layout className="flex-1 overflow-hidden">
          <Sider
            width={250}
            theme={currentTheme === 'dark' ? 'dark' : 'light'}
            className={`transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            collapsedWidth={0}
            collapsed={collapsed}
            breakpoint="lg"
            onBreakpoint={(broken) => broken && setCollapsed(true)}
            onCollapse={setCollapsed}
            style={{ height: '100%', minHeight: 0 }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              openKeys={getOpenKeys()}
              onOpenChange={handleOpenChange}
              items={menuItems}
              className={`h-full border-right-0 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              style={{ paddingTop: '20px' }}
              onClick={(e) => setCurrentPage(e.key)}
            />
          </Sider>

          <Content
            className={`flex-1 overflow-auto ${currentTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
            style={{ flexShrink: 0 }}
          >
            <div className="p-6">
              {renderPageContent()}
            </div>
          </Content>
        </Layout>

        {/* 移动端菜单抽屉 */}
        <Drawer
          title="菜单"
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          className={currentTheme === 'dark' ? 'dark' : ''}
          styles={{
            content: {
              backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
              color: currentTheme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            openKeys={getOpenKeys()}
            onOpenChange={handleOpenChange}
            items={menuItems}
            style={{ height: '100%', borderRight: 0, backgroundColor: 'transparent' }}
            onClick={(e) => {
              setCurrentPage(e.key);
              setMobileMenuOpen(false);
            }}
          />
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;