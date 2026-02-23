'use client';

import { useState, useCallback, useMemo } from 'react';
import { domainApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import { useAuthStore } from '@/stores';
import type { DomainStatus, DomainStatusResponse, DnsRecord } from '@/types';

// ==========================================
// USE DOMAIN STATUS HOOK
// Derived langsung dari tenant — no extra state
// ==========================================

export function useDomainStatus(): DomainStatus {
  const tenant = useAuthStore((s) => s.tenant);

  return useMemo(
    () => ({
      hasDomain: !!tenant?.customDomain,
      domain: tenant?.customDomain ?? null,
      isVerified: tenant?.customDomainVerified ?? false,
      sslStatus: (tenant?.sslStatus as DomainStatus['sslStatus']) ?? null,
      isFullyActive:
        !!tenant?.customDomainVerified && tenant?.sslStatus === 'active',
      dnsRecords: (tenant?.dnsRecords as DnsRecord[]) ?? [],
    }),
    [tenant],
  );
}

// ==========================================
// USE DOMAIN SETUP HOOK
// Simple — hanya 3 aksi: request, checkStatus, remove
// Tidak ada polling, tidak ada wizard state berlapis
// ==========================================

interface UseDomainSetupReturn {
  isLoading: boolean;
  isChecking: boolean;
  error: string | null;
  requestDomain: (domain: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  removeDomain: () => Promise<boolean>;
  resetError: () => void;
}

export function useDomainSetup(): UseDomainSetupReturn {
  const { tenant, setTenant } = useAuthStore();
  const tenantId = tenant?.id ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // REQUEST DOMAIN
  // User input domain → simpan ke DB + add ke Vercel
  // → Vercel return DNS records (apex/subdomain-aware) → tampilkan ke user
  // ========================================

  const requestDomain = useCallback(
    async (domain: string): Promise<boolean> => {
      if (!tenantId) return false;

      setIsLoading(true);
      setError(null);

      try {
        const response = await domainApi.request({
          tenantId,
          customDomain: domain.toLowerCase().trim(),
        });

        // Update tenant store dengan data terbaru dari backend
        setTenant(response.tenant);

        toast.success(
          'Domain terdaftar!',
          'Pasang DNS records di registrar Anda, lalu klik "Cek Status"',
        );
        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Gagal mendaftarkan domain', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tenantId, setTenant],
  );

  // ========================================
  // CHECK STATUS (Manual — user yang klik)
  // Tanya Vercel: sudah verified? SSL active?
  // ========================================

  const checkStatus = useCallback(async (): Promise<void> => {
    if (!tenantId) return;

    setIsChecking(true);
    setError(null);

    try {
      const result: DomainStatusResponse = await domainApi.checkStatus(tenantId);

      if (!tenant) return;

      const now = new Date().toISOString();

      // Update tenant store dengan status terbaru
      setTenant({
        ...tenant,
        customDomainVerified: result.verified,
        sslStatus:
          result.sslStatus === 'not_configured' ? null : result.sslStatus,
        dnsRecords: result.dnsRecords as never,
        // ✅ Sync verifiedAt kalau baru verified
        ...(result.verified && !tenant.customDomainVerified
          ? { customDomainVerifiedAt: now }
          : {}),
        // ✅ Sync sslIssuedAt kalau SSL baru active
        ...(result.sslStatus === 'active' && tenant.sslStatus !== 'active'
          ? { sslIssuedAt: now }
          : {}),
      });

      // Feedback ke user
      if (result.verified && result.sslStatus === 'active') {
        toast.success('Domain aktif! 🎉', 'Domain Anda sudah live dengan HTTPS');
      } else if (result.verified) {
        toast.success(
          'DNS terverifikasi! ✅',
          'Menunggu SSL certificate dari Vercel...',
        );
      } else {
        toast.info(
          'Belum terverifikasi',
          'Pastikan DNS records sudah terpasang di registrar Anda',
        );
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error('Gagal cek status', message);
    } finally {
      setIsChecking(false);
    }
  }, [tenantId, tenant, setTenant]);

  // ========================================
  // REMOVE DOMAIN
  // Hapus dari Vercel + reset DB
  // ========================================

  const removeDomain = useCallback(async (): Promise<boolean> => {
    if (!tenantId) return false;

    setIsLoading(true);
    setError(null);

    try {
      await domainApi.remove({ tenantId });

      if (tenant) {
        setTenant({
          ...tenant,
          customDomain: null,
          customDomainVerified: false,
          customDomainToken: null,
          sslStatus: null,
          sslIssuedAt: null,
          dnsRecords: null,
          customDomainAddedAt: null,
          customDomainVerifiedAt: null,
          customDomainRemovedAt: new Date().toISOString(),
        });
      }

      toast.success('Domain dihapus', 'Kamu bisa mendaftarkan domain baru');
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error('Gagal menghapus domain', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, tenant, setTenant]);

  // ========================================
  // HELPERS
  // ========================================

  const resetError = useCallback(() => setError(null), []);

  return {
    isLoading,
    isChecking,
    error,
    requestDomain,
    checkStatus,
    removeDomain,
    resetError,
  };
}