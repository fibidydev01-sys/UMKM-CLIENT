'use client';

import { useState, useEffect, useRef, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
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
  MoreHorizontal,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { feedApi, getErrorMessage } from '@/lib/api';
import { useCurrentTenant } from '@/stores/auth-store';
import { WhatsAppOrderButton } from '@/components/store/whatsapp-order-button';
import type { Feed, FeedComment } from '@/types';

export default function FeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: feedId } = use(params);
  const router = useRouter();
  const tenant = useCurrentTenant();
  const currentTenantId = tenant?.id ?? null;
  const isLoggedIn = !!currentTenantId;
  const viewTracked = useRef(false);

  // Feed state
  const [feed, setFeed] = useState<Feed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Comments state
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

  // Fetch feed detail
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const data = await feedApi.getById(feedId);
        setFeed(data);
        setLiked(data.isLiked ?? false);
        setLikeCount(data.likeCount);
        setBookmarked(data.isBookmarked ?? false);
        setCommentCount(data.commentCount);
        setEditCaption(data.caption ?? '');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, [feedId]);

  // Track view
  useEffect(() => {
    if (!isLoggedIn || viewTracked.current || !feed) return;
    viewTracked.current = true;
    feedApi.trackView(feedId).catch(() => {});
  }, [feedId, isLoggedIn, feed]);

  // Load comments
  useEffect(() => {
    if (!feed) return;
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const res = await feedApi.getComments(feedId, { page: 1, limit: 20 });
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
  }, [feedId, feed]);

  if (isLoading) {
    return <FeedDetailSkeleton />;
  }

  if (error || !feed) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-destructive font-medium">
          {error ?? 'Feed tidak ditemukan'}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
      </div>
    );
  }

  const isOwner = currentTenantId === feed.tenantId;
  const productImage = feed.product.images?.[0];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  // Handlers
  const handleLike = async () => {
    if (!isLoggedIn || likePending) return;
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
    if (!isLoggedIn || bookmarkPending) return;
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
    const url = window.location.href;
    const text = feed.caption ? `${feed.product.name} - ${feed.caption}` : feed.product.name;
    if (navigator.share) {
      try { await navigator.share({ title: feed.product.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleSaveCaption = async () => {
    if (editPending) return;
    setEditPending(true);
    try {
      await feedApi.update(feed.id, { caption: editCaption.trim() || undefined });
      feed.caption = editCaption.trim() || null;
      setIsEditing(false);
    } catch {} finally {
      setEditPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      await feedApi.delete(feed.id);
      router.push('/dashboard/explore');
    } catch {}
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submittingComment || !isLoggedIn) return;
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
    if (!commentsMeta?.hasMore || loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await feedApi.getComments(feedId, { page: commentsMeta.page + 1, limit: 20 });
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

  const handleSubmitReply = async (parentCommentId: string) => {
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
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      {/* Feed Card */}
      <div className="bg-card rounded-lg border p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href={`/store/${feed.tenant.slug}`}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {feed.tenant.logo ? (
                <Image src={feed.tenant.logo} alt={feed.tenant.name} width={48} height={48} className="object-cover w-full h-full" />
              ) : (
                <Store className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/store/${feed.tenant.slug}`} className="font-semibold hover:underline truncate block">
              {feed.tenant.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(feed.createdAt), { addSuffix: true, locale: localeId })}
            </p>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setEditCaption(feed.caption ?? ''); setIsEditing(true); }}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit Caption
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus Feed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Caption */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} maxLength={500} rows={3} />
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
        ) : (
          feed.caption && <p className="text-sm whitespace-pre-line">{feed.caption}</p>
        )}

        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          {productImage ? (
            <Image src={productImage} alt={feed.product.name} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Store className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h2 className="font-bold text-lg">{feed.product.name}</h2>
          {feed.product.description && (
            <p className="text-sm text-muted-foreground">{feed.product.description}</p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-primary">{formatPrice(feed.product.price)}</p>
            {feed.product.comparePrice && (
              <p className="text-sm text-muted-foreground line-through">{formatPrice(feed.product.comparePrice)}</p>
            )}
          </div>
          {/* WhatsApp Order */}
          <WhatsAppOrderButton
            product={feed.product}
            tenant={feed.tenant}
            className="w-full mt-4"
          />
        </div>

        {/* Engagement Bar */}
        <div className="flex items-center gap-1 pt-3 border-t">
          <Button
            variant="ghost" size="sm"
            className={`gap-1.5 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
            onClick={handleLike} disabled={!isLoggedIn || likePending}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </Button>

          <div className="flex items-center gap-1.5 text-muted-foreground px-3">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">{commentCount}</span>
          </div>

          <Button
            variant="ghost" size="sm"
            className={`gap-1.5 ${bookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}`}
            onClick={handleBookmark} disabled={!isLoggedIn || bookmarkPending}
          >
            <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>

          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
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
            <Eye className="h-5 w-5" />
            <span className="text-sm">{feed.viewCount}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments" className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="font-semibold">Komentar ({commentCount})</h3>

        {/* Comment Input */}
        {isLoggedIn && (
          <div className="flex gap-2">
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
              <DetailCommentItem
                key={comment.id}
                comment={comment}
                feedOwnerTenantId={feed.tenantId}
                currentTenantId={currentTenantId}
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
          <p className="text-sm text-muted-foreground text-center py-4">Belum ada komentar. Jadilah yang pertama!</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DETAIL COMMENT ITEM (reused pattern from feed-card)
// ══════════════════════════════════════════════════════════════

function DetailCommentItem({
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
            <DetailCommentItem
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

// ══════════════════════════════════════════════════════════════
// SKELETON
// ══════════════════════════════════════════════════════════════

function FeedDetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Skeleton className="h-8 w-24" />
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}
