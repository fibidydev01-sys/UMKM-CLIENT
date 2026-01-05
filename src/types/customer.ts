// ==========================================
// CUSTOMER TYPES
// ==========================================

/**
 * Customer entity
 */
export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create customer request
 */
export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}


/**
 * Update customer request
 */
export type UpdateCustomerInput = Partial<CreateCustomerInput>;

/**
 * Customer query parameters
 */
export interface CustomerQueryParams {
  search?: string;
  sortBy?: 'name' | 'totalOrders' | 'totalSpent' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}