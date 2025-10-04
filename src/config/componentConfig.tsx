// 组件和图标映射配置文件

import React from 'react';
import { lazy } from 'react';
import { 
  HomeOutlined, 
  UsergroupAddOutlined, 
  ShoppingCartOutlined, 
  SettingOutlined, 
  OrderedListOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

// 图标映射配置
export const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  UsergroupAddOutlined: <UsergroupAddOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  SettingOutlined: <SettingOutlined />,
  OrderedListOutlined: <OrderedListOutlined />,
  UserOutlined: <UserOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  MenuFoldOutlined: <MenuFoldOutlined />,
  MenuUnfoldOutlined: <MenuUnfoldOutlined />,
  TestOutlined: <SettingOutlined />,
  OrderedListTestOutlined: <OrderedListOutlined />,
};

// 组件映射配置
export const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  '1': lazy(() => import('@/app/page')),
  '2': lazy(() => import('@/app/users/page')),
  '3': lazy(() => import('@/app/products/page')),
  '4': lazy(() => import('@/app/settings/profile/page')),
  '4-1': lazy(() => import('@/app/settings/profile/page')),
  '4-2': lazy(() => import('@/app/settings/system/page')),
  '4-3': lazy(() => import('@/app/settings/permissions/page')),
  '5': lazy(() => import('@/app/orders/test/page')),
  '999': lazy(() => import('@/app/test/page')),
  '5-1': lazy(() => import('@/app/orders/test/page'))
};