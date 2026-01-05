import { api } from './client';
import type {
  Order,
  OrderListItem,
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  OrderQueryParams,
  PaginatedResponse,
} from '@/types';

// ==========================================
// ORDERS API SERVICE
// ==========================================

export const ordersApi = {
  /**
   * Get all orders
   * GET /orders
   */
  getAll: async (params?: OrderQueryParams): Promise<PaginatedResponse<OrderListItem>> => {
    return api.get<PaginatedResponse<OrderListItem>>('/orders', { params });
  },

  /**
   * Get single order by ID
   * GET /orders/:id
   */
  getById: async (id: string): Promise<Order> => {
    return api.get<Order>(`/orders/${id}`);
  },

  /**
   * Get order by order number
   * GET /orders/number/:orderNumber
   */
  getByNumber: async (orderNumber: string): Promise<Order> => {
    return api.get<Order>(`/orders/number/${orderNumber}`);
  },

  /**
   * Create new order
   * POST /orders
   */
  create: async (data: CreateOrderInput): Promise<Order> => {
    return api.post<Order>('/orders', data);
  },

  /**
   * Update order
   * PATCH /orders/:id
   */
  update: async (id: string, data: UpdateOrderInput): Promise<Order> => {
    return api.patch<Order>(`/orders/${id}`, data);
  },

  /**
   * Update order status
   * PATCH /orders/:id/status
   */
  updateStatus: async (id: string, data: UpdateOrderStatusInput): Promise<Order> => {
    return api.patch<Order>(`/orders/${id}/status`, data);
  },

  /**
   * Update payment status
   * PATCH /orders/:id/payment
   */
  updatePayment: async (id: string, data: UpdatePaymentStatusInput): Promise<Order> => {
    return api.patch<Order>(`/orders/${id}/payment`, data);
  },

  /**
   * Cancel order
   * PATCH /orders/:id/cancel
   */
  cancel: async (id: string, reason?: string): Promise<Order> => {
    return api.patch<Order>(`/orders/${id}/cancel`, { reason });
  },

  /**
   * Delete order (only PENDING orders)
   * DELETE /orders/:id
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/orders/${id}`);
  },

  /**
   * Get today's orders
   * GET /orders/today
   */
  getToday: async (): Promise<OrderListItem[]> => {
    return api.get<OrderListItem[]>('/orders/today');
  },

  /**
   * Get order stats
   * GET /orders/stats
   */
  getStats: async (period?: 'today' | 'week' | 'month'): Promise<{
    count: number;
    revenue: number;
    avgOrderValue: number;
  }> => {
    return api.get('/orders/stats', { params: { period } });
  },
};