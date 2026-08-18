export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role?: 'STUDENT' | 'INSTRUCTOR';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
