// ==========================================
// ADMIN API SERVICE
// File: src/lib/api/admin.ts
//
// Semua endpoint /api/admin/*
// Pakai adminApiClient (bukan api tenant)
// ==========================================

import { adminApiClient } from './admin-client';
import type {
  Admin,
  AdminStats,
  AdminTenant,
  AdminTenantDetail,
  AdminSubscription,
  RedeemCode,
  AdminLog,
  AdminPaginatedResponse,
  TenantQueryParams,
  SubscriptionQueryParams,
  RedeemCodeQueryParams,
} from '@/types/admin';

const BASE = '/admin';

export const adminApi = {
  // ============================================================
  // AUTH
  // ============================================================

  login: (email: string, password: string): Promise<{ admin: Admin }> =>
    adminApiClient.post(`${BASE}/auth/login`, { email, password }),

  logout: (): Promise<{ message: string }> =>
    adminApiClient.post(`${BASE}/auth/logout`),

  me: (): Promise<Admin> =>
    adminApiClient.get(`${BASE}/auth/me`),

  // ============================================================
  // STATS
  // ============================================================

  getStats: (): Promise<AdminStats> =>
    adminApiClient.get(`${BASE}/stats`),

  // ============================================================
  // TENANTS
  // ============================================================

  getTenants: (params: TenantQueryParams = {}): Promise<AdminPaginatedResponse<AdminTenant>> =>
    adminApiClient.get(`${BASE}/tenants`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status }),
      },
    }),

  getTenantDetail: (id: string): Promise<AdminTenantDetail> =>
    adminApiClient.get(`${BASE}/tenants/${id}`),

  suspendTenant: (id: string, reason: string): Promise<{ success: boolean; message: string }> =>
    adminApiClient.patch(`${BASE}/tenants/${id}/suspend`, { reason }),

  unsuspendTenant: (id: string): Promise<{ success: boolean; message: string }> =>
    adminApiClient.patch(`${BASE}/tenants/${id}/unsuspend`),

  // ============================================================
  // SUBSCRIPTIONS
  // ============================================================

  getSubscriptions: (params: SubscriptionQueryParams = {}): Promise<AdminPaginatedResponse<AdminSubscription>> =>
    adminApiClient.get(`${BASE}/subscriptions`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.status && { status: params.status }),
        ...(params.plan && { plan: params.plan }),
      },
    }),

  extendSubscription: (
    id: string,
    days: number,
    reason: string,
  ): Promise<{ success: boolean; message: string; newPeriodEnd: string }> =>
    adminApiClient.patch(`${BASE}/subscriptions/${id}/extend`, { days, reason }),

  changePlan: (
    id: string,
    plan: string,
    reason: string,
  ): Promise<{ success: boolean; message: string }> =>
    adminApiClient.patch(`${BASE}/subscriptions/${id}/change-plan`, { plan, reason }),

  overrideSubscription: (
    id: string,
    data: {
      plan?: string;
      status?: string;
      currentPeriodEnd?: string;
      resetCancellation?: boolean;
      isTrial?: boolean;
      reason: string;
    },
  ): Promise<{ success: boolean; message: string }> =>
    adminApiClient.patch(`${BASE}/subscriptions/${id}/override`, data),

  // ============================================================
  // REDEEM CODES
  // ============================================================

  getRedeemCodes: (params: RedeemCodeQueryParams = {}): Promise<AdminPaginatedResponse<RedeemCode>> =>
    adminApiClient.get(`${BASE}/redeem-codes`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.isUsed !== undefined && { isUsed: params.isUsed }),
      },
    }),

  createRedeemCodes: (data: {
    plan: string;
    durationDay: number;
    quantity: number;
    expiresAt?: string;
  }): Promise<{ success: boolean; count: number; codes: string[] }> =>
    adminApiClient.post(`${BASE}/redeem-codes`, data),

  deleteRedeemCode: (id: string): Promise<{ success: boolean; message: string }> =>
    adminApiClient.delete(`${BASE}/redeem-codes/${id}`),

  // ============================================================
  // ADMIN LOGS
  // ============================================================

  getLogs: (params: {
    page?: number;
    limit?: number;
    action?: string;
    from?: string;
    to?: string;
  } = {}): Promise<AdminPaginatedResponse<AdminLog>> =>
    adminApiClient.get(`${BASE}/logs`, { params }),
};