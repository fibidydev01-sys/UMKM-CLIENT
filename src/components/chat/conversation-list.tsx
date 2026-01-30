'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ConversationItem } from './conversation-item';
import { Search, MessageSquare } from 'lucide-react';
import type { Conversation, ConversationStatus } from '@/types/chat';

// ==========================================
// CONVERSATION LIST COMPONENT
// ==========================================

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  isLoading?: boolean;
  onSelect: (id: string) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (status: ConversationStatus | 'ALL') => void;
  currentFilter?: ConversationStatus | 'ALL';
}

export function ConversationList({
  conversations,
  activeId,
  isLoading = false,
  onSelect,
  onSearch,
  onFilterChange,
  currentFilter = 'ALL',
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Pesan</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-zinc-100 dark:bg-zinc-800 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
        <Tabs
          value={currentFilter}
          onValueChange={(value) => onFilterChange?.(value as ConversationStatus | 'ALL')}
        >
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="ALL" className="text-xs">
              Semua
            </TabsTrigger>
            <TabsTrigger value="ACTIVE" className="text-xs">
              Aktif
            </TabsTrigger>
            <TabsTrigger value="RESOLVED" className="text-xs">
              Selesai
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : conversations.length === 0 ? (
          <EmptyConversationList searchQuery={searchQuery} />
        ) : (
          <div>
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeId === conversation.id}
                onClick={() => onSelect(conversation.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ==========================================
// SKELETON LOADING
// ==========================================

function ConversationListSkeleton() {
  return (
    <div className="p-3 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// EMPTY STATE
// ==========================================

interface EmptyConversationListProps {
  searchQuery?: string;
}

function EmptyConversationList({ searchQuery }: EmptyConversationListProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-zinc-400" />
      </div>
      {searchQuery ? (
        <>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tidak ditemukan</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Tidak ada percakapan yang cocok dengan &quot;{searchQuery}&quot;
          </p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Belum ada percakapan
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Percakapan baru akan muncul di sini
          </p>
        </>
      )}
    </div>
  );
}
