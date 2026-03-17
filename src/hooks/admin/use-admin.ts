'use client';

// ==========================================
// ADMIN HOOKS
// File: src/hooks/admin/use-admin.ts
//
// Pattern identik dengan src/hooks/auth/use-auth.ts
// ==========================================

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/stores/admin-store';
import { adminApi } from '@/lib/api/admin';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type {
  TenantQueryParams,
  SubscriptionQueryParams,
  RedeemCodeQueryParams,
} from '@/types/admin';

// ============================================================
// USE ADMIN AUTH CHECK
// Dipanggil di AdminGuard untuk verify session
// ============================================================

export function useAdminAuthCheck() {
  const { setAdmin, setChecked, isChecked } = useAdminStore();

  const checkAuth = useCallback(async () => {
    if (isChecked) return;

    try {
      const admin = await adminApi.me();
      setAdmin(admin);
    } catch {
      setAdmin(null);
    } finally {
      setChecked(true);
    }
  }, [isChecked, setAdmin, setChecked]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { checkAuth };
}

// ============================================================
// USE ADMIN LOGIN
// ============================================================

export function useAdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAdmin, setChecked } = useAdminStore();
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await adminApi.login(email, password);

        setAdmin(response.admin);
        setChecked(true);

        toast.success('Login berhasil', `Selamat datang, ${response.admin.name ?? response.admin.email}`);
        router.push('/admin');

        return response;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Login gagal', message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAdmin, setChecked, router],
  );

  return { login, isLoading, error };
}

// ============================================================
// USE ADMIN LOGOUT
// ============================================================

export function useAdminLogout() {
  const { reset } = useAdminStore();
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore error — tetap logout
    }

    reset();
    toast.success('Logout berhasil');
    router.push('/admin/login');
  }, [reset, router]);

  return { logout };
}

// ============================================================
// USE ADMIN STATS
// ============================================================

export function useAdminStats() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.getStats>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

// ============================================================
// USE ADMIN TENANTS
// ============================================================

export function useAdminTenants(params: TenantQueryParams = {}) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof adminApi.getTenants>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getTenants(params);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.search, params.status]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  return { result, isLoading, error, refetch: fetchTenants };
}

// ============================================================
// USE ADMIN TENANT DETAIL
// ============================================================

export function useAdminTenantDetail(id: string) {
  const [tenant, setTenant] = useState<Awaited<ReturnType<typeof adminApi.getTenantDetail>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      const data = await adminApi.getTenantDetail(id);
      setTenant(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTenant(); }, [fetchTenant]);

  return { tenant, isLoading, error, refetch: fetchTenant };
}

// ============================================================
// USE SUSPEND TENANT
// ============================================================

export function useSuspendTenant() {
  const [isLoading, setIsLoading] = useState(false);

  const suspend = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);
    try {
      const res = await adminApi.suspendTenant(id, reason);
      toast.success('Tenant di-suspend', res.message);
      return res;
    } catch (err) {
      toast.error('Gagal suspend', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsuspend = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await adminApi.unsuspendTenant(id);
      toast.success('Tenant diaktifkan', res.message);
      return res;
    } catch (err) {
      toast.error('Gagal unsuspend', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suspend, unsuspend, isLoading };
}

// ============================================================
// USE ADMIN SUBSCRIPTIONS
// ============================================================

export function useAdminSubscriptions(params: SubscriptionQueryParams = {}) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof adminApi.getSubscriptions>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getSubscriptions(params);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.status, params.plan]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  return { result, isLoading, error, refetch: fetchSubs };
}

// ============================================================
// USE EXTEND SUBSCRIPTION
// ============================================================

export function useExtendSubscription() {
  const [isLoading, setIsLoading] = useState(false);

  const extend = useCallback(async (id: string, days: number, reason: string) => {
    setIsLoading(true);
    try {
      const res = await adminApi.extendSubscription(id, days, reason);
      toast.success('Subscription di-extend', res.message);
      return res;
    } catch (err) {
      toast.error('Gagal extend', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { extend, isLoading };
}

// ============================================================
// USE REDEEM CODES
// ============================================================

export function useRedeemCodes(params: RedeemCodeQueryParams = {}) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof adminApi.getRedeemCodes>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getRedeemCodes(params);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.isUsed]);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  return { result, isLoading, error, refetch: fetchCodes };
}

// ============================================================
// USE CREATE REDEEM CODES
// ============================================================

export function useCreateRedeemCodes() {
  const [isLoading, setIsLoading] = useState(false);

  const create = useCallback(async (data: {
    plan: string;
    durationDay: number;
    quantity: number;
    expiresAt?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await adminApi.createRedeemCodes(data);
      toast.success(`${res.count} kode berhasil dibuat`);
      return res;
    } catch (err) {
      toast.error('Gagal buat kode', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCode = useCallback(async (id: string) => {
    try {
      const res = await adminApi.deleteRedeemCode(id);
      toast.success('Kode dihapus', res.message);
      return res;
    } catch (err) {
      toast.error('Gagal hapus kode', getErrorMessage(err));
      throw err;
    }
  }, []);

  return { create, deleteCode, isLoading };
}

// ============================================================
// USE ADMIN LOGS
// ============================================================

export function useAdminLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  from?: string;
  to?: string;
} = {}) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof adminApi.getLogs>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await adminApi.getLogs(params);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit, params.action, params.from, params.to]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { result, isLoading, error, refetch: fetchLogs };
}