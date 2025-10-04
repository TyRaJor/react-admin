# React Admin 项目

## 项目概述
这是一个现代化的 React 管理系统框架，基于 Next.js 14 和 Ant Design 开发，提供了完整的路由管理、状态管理和用户认证功能，支持多级菜单和子路由功能。

## 技术栈

- **React 18.2.0**
- **Next.js 14.2.13** - 支持多级路由
- **Ant Design 5.27.4**
- **Redux Toolkit 2.9.0**
- **TypeScript 5**
- **Tailwind CSS 4**
- **React Hook Form 7.63.0**

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 开发模式运行

```bash
npm run dev
# 项目将运行在 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm start
```

### 代码检查

```bash
npm run lint
```

## 文件结构

### 核心目录规范

- **`src/app/`** - 存放所有页面组件
  - `page.tsx` - 首页
  - `login/page.tsx` - 登录页
  - `users/page.tsx` - 用户管理页面
  - `products/page.tsx` - 产品管理页面
  - 新页面应该按照 `[页面名]/page.tsx` 的格式创建
  - 子页面按照 `[父页面名]/[子页面名]/page.tsx` 的格式创建

- **`src/components/`** - 存放所有可复用组件
  - `MainLayout.tsx` - 主布局组件
  - 其他自定义组件

- **`src/config/`** - 存放项目配置文件
  - `pageConfig.ts` - 页面映射和面包屑导航配置
  - `componentConfig.tsx` - 组件映射和图标映射配置
- **`src/routes.ts`** - 路由配置文件（支持多级路由）
- **`src/types/`** - 类型定义
- **`src/store/`** - Redux 状态管理
- **`src/hooks/`** - 自定义 React Hooks
- **`src/services/`** - API 服务层
- **`src/lib/`** - 通用工具库
- **`scripts/`** - 自动化脚本
  - `create-page.js` - 自动创建页面组件、更新路由配置的脚本

## 开发体验优化

### 多级菜单和子路由功能

项目支持多级菜单和嵌套路由结构，可以创建层级化的管理界面。

#### 路由结构
路由配置支持嵌套的子路由结构，每个路由对象可以包含 `children` 属性：

```typescript
interface RouteObject {
  path: string;
  name: string;
  key: string;
  icon: string;
  protected: boolean;
  component: () => Promise<{ default: React.ComponentType }>;
  children?: RouteObject[]; // 支持子路由
}
```

### 页面配置系统

项目使用独立的配置文件管理页面映射、图标映射和面包屑导航，使得配置更加集中和易于维护。

#### 配置文件说明

1. **componentConfig.tsx** - 组件映射和图标映射配置
2. **pageConfig.ts** - 页面映射和面包屑导航配置

#### componentConfig.tsx 配置说明

这个文件集中管理所有的组件懒加载和图标映射：

```typescript
import { lazy } from 'react';
import { 
  HomeOutlined, 
  UsergroupAddOutlined, 
  ShoppingCartOutlined, 
  SettingOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined 
} from '@ant-design/icons';

// 组件映射配置 - 使用懒加载优化性能
export const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  '1': lazy(() => import('@/app/page')), // 首页
  '2': lazy(() => import('@/app/users/page')), // 用户管理
  '3': lazy(() => import('@/app/products/page')), // 产品管理
  '4': lazy(() => import('@/app/settings/page')), // 系统设置
  '4-1': lazy(() => import('@/app/settings/profile/page')), // 个人设置
  '4-2': lazy(() => import('@/app/settings/system/page')), // 系统配置
  '4-3': lazy(() => import('@/app/settings/permissions/page')), // 权限管理
};

// 图标映射配置
export const iconMap: Record<string, React.ReactNode> = {
  HomeOutlined: <HomeOutlined />,
  UsergroupAddOutlined: <UsergroupAddOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  SettingOutlined: <SettingOutlined />,
  MenuFoldOutlined: <MenuFoldOutlined />,
  MenuUnfoldOutlined: <MenuUnfoldOutlined />,
};

示例配置：

```typescript
// 子页面映射配置
export const subPageMap: Record<string, string> = {
  '4-1': '个人设置',
  '4-2': '系统配置',
  '4-3': '权限管理'
};

