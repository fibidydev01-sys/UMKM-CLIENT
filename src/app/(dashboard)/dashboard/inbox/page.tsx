'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ConversationList,
  ChatHeader,
  MessageList,
  MessageInput,
  ChatEmptyState,
} from '@/components/chat';
import { useConversations } from '@/hooks/use-conversations';
import { useMessages } from '@/hooks/use-messages';
import { useRealtimeChat } from '@/hooks/use-realtime-chat';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { useChatStore, selectFilteredConversations } from '@/stores/chat-store';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, QrCode, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ==========================================
// INBOX PAGE - WhatsApp Chat Interface
// ==========================================

export default function InboxPage() {
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Hooks
  const { status, isConnected, checkStatus } = useWhatsApp();
  const {
    isLoading: conversationsLoading,
    filters,
    setStatusFilter,
    setSearch,
    fetchConversations,
  } = useConversations();

  const {
    messages,
    activeConversation,
    activeConversationId,
    isLoading: messagesLoading,
    isSending,
    hasMore,
    sendMessage,
    selectConversation,
    loadMoreMessages,
  } = useMessages();

  const { markAsReadRealtime, requestNotificationPermission } = useRealtimeChat();

  // Get filtered conversations from store
  const filteredConversations = selectFilteredConversations(useChatStore.getState());
  useChatStore.subscribe(() => {
    // Re-render when store updates
  });

  // Check WhatsApp status on mount
  useEffect(() => {
    checkStatus();
    fetchConversations();
    requestNotificationPermission();
  }, []);

  // Mark as read when conversation is selected
  useEffect(() => {
    if (activeConversationId) {
      markAsReadRealtime(activeConversationId);
    }
  }, [activeConversationId, markAsReadRealtime]);

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    (id: string) => {
      selectConversation(id);
      setShowMobileChat(true);
    },
    [selectConversation]
  );

  // Handle send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  // Handle status change
  const handleStatusChange = useCallback(async (newStatus: 'ACTIVE' | 'RESOLVED' | 'CLOSED') => {
    // TODO: Implement status change
    console.log('Change status to:', newStatus);
  }, []);

  // Handle back (mobile)
  const handleBack = useCallback(() => {
    setShowMobileChat(false);
    selectConversation(null);
  }, [selectConversation]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Connection Status Banner */}
      {!isConnected && <ConnectionBanner status={status} />}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversation List (Left) */}
        <div
          className={cn(
            'w-full lg:w-80 xl:w-96 flex-shrink-0 relative',
            showMobileChat && 'hidden lg:block'
          )}
        >
          <ConversationList
            conversations={filteredConversations}
            activeId={activeConversationId}
            isLoading={conversationsLoading}
            onSelect={handleSelectConversation}
            onSearch={setSearch}
            onFilterChange={setStatusFilter}
            currentFilter={filters.status}
          />

          {/* Auto Reply FAB - Inside Conversation List */}
          <Button
            asChild
            size="icon"
            className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-10 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href="/dashboard/auto-reply">
              <Bot className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Chat Window (Right) */}
        <div className={cn('flex-1 flex flex-col min-w-0', !showMobileChat && 'hidden lg:flex')}>
          {activeConversation ? (
            <>
              <ChatHeader
                conversation={activeConversation}
                onStatusChange={handleStatusChange}
                onBack={handleBack}
                showBackButton={showMobileChat}
              />
              <MessageList
                messages={messages}
                isLoading={messagesLoading}
                hasMore={hasMore}
                onLoadMore={loadMoreMessages}
              />
              <MessageInput
                onSend={handleSendMessage}
                disabled={!isConnected || isSending}
                placeholder={
                  !isConnected ? 'Hubungkan WhatsApp untuk mengirim pesan...' : 'Ketik pesan...'
                }
              />
            </>
          ) : (
            <ChatEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CONNECTION BANNER
// ==========================================

interface ConnectionBannerProps {
  status: string;
}

function ConnectionBanner({ status }: ConnectionBannerProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'DISCONNECTED':
        return {
          icon: WifiOff,
          text: 'WhatsApp belum terhubung',
          color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          iconColor: 'text-red-500',
        };
      case 'QR_PENDING':
        return {
          icon: QrCode,
          text: 'Menunggu scan QR code',
          color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
          iconColor: 'text-yellow-500',
        };
      case 'CONNECTING':
        return {
          icon: Wifi,
          text: 'Menghubungkan ke WhatsApp...',
          color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          iconColor: 'text-blue-500',
        };
      default:
        return {
          icon: WifiOff,
          text: 'Status tidak diketahui',
          color: 'bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700',
          iconColor: 'text-zinc-500',
        };
    }
  };

  const info = getStatusInfo();
  const Icon = info.icon;

  return (
    <div className={cn('px-4 py-2 border-b flex items-center justify-between', info.color)}>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', info.iconColor)} />
        <span className="text-sm font-medium">{info.text}</span>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href="/dashboard/settings/whatsapp">Hubungkan</Link>
      </Button>
    </div>
  );
}
