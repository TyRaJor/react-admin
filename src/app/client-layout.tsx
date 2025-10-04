'use client';

import { ReactNode } from 'react';
import NotificationProvider from '../components/NotificationProvider';
import { ConfigProvider } from 'antd';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store';

// 主题配置
const themeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: '#1890ff',
  },
};

// 主题包装组件
function ThemeWrapper({ children }: { children: ReactNode }) {
  const theme = useAppSelector((state: RootState) => state.theme?.theme);
  
  return (
    <ConfigProvider theme={themeConfig}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </ConfigProvider>
  );
}

// 客户端布局组件
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeWrapper>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </ThemeWrapper>
    </ReduxProvider>
  );
}