// 面包屑导航配置
export const breadcrumbConfig: Record<string, { parentKey?: string; parentTitle?: string }> = {
  // 系统设置子页面配置
  '4-1': { parentKey: '4', parentTitle: '系统设置' },
  '4-2': { parentKey: '4', parentTitle: '系统设置' },
  '4-3': { parentKey: '4', parentTitle: '系统设置' }
};
```

#### 如何手动更新页面配置

当需要添加新的子页面时，可以直接在 `pageConfig.ts` 文件中添加对应的配置：

1. 在 `subPageMap` 中添加子页面键值对：`'子页面key': '子页面名称'`
2. 在 `breadcrumbConfig` 中添加面包屑配置：`'子页面key': { parentKey: '父页面key', parentTitle: '父页面名称' }`

这种方式使得配置更加集中，避免了在代码中硬编码页面信息。

### 如何快速添加新页面

#### 方法一：使用自动化脚本（推荐）
```bash
# 创建顶级页面
npm run create-page -- --name="页面名称" --path="/页面路径" --key="唯一键" --icon="图标名称"

# 创建子页面
npm run create-page -- --name="子页面名称" --path="/父路径/子路径" --key="父键-子键" --parent="父键"
```

**参数说明：**
- `--name`: 页面名称
- `--path`: 页面路径（可选，如果不提供会自动基于名称生成）
- `--key`: 路由唯一键
- `--icon`: 图标名称（来自 @ant-design/icons）
- `--parent`: 父级路由键（创建子页面时需要）
- `--public`: 标记为公共页面（不需要登录访问）

**自动化脚本功能：**
- 创建页面组件文件和目录结构
- 更新 `src/routes.ts` 路由配置
- 更新 `src/config/componentConfig.tsx` 中的组件映射和图标映射
- **自动更新页面配置**（子页面）: 
  - 将子页面添加到 `src/config/pageConfig.ts` 的 `subPageMap`
  - 在 `breadcrumbConfig` 中添加相应的面包屑导航配置

这种方式可以一键完成所有配置，无需手动修改多个文件，大大提高开发效率。

#### 方法二：手动添加

##### 顶级页面

##### 步骤 1: 创建页面组件
在 `src/app/` 目录下创建新的页面文件夹和 page.tsx 文件。

例如，创建一个新的订单管理页面：
```
src/app/orders/page.tsx
```

页面组件模板：
```tsx
import React from 'react';
import { Card, Typography } from 'antd';
import MainLayout from '@/components/MainLayout';

const { Title } = Typography;

const OrdersPage: React.FC = () => {
  return (
    <MainLayout>
      <Card>
        <Title level={2}>订单管理</Title>
        {/* 页面内容 */}
      </Card>
    </MainLayout>
  );
};

export default OrdersPage;
```

##### 步骤 2: 更新路由配置
在 `src/routes.ts` 文件中添加新路由配置：

```typescript
{
  path: '/orders',
  name: '订单管理',
  key: '4', // 确保key唯一
  icon: 'OrderedListOutlined',
  protected: true,
  component: () => import('@/app/orders/page'),
  children: [] // 空数组，表示可以添加子路由
}
```

##### 步骤 3: 更新组件和图标映射
在 `src/config/componentConfig.tsx` 文件中：

1. 导入新使用的图标
2. 将图标添加到 `iconMap`
3. 将页面组件添加到 `componentMap`

```typescript
// 1. 导入图标
import { OrderedListOutlined } from '@ant-design/icons';

// 2. 添加到图标映射
export const iconMap: Record<string, React.ReactNode> = {
  // ... 已有图标
  OrderedListOutlined: <OrderedListOutlined />,
};

