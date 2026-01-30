'use client';

import { useState, useCallback, useEffect } from 'react';
import { messagesApi } from '@/lib/api/messages';
import { conversationsApi } from '@/lib/api/conversations';
import {
  useChatStore,
  selectActiveConversation,
  selectConversationMessages,
} from '@/stores/chat-store';
import { getErrorMessage } from '@/lib/api/client';
import { toast } from 'sonner';
import type { Message, MessageType } from '@/types/chat';

// ==========================================
// USE MESSAGES HOOK
// ==========================================

export function useMessages(conversationId?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    activeConversationId,
    setActiveConversation,
    setMessages,
    addMessage,
    prependMessages,
    setMessagesLoading,
    updateMessageStatus,
    messages: allMessages,
  } = useChatStore();

  const currentConversationId = conversationId ?? activeConversationId;
  const messages = currentConversationId ? allMessages[currentConversationId] || [] : [];
  const activeConversation = selectActiveConversation(useChatStore.getState());

  /**
   * Fetch messages for conversation
   */
  const fetchMessages = useCallback(
    async (convId?: string) => {
      const id = convId || currentConversationId;
      if (!id) return null;

      setIsLoading(true);
      setMessagesLoading(true);

      try {
        // Get conversation detail which includes messages
        const response = await conversationsApi.getById(id);
        setMessages(id, response.messages);
        setHasMore(false); // Initial load gets all messages

        return response.messages;
      } catch (err) {
        toast.error(getErrorMessage(err));
        return null;
      } finally {
        setIsLoading(false);
        setMessagesLoading(false);
      }
    },
    [currentConversationId, setMessages, setMessagesLoading]
  );

  /**
   * Load more messages (pagination)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!currentConversationId || !hasMore || isLoading) return;

    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    setIsLoading(true);

    try {
      const response = await messagesApi.getAll({
        conversationId: currentConversationId,
        before: oldestMessage.id,
        limit: 50,
      });

      prependMessages(currentConversationId, response.messages);
      setHasMore(response.hasMore);

      return response.messages;
    } catch (err) {
      toast.error(getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, hasMore, isLoading, messages, prependMessages]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    async (content: string, messageType: MessageType = 'TEXT', mediaUrl?: string) => {
      if (!currentConversationId) {
        toast.error('Tidak ada percakapan yang aktif');
        return null;
      }

      setIsSending(true);

      // Create optimistic message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        conversationId: currentConversationId,
        tenantId: '',
        senderType: 'OWNER',
        messageType,
        content,
        mediaUrl,
        status: 'PENDING',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Add optimistic message
      addMessage(currentConversationId, optimisticMessage);

      try {
        const response = await messagesApi.send({
          conversationId: currentConversationId,
          messageType,
          content,
          mediaUrl,
        });

        if (response.success) {
          // Update the temp message with real data
          updateMessageStatus(currentConversationId, tempId, 'SENT');
        }

        return response;
      } catch (err) {
        // Mark as failed
        updateMessageStatus(currentConversationId, tempId, 'FAILED');
        toast.error(getErrorMessage(err));
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [currentConversationId, addMessage, updateMessageStatus]
  );

  /**
   * Select a conversation
   */
  const selectConversation = useCallback(
    async (id: string | null) => {
      setActiveConversation(id);

      if (id) {
        // Fetch messages if not already loaded
        const existingMessages = allMessages[id];
        if (!existingMessages || existingMessages.length === 0) {
          await fetchMessages(id);
        }
      }
    },
    [setActiveConversation, allMessages, fetchMessages]
  );

  // Auto-fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId && !allMessages[activeConversationId]) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  return {
    // Data
    messages,
    activeConversation,
    activeConversationId: currentConversationId,
    hasMore,

    // Loading states
    isLoading,
    isSending,

    // Actions
    fetchMessages,
    loadMoreMessages,
    sendMessage,
    selectConversation,

    // Direct access for WebSocket updates
    addMessage,
    updateMessageStatus,
  };
}
