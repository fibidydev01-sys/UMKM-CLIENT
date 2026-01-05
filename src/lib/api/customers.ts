import { api } from './client';
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerQueryParams,
  PaginatedResponse,
} from '@/types';

// ==========================================
// CUSTOMERS API SERVICE
// ==========================================

export const customersApi = {
  /**
   * Get all customers
   * GET /customers
   */
  getAll: async (params?: CustomerQueryParams): Promise<PaginatedResponse<Customer>> => {
    return api.get<PaginatedResponse<Customer>>('/customers', { params });
  },

  /**
   * Get single customer by ID
   * GET /customers/:id
   */
  getById: async (id: string): Promise<Customer> => {
    return api.get<Customer>(`/customers/${id}`);
  },

  /**
   * Search customers by phone
   * GET /customers/search?phone=xxx
   */
  searchByPhone: async (phone: string): Promise<Customer[]> => {
    return api.get<Customer[]>('/customers/search', { params: { phone } });
  },

  /**
   * Create new customer
   * POST /customers
   */
  create: async (data: CreateCustomerInput): Promise<Customer> => {
    return api.post<Customer>('/customers', data);
  },

  /**
   * Update customer
   * PATCH /customers/:id
   */
  update: async (id: string, data: UpdateCustomerInput): Promise<Customer> => {
    return api.patch<Customer>(`/customers/${id}`, data);
  },

  /**
   * Delete customer
   * DELETE /customers/:id
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/customers/${id}`);
  },

  /**
   * Get customer order history
   * GET /customers/:id/orders
   */
  getOrders: async (id: string): Promise<{ orders: unknown[]; total: number }> => {
    return api.get(`/customers/${id}/orders`);
  },
};