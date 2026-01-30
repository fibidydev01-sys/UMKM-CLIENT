'use client';

import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Bot } from 'lucide-react';
import type { Conversation, SenderType } from '@/types/chat';

// ==========================================
// CONVERSATION ITEM COMPONENT
// ==========================================

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const displayName = conversation.customerName || conversation.customerPhone;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 cursor-pointer transition-colors',
        'hover:bg-zinc-100 dark:hover:bg-zinc-800',
        'border-b border-zinc-100 dark:border-zinc-800',
        isActive && 'bg-zinc-100 dark:bg-zinc-800'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          {conversation.customerAvatarUrl ? (
            <AvatarImage src={conversation.customerAvatarUrl} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-sm font-medium">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        {/* Unread badge */}
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-0.5">
          <h3
            className={cn(
              'text-sm truncate',
              conversation.unreadCount > 0
                ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                : 'font-medium text-zinc-700 dark:text-zinc-300'
            )}
          >
            {displayName}
          </h3>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 flex-shrink-0 ml-2">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>

        {/* Last message preview */}
        <div className="flex items-center gap-1">
          {/* Sender indicator */}
          {conversation.lastMessageFrom && conversation.lastMessageFrom !== 'CUSTOMER' && (
            <LastMessageIndicator from={conversation.lastMessageFrom} />
          )}

          <p
            className={cn(
              'text-xs truncate flex-1',
              conversation.unreadCount > 0
                ? 'text-zinc-700 dark:text-zinc-300'
                : 'text-zinc-500 dark:text-zinc-400'
            )}
          >
            {conversation.lastMessageContent || 'Belum ada pesan'}
          </p>
        </div>

        {/* Status badge */}
        {conversation.status !== 'ACTIVE' && (
          <Badge
            variant="outline"
            className={cn(
              'mt-1 text-[10px] px-1.5 py-0',
              conversation.status === 'RESOLVED' &&
                'border-green-300 text-green-600 dark:border-green-700 dark:text-green-400',
              conversation.status === 'CLOSED' &&
                'border-zinc-300 text-zinc-500 dark:border-zinc-600 dark:text-zinc-400'
            )}
          >
            {conversation.status === 'RESOLVED' ? 'Selesai' : 'Ditutup'}
          </Badge>
        )}
      </div>
    </div>
  );
}

// ==========================================
// LAST MESSAGE INDICATOR
// ==========================================

interface LastMessageIndicatorProps {
  from: SenderType;
}

function LastMessageIndicator({ from }: LastMessageIndicatorProps) {
  if (from === 'OWNER') {
    return <CheckCheck className="h-3 w-3 text-emerald-500 flex-shrink-0" />;
  }

  if (from === 'AUTO_REPLY') {
    return <Bot className="h-3 w-3 text-sky-500 flex-shrink-0" />;
  }

  return null;
}
