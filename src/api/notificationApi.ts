import { axiosClient } from './axiosClient';

export interface NotificationModel {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<NotificationModel[]> => {
    const response = await axiosClient.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<NotificationModel> => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
};
