'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Phone, CheckCircle2, XCircle, Archive, User, ArrowLeft } from 'lucide-react';
import { cn, getInitials, formatPhone } from '@/lib/utils';
import type { Conversation, ConversationStatus } from '@/types/chat';

// ==========================================
// CHAT HEADER COMPONENT
// ==========================================

interface ChatHeaderProps {
  conversation: Conversation | null;
  onStatusChange?: (status: ConversationStatus) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({
  conversation,
  onStatusChange,
  onBack,
  showBackButton = false,
}: ChatHeaderProps) {
  if (!conversation) {
    return (
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Pilih percakapan untuk memulai</p>
      </div>
    );
  }

  const displayName = conversation.customerName || conversation.customerPhone;

  return (
    <div className="h-16 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Back button (mobile) */}
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Avatar */}
        <Avatar className="h-10 w-10">
          {conversation.customerAvatarUrl ? (
            <AvatarImage src={conversation.customerAvatarUrl} alt={displayName} />
          ) : null}
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-sm font-medium">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {displayName}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatPhone(conversation.customerPhone)}
          </p>
        </div>

        {/* Status badge */}
        <StatusBadge status={conversation.status} />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Call button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => window.open(`tel:${conversation.customerPhone}`, '_blank')}
        >
          <Phone className="h-4 w-4" />
        </Button>

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Lihat Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {conversation.status === 'ACTIVE' && (
              <>
                <DropdownMenuItem onClick={() => onStatusChange?.('RESOLVED')}>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                  Tandai Selesai
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange?.('CLOSED')}>
                  <Archive className="h-4 w-4 mr-2 text-zinc-500" />
                  Tutup Percakapan
                </DropdownMenuItem>
              </>
            )}
            {conversation.status !== 'ACTIVE' && (
              <DropdownMenuItem onClick={() => onStatusChange?.('ACTIVE')}>
                <XCircle className="h-4 w-4 mr-2 text-blue-500" />
                Buka Kembali
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

interface StatusBadgeProps {
  status: ConversationStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'ACTIVE') return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-[10px] px-2 py-0.5',
        status === 'RESOLVED' &&
          'border-green-300 text-green-600 bg-green-50 dark:border-green-700 dark:text-green-400 dark:bg-green-900/20',
        status === 'CLOSED' &&
          'border-zinc-300 text-zinc-500 bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:bg-zinc-800'
      )}
    >
      {status === 'RESOLVED' ? 'Selesai' : 'Ditutup'}
    </Badge>
  );
}
