// ==========================================
// PRODUCT TYPES
// ==========================================

/**
 * Product entity
 */
export interface Product {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  sku?: string | null;
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  stock?: number | null;
  minStock?: number | null;
  trackStock: boolean;
  unit?: string | null;
  images: string[];
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  isFeatured: boolean;
  slug?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create product request
 */
export interface CreateProductInput {
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  stock?: number;
  minStock?: number;
  trackStock?: boolean;
  unit?: string;
  images?: string[];
  metadata?: Record<string, unknown>;
  isActive?: boolean;
  isFeatured?: boolean;
}

/**
 * Update product request
 */
export type UpdateProductInput = Partial<CreateProductInput>;

/**
 * Update stock request
 */
export interface UpdateStockInput {
  quantity: number;  // Positive = add, Negative = subtract
  reason?: string;
}

/**
 * Product query parameters
 */
/**
 * Product query parameters
 */
// In ProductQueryParams type (src/types/product.ts)
export interface ProductQueryParams {
  search?: string;
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  lowStock?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  _t?: number;
  [key: string]: string | number | boolean | undefined;
}
/**
 * Low stock product
 */
export interface LowStockProduct {
  id: string;
  name: string;
  stock: number | null;
  minStock: number | null;
  unit?: string | null;
}