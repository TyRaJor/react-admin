// 页面配置文件 - 存储面包屑导航和页面映射信息

// 子页面映射配置
export const subPageMap: Record<string, string> = {
  '4-1': '个人设置',
  '4-2': '系统配置',
  '4-3': '权限管理',
  "5-1": "订单管理测试"
};

// 面包屑导航配置
export const breadcrumbConfig: Record<string, { parentKey?: string; parentTitle?: string }> = {
  // 系统设置子页面配置
  '4-1': { parentKey: '4', parentTitle: '系统设置' },
  '4-2': { parentKey: '4', parentTitle: '系统设置' },
  '4-3': { parentKey: '4', parentTitle: '系统设置' },
  // 可以在这里添加更多二级页面的配置
  // 格式: '子页面key': { parentKey: '父页面key', parentTitle: '父页面标题' }
  '5-1': { parentKey: '5', parentTitle: '订单管理' }
};