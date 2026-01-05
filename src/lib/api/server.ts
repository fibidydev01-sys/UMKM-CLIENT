import { cookies } from 'next/headers';
import { API_URL } from '@/config/constants';
import type {
  Tenant,
  Product,
  Customer,
  Order,
  DashboardStats,
  PaginatedResponse,
} from '@/types';

// ==========================================
// SERVER-SIDE API CLIENT
// ==========================================

const COOKIE_NAME = 'fibidy_auth';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildURL(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T | null> {
  const { params, ...fetchOptions } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  const url = buildURL(endpoint, params);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...fetchOptions.headers,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    console.error('Server fetch error:', error);
    return null;
  }
}

// ==========================================
// SERVER API HELPERS
// ==========================================

export const serverApi = {
  // Auth
  getMe: () => serverFetch<Tenant>('/auth/me'),

  // Tenants
  getStats: () => serverFetch<DashboardStats>('/tenants/me/stats'),
  getTenant: () => serverFetch<Tenant>('/tenants/me'),

  // Products
  getProducts: (params?: Record<string, string | number | boolean | undefined>) =>
    serverFetch<PaginatedResponse<Product>>('/products', { params }),
  getProduct: (id: string) => serverFetch<Product>(`/products/${id}`),
  getCategories: () => serverFetch<{ categories: string[] }>('/products/categories'),
  getLowStock: () => serverFetch<Product[]>('/products/low-stock'),

  // Customers
  getCustomers: (params?: Record<string, string | number | boolean | undefined>) =>
    serverFetch<PaginatedResponse<Customer>>('/customers', { params }),
  getCustomer: (id: string) => serverFetch<Customer>(`/customers/${id}`),

  // Orders
  getOrders: (params?: Record<string, string | number | boolean | undefined>) =>
    serverFetch<PaginatedResponse<Order>>('/orders', { params }),
  getOrder: (id: string) => serverFetch<Order>(`/orders/${id}`),

  // Public
  getTenantBySlug: (slug: string) =>
    serverFetch<Tenant>(`/tenants/by-slug/${slug}`),
  getStoreProducts: (slug: string, params?: Record<string, string | number | boolean | undefined>) =>
    serverFetch<PaginatedResponse<Product>>(`/products/store/${slug}`, { params }),
};