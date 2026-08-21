import { axiosClient } from '../services/api/axiosClient';
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
    const res: any = await axiosClient.post('/auth/login', payload);
    return res?.data || res;
  },

  /**
   * Đăng ký tài khoản mới (POST /auth/register)
   */
  async register(payload: RegisterDto): Promise<AuthResponse> {
    const res: any = await axiosClient.post('/auth/register', payload);
    return res?.data || res;
  },

  /**
   * Lấy thông tin cá nhân hiện tại (GET /auth/me)
   */
  async getProfile(): Promise<User> {
    const res: any = await axiosClient.get('/auth/me');
    return res?.data || res;
  },

  /**
   * Đổi mật khẩu (POST /auth/change-password)
   */
  async changePassword(payload: ChangePasswordDto): Promise<{ message: string }> {
    const res: any = await axiosClient.post('/auth/change-password', payload);
    return res?.data || res;
  },

  /**
   * Yêu cầu quên mật khẩu / Gửi OTP về email (POST /auth/forgot-password)
   */
  async forgotPassword(payload: ForgotPasswordDto): Promise<{ message: string }> {
    const res: any = await axiosClient.post('/auth/forgot-password', payload);
    return res?.data || res;
  },

  /**
   * Đặt lại mật khẩu mới bằng OTP / Token (POST /auth/reset-password)
   */
  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const res: any = await axiosClient.post('/auth/reset-password', payload);
    return res?.data || res;
  },
};
