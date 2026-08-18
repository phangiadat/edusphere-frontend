import { axiosClient } from './axiosClient';
import type { 
  LoginDto, 
  RegisterDto, 
  AuthResponse, 
  User, 
  ChangePasswordDto, 
  ForgotPasswordDto, 
  ResetPasswordDto 
} from '../types/auth';

export const authApi = {
  /**
   * Đăng nhập tài khoản (POST /auth/login)
   */
  async login(payload: LoginDto): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  /**
   * Đăng ký tài khoản mới (POST /auth/register)
   */
  async register(payload: RegisterDto): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  /**
   * Lấy thông tin cá nhân hiện tại (GET /auth/me hoặc GET /users/profile)
   */
  async getProfile(): Promise<User> {
    const response = await axiosClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Đổi mật khẩu (POST /auth/change-password)
   */
  async changePassword(payload: ChangePasswordDto): Promise<{ message: string }> {
    const response = await axiosClient.post<{ message: string }>('/auth/change-password', payload);
    return response.data;
  },

  /**
   * Yêu cầu quên mật khẩu / Gửi OTP về email (POST /auth/forgot-password)
   */
  async forgotPassword(payload: ForgotPasswordDto): Promise<{ message: string }> {
    const response = await axiosClient.post<{ message: string }>('/auth/forgot-password', payload);
    return response.data;
  },

  /**
   * Đặt lại mật khẩu mới bằng OTP / Token (POST /auth/reset-password)
   */
  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const response = await axiosClient.post<{ message: string }>('/auth/reset-password', payload);
    return response.data;
  },
};
