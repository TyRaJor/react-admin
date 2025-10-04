import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 通知状态类型
interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

// 初始状态
const initialState: NotificationState = {
  visible: false,
  message: '',
  type: 'success',
};

// 创建notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // 显示通知
    showNotification: (state, action: PayloadAction<Omit<NotificationState, 'visible'>>) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    // 隐藏通知
    hideNotification: (state) => {
      state.visible = false;
    },
    // 更新通知
    updateNotification: (state, action: PayloadAction<NotificationState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { showNotification, hideNotification, updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer;