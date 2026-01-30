'use client';

import { create } from 'zustand';
import { useSyncExternalStore } from 'react';
import type { Conversation, Message, WhatsAppStatus, ConversationStatus } from '@/types/chat';

// ==========================================
// CHAT STORE TYPES
// ==========================================

interface ChatFilters {
  status: ConversationStatus | 'ALL';
  search: string;
  unreadOnly: boolean;
}

interface ChatState {
  // WhatsApp Connection
  whatsappStatus: WhatsAppStatus;
  phoneNumber: string | null;
  qrCode: string | null;

  // Active conversation
  activeConversationId: string | null;

  // Conversations
  conversations: Conversation[];
  conversationsLoading: boolean;

  // Messages (keyed by conversationId)
  messages: Record<string, Message[]>;
  messagesLoading: boolean;

  // Filters
  filters: ChatFilters;

  // Unread total
  totalUnread: number;
}

interface ChatActions {
  // WhatsApp
  setWhatsAppStatus: (status: WhatsAppStatus) => void;
  setPhoneNumber: (phone: string | null) => void;
  setQRCode: (qr: string | null) => void;

  // Conversation
  setActiveConversation: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setConversationsLoading: (loading: boolean) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addConversation: (conversation: Conversation) => void;

  // Messages
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (
    conversationId: string,
    messageId: string,
    status: Message['status']
  ) => void;
  setMessagesLoading: (loading: boolean) => void;
  prependMessages: (conversationId: string, messages: Message[]) => void;

  // Unread
  incrementUnread: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
  updateTotalUnread: () => void;

  // Filters
  setFilters: (filters: Partial<ChatFilters>) => void;
  resetFilters: () => void;

  // Reset
  reset: () => void;
}

type ChatStore = ChatState & ChatActions;

// ==========================================
// INITIAL STATE
// ==========================================

const initialState: ChatState = {
  whatsappStatus: 'DISCONNECTED',
  phoneNumber: null,
  qrCode: null,
  activeConversationId: null,
  conversations: [],
  conversationsLoading: false,
  messages: {},
  messagesLoading: false,
  filters: {
    status: 'ALL',
    search: '',
    unreadOnly: false,
  },
  totalUnread: 0,
};

// ==========================================
// CHAT STORE
// ==========================================

export const useChatStore = create<ChatStore>()((set, get) => ({
  ...initialState,

  // WhatsApp
  setWhatsAppStatus: (status) => set({ whatsappStatus: status }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setQRCode: (qr) => set({ qrCode: qr }),

  // Conversation
  setActiveConversation: (id) => set({ activeConversationId: id }),

  setConversations: (conversations) => {
    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    set({ conversations, totalUnread });
  },

  setConversationsLoading: (loading) => set({ conversationsLoading: loading }),

  updateConversation: (id, updates) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
    }));
    get().updateTotalUnread();
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    }));
    get().updateTotalUnread();
  },

  // Messages
  setMessages: (conversationId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    }));
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    }));

    // Update conversation's last message
    const state = get();
    const conversation = state.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      get().updateConversation(conversationId, {
        lastMessageAt: message.sentAt,
        lastMessageContent: message.content,
        lastMessageFrom: message.senderType,
        totalMessages: (conversation.totalMessages || 0) + 1,
      });
    }
  },

  updateMessageStatus: (conversationId, messageId, status) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, status } : msg
        ),
      },
    }));
  },

  setMessagesLoading: (loading) => set({ messagesLoading: loading }),

  prependMessages: (conversationId, messages) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...messages, ...(state.messages[conversationId] || [])],
      },
    }));
  },

  // Unread
  incrementUnread: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: conv.unreadCount + 1 } : conv
      ),
    }));
    get().updateTotalUnread();
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
    get().updateTotalUnread();
  },

  updateTotalUnread: () => {
    const { conversations } = get();
    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    set({ totalUnread });
  },

  // Filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  resetFilters: () => {
    set({ filters: initialState.filters });
  },

  // Reset
  reset: () => set(initialState),
}));

// ==========================================
// HYDRATION-SAFE HOOKS
// ==========================================

const subscribe = (callback: () => void) => {
  return useChatStore.subscribe(callback);
};

export function useActiveConversationId(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => useChatStore.getState().activeConversationId,
    () => null
  );
}

export function useWhatsAppStatus(): WhatsAppStatus {
  return useSyncExternalStore(
    subscribe,
    () => useChatStore.getState().whatsappStatus,
    () => 'DISCONNECTED'
  );
}

export function useTotalUnread(): number {
  return useSyncExternalStore(
    subscribe,
    () => useChatStore.getState().totalUnread,
    () => 0
  );
}

export function useConversations(): Conversation[] {
  return useSyncExternalStore(
    subscribe,
    () => useChatStore.getState().conversations,
    () => []
  );
}

export function useChatFilters(): ChatFilters {
  return useSyncExternalStore(
    subscribe,
    () => useChatStore.getState().filters,
    () => initialState.filters
  );
}

// ==========================================
// SELECTORS
// ==========================================

export const selectActiveConversation = (state: ChatStore) => {
  const { activeConversationId, conversations } = state;
  if (!activeConversationId) return null;
  return conversations.find((c) => c.id === activeConversationId) || null;
};

export const selectConversationMessages = (state: ChatStore, conversationId: string) => {
  return state.messages[conversationId] || [];
};

export const selectFilteredConversations = (state: ChatStore) => {
  let filtered = [...state.conversations];

  // Filter by status
  if (state.filters.status !== 'ALL') {
    filtered = filtered.filter((c) => c.status === state.filters.status);
  }

  // Filter by unread
  if (state.filters.unreadOnly) {
    filtered = filtered.filter((c) => c.unreadCount > 0);
  }

  // Filter by search
  if (state.filters.search) {
    const search = state.filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.customerName?.toLowerCase().includes(search) || c.customerPhone.includes(search)
    );
  }

  // Sort by last message
  filtered.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return filtered;
};
