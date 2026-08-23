import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, LoginDto, RegisterDto } from '../types/auth';
import { authApi } from '../api/authApi';

export type AuthModalMode = 'login' | 'register' | 'forgot' | 'reset' | null;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalMode: AuthModalMode;
  login: (credentials: LoginDto) => Promise<void>;
  register: (payload: RegisterDto) => Promise<void>;
  logout: () => void;
  openAuthModal: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>(null);

  // Initialize Auth State from LocalStorage / Backend Profile
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_info');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally fetch fresh profile in background
          const freshProfile = await authApi.getProfile();
          setUser(freshProfile);
          localStorage.setItem('user_info', JSON.stringify(freshProfile));
        } catch {
          // Silent fallback if token expired
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    setIsLoading(true);
    try {
      const data = await authApi.login(credentials);
      const accessToken = data.access_token || (data as any).accessToken;
      const refreshToken = data.refresh_token || (data as any).refreshToken;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (data.user) {
        localStorage.setItem('user_info', JSON.stringify(data.user));
        setUser(data.user);

        if (data.user.role === 'INSTRUCTOR') {
          window.location.href = '/instructor/dashboard';
        }
      }
      setAuthModalMode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterDto) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(payload);
      const accessToken = data.access_token || (data as any).accessToken;
      const refreshToken = data.refresh_token || (data as any).refreshToken;

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (data.user) {
        localStorage.setItem('user_info', JSON.stringify(data.user));
        setUser(data.user);

        if (data.user.role === 'INSTRUCTOR') {
          window.location.href = '/instructor/dashboard';
        }
      }
      setAuthModalMode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    setUser(null);
  };

  const openAuthModal = (mode: AuthModalMode) => setAuthModalMode(mode);
  const closeAuthModal = () => setAuthModalMode(null);
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user_info', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalMode,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
