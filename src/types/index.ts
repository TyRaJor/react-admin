// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  user: User;
  token: string;
}

// 路由配置类型
export interface RouteObject {
  path: string;
  name: string;
  key: string;
  icon?: string;
  protected: boolean;
  component: () => Promise<{ default: React.ComponentType }>;
}

// 模拟数据 - 用户列表
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: '系统管理员',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    name: '用户一',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    username: 'user2',
    email: 'user2@example.com',
    name: '用户二',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
];
