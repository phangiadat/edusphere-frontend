import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginDto, RegisterDto } from '../../types/auth';
import { authApi } from '../../api/authApi';
import { tokenStorage } from '../../utils/tokenStorage';

export type AuthModalMode = 'login' | 'register' | 'forgot' | 'reset' | null;

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  authModalMode: AuthModalMode;
  error: string | null;
}

// Initial state synchronized directly from tokenStorage to prevent FOUC
const initialState: AuthState = {
  user: tokenStorage.getUserInfo(),
  token: tokenStorage.getAccessToken(),
  isLoading: false,
  authModalMode: null,
  error: null,
};

// Async Thunk: Login
export const loginThunk = createAsyncThunk<User, LoginDto, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      const accessToken = data.access_token || (data as any).accessToken;
      const refreshToken = data.refresh_token || (data as any).refreshToken;

      tokenStorage.setTokens(accessToken, refreshToken);

      if (data.user) {
        tokenStorage.setUserInfo(data.user);
        return data.user;
      }
      throw new Error('Dữ liệu phản hồi người dùng không hợp lệ');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : 'Email hoặc mật khẩu không chính xác!');
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Register
export const registerThunk = createAsyncThunk<User, RegisterDto, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      const accessToken = data.access_token || (data as any).accessToken;
      const refreshToken = data.refresh_token || (data as any).refreshToken;

      tokenStorage.setTokens(accessToken, refreshToken);

      if (data.user) {
        tokenStorage.setUserInfo(data.user);
        return data.user;
      }
      throw new Error('Dữ liệu tạo tài khoản không hợp lệ');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : 'Đăng ký thất bại. Vui lòng thử lại!');
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Revalidate Session Profile
export const initAuthThunk = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/initAuth',
  async (_, { rejectWithValue }) => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const freshProfile = await authApi.getProfile();
      tokenStorage.setUserInfo(freshProfile);
      return freshProfile;
    } catch (err: any) {
      // If token expired silently, clear storage
      tokenStorage.clearAuthStorage();
      return rejectWithValue('Phiên đăng nhập đã hết hạn');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      tokenStorage.clearAuthStorage();
      state.user = null;
      state.token = null;
      state.authModalMode = null;
      state.error = null;
    },
    openAuthModal(state, action: PayloadAction<AuthModalMode>) {
      state.authModalMode = action.payload;
    },
    closeAuthModal(state) {
      state.authModalMode = null;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      tokenStorage.setUserInfo(action.payload);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = tokenStorage.getAccessToken();
        state.authModalMode = null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = tokenStorage.getAccessToken();
        state.authModalMode = null;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng ký thất bại';
      });

    // Init Auth Revalidation
    builder
      .addCase(initAuthThunk.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.token = tokenStorage.getAccessToken();
        } else {
          state.user = null;
          state.token = null;
        }
      })
      .addCase(initAuthThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, openAuthModal, closeAuthModal, updateUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
