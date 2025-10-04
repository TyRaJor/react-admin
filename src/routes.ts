// 路由配置文件
import type { RouteObject } from './types';

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    name: '首页',
    key: '1',
    icon: 'HomeOutlined',
    protected: true,
    component: () => import('@/app/page'),
  },
  {
    path: '/login',
    name: '登录',
    key: 'login',
    protected: false,
    component: () => import('@/app/login/page'),
  },
  {
    path: '/users',
    name: '用户管理',
    key: '2',
    icon: 'UsergroupAddOutlined',
    protected: true,
    component: () => import('@/app/users/page'),
  },
];

// 获取受保护的路由
export const protectedRoutes = routes.filter(route => route.protected);

// 获取公开的路由
export const publicRoutes = routes.filter(route => !route.protected);

// 根据路径查找路由
export const findRouteByPath = (path: string) => {
  return routes.find(route => route.path === path);
};

// 根据key查找路由
export const findRouteByKey = (key: string) => {
  return routes.find(route => route.key === key);
};