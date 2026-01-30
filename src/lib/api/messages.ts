import { api } from './client';
import type {
  SendMessageInput,
  SendMessageResponse,
  MessagesListResponse,
  MessageFilters,
} from '@/types/chat';

// ==========================================
// MESSAGES API SERVICE
// ==========================================

export const messagesApi = {
  /**
   * Send message to customer
   */
  send: (data: SendMessageInput): Promise<SendMessageResponse> => {
    return api.post<SendMessageResponse>('/messages/send', data);
  },

  /**
   * Get messages for a conversation with cursor-based pagination
   */
  getAll: (filters: MessageFilters): Promise<MessagesListResponse> => {
    return api.get<MessagesListResponse>('/messages', {
      params: {
        conversationId: filters.conversationId,
        before: filters.before,
        limit: filters.limit,
      },
    });
  },
};
