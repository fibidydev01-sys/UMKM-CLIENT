import { api } from './client';
import type {
  ConversationListResponse,
  ConversationDetailResponse,
  ConversationFilters,
  UpdateConversationInput,
  Conversation,
} from '@/types/chat';

// ==========================================
// CONVERSATIONS API SERVICE
// ==========================================

export const conversationsApi = {
  /**
   * Get list of conversations with filters and pagination
   */
  getAll: (filters?: ConversationFilters): Promise<ConversationListResponse> => {
    return api.get<ConversationListResponse>('/conversations', {
      params: {
        status: filters?.status,
        search: filters?.search,
        unreadOnly: filters?.unreadOnly,
        page: filters?.page,
        limit: filters?.limit,
      },
    });
  },

  /**
   * Get single conversation with messages
   */
  getById: (id: string): Promise<ConversationDetailResponse> => {
    return api.get<ConversationDetailResponse>(`/conversations/${id}`);
  },

  /**
   * Update conversation status
   */
  update: (
    id: string,
    data: UpdateConversationInput
  ): Promise<{ success: boolean; conversation: Conversation }> => {
    return api.patch<{ success: boolean; conversation: Conversation }>(
      `/conversations/${id}`,
      data
    );
  },

  /**
   * Mark all messages in conversation as read
   */
  markAsRead: (id: string): Promise<{ success: boolean }> => {
    return api.post<{ success: boolean }>(`/conversations/${id}/mark-read`);
  },
};
