'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './message-bubble';
import { Loader2 } from 'lucide-react';
import type { Message } from '@/types/chat';

// ==========================================
// MESSAGE LIST COMPONENT
// ==========================================

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MessageList({
  messages,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageCount = useRef(messages.length);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > lastMessageCount.current) {
      scrollToBottom();
    }
    lastMessageCount.current = messages.length;
  }, [messages.length, scrollToBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#E5DDD5] dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada pesan</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            Kirim pesan untuk memulai percakapan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-[#E5DDD5] dark:bg-zinc-900"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-white/80 dark:bg-zinc-800/80"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Muat pesan sebelumnya
          </Button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && messages.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      )}

      {/* Messages grouped by date */}
      <div className="py-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex justify-center my-4">
              <span className="text-[10px] text-zinc-500 bg-white/80 dark:bg-zinc-800/80 px-3 py-1 rounded-full shadow-sm">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.sentAt);
    const dateKey = formatDateHeader(date);

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return groups;
}

function formatDateHeader(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    return 'Hari Ini';
  }

  if (messageDate.getTime() === yesterday.getTime()) {
    return 'Kemarin';
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
