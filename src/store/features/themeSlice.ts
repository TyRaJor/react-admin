import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 主题状态类型
type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
}

// 初始状态
const initialState: ThemeState = {
  theme: 'light',
};

// 创建theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 设置主题
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
      
      // 更新HTML类名
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', action.payload === 'dark');
      }
    },
    // 切换主题
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      
      // 更新HTML类名
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;