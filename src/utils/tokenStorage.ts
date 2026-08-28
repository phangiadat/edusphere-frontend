import type { User } from '../types/auth';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem('accessToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem('refreshToken');
  },

  getUserInfo(): User | null {
    const rawUser = localStorage.getItem(USER_INFO_KEY);
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser) as User;
    } catch (err) {
      console.warn('Không thể đọc thông tin người dùng từ localStorage:', err);
      return null;
    }
  },

  setTokens(accessToken?: string | null, refreshToken?: string | null): void {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  setUserInfo(user: User): void {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  },

  clearAuthStorage(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem('accessToken');
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(USER_INFO_KEY);
  },
};
