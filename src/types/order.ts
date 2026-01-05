import type { Customer } from './customer';
import type { Product } from './product';

// ==========================================
// ORDER TYPES
// ==========================================

/**
 * Order status enum
 */
export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * Payment status enum
 */
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'PARTIAL'
  | 'FAILED';

/**
 * Order item entity
 */
export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  product?: Pick<Product, 'id' | 'name' | 'images'> | null;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Order entity
 */
export interface Order {
  id: string;
  tenantId: string;
  customerId?: string | null;
  customer?: Pick<Customer, 'id' | 'name' | 'phone' | 'email' | 'address'> | null;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  status: OrderStatus;
  customerName?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  _count?: {
    items: number;
  };
}

/**
 * Order list item (simplified for list view)
 */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  createdAt: string;
  customer?: Pick<Customer, 'id' | 'name' | 'phone'> | null;
  _count?: {
    items: number;
  };
}

/**
 * Create order item request
 */
export interface CreateOrderItemInput {
  productId?: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
}

/**
 * Create order request
 */
export interface CreateOrderInput {
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: CreateOrderItemInput[];
  subtotal?: number;
  total?: number;
  discount?: number;
  tax?: number;
  paymentMethod?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update order request
 */
export interface UpdateOrderInput {
  discount?: number;
  paymentMethod?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

/**
 * Update payment status request
 */
export interface UpdatePaymentStatusInput {
  paymentStatus: PaymentStatus;
  paidAmount?: number;
}

/**
 * Order query parameters
 */
export interface OrderQueryParams {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'orderNumber' | 'total' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}