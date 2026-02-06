// ==========================================
// FEED TYPES
// ==========================================

/**
 * Tenant info embedded in feed response
 */
export interface FeedTenant {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  whatsapp?: string;
}

/**
 * Product info embedded in feed response
 */
export interface FeedProduct {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock?: number | null;
  trackStock?: boolean;
  unit?: string | null;
}

/**
 * Feed entity
 */
export interface Feed {
  id: string;
  tenantId: string;
  productId: string;
  caption?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  tenant: FeedTenant;
  product: FeedProduct;
}

/**
 * Feed pagination meta (uses hasMore instead of totalPages)
 */
export interface FeedPaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Feed list response
 */
export interface FeedListResponse {
  data: Feed[];
  meta: FeedPaginationMeta;
}

/**
 * Create feed input
 */
export interface CreateFeedInput {
  productId: string;
  caption?: string;
}

/**
 * Update feed input (edit caption)
 */
export interface UpdateFeedInput {
  caption?: string;
}

/**
 * Create feed response
 */
export interface CreateFeedResponse {
  message: string;
  feed: Feed;
}

/**
 * Update feed response
 */
export interface UpdateFeedResponse {
  message: string;
  feed: Feed;
}

/**
 * Delete feed response
 */
export interface DeleteFeedResponse {
  message: string;
}

// ==========================================
// INTERACTIONS - Like, Comment, Bookmark, View
// ==========================================

/**
 * Toggle like response
 */
export interface ToggleLikeResponse {
  liked: boolean;
  message: string;
}

/**
 * Toggle bookmark response
 */
export interface ToggleBookmarkResponse {
  bookmarked: boolean;
  message: string;
}

/**
 * Track view response
 */
export interface TrackViewResponse {
  viewCount: number;
}

/**
 * Feed comment entity (with nested replies)
 */
export interface FeedComment {
  id: string;
  feedId: string;
  tenantId: string;
  content: string;
  parentId?: string | null;
  isOwner: boolean;
  createdAt: string;
  tenant: FeedTenant;
  replies?: FeedComment[];
}

/**
 * Create comment input
 */
export interface CreateCommentInput {
  content: string;
}

/**
 * Create comment response
 */
export interface CreateCommentResponse {
  message: string;
  comment: FeedComment;
}

/**
 * Reply to comment response
 */
export interface CreateReplyResponse {
  message: string;
  reply: FeedComment;
}

/**
 * Delete comment response
 */
export interface DeleteCommentResponse {
  message: string;
}

/**
 * Comments list response
 */
export interface FeedCommentsResponse {
  data: FeedComment[];
  meta: FeedPaginationMeta;
}
