'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import notificationReducer from './features/notificationSlice';
import themeReducer from './features/themeSlice';

// 创建根Reducer
const rootReducer = {
  auth: authReducer,
  notification: notificationReducer,
  theme: themeReducer,
};

// 配置Store
export const store = configureStore({
  reducer: rootReducer,
});

// 导出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;