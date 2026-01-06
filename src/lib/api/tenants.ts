import { api, ApiRequestError, getErrorMessage } from './client';
import type {
  Tenant,
  PublicTenant,
  UpdateTenantInput,
  TenantStats,
} from '@/types';

// ==========================================
// TENANTS API
// ==========================================

export const tenantsApi = {
  // Get current tenant (protected)
  me: async (): Promise<Tenant> => {
    return api.get<Tenant>('/tenants/me');
  },

  // Get tenant by slug (public)
  getBySlug: async (slug: string): Promise<PublicTenant> => {
    return api.get<PublicTenant>(`/tenants/by-slug/${slug}`);
  },

  // Update current tenant (protected)
  update: async (data: UpdateTenantInput): Promise<{ message: string; tenant: Tenant }> => {
    return api.patch<{ message: string; tenant: Tenant }>('/tenants/me', data);
  },

  // Get dashboard stats (protected)
  getStats: async (): Promise<TenantStats> => {
    return api.get<TenantStats>('/tenants/me/stats');
  },

  // Upload logo
  uploadLogo: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ url: string }>('/tenants/upload/logo', formData);
  },

  // Upload banner
  uploadBanner: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload<{ url: string }>('/tenants/upload/banner', formData);
  },
};

export { ApiRequestError, getErrorMessage };