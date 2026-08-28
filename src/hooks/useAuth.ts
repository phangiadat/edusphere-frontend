import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginThunk,
  registerThunk,
  logout,
  openAuthModal,
  closeAuthModal,
  updateUser,
  type AuthModalMode,
} from '../features/auth/authSlice';
import type { User, LoginDto, RegisterDto } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalMode: AuthModalMode;
  error: string | null;
  login: (credentials: LoginDto) => Promise<User>;
  register: (payload: RegisterDto) => Promise<User>;
  logout: () => void;
  openAuthModal: (mode: AuthModalMode) => void;
  closeAuthModal: () => void;
  updateUser: (user: User) => void;
}

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const { user, isLoading, authModalMode, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginDto): Promise<User> => {
    return await dispatch(loginThunk(credentials)).unwrap();
  };

  const handleRegister = async (payload: RegisterDto): Promise<User> => {
    return await dispatch(registerThunk(payload)).unwrap();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleOpenAuthModal = (mode: AuthModalMode) => {
    dispatch(openAuthModal(mode));
  };

  const handleCloseAuthModal = () => {
    dispatch(closeAuthModal());
  };

  const handleUpdateUser = (updatedUser: User) => {
    dispatch(updateUser(updatedUser));
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    authModalMode,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    openAuthModal: handleOpenAuthModal,
    closeAuthModal: handleCloseAuthModal,
    updateUser: handleUpdateUser,
  };
};
