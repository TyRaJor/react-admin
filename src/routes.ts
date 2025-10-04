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
    protected: false,
    component: () => import('@/app/users/page'),
  },
  {
    path: '/products',
    name: '产品管理',
    key: '3',
    icon: 'ShoppingCartOutlined',
    protected: false,
    component: () => import('@/app/products/page'),
  },
  {
    path: '/settings',
    name: '系统设置',
    key: '4',
    icon: 'SettingOutlined',
    protected: true,
    component: () => import('@/app/settings/profile/page'), // 默认显示个人设置
    children: [
      {
        path: '/settings/profile',
        name: '个人设置',
        key: '4-1',
        protected: true,
        component: () => import('@/app/settings/profile/page'),
      },
      {
        path: '/settings/system',
        name: '系统配置',
        key: '4-2',
        protected: true,
        component: () => import('@/app/settings/system/page'),
      },
      {
        path: '/settings/permissions',
        name: '权限管理',
        key: '4-3',
        protected: true,
        component: () => import('@/app/settings/permissions/page'),
      }
    ]
  },
  {
    key: '5',
    name: '订单管理',
    path: '/orders',
    icon: 'OrderedListOutlined',
    protected: true,
    component: () => import('@/app/orders/test/page'),
    children: [
      {
        path: '/orders/test',
        name: '订单管理测试',
        key: '5-1',
        protected: true,
        component: () => import('@/app/orders/test/page'),
      }
    ]
  },
  {
    key: '999',
    name: '测试页面',
    path: '/test',
    icon: 'TestOutlined',
    protected: true,
    component: () => import('@/app/test/page'),
    children: []
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
  // 先在顶级路由中查找
  let route = routes.find(route => route.key === key);
  if (route) return route;
  
  // 如果顶级路由没找到，在子路由中查找
  for (const parentRoute of routes) {
    if (parentRoute.children) {
      route = parentRoute.children.find(child => child.key === key);
      if (route) return route;
    }
  }
  
  return undefined;
};

// 递归获取所有路由，包括子路由
export const getAllRoutes = (routes: RouteObject[]): RouteObject[] => {
  let allRoutes: RouteObject[] = [];
  
  routes.forEach(route => {
    allRoutes.push(route);
    if (route.children && route.children.length > 0) {
      allRoutes = [...allRoutes, ...getAllRoutes(route.children)];
    }
  });
  
  return allRoutes;
};