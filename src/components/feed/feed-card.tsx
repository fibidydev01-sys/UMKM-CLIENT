'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Heart,
  MessageCircle,
  Eye,
  Store,
  Trash2,
  Send,
  Bookmark,
  Share2,
  MoreHorizontal,
  Pencil,
  Reply,
  Crown,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { feedApi } from '@/lib/api';
import { toast } from '@/providers';
import type { Feed, FeedComment } from '@/types';

interface FeedCardProps {
  feed: Feed;
  currentTenantId?: string | null;
  onDelete?: (feedId: string) => void;
  onUpdate?: (feedId: string, caption: string) => void;
  onCardClick?: (feed: Feed) => void;
  onTenantClick?: (slug: string) => void;
  onCommentClick?: (feed: Feed) => void;
  onBookmarkChange?: (feedId: string, bookmarked: boolean) => void;
}

export function FeedCard({ feed, currentTenantId, onDelete, onUpdate, onCardClick, onTenantClick, onCommentClick, onBookmarkChange }: FeedCardProps) {
  const isOwner = currentTenantId === feed.tenantId;
  const isLoggedIn = !!currentTenantId;
  const productImage = feed.product.images?.[0];
  const cardRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);

  // Like state
  const [liked, setLiked] = useState(feed.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(feed.likeCount);
  const [likePending, setLikePending] = useState(false);

  // Bookmark state
  const [bookmarked, setBookmarked] = useState(feed.isBookmarked ?? false);
  const [bookmarkPending, setBookmarkPending] = useState(false);

  // View count state
  const [viewCount, setViewCount] = useState(feed.viewCount);

  // Edit caption state
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(feed.caption ?? '');
  const [editPending, setEditPending] = useState(false);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentCount, setCommentCount] = useState(feed.commentCount);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsMeta, setCommentsMeta] = useState<{ hasMore: boolean; page: number } | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(feed.product.price);

  const formattedComparePrice = feed.product.comparePrice
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(feed.product.comparePrice)
    : null;

  // ── View Tracking (Intersection Observer) ──────────────────
  useEffect(() => {
    if (!isLoggedIn || viewTracked.current) return;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !viewTracked.current) {
          viewTracked.current = true;
          feedApi.trackView(feed.id).then((res) => {
            setViewCount(res.viewCount);
          }).catch(() => {
            // Silent fail for view tracking
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [feed.id, isLoggedIn]);

  // ── Toggle Like ────────────────────────────────────────────
  const handleLike = async () => {
    if (!isLoggedIn || likePending) return;
    setLikePending(true);

    const prevLiked = liked;
    const prevCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await feedApi.toggleLike(feed.id);
      setLiked(res.liked);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLikePending(false);
    }
  };

  // ── Toggle Bookmark ────────────────────────────────────────
  const handleBookmark = async () => {
    if (!isLoggedIn || bookmarkPending) return;
    setBookmarkPending(true);

    const prevBookmarked = bookmarked;
    setBookmarked(!bookmarked);

    try {
      const res = await feedApi.toggleBookmark(feed.id);
      setBookmarked(res.bookmarked);
      onBookmarkChange?.(feed.id, res.bookmarked);
    } catch {
      setBookmarked(prevBookmarked);
    } finally {
      setBookmarkPending(false);
    }
  };

  // ── Share ──────────────────────────────────────────────────
  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/explore/${feed.id}`;
    const text = feed.caption
      ? `${feed.product.name} - ${feed.caption}`
      : feed.product.name;

    if (navigator.share) {
      try {
        await navigator.share({ title: feed.product.name, text, url });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      // Could add a toast here
    }
  };

  // ── Edit Caption ───────────────────────────────────────────
  const handleStartEdit = () => {
    setEditCaption(feed.caption ?? '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditCaption(feed.caption ?? '');
  };

  const handleSaveCaption = async () => {
    if (editPending) return;
    setEditPending(true);

    try {
      await feedApi.update(feed.id, { caption: editCaption.trim() || undefined });
      feed.caption = editCaption.trim() || null;
      onUpdate?.(feed.id, editCaption.trim());
      setIsEditing(false);
      toast.success('Caption berhasil diperbarui');
    } catch {
      toast.error('Gagal menyimpan caption');
    } finally {
      setEditPending(false);
    }
  };

  // ── Comments ───────────────────────────────────────────────
  const handleToggleComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);

    if (!commentsLoaded) {
      setLoadingComments(true);
      try {
        const res = await feedApi.getComments(feed.id, { page: 1, limit: 10 });
        setComments(res.data);
        setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
        setCommentsLoaded(true);
      } catch {
        // Silently fail
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleLoadMoreComments = async () => {
    if (!commentsMeta?.hasMore || loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await feedApi.getComments(feed.id, { page: commentsMeta.page + 1, limit: 10 });
      setComments((prev) => [...prev, ...res.data]);
      setCommentsMeta({ hasMore: res.meta.hasMore, page: res.meta.page });
    } catch {
      // Silently fail
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submittingComment || !isLoggedIn) return;
    setSubmittingComment(true);

    try {
      const res = await feedApi.addComment(feed.id, { content: commentText.trim() });
      setComments((prev) => [res.comment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText('');
    } catch {
      // Keep text on error
    } finally {
      setSubmittingComment(false);
    }
  };

  // ── Delete Comment ─────────────────────────────────────────
  const handleDeleteComment = async (commentId: string, isReply: boolean, parentId?: string | null) => {
    try {
      await feedApi.deleteComment(commentId);

      if (isReply && parentId) {
        // Remove reply from parent's replies
        setComments((prev) =>
          prev.map((c) =>
            c.id === parentId
              ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== commentId) }
              : c,
          ),
        );
      } else {
        // Remove top-level comment (and all its replies counted)
        const comment = comments.find((c) => c.id === commentId);
        const replyCount = comment?.replies?.length ?? 0;
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentCount((prev) => prev - 1 - replyCount);
        return;
      }

      setCommentCount((prev) => prev - 1);
    } catch {
      // Silent fail
    }
  };

  // ── Reply to Comment ───────────────────────────────────────
  const handleSubmitReply = useCallback(async (parentCommentId: string) => {
    if (!replyText.trim() || submittingReply || !isLoggedIn) return;
    setSubmittingReply(true);

    try {
      const res = await feedApi.replyToComment(parentCommentId, { content: replyText.trim() });
      // Append reply to parent comment
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentCommentId
            ? { ...c, replies: [...(c.replies ?? []), res.reply] }
            : c,
        ),
      );
      setCommentCount((prev) => prev + 1);
      setReplyText('');
      setReplyingTo(null);
    } catch {
      // Keep text on error
    } finally {
      setSubmittingReply(false);
    }
  }, [replyText, submittingReply, isLoggedIn]);

  return (
    <div ref={cardRef} className="bg-card rounded-lg border p-4 space-y-3">
      {/* Header - Tenant Info */}
      <div className="flex items-center gap-3">
        <button onClick={() => onTenantClick?.(feed.tenant.slug)} className="hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {feed.tenant.logo ? (
              <Image
                src={feed.tenant.logo}
                alt={feed.tenant.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <Store className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <button onClick={() => onTenantClick?.(feed.tenant.slug)} className="font-semibold text-sm hover:underline truncate block text-left">
            {feed.tenant.name}
          </button>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(feed.createdAt), {
              addSuffix: true,
              locale: localeId,
            })}
          </p>
        </div>

        {/* Owner Menu: Edit / Delete */}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStartEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Caption
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Feed
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Caption (editable) */}
      {isEditing ? (
        <div className="space-y-2">
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
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={editPending}>
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
      <div
        className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-95 transition"
        onClick={() => onCardClick?.(feed)}
      >
        {productImage ? (
          <Image
            src={productImage}
            alt={feed.product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Store className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 className="font-semibold text-sm">{feed.product.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-primary">{formattedPrice}</p>
          {formattedComparePrice && (
            <p className="text-sm text-muted-foreground line-through">{formattedComparePrice}</p>
          )}
        </div>
      </div>

      {/* Interactive Engagement Bar */}
      <div className="flex items-center gap-1 pt-2 border-t">
        {/* Like Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
          onClick={handleLike}
          disabled={!isLoggedIn || likePending}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span className="text-xs">{likeCount}</span>
        </Button>

        {/* Comment Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => onCommentClick ? onCommentClick(feed) : handleToggleComments()}
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{commentCount}</span>
        </Button>

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1.5 ${bookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}`}
          onClick={handleBookmark}
          disabled={!isLoggedIn || bookmarkPending}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
        </Button>

        {/* Share Button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* View Count (passive) */}
        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
          <Eye className="h-4 w-4" />
          <span className="text-xs">{viewCount}</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 pt-2">
          {/* Comment Input */}
          {isLoggedIn && (
            <div className="flex gap-2">
              <Input
                placeholder="Tulis komentar..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                maxLength={500}
                disabled={submittingComment}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submittingComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Loading skeleton */}
          {loadingComments && !commentsLoaded && (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
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
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem
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

              {/* Load more comments */}
              {commentsMeta?.hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={handleLoadMoreComments}
                  disabled={loadingComments}
                >
                  {loadingComments ? 'Memuat...' : 'Lihat komentar lainnya'}
                </Button>
              )}
            </div>
          )}

          {/* Empty comments */}
          {commentsLoaded && comments.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Belum ada komentar
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Feed?</AlertDialogTitle>
            <AlertDialogDescription>
              Feed ini akan dihapus secara permanen beserta semua komentar dan interaksinya. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete?.(feed.id);
                toast.success('Feed berhasil dihapus');
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// COMMENT ITEM (with nested replies, owner badge, delete, reply)
// ══════════════════════════════════════════════════════════════

interface CommentItemProps {
  comment: FeedComment;
  feedOwnerTenantId: string;
  currentTenantId?: string | null;
  isLoggedIn: boolean;
  replyingTo: string | null;
  replyText: string;
  submittingReply: boolean;
  onSetReplyingTo: (id: string | null) => void;
  onSetReplyText: (text: string) => void;
  onSubmitReply: (parentId: string) => void;
  onDeleteComment: (commentId: string, isReply: boolean, parentId?: string | null) => void;
  isReply?: boolean;
  parentId?: string;
}

function CommentItem({
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
}: CommentItemProps) {
  const isFeedOwner = comment.tenantId === feedOwnerTenantId;
  const isCommentAuthor = currentTenantId === comment.tenantId;
  const canDelete = isCommentAuthor || currentTenantId === feedOwnerTenantId;
  const isReplying = replyingTo === comment.id;

  return (
    <div className={isReply ? 'ml-10' : ''}>
      <div className="flex gap-2 group">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
          {comment.tenant.logo ? (
            <Image
              src={comment.tenant.logo}
              alt={comment.tenant.name}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          ) : (
            <Store className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold">{comment.tenant.name}</span>
            {/* Owner Badge */}
            {isFeedOwner && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                <Crown className="h-2.5 w-2.5" /> Pemilik
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: localeId,
              })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>

          {/* Comment Actions: Reply + Delete */}
          <div className="flex items-center gap-2 mt-1">
            {/* Reply button (only on top-level comments) */}
            {!isReply && isLoggedIn && (
              <button
                className="text-[10px] text-muted-foreground hover:text-foreground transition"
                onClick={() => {
                  if (isReplying) {
                    onSetReplyingTo(null);
                    onSetReplyText('');
                  } else {
                    onSetReplyingTo(comment.id);
                    onSetReplyText('');
                  }
                }}
              >
                <Reply className="h-3 w-3 inline mr-0.5" /> Balas
              </button>
            )}

            {/* Delete button */}
            {canDelete && (
              <button
                className="text-[10px] text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100"
                onClick={() => onDeleteComment(comment.id, isReply, parentId)}
              >
                <Trash2 className="h-3 w-3 inline mr-0.5" /> Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      {isReplying && !isReply && (
        <div className="flex gap-2 ml-10 mt-2">
          <Input
            placeholder={`Balas ${comment.tenant.name}...`}
            value={replyText}
            onChange={(e) => onSetReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmitReply(comment.id);
              }
              if (e.key === 'Escape') {
                onSetReplyingTo(null);
                onSetReplyText('');
              }
            }}
            maxLength={500}
            disabled={submittingReply}
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onSubmitReply(comment.id)}
            disabled={!replyText.trim() || submittingReply}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Nested Replies */}
      {!isReply && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              feedOwnerTenantId={feedOwnerTenantId}
              currentTenantId={currentTenantId}
              isLoggedIn={isLoggedIn}
              replyingTo={replyingTo}
              replyText={replyText}
              submittingReply={submittingReply}
              onSetReplyingTo={onSetReplyingTo}
              onSetReplyText={onSetReplyText}
              onSubmitReply={onSubmitReply}
              onDeleteComment={onDeleteComment}
              isReply
              parentId={comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
