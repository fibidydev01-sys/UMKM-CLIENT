'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bookmark, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard';
import { FeedCard, FeedPreviewDrawer, TenantProfileDrawer } from '@/components/feed';
import { feedApi, getErrorMessage } from '@/lib/api';
import { useCurrentTenant } from '@/stores/auth-store';
import type { Feed, FeedPaginationMeta } from '@/types';

const FEED_LIMIT = 20;

export default function BookmarksPage() {
  const tenant = useCurrentTenant();

  // Feed state
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [meta, setMeta] = useState<FeedPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drawer state
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'preview' | 'comments'>('preview');

  // Tenant profile drawer state
  const [profileSlug, setProfileSlug] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Refs
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async (page: number, append = false) => {
    if (!isMounted.current) return;

    if (page === 1 && !append) {
      setIsLoading(true);
    }
    if (append) {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const res = await feedApi.getBookmarks({ page, limit: FEED_LIMIT });

      if (!isMounted.current) return;

      if (append) {
        setFeeds((prev) => [...prev, ...res.data]);
      } else {
        setFeeds(res.data);
      }
      setMeta(res.meta);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err));
    } finally {
      if (!isMounted.current) return;
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    isMounted.current = true;

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBookmarks(1);
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchBookmarks]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookmarks(1);
  };

  // Load more handler
  const handleLoadMore = async () => {
    if (!meta?.hasMore || isLoadingMore) return;
    await fetchBookmarks(meta.page + 1, true);
  };

  // Delete handler (remove from list)
  const handleDelete = async (feedId: string) => {
    try {
      await feedApi.delete(feedId);
      setFeeds((prev) => prev.filter((f) => f.id !== feedId));
      if (meta) {
        setMeta({ ...meta, total: meta.total - 1 });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  // When unbookmark, remove from list immediately
  const handleUnbookmark = (feedId: string) => {
    setFeeds((prev) => prev.filter((f) => f.id !== feedId));
    if (meta) {
      setMeta({ ...meta, total: meta.total - 1 });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Tersimpan" description="Feed yang kamu simpan" />
        <BookmarksSkeleton />
      </>
    );
  }

  // Error state
  if (error && feeds.length === 0) {
    return (
      <>
        <PageHeader title="Tersimpan" description="Feed yang kamu simpan" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat bookmark</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              hasFetched.current = false;
              fetchBookmarks(1);
            }}
          >
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // Empty state
  if (feeds.length === 0) {
    return (
      <>
        <PageHeader title="Tersimpan" description="Feed yang kamu simpan" />
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Belum ada yang disimpan</h2>
          <p className="text-muted-foreground">
            Ketuk ikon bookmark pada feed untuk menyimpannya di sini
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Tersimpan" description="Feed yang kamu simpan">
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </PageHeader>

      {/* Bookmarked Feed List */}
      <div className="max-w-xl mx-auto space-y-4">
        {feeds.map((feed) => (
          <FeedCard
            key={feed.id}
            feed={feed}
            currentTenantId={tenant?.id ?? null}
            onDelete={handleDelete}
            onUpdate={(feedId, caption) => {
              setFeeds((prev) =>
                prev.map((f) => (f.id === feedId ? { ...f, caption } : f)),
              );
            }}
            onBookmarkChange={(feedId, bookmarked) => {
              if (!bookmarked) {
                handleUnbookmark(feedId);
              }
            }}
            onCardClick={(f) => {
              setSelectedFeed(f);
              setDrawerMode('preview');
              setDrawerOpen(true);
            }}
            onTenantClick={(slug) => {
              setProfileSlug(slug);
              setProfileOpen(true);
            }}
            onCommentClick={(f) => {
              setSelectedFeed(f);
              setDrawerMode('comments');
              setDrawerOpen(true);
            }}
          />
        ))}

        {/* Load More */}
        {meta?.hasMore ? (
          <div className="flex justify-center py-4">
            <Button variant="outline" onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Memuat...' : 'Lihat Lebih Banyak'}
            </Button>
          </div>
        ) : feeds.length > 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Semua feed tersimpan sudah ditampilkan
          </div>
        )}

        {/* Inline error */}
        {error && feeds.length > 0 && (
          <div className="rounded-md bg-destructive/10 p-3 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>

      <FeedPreviewDrawer
        feed={selectedFeed}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentTenantId={tenant?.id ?? null}
        initialMode={drawerMode}
        onDelete={handleDelete}
        onUpdate={(feedId, caption) => {
          setFeeds((prev) =>
            prev.map((f) => (f.id === feedId ? { ...f, caption } : f)),
          );
        }}
        onTenantClick={(slug) => {
          setProfileSlug(slug);
          setProfileOpen(true);
        }}
      />

      <TenantProfileDrawer
        slug={profileSlug}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

function BookmarksSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
