'use client';

import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Smile, Paperclip, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// MESSAGE INPUT COMPONENT
// ==========================================

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Ketik pesan...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(trimmed);
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Send on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, []);

  const isDisabled = disabled || isSending;

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3">
      <div className="flex items-end gap-2">
        {/* Attachment button (placeholder) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          disabled={isDisabled}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={1}
            className={cn(
              'min-h-[40px] max-h-[120px] resize-none py-2.5 pr-10',
              'bg-zinc-100 dark:bg-zinc-800 border-0',
              'focus-visible:ring-1 focus-visible:ring-emerald-500',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500'
            )}
          />

          {/* Emoji button (inside textarea) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            disabled={isDisabled}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isDisabled}
          size="icon"
          className={cn(
            'h-10 w-10 flex-shrink-0 rounded-full',
            'bg-emerald-500 hover:bg-emerald-600',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>

      {/* Character count (optional) */}
      {message.length > 3500 && (
        <div className="text-right mt-1">
          <span className={cn('text-xs', message.length > 4000 ? 'text-red-500' : 'text-zinc-400')}>
            {message.length}/4096
          </span>
        </div>
      )}
    </div>
  );
}
