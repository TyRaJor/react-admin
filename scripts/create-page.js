#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 确保脚本在项目根目录执行
const projectRoot = path.resolve(__dirname, '..');

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    name: '',
    path: '',
    key: '',
    icon: 'HomeOutlined', // 默认图标
    parentKey: '', // 父级路由key，用于创建子路由
    protected: true // 默认受保护
  };
  
  // 简单的命令行参数解析
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      if (key === '--name') options.name = value;
      else if (key === '--path') options.path = value;
      else if (key === '--key') options.key = value;
      else if (key === '--icon') options.icon = value;
      else if (key === '--parent') options.parentKey = value;
      else if (key === '--public') options.protected = false;
    }
  }
  
  return options;
}

// 验证参数
function validateOptions(options) {
  if (!options.name) {
    console.error('错误：必须提供页面名称，请使用 --name 参数');
    return false;
  }
  
  if (!options.path) {
    // 如果没有提供路径，基于名称生成
    options.path = `/${options.name.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  return true;
}

// 生成页面组件
function generatePageComponent(options) {
  // 确定页面目录
  let pageDir = path.join(projectRoot, 'src', 'app');
  const pathSegments = options.path.split('/').filter(Boolean);
  
  // 创建页面目录结构
  pathSegments.forEach(segment => {
    pageDir = path.join(pageDir, segment);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }
  });
  
  // 页面组件内容
  const componentName = options.name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const pageContent = `'use client';

import { Card, Typography, Button, Space } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

const ${componentName} = () => {
  const router = useRouter();

  return (
    <Card>
      <Title level={4}>${options.name}</Title>
      <Paragraph>
        这是${options.name}页面的内容。
      </Paragraph>
      <Space>
        <Button type="primary">主要操作</Button>
        <Button>次要操作</Button>
      </Space>
    </Card>
  );
};

export default ${componentName};
`;
  
  // 写入页面组件文件
  const pageFilePath = path.join(pageDir, 'page.tsx');
  fs.writeFileSync(pageFilePath, pageContent);
  console.log(`✅ 页面组件已创建: ${pageFilePath}`);
  
  return pageFilePath;
}

// 生成路由配置
function generateRouteConfig(options) {
  const routesPath = path.join(projectRoot, 'src', 'routes.ts');
  
  // 读取现有路由配置
  let routesContent = fs.readFileSync(routesPath, 'utf8');
  
  // 如果是子路由，需要找到父级路由并在其children数组中添加
  if (options.parentKey) {
    // 查找父级路由的位置
    const parentRouteRegex = new RegExp(
      `{\\s*key:\s*['"]${options.parentKey}['"],\\s*name:\s*['"]([^'"]+)['"],.*?children:\s*\[([^\]]*)\]`,
      's'
    );
    
    const match = routesContent.match(parentRouteRegex);
    
    if (match) {
      const parentName = match[1];
      const existingChildren = match[2].trim();
      const hasExistingChildren = existingChildren.length > 0;
      
      // 生成新的子路由配置
      const newChildRoute = `{
    key: '${options.key}',
    name: '${options.name}',
    path: '${options.path}',
    icon: '${options.icon}',
    protected: ${options.protected},
    component: () => import('@/app${options.path}/page')
  }`;
      
      // 更新children数组
      const updatedChildren = hasExistingChildren 
        ? `${existingChildren},\n  ${newChildRoute}`
        : `  ${newChildRoute}`;
      
      // 替换原有的children
      routesContent = routesContent.replace(
        parentRouteRegex,
        `{\n  key: '${options.parentKey}',\n  name: '${parentName}',\n  path: '/${options.parentKey.toLowerCase()}',\n  icon: 'SettingOutlined',\n  protected: true,\n  children: [\n${updatedChildren}\n  ]`
      );
      
      console.log(`✅ 子路由已添加到父级路由 ${options.parentKey}`);
    } else {
      console.error(`❌ 未找到父级路由: ${options.parentKey}`);
      return false;
    }
  } else {
    // 顶级路由，添加到routes数组末尾
    const newRoute = `  {
    key: '${options.key}',
    name: '${options.name}',
    path: '${options.path}',
    icon: '${options.icon}',
    protected: ${options.protected},
    component: () => import('@/app${options.path}/page'),
    children: []
  }`;
    
    // 查找routes数组的末尾并添加新路由
    routesContent = routesContent.replace(
      /const routes: RouteObject\[\] = \[(.*?)\];/s,
      (match, p1) => {
        const existingRoutes = p1.trim();
        const hasExistingRoutes = existingRoutes.length > 0;
        
        return hasExistingRoutes
          ? `const routes: RouteObject[] = [\n${existingRoutes},\n${newRoute}\n];`
          : `const routes: RouteObject[] = [\n${newRoute}\n];`;
      }
    );
    
    console.log(`✅ 顶级路由已添加`);
  }
  
  // 写入更新后的路由配置
  fs.writeFileSync(routesPath, routesContent);
  return true;
}

// 更新pageConfig.ts中的页面配置
function updatePageConfig(options) {
  // 只有子页面才需要更新pageConfig
  if (!options.parentKey) {
    return true;
  }
  
  const configPath = path.join(projectRoot, 'src', 'config', 'pageConfig.ts');
  
  // 读取现有配置
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // 查找父级路由的名称
  const routesPath = path.join(projectRoot, 'src', 'routes.ts');
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  const parentRouteRegex = new RegExp(
    `{\s*key:\s*['"]${options.parentKey}['"],\s*name:\s*['"]([^'"]+)['"]`,
    's'
  );
  const parentMatch = routesContent.match(parentRouteRegex);
  const parentName = parentMatch ? parentMatch[1] : '父页面';
  
  // 更新subPageMap
  if (!configContent.includes(`'${options.key}': '${options.name}'`)) {
    configContent = configContent.replace(
      /export const subPageMap: Record<string, string> = \{([^}]*?)\};\s*/s,
      (match, p1) => {
        const existingItems = p1.trim();
        const hasExistingItems = existingItems.length > 0;
        
        const newItem = `  '${options.key}': '${options.name}'`;
        
        return hasExistingItems
          ? `export const subPageMap: Record<string, string> = {\n${existingItems},\n${newItem}\n};\n`
          : `export const subPageMap: Record<string, string> = {\n${newItem}\n};\n`;
      }
    );
    console.log(`✅ 子页面已添加到subPageMap: ${options.key} => ${options.name}`);
  }
  
  // 更新breadcrumbConfig
  if (!configContent.includes(`'${options.key}': {`)) {
    configContent = configContent.replace(
      /export const breadcrumbConfig: Record<string, { parentKey?: string; parentTitle?: string }> = \{([^}]*?)\};\s*/s,
      (match, p1) => {
        const existingConfigs = p1.trim();
        const hasExistingConfigs = existingConfigs.length > 0;
        
        const newConfig = `  '${options.key}': { parentKey: '${options.parentKey}', parentTitle: '${parentName}' }`;
        
        return hasExistingConfigs
          ? `export const breadcrumbConfig: Record<string, { parentKey?: string; parentTitle?: string }> = {\n${existingConfigs},\n${newConfig}\n};\n`
          : `export const breadcrumbConfig: Record<string, { parentKey?: string; parentTitle?: string }> = {\n${newConfig}\n};\n`;
      }
    );
    console.log(`✅ 面包屑配置已添加: ${options.key}`);
  }
  
  // 写入更新后的配置
  fs.writeFileSync(configPath, configContent);
  return true;
}

