// ══════════════════════════════════════════════════════════════
// FEED PREVIEW DRAWER
// Two modes: Preview (product + caption) & Comments
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  Heart,
  MessageCircle,
  Eye,
  Store,
  Bookmark,
  Share2,
  Send,
  Crown,
  Trash2,
  Reply,
  Check,
  X,
  ImageIcon,
  Quote,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';
import { feedApi } from '@/lib/api';
import { WhatsAppOrderButton } from '@/components/store/whatsapp-order-button';
import type { Feed, FeedComment } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type DrawerMode = 'preview' | 'comments';

interface FeedPreviewDrawerProps {
  feed: Feed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTenantId?: string | null;
  onDelete?: (feedId: string) => void;
  onUpdate?: (feedId: string, caption: string) => void;
  onTenantClick?: (slug: string) => void;
  initialMode?: DrawerMode;
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function FeedPreviewDrawer({
  feed,
  open,
  onOpenChange,
  currentTenantId,
  onDelete,
  onUpdate,
  onTenantClick,
  initialMode = 'preview',
}: FeedPreviewDrawerProps) {
  const [mode, setMode] = useState<DrawerMode>(initialMode);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  const isOwner = currentTenantId === feed?.tenantId;
  const isLoggedIn = !!currentTenantId;

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likePending, setLikePending] = useState(false);

  // Bookmark state
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState('');
  const [editPending, setEditPending] = useState(false);

