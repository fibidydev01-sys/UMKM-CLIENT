import { api } from './client';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductQueryParams,
  PaginatedResponse,
  LowStockProduct,
} from '@/types';

// ==========================================
// PRODUCTS API SERVICE
// ==========================================

export const productsApi = {
  /**
   * Get all products (protected - tenant's products)
   * GET /products
   */
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    return api.get<PaginatedResponse<Product>>('/products', { params });
  },

  /**
   * Get public products by tenant slug
   * GET /products/store/:slug
   */
  getByStore: async (slug: string, params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    return api.get<PaginatedResponse<Product>>(`/products/store/${slug}`, { params });
  },

  /**
   * Get single product by ID (protected - for dashboard)
   * GET /products/:id
   */
  getById: async (id: string): Promise<Product> => {
    return api.get<Product>(`/products/${id}`);
  },

  /**
   * Get single product by store slug and product ID (public - for store frontend)
   * GET /products/store/:slug/:productId
   */
  getByStoreAndId: async (slug: string, productId: string): Promise<Product> => {
    return api.get<Product>(`/products/store/${slug}/${productId}`);
  },

  /**
   * Create new product
   * POST /products
   */
  create: async (data: CreateProductInput): Promise<Product> => {
    return api.post<Product>('/products', data);
  },

  /**
   * Update product
   * PATCH /products/:id
   */
  update: async (id: string, data: UpdateProductInput): Promise<Product> => {
    return api.patch<Product>(`/products/${id}`, data);
  },

  /**
   * Delete product
   * DELETE /products/:id
   */
  delete: async (id: string): Promise<{ message: string; softDeleted: boolean }> => {
    return api.delete<{ message: string; softDeleted: boolean }>(`/products/${id}`);
  },

  /**
   * Update stock
   * PATCH /products/:id/stock
   */
  updateStock: async (id: string, quantity: number, reason?: string): Promise<Product> => {
    return api.patch<Product>(`/products/${id}/stock`, { quantity, reason });
  },

  /**
   * Get low stock products
   * GET /products/low-stock
   */
  getLowStock: async (): Promise<LowStockProduct[]> => {
    return api.get<LowStockProduct[]>('/products/low-stock');
  },

  /**
   * Get product categories (unique from tenant's products)
   * GET /products/categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<{ categories: string[] }>('/products/categories');
    return response.categories || [];
  },

  /**
   * Upload product image
   * POST /products/upload
   */
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ url: string }>('/products/upload', formData);
  },

  /**
   * Bulk update products (active/inactive)
   * PATCH /products/bulk
   */
  bulkUpdate: async (ids: string[], data: Partial<UpdateProductInput>): Promise<{ count: number }> => {
    return api.patch<{ count: number }>('/products/bulk', { ids, ...data });
  },

  /**
   * Bulk delete products
   * DELETE /products/bulk
   */
  bulkDelete: async (ids: string[]): Promise<{ count: number; message: string }> => {
    return api.deleteWithBody<{ count: number; message: string }>(
      '/products/bulk',
      { ids },
      { timeout: 60000 }
    );
  },
};