// 3. 添加到组件映射
export const componentMap: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  // ... 已有映射
  '4': lazy(() => import('@/app/orders/page')), // 订单管理
};
```

##### 子页面

##### 步骤 1: 创建子页面组件
在父页面目录下创建子页面文件夹和 page.tsx 文件。

例如，为订单管理创建订单详情子页面：
```
src/app/orders/detail/page.tsx
```

##### 步骤 2: 更新路由配置（添加子路由）
在父路由的 `children` 数组中添加子路由配置：

```typescript
{
  path: '/orders',
  name: '订单管理',
  key: '4',
  icon: 'OrderedListOutlined',
  protected: true,
  component: () => import('@/app/orders/page'),
  children: [
    {
      path: '/orders/detail',
      name: '订单详情',
      key: '4-detail',
      icon: 'ProfileOutlined',
      protected: true,
      component: () => import('@/app/orders/detail/page'),
    }
  ]
}
```

### 开发技巧

1. **组件复用**：创建通用组件时，遵循单一职责原则，确保组件可复用性高
2. **状态管理**：使用 Redux Toolkit 管理全局状态，局部状态使用 React 的 useState
3. **TypeScript 类型安全**：为所有组件和函数添加明确的类型定义
4. **代码格式化**：使用 ESLint 和项目配置的规则保持代码风格一致
5. **性能优化**：
   - 使用 React.memo 包装频繁重渲染的组件
   - 使用 Redux Toolkit 的 createEntityAdapter 优化列表数据管理
   - 利用 Next.js 的增量静态重新生成(ISR)优化页面加载性能
6. **多级菜单交互**：
   - 点击父级菜单：展开/折叠子菜单
   - 点击子菜单项：导航到对应页面
   - 面包屑导航：显示当前页面的完整路径，可点击返回上级页面

### 调试技巧

1. **React Developer Tools**：使用 Chrome 扩展检查组件结构和状态
2. **Redux DevTools**：监控状态变化和 action 派发
3. **Next.js 调试**：利用 Next.js 的内置错误页面和日志系统
4. **网络请求调试**：在 Chrome DevTools 的 Network 面板监控 API 请求

## 开发规范

1. **页面组件**：所有页面组件放在 `src/app/[页面名]/page.tsx`
2. **通用组件**：所有可复用组件放在 `src/components/`
3. **路由配置**：所有路由在 `src/routes.ts` 中集中管理
4. **命名规范**：
   - 文件名使用 `camelCase`
   - 组件名使用 `PascalCase`
   - 路由 key 使用数字编号，确保唯一
5. **代码注释**：为复杂逻辑和关键函数添加注释
6. **错误处理**：统一处理 API 错误和用户操作错误，提供友好的错误提示

## 项目改进日志

### 配置系统优化

#### 组件和图标映射分离

为了提高代码的可维护性和结构清晰度，我们进行了以下优化：

1. **配置文件分离**：
   - 创建了 `src/config/componentConfig.tsx` 文件，专门用于管理组件映射和图标映射
   - 从 `MainLayout.tsx` 中移除了硬编码的组件和图标映射
   - 这种分离使得配置更加集中，更容易维护

2. **统一图标引用**：
   - 所有图标现在通过 `iconMap` 统一引用，包括侧边栏折叠按钮的图标
   - 这确保了图标样式的一致性和可维护性

3. **构建优化**：
   - 正确配置了文件扩展名（.tsx）以支持JSX语法
   - 确保了组件和图标映射的类型安全

4. **脚本更新**：
   - 更新了 `scripts/create-page.js` 脚本，使其正确更新 `componentConfig.tsx` 而不是 `MainLayout.tsx`
   - 保留了向后兼容性，确保自动页面创建功能正常工作

5. **布局优化**：

## 部署

### Vercel 部署
1. 登录 Vercel 账号
2. 导入项目仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`.next`
5. 点击部署

### Docker 部署

可以创建一个 Dockerfile 用于容器化部署：

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## 注意事项

1. 项目使用 Next.js 14 的 App Router 模式，请遵循相关的文件命名和组件结构规范
2. 项目使用 JavaScript 配置文件（next.config.js），不支持 TypeScript 配置文件
3. 确保所有路由配置中的 key 值唯一
4. 对于受保护的路由，确保用户已登录才能访问
5. 在开发新功能前，建议先了解现有代码结构和模式