  // Comment state
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsMeta, setCommentsMeta] = useState<{ hasMore: boolean; page: number } | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // ── Sync state when feed changes ───────────────────────────
  const prevFeedId = useRef(feed?.id);
  useEffect(() => {
    if (!feed) return;

    if (prevFeedId.current !== feed.id) {
      setSelectedImageIndex(0);
      setCommentsLoaded(false);
      setComments([]);
      setCommentsMeta(null);
      setMode(initialMode);
      setIsEditing(false);
      setReplyingTo(null);
      prevFeedId.current = feed.id;
    }

    setLiked(feed.isLiked ?? false);
    setLikeCount(feed.likeCount);
    setBookmarked(feed.isBookmarked ?? false);
    setCommentCount(feed.commentCount);
    setEditCaption(feed.caption ?? '');

    // Scroll to top
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [feed]);

  // ── Reset when drawer closes ───────────────────────────────
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      setIsHeaderSticky(false);
      setIsEditing(false);
      setMode(initialMode);
      setReplyingTo(null);
      setReplyText('');
    }
    prevOpen.current = open;
  }, [open]);

  // ── Sticky header detection ────────────────────────────────
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = headerSentinelRef.current;
    if (!scrollContainer || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeaderSticky(!entry.isIntersecting),
      { root: scrollContainer, threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open]);

  // ── Load comments when switching to comments mode ──────────
  useEffect(() => {
    if (mode !== 'comments' || !feed || commentsLoaded) return;

    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const res = await feedApi.getComments(feed.id, { page: 1, limit: 20 });
        setComments(res.data);
        setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
        setCommentsLoaded(true);
      } catch {
        // Silent fail
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [mode, feed, commentsLoaded]);

  // ── Sync initialMode when parent changes it ──────────────
  useEffect(() => {
    if (open) setMode(initialMode);
  }, [initialMode, open]);

  // ── Track view ─────────────────────────────────────────────
  const viewTracked = useRef<string | null>(null);
  useEffect(() => {
    if (!open || !feed || !isLoggedIn || viewTracked.current === feed.id) return;
    viewTracked.current = feed.id;
    feedApi.trackView(feed.id).catch(() => {});
  }, [open, feed, isLoggedIn]);

  // ── Handlers ───────────────────────────────────────────────
  const handleLike = async () => {
    if (!feed || !isLoggedIn || likePending) return;
    setLikePending(true);
    const prev = liked;
    const prevCount = likeCount;
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    try {
      const res = await feedApi.toggleLike(feed.id);
      setLiked(res.liked);
    } catch {
      setLiked(prev);
      setLikeCount(prevCount);
    } finally {
      setLikePending(false);
    }
  };

  const handleBookmark = async () => {
    if (!feed || !isLoggedIn || bookmarkPending) return;
    setBookmarkPending(true);
    const prev = bookmarked;
    setBookmarked(!bookmarked);
    try {
      const res = await feedApi.toggleBookmark(feed.id);
      setBookmarked(res.bookmarked);
    } catch {
      setBookmarked(prev);
    } finally {
      setBookmarkPending(false);
    }
  };

  const handleShare = async () => {
    if (!feed) return;
    const url = `${window.location.origin}/dashboard/explore/${feed.id}`;
    const text = feed.caption ? `${feed.product.name} - ${feed.caption}` : feed.product.name;
    if (navigator.share) {
      try { await navigator.share({ title: feed.product.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleSaveCaption = async () => {
    if (!feed || editPending) return;
    setEditPending(true);
    try {
      await feedApi.update(feed.id, { caption: editCaption.trim() || undefined });
      feed.caption = editCaption.trim() || null;
      onUpdate?.(feed.id, editCaption.trim());
      setIsEditing(false);
    } catch {} finally {
      setEditPending(false);
    }
  };

  const handleDelete = () => {
    if (!feed) return;
    onDelete?.(feed.id);
    onOpenChange(false);
  };

  const handleSubmitComment = async () => {
    if (!feed || !commentText.trim() || submittingComment || !isLoggedIn) return;
    setSubmittingComment(true);
    try {
      const res = await feedApi.addComment(feed.id, { content: commentText.trim() });
      setComments((prev) => [res.comment, ...prev]);
      setCommentCount((c) => c + 1);
      setCommentText('');
    } catch {} finally {
      setSubmittingComment(false);
    }
  };

  const handleLoadMoreComments = async () => {
    if (!feed || !commentsMeta?.hasMore || loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await feedApi.getComments(feed.id, { page: commentsMeta.page + 1, limit: 20 });
      setComments((prev) => [...prev, ...res.data]);
      setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
    } catch {} finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string, isReply: boolean, parentId?: string | null) => {
    try {
      await feedApi.deleteComment(commentId);
      if (isReply && parentId) {
        setComments((prev) => prev.map((c) =>
          c.id === parentId ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== commentId) } : c
        ));
      } else {
        const comment = comments.find((c) => c.id === commentId);
        const replyCount = comment?.replies?.length ?? 0;
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentCount((c) => c - 1 - replyCount);
        return;
      }
      setCommentCount((c) => c - 1);
    } catch {}
  };

  const handleSubmitReply = useCallback(async (parentCommentId: string) => {
    if (!replyText.trim() || submittingReply || !isLoggedIn) return;
    setSubmittingReply(true);
    try {
      const res = await feedApi.replyToComment(parentCommentId, { content: replyText.trim() });
      setComments((prev) => prev.map((c) =>
        c.id === parentCommentId ? { ...c, replies: [...(c.replies ?? []), res.reply] } : c
      ));
      setCommentCount((c) => c + 1);
      setReplyText('');
      setReplyingTo(null);
    } catch {} finally {
      setSubmittingReply(false);
    }
  }, [replyText, submittingReply, isLoggedIn]);

  if (!feed) return null;

  const hasImages = feed.product.images && feed.product.images.length > 0;
  const currentImage = hasImages ? feed.product.images[selectedImageIndex] : null;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'h-[85vh] outline-none',
            'flex flex-col',
          )}
          aria-describedby="feed-drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {mode === 'preview'
                ? `Preview: ${feed.product.name}`
                : `Komentar: ${feed.product.name}`}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="feed-drawer-description">
              {feed.caption || `Feed post dari ${feed.tenant.name}`}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Sticky Header */}
          <div
            className={cn(
              'px-4 pb-3 border-b shrink-0 transition-shadow duration-200',
              'sticky top-0 bg-background z-10',
              isHeaderSticky && 'shadow-md',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Tenant Info - clickable to open profile */}
              <button
                className="flex items-center gap-3 min-w-0 flex-1 text-left hover:opacity-80 transition-opacity"
                onClick={() => onTenantClick?.(feed.tenant.slug)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                  {feed.tenant.logo ? (
                    <Image src={feed.tenant.logo} alt={feed.tenant.name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <Store className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{feed.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(feed.createdAt), { addSuffix: true, locale: localeId })}
                  </p>
                </div>
              </button>

              {/* Mode Toggle + Actions */}
              <div className="flex items-center gap-1">
                {/* Preview Toggle */}
                <Button
                  variant={mode === 'preview' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { setMode('preview'); scrollContainerRef.current?.scrollTo({ top: 0 }); }}
                  title="Preview Produk"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                {/* Comments Toggle */}
                <Button
                  variant={mode === 'comments' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 relative"
                  onClick={() => { setMode('comments'); scrollContainerRef.current?.scrollTo({ top: 0 }); }}
                  title="Komentar"
                >
                  <MessageCircle className="h-4 w-4" />
                  {commentCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {commentCount > 99 ? '99+' : commentCount}
                    </span>
                  )}
                </Button>

              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <div ref={headerSentinelRef} className="h-0" />

            {/* ══════════ PREVIEW MODE ══════════ */}
            {mode === 'preview' && (
              <div className="max-w-2xl mx-auto w-full px-6 pb-8">
                {/* Caption / Quote */}
                {isEditing ? (
                  <div className="py-4 space-y-2">
                    <Textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="Tulis caption..."
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{editCaption.length}/500</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={editPending}>
                          <X className="h-3 w-3 mr-1" /> Batal
                        </Button>
                        <Button size="sm" onClick={handleSaveCaption} disabled={editPending}>
                          <Check className="h-3 w-3 mr-1" /> {editPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : feed.caption ? (
                  <div className="py-4 bg-muted/30 -mx-6 px-6">
                    <div className="flex gap-2">
                      <Quote className="h-4 w-4 text-primary/60 flex-shrink-0 mt-0.5" />
                      <p className="text-sm italic whitespace-pre-line">{feed.caption}</p>
                    </div>
                  </div>
                ) : null}

                {/* Product Image */}
                <div className="py-4">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
                    {currentImage ? (
                      <Image src={currentImage} alt={feed.product.name} fill className="object-cover" priority />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground mt-2">Tidak ada gambar</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {hasImages && feed.product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {feed.product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={cn(
                            'relative aspect-square rounded-lg overflow-hidden bg-muted',
                            'border-2 transition-all',
                            selectedImageIndex === idx ? 'border-primary' : 'border-transparent hover:border-muted-foreground/20',
                          )}
                        >
                          <Image src={img} alt={`${feed.product.name} ${idx + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="font-bold text-lg">{feed.product.name}</h2>

                  {feed.product.description && (
                    <p className="text-sm text-muted-foreground mt-1">{feed.product.description}</p>
                  )}

                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-bold text-primary">{formatPrice(feed.product.price)}</span>
                    {feed.product.comparePrice && feed.product.comparePrice > feed.product.price && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(feed.product.comparePrice)}</span>
                    )}
                  </div>

                  {/* WhatsApp Order */}
                  <WhatsAppOrderButton
                    product={feed.product}
                    tenant={feed.tenant}
                    className="w-full mt-4"
                  />

                  <Separator className="my-4" />

                  {/* Engagement Bar */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost" size="sm"
                      className={`gap-1.5 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
                      onClick={handleLike} disabled={!isLoggedIn || likePending}
                    >
                      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                      <span className="text-xs">{likeCount}</span>
                    </Button>

                    <Button
                      variant="ghost" size="sm"
                      className="gap-1.5 text-muted-foreground"
                      onClick={() => { setMode('comments'); scrollContainerRef.current?.scrollTo({ top: 0 }); }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{commentCount}</span>
                    </Button>

                    <Button
                      variant="ghost" size="sm"
                      className={`gap-1.5 ${bookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}`}
                      onClick={handleBookmark} disabled={!isLoggedIn || bookmarkPending}
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>

                    {/* WhatsApp Order Button */}
                    <WhatsAppOrderButton
                      product={feed.product}
                      tenant={feed.tenant}
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </WhatsAppOrderButton>

                    <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">{feed.viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ COMMENTS MODE ══════════ */}
            {mode === 'comments' && (
              <div className="max-w-2xl mx-auto w-full px-6 py-4 pb-8">
                <h3 className="font-semibold mb-4">Komentar ({commentCount})</h3>

                {/* Comment Input */}
                {isLoggedIn && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Tulis komentar..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment(); }
                      }}
                      maxLength={500}
                      disabled={submittingComment}
                    />
                    <Button size="icon" variant="ghost" onClick={handleSubmitComment} disabled={!commentText.trim() || submittingComment}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Scrollable Comment Area */}
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-4 pr-2">
                    {/* Loading */}
                    {loadingComments && !commentsLoaded && (
                      <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex gap-2">
                            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="space-y-1 flex-1">
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment List */}
                    {comments.length > 0 && (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <DrawerCommentItem
                            key={comment.id}
                            comment={comment}
                            feedOwnerTenantId={feed.tenantId}
                            currentTenantId={currentTenantId ?? null}
                            isLoggedIn={isLoggedIn}
                            replyingTo={replyingTo}
                            replyText={replyText}
                            submittingReply={submittingReply}
                            onSetReplyingTo={setReplyingTo}
                            onSetReplyText={setReplyText}
                            onSubmitReply={handleSubmitReply}
                            onDeleteComment={handleDeleteComment}
                          />
                        ))}

                        {commentsMeta?.hasMore && (
                          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={handleLoadMoreComments} disabled={loadingComments}>
                            {loadingComments ? 'Memuat...' : 'Lihat komentar lainnya'}
                          </Button>
                        )}
                      </div>
                    )}

                    {commentsLoaded && comments.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Belum ada komentar</p>
                        <p className="text-xs text-muted-foreground mt-1">Jadilah yang pertama berkomentar!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// ══════════════════════════════════════════════════════════════
// DRAWER COMMENT ITEM
// ══════════════════════════════════════════════════════════════

function DrawerCommentItem({
  comment,
  feedOwnerTenantId,
  currentTenantId,
  isLoggedIn,
  replyingTo,
  replyText,
  submittingReply,
  onSetReplyingTo,
  onSetReplyText,
  onSubmitReply,
  onDeleteComment,
  isReply = false,
  parentId,
}: {
  comment: FeedComment;
  feedOwnerTenantId: string;
  currentTenantId: string | null;
  isLoggedIn: boolean;
  replyingTo: string | null;
  replyText: string;
  submittingReply: boolean;
  onSetReplyingTo: (id: string | null) => void;
  onSetReplyText: (t: string) => void;
  onSubmitReply: (parentId: string) => void;
  onDeleteComment: (commentId: string, isReply: boolean, parentId?: string | null) => void;
  isReply?: boolean;
  parentId?: string;
}) {
  const isFeedOwner = comment.tenantId === feedOwnerTenantId;
  const canDelete = currentTenantId === comment.tenantId || currentTenantId === feedOwnerTenantId;
  const isReplying = replyingTo === comment.id;

  return (
    <div className={isReply ? 'ml-10' : ''}>
      <div className="flex gap-2 group">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
          {comment.tenant.logo ? (
            <Image src={comment.tenant.logo} alt={comment.tenant.name} width={32} height={32} className="object-cover w-full h-full" />
          ) : (
            <Store className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold">{comment.tenant.name}</span>
            {isFeedOwner && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                <Crown className="h-2.5 w-2.5" /> Pemilik
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: localeId })}
            </span>
          </div>
          <p className="text-sm mt-0.5">{comment.content}</p>
          <div className="flex items-center gap-2 mt-1">
            {!isReply && isLoggedIn && (
              <button className="text-[10px] text-muted-foreground hover:text-foreground transition" onClick={() => {
                if (isReplying) { onSetReplyingTo(null); onSetReplyText(''); } else { onSetReplyingTo(comment.id); onSetReplyText(''); }
              }}>
                <Reply className="h-3 w-3 inline mr-0.5" /> Balas
              </button>
            )}
            {canDelete && (
              <button className="text-[10px] text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100" onClick={() => onDeleteComment(comment.id, isReply, parentId)}>
                <Trash2 className="h-3 w-3 inline mr-0.5" /> Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {isReplying && !isReply && (
        <div className="flex gap-2 ml-10 mt-2">
          <Input
            placeholder={`Balas ${comment.tenant.name}...`}
            value={replyText}
            onChange={(e) => onSetReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmitReply(comment.id); }
              if (e.key === 'Escape') { onSetReplyingTo(null); onSetReplyText(''); }
            }}
            maxLength={500}
            disabled={submittingReply}
            autoFocus
          />
          <Button size="icon" variant="ghost" onClick={() => onSubmitReply(comment.id)} disabled={!replyText.trim() || submittingReply}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <DrawerCommentItem
              key={reply.id} comment={reply} feedOwnerTenantId={feedOwnerTenantId}
              currentTenantId={currentTenantId} isLoggedIn={isLoggedIn}
              replyingTo={replyingTo} replyText={replyText} submittingReply={submittingReply}
              onSetReplyingTo={onSetReplyingTo} onSetReplyText={onSetReplyText}
              onSubmitReply={onSubmitReply} onDeleteComment={onDeleteComment}
              isReply parentId={comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
