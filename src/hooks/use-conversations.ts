'use client';

import { useState, useCallback, useEffect } from 'react';
import { conversationsApi } from '@/lib/api/conversations';
import { useChatStore, selectFilteredConversations } from '@/stores/chat-store';
import { getErrorMessage } from '@/lib/api/client';
import { toast } from 'sonner';
import type { ConversationFilters, ConversationStatus } from '@/types/chat';

// ==========================================
// USE CONVERSATIONS HOOK
// ==========================================

export function useConversations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    conversations,
    filters,
    setConversations,
    setConversationsLoading,
    setFilters,
    resetFilters,
    updateConversation,
    markAsRead,
    activeConversationId,
  } = useChatStore();

  // Get filtered conversations
  const filteredConversations = selectFilteredConversations(useChatStore.getState());

  /**
   * Fetch conversations from API
   */
  const fetchConversations = useCallback(
    async (customFilters?: ConversationFilters) => {
      setIsLoading(true);
      setConversationsLoading(true);
      setError(null);

      try {
        const response = await conversationsApi.getAll({
          status: filters.status !== 'ALL' ? (filters.status as ConversationStatus) : undefined,
          search: filters.search || undefined,
          unreadOnly: filters.unreadOnly || undefined,
          ...customFilters,
        });

        setConversations(response.data);
        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
        setConversationsLoading(false);
      }
    },
    [filters, setConversations, setConversationsLoading]
  );

  /**
   * Update conversation status
   */
  const updateStatus = useCallback(
    async (id: string, status: ConversationStatus) => {
      try {
        const response = await conversationsApi.update(id, { status });

        if (response.success) {
          updateConversation(id, { status });
          toast.success('Status percakapan diperbarui');
        }

        return response;
      } catch (err) {
        toast.error(getErrorMessage(err));
        throw err;
      }
    },
    [updateConversation]
  );

  /**
   * Mark conversation as read
   */
  const markConversationAsRead = useCallback(
    async (id: string) => {
      try {
        await conversationsApi.markAsRead(id);
        markAsRead(id);
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    },
    [markAsRead]
  );

  /**
   * Refresh conversations on filter change
   */
  useEffect(() => {
    fetchConversations();
  }, [filters.status, filters.unreadOnly]); // Don't include search to avoid too many requests

  return {
    // Data
    conversations: filteredConversations,
    allConversations: conversations,
    filters,
    error,

    // Loading states
    isLoading,

    // Actions
    fetchConversations,
    updateStatus,
    markAsRead: markConversationAsRead,

    // Filter actions
    setFilters,
    resetFilters,
    setSearch: (search: string) => setFilters({ search }),
    setStatusFilter: (status: ConversationStatus | 'ALL') => setFilters({ status }),
    setUnreadOnly: (unreadOnly: boolean) => setFilters({ unreadOnly }),

    // Active conversation
    activeConversationId,
  };
}
