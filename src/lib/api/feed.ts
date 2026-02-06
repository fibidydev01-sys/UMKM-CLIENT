import { api } from './client';
import type {
  FeedListResponse,
  Feed,
  CreateFeedInput,
  UpdateFeedInput,
  CreateFeedResponse,
  UpdateFeedResponse,
  DeleteFeedResponse,
  ToggleLikeResponse,
  ToggleBookmarkResponse,
  TrackViewResponse,
  CreateCommentInput,
  CreateCommentResponse,
  CreateReplyResponse,
  DeleteCommentResponse,
  FeedCommentsResponse,
} from '@/types';

// ==========================================
// FEED API SERVICE
// ==========================================

export const feedApi = {
  /**
   * Get feed list (public - chronological, paginated)
   * GET /feed?page=1&limit=20
   */
  getAll: async (params?: { page?: number; limit?: number }): Promise<FeedListResponse> => {
    return api.get<FeedListResponse>('/feed', { params });
  },

  /**
   * Get single feed detail (public)
   * GET /feed/:id
   */
  getById: async (id: string): Promise<Feed> => {
    return api.get<Feed>(`/feed/${id}`);
  },

  /**
   * Create feed post (protected - from own product)
   * POST /feed
   */
  create: async (data: CreateFeedInput): Promise<CreateFeedResponse> => {
    return api.post<CreateFeedResponse>('/feed', data);
  },

  /**
   * Update feed caption (protected - owner only)
   * PATCH /feed/:id
   */
  update: async (id: string, data: UpdateFeedInput): Promise<UpdateFeedResponse> => {
    return api.patch<UpdateFeedResponse>(`/feed/${id}`, data);
  },

  /**
   * Delete own feed post (protected)
   * DELETE /feed/:id
   */
  delete: async (id: string): Promise<DeleteFeedResponse> => {
    return api.delete<DeleteFeedResponse>(`/feed/${id}`);
  },

  /**
   * Get my bookmarks (private - only own bookmarks)
   * GET /feed/bookmarks?page=1&limit=20
   */
  getBookmarks: async (params?: { page?: number; limit?: number }): Promise<FeedListResponse> => {
    return api.get<FeedListResponse>('/feed/bookmarks', { params });
  },

  // ==========================================
  // INTERACTIONS
  // ==========================================

  /**
   * Toggle like on a feed (protected)
   * POST /feed/:id/like
   */
  toggleLike: async (feedId: string): Promise<ToggleLikeResponse> => {
    return api.post<ToggleLikeResponse>(`/feed/${feedId}/like`);
  },

  /**
   * Toggle bookmark on a feed (protected)
   * POST /feed/:id/bookmark
   */
  toggleBookmark: async (feedId: string): Promise<ToggleBookmarkResponse> => {
    return api.post<ToggleBookmarkResponse>(`/feed/${feedId}/bookmark`);
  },

  /**
   * Track view on a feed (protected)
   * POST /feed/:id/view
   */
  trackView: async (feedId: string): Promise<TrackViewResponse> => {
    return api.post<TrackViewResponse>(`/feed/${feedId}/view`);
  },

  /**
   * Get comments for a feed (public, paginated)
   * GET /feed/:id/comments?page=1&limit=20
   */
  getComments: async (feedId: string, params?: { page?: number; limit?: number }): Promise<FeedCommentsResponse> => {
    return api.get<FeedCommentsResponse>(`/feed/${feedId}/comments`, { params });
  },

  /**
   * Add comment to a feed (protected)
   * POST /feed/:id/comments
   */
  addComment: async (feedId: string, data: CreateCommentInput): Promise<CreateCommentResponse> => {
    return api.post<CreateCommentResponse>(`/feed/${feedId}/comments`, data);
  },

  /**
   * Reply to a comment (protected, 1 level nesting)
   * POST /feed/comments/:commentId/reply
   */
  replyToComment: async (commentId: string, data: CreateCommentInput): Promise<CreateReplyResponse> => {
    return api.post<CreateReplyResponse>(`/feed/comments/${commentId}/reply`, data);
  },

  /**
   * Delete a comment (protected - author or feed owner)
   * DELETE /feed/comments/:commentId
   */
  deleteComment: async (commentId: string): Promise<DeleteCommentResponse> => {
    return api.delete<DeleteCommentResponse>(`/feed/comments/${commentId}`);
  },
};
