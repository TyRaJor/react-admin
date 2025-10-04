import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { User, LoginParams, LoginResponse } from '../../types';
import userService from '../../services/userService';

// 认证状态类型
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// 安全获取localStorage值
const getLocalStorageToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 初始状态
const initialState: AuthState = {
  user: null,
  token: getLocalStorageToken(),
  isLoading: false,
  error: null,
  isAuthenticated: !!getLocalStorageToken(),
};

// 登录异步Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginParams, { rejectWithValue }) => {
    try {
      // 使用userService进行登录
      const response: LoginResponse = await userService.login(credentials);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '登录失败，请重试'
      );
    }
  }
);

// 退出登录异步Thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // 使用userService进行登出
      await userService.logout();
      return true;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '退出登录失败'
      );
    }
  }
);

// 创建认证切片
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置用户信息
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // 设置token
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
      state.isAuthenticated = true;
    },
    // 清除认证信息
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    // 处理登录
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // 处理退出登录
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      });
  },
});

// 导出actions
export const { setUser, setToken, clearAuth } = authSlice.actions;

// 导出selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;

// 导出reducer
export default authSlice.reducer;