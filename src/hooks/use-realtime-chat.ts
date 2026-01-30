'use client';

import { useEffect, useCallback } from 'react';
import {
  initMessagesSocket,
  initWhatsAppSocket,
  disconnectAllSockets,
  onQRCode,
  onConnectionStatus,
  onNewMessage,
  onMessageStatusUpdated,
  onNewConversation,
  joinConversation,
  leaveConversation,
  emitMarkAsRead,
} from '@/lib/socket';
import { useChatStore } from '@/stores/chat-store';
import type { WhatsAppStatus } from '@/types/chat';

// ==========================================
// USE REALTIME CHAT HOOK
// ==========================================

export function useRealtimeChat() {
  const {
    setWhatsAppStatus,
    setQRCode,
    setPhoneNumber,
    addMessage,
    incrementUnread,
    addConversation,
    updateMessageStatus,
    activeConversationId,
  } = useChatStore();

  /**
   * Initialize WebSocket connections and listeners
   */
  useEffect(() => {
    // Initialize sockets
    initWhatsAppSocket();
    initMessagesSocket();

    // WhatsApp events
    const unsubQR = onQRCode((data) => {
      setQRCode(data.qrCode);
      setWhatsAppStatus('QR_PENDING');
    });

    const unsubStatus = onConnectionStatus((data) => {
      setWhatsAppStatus(data.status as WhatsAppStatus);

      if (data.phoneNumber) {
        setPhoneNumber(data.phoneNumber);
      }

      if (data.status === 'CONNECTED') {
        setQRCode(null);
      }
    });

    // Message events
    const unsubNewMessage = onNewMessage((data) => {
      const { conversationId, message } = data;
      const state = useChatStore.getState();

      // Add message to store
      addMessage(conversationId, message);

      // Increment unread if not active conversation and from customer
      if (conversationId !== state.activeConversationId && message.senderType === 'CUSTOMER') {
        incrementUnread(conversationId);

        // Show browser notification
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(message.senderName || 'Pesan Baru', {
              body: message.content.substring(0, 100),
              icon: '/icons/icon-192x192.png',
            });
          }
        }
      }
    });

    const unsubStatusUpdate = onMessageStatusUpdated((data) => {
      // Find conversation that contains this message and update
      const state = useChatStore.getState();
      Object.keys(state.messages).forEach((convId) => {
        const messages = state.messages[convId];
        const hasMessage = messages.some((m) => m.id === data.messageId);
        if (hasMessage) {
          updateMessageStatus(convId, data.messageId, data.status);
        }
      });
    });

    const unsubNewConversation = onNewConversation((data) => {
      addConversation(data.conversation);
    });

    // Cleanup
    return () => {
      unsubQR();
      unsubStatus();
      unsubNewMessage();
      unsubStatusUpdate();
      unsubNewConversation();
      disconnectAllSockets();
    };
  }, []);

  /**
   * Join/leave conversation room when active conversation changes
   */
  useEffect(() => {
    if (activeConversationId) {
      joinConversation(activeConversationId);

      return () => {
        leaveConversation(activeConversationId);
      };
    }
  }, [activeConversationId]);

  /**
   * Mark conversation as read via WebSocket
   */
  const markAsReadRealtime = useCallback((conversationId: string) => {
    emitMarkAsRead(conversationId);
  }, []);

  /**
   * Request notification permission
   */
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    markAsReadRealtime,
    requestNotificationPermission,
  };
}
