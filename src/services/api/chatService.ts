import { axiosClient } from './axiosClient';

export interface UserChatInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface ConversationBackendModel {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: UserChatInfo;
  user2: UserChatInfo;
  createdAt: string;
  updatedAt: string;
  messages?: MessageBackendModel[];
  lastMessage?: MessageBackendModel | null;
  unreadCount?: number;
}

export interface MessageBackendModel {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: UserChatInfo;
}

export interface PaginatedMessagesResponse {
  data: MessageBackendModel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const chatService = {
  // Get My Conversations
  async getMyConversations(page = 1, limit = 20): Promise<ConversationBackendModel[]> {
    const res = (await axiosClient.get('/chat/conversations', {
      params: { page, limit },
    })) as unknown as any;
    return Array.isArray(res) ? res : res?.data || [];
  },

  // Start / Find Conversation 1-1
  async startConversation(targetUserId: string): Promise<ConversationBackendModel> {
    return (await axiosClient.post('/chat/conversations', {
      targetUserId,
    })) as unknown as ConversationBackendModel;
  },

  // Get Chat Messages History with Pagination (for Infinite Scroll)
  async getChatHistory(conversationId: string, page = 1, limit = 30): Promise<PaginatedMessagesResponse> {
    const res = (await axiosClient.get(`/chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    })) as unknown as any;

    if (Array.isArray(res)) {
      return {
        data: res,
        meta: { page, limit, total: res.length, totalPages: 1 },
      };
    }
    return res as PaginatedMessagesResponse;
  },
};