// 更新组件配置文件中的图标映射和组件映射
function updateComponentConfig(options) {
  console.log('正在更新组件配置...');
  try {
    const componentConfigPath = path.join(projectRoot, 'src', 'config', 'componentConfig.tsx');
    let componentConfigContent = fs.readFileSync(componentConfigPath, 'utf8');
    
    // 更新iconMap
    if (options.icon && !componentConfigContent.includes(`${options.icon}: <${options.icon} />`)) {
      componentConfigContent = componentConfigContent.replace(
        /export const iconMap: Record<string, React\.ReactNode> = \{([^}]*)\};/s,
        (match, p1) => {
          const existingIcons = p1.trim();
          const hasExistingIcons = existingIcons.length > 0;
          
          const newIconEntry = `  ${options.icon}: <${options.icon} />`;
          
          return hasExistingIcons
            ? `export const iconMap: Record<string, React.ReactNode> = {\n${existingIcons},\n${newIconEntry}\n};`
            : `export const iconMap: Record<string, React.ReactNode> = {\n${newIconEntry}\n};`;
        }
      );
      console.log(`✅ 图标已添加到iconMap: ${options.icon}`);
    }
    
    // 更新componentMap
    if (!componentConfigContent.includes(`'${options.key}': lazy`)) {
      componentConfigContent = componentConfigContent.replace(
        /export const componentMap: Record<string, React\.LazyExoticComponent<React\.ComponentType>> = \{([^}]*)\};/s,
        (match, p1) => {
          const existingComponents = p1.trim();
          const hasExistingComponents = existingComponents.length > 0;
          
          const newComponentEntry = `  '${options.key}': lazy(() => import('@/app${options.path}/page')), // ${options.name}`;
          
          return hasExistingComponents
            ? `export const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {\n${existingComponents},\n${newComponentEntry}\n};`
            : `export const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {\n${newComponentEntry}\n};`;
        }
      );
      console.log(`✅ 组件已添加到componentMap: ${options.key}`);
    }
    
    fs.writeFileSync(componentConfigPath, componentConfigContent, 'utf8');
    return true;
  } catch (error) {
    console.error('❌ 组件配置更新失败:', error.message);
    return false;
  }
}

