'use client';

import { cn } from '@/lib/utils';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import type { Message, MessageStatus } from '@/types/chat';

// ==========================================
// MESSAGE BUBBLE COMPONENT
// ==========================================

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.senderType !== 'CUSTOMER';
  const isAutoReply = message.senderType === 'AUTO_REPLY';

  return (
    <div className={cn('flex gap-2 mb-3 px-4', isSent ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative',
          // Customer messages (incoming)
          !isSent && 'bg-white dark:bg-zinc-800 rounded-tl-sm',
          // Owner messages (outgoing)
          isSent && !isAutoReply && 'bg-emerald-100 dark:bg-emerald-900/40 rounded-tr-sm',
          // Auto-reply messages
          isAutoReply && 'bg-sky-100 dark:bg-sky-900/40 rounded-tr-sm'
        )}
      >
        {/* Auto-reply indicator */}
        {isAutoReply && (
          <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium mb-1">
            Balasan Otomatis
          </div>
        )}

        {/* Message content */}
        {message.messageType === 'TEXT' && (
          <p className="text-sm whitespace-pre-wrap break-words text-zinc-900 dark:text-zinc-100">
            {message.content}
          </p>
        )}

        {message.messageType === 'IMAGE' && message.mediaUrl && (
          <div className="space-y-2">
            <img
              src={message.mediaUrl}
              alt="Image message"
              className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words text-zinc-900 dark:text-zinc-100">
                {message.content}
              </p>
            )}
          </div>
        )}

        {message.messageType === 'AUDIO' && message.mediaUrl && (
          <audio controls className="max-w-full">
            <source src={message.mediaUrl} type={message.mediaMimeType || 'audio/mpeg'} />
            Browser tidak mendukung audio.
          </audio>
        )}

        {message.messageType === 'DOCUMENT' && message.mediaUrl && (
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            <div className="w-10 h-10 bg-zinc-300 dark:bg-zinc-600 rounded flex items-center justify-center text-xs font-medium">
              DOC
            </div>
            <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
              {message.content || 'Document'}
            </span>
          </a>
        )}

        {/* Timestamp + Status */}
        <div className="flex items-center gap-1 mt-1 justify-end">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {formatMessageTime(message.sentAt)}
          </span>
          {isSent && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MESSAGE STATUS ICON
// ==========================================

interface MessageStatusIconProps {
  status: MessageStatus;
}

function MessageStatusIcon({ status }: MessageStatusIconProps) {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-3 w-3 text-zinc-400" />;
    case 'SENT':
      return <Check className="h-3 w-3 text-zinc-400" />;
    case 'DELIVERED':
      return <CheckCheck className="h-3 w-3 text-zinc-400" />;
    case 'READ':
      return <CheckCheck className="h-3 w-3 text-emerald-500" />;
    case 'FAILED':
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    default:
      return null;
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatMessageTime(date: string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
