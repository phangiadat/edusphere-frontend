import { axiosClient } from './axiosClient';
import type { User } from '../types/auth';

export interface UpdateProfilePayload {
  fullName?: string;
  avatarUrl?: string;
}

export const userApi = {
  /**
   * Cập nhật thông tin cá nhân (PATCH /users/profile)
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<{ message: string; user: User }> {
    const response = await axiosClient.patch<{ message: string; user: User }>('/users/profile', payload);
    return response.data;
  },

  /**
   * Tải lên ảnh đại diện cá nhân (PATCH /users/avatar)
   */
  async uploadAvatar(file: File): Promise<{ message: string; user: User }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.patch<{ message: string; user: User }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