// 更新MainLayout.tsx中的图标映射已移至updateComponentConfig函数
function updateComponentMap(options) {
  // 现在这个函数只保留为了保持向后兼容
  // 所有的更新都在updateComponentConfig中进行
  return true;
}

// 主函数
function main() {
  console.log('🚀 React Admin 页面创建工具');
  
  // 解析和验证参数
  const options = parseArgs();
  if (!validateOptions(options)) {
    console.log('\n使用方法:');
    console.log('  创建顶级页面: npm run create-page -- --name="页面名称" --path="/页面路径" --key="123" --icon="HomeOutlined"');
    console.log('  创建子页面: npm run create-page -- --name="子页面名称" --path="/父路径/子路径" --key="123-1" --parent="123"');
    process.exit(1);
  }
  
  // 如果没有提供key，生成一个唯一的key
  if (!options.key) {
    // 生成一个基于时间戳的key
    options.key = Date.now().toString().slice(-6);
  }
  
  try {
    // 生成页面组件
    generatePageComponent(options);
    
    // 更新路由配置
    if (!generateRouteConfig(options)) {
      console.error('❌ 路由配置更新失败');
      process.exit(1);
    }
    
    // 更新MainLayout.tsx中的图标映射
    if (!updateComponentMap(options)) {
      console.error('❌ MainLayout更新失败');
      process.exit(1);
    }
    
    // 更新componentConfig.ts中的组件映射
    if (!updateComponentConfig(options)) {
      console.error('❌ 组件配置更新失败');
      process.exit(1);
    }
    
    // 更新pageConfig.ts中的页面配置
    if (!updatePageConfig(options)) {
      console.error('❌ 页面配置更新失败');
      process.exit(1);
    }
    
    console.log('\n🎉 页面创建成功！');
    console.log(`📄 页面名称: ${options.name}`);
    console.log(`🔗 页面路径: ${options.path}`);
    console.log(`🔑 路由Key: ${options.key}`);
    console.log(`🖼️  图标: ${options.icon}`);
    if (options.parentKey) {
      console.log(`👪 父级路由: ${options.parentKey}`);
    }
    console.log(`\n请运行 npm run dev 查看效果`);
  } catch (error) {
    console.error('❌ 页面创建失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();