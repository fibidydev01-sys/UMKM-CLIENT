'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuthStore, useIsAuthenticated } from '@/stores';
import { tenantsApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { PublicTenant, UpdateTenantInput, DashboardStats } from '@/types';

// ==========================================
// USE TENANT HOOK
// Get current tenant data
// ==========================================

export function useTenant() {
  const { tenant, setTenant } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await tenantsApi.me();
      setTenant(data);
      return data;
    } catch (err) {
      console.error('Failed to refresh tenant:', err);
    }
  }, [isAuthenticated, setTenant]);

  return {
    tenant,
    refresh,
  };
}

// ==========================================
// USE PUBLIC TENANT HOOK
// Get tenant by slug (public store)
// ==========================================

export function usePublicTenant(slug: string) {
  const [tenant, setTenant] = useState<PublicTenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await tenantsApi.getBySlug(slug);
      setTenant(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTenant();
  }, [fetchTenant]);

  return {
    tenant,
    isLoading,
    error,
    refetch: fetchTenant,
  };
}

// ==========================================
// USE UPDATE TENANT HOOK
// Update tenant/store settings
// ==========================================

export function useUpdateTenant() {
  const [isLoading, setIsLoading] = useState(false);
  const { setTenant } = useAuthStore();

  const updateTenant = useCallback(async (data: UpdateTenantInput) => {
    setIsLoading(true);

    try {
      const response = await tenantsApi.update(data);
      const updated = 'tenant' in response ? response.tenant : response;
      setTenant(updated);
      toast.success('Pengaturan toko berhasil disimpan');
      return updated;
    } catch (err) {
      toast.error('Gagal menyimpan pengaturan', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setTenant]);

  return {
    updateTenant,
    isLoading,
  };
}

// ==========================================
// USE DASHBOARD STATS HOOK
// Get dashboard statistics
// ==========================================

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tenantsApi.getStats();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}