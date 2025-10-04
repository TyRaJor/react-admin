import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loginUser, logoutUser, clearAuth } from '../store/features/authSlice';
import { showNotification } from '../store/features/notificationSlice';
import { LoginParams } from '../types';

// 认证Hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const notification = useAppSelector((state) => state.notification);

  // 登录
  const login = async (params: LoginParams) => {
    try {
      const resultAction = await dispatch(loginUser(params));
      
      if (loginUser.fulfilled.match(resultAction)) {
        // 显示成功消息
        dispatch(showNotification({
          message: '登录成功',
          type: 'success',
        }));
        
        return resultAction.payload;
      } else {
        // 显示失败消息
        dispatch(showNotification({
          message: '登录失败，请检查用户名和密码',
          type: 'error',
        }));
        throw new Error('登录失败');
      }
    } catch (error) {
      // 显示错误消息
      dispatch(showNotification({
        message: '登录失败，请检查用户名和密码',
        type: 'error',
      }));
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      // 即使API调用失败，也清除本地状态
      dispatch(clearAuth());
      
      // 显示登出成功消息
      dispatch(showNotification({
        message: '已成功登出',
        type: 'info',
      }));
    }
  };

  // 检查是否为管理员
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    notification,
  };
};

export default useAuth;