import { User, LoginParams, LoginResponse } from '../types';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    name: '用户1',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'user2',
    email: 'user2@example.com',
    name: '用户2',
    role: 'user',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 用户服务类
export class UserService {
  // 登录
  async login(params: LoginParams): Promise<LoginResponse> {
    // 使用模拟数据，不再调用API
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟根据用户名查找用户
        const foundUser = mockUsers.find(u => u.username === params.username) || mockUsers[0];
        
        resolve({
          user: foundUser,
          token: 'mock-jwt-token-' + Date.now(),
        });
      }, 500);
    });
  }

  // 登出
  async logout(): Promise<void> {
    return Promise.resolve();
  }

  // 获取用户列表
  async getUsers(): Promise<User[]> {
    // 直接返回模拟数据，不再调用API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 300);
    });
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    // 使用模拟数据，不再调用API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers[0]);
      }, 500);
    });
  }

  // 添加用户
  async addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // 模拟添加用户
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...user,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        resolve(newUser);
      }, 500);
    });
  }

  // 更新用户
  async updateUser(userData: Partial<User>): Promise<User> {
    // 模拟更新用户
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 查找用户索引
        const index = mockUsers.findIndex((user) => user.id === userData.id);
        if (index === -1) {
          reject(new Error('用户不存在'));
        } else {
          // 更新用户数据并更新时间戳
          mockUsers[index] = { 
            ...mockUsers[index], 
            ...userData,
            updatedAt: new Date().toISOString() 
          };
          resolve(mockUsers[index]);
        }
      }, 500);
    });
  }

  // 删除用户
  async deleteUser(id: string): Promise<boolean> {
    // 模拟删除用户
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    });
  }
}

// 导出单例实例
const userService = new UserService();
export default userService;