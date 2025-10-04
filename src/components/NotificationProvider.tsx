'use client';
import { useEffect } from 'react';
import { notification } from 'antd';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { hideNotification } from '../store/features/notificationSlice';

// 通知组件
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationState = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (notificationState.visible) {
      const notificationApi = {
        success: notification.success,
        error: notification.error,
        warning: notification.warning,
        info: notification.info,
      };
      
      notificationApi[notificationState.type]({
        message: notificationState.message,
        duration: 3,
      });
      
      // 3秒后隐藏通知
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notificationState, dispatch]);

  return <>{children}</>;
};

export default NotificationProvider;