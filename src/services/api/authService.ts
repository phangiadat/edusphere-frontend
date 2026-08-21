import { axiosClient } from '../../api/axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    avatarUrl?: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = (await axiosClient.post('/auth/login', payload)) as unknown as AuthResponse;
    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
    }
    return res;
  },

  logout() {
    localStorage.removeItem('accessToken');
  },
};
