'use client';

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react';
import { domainApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import { useAuthStore } from '@/stores';
import type { DomainStatus, DomainStatusResponse, DnsRecord } from '@/types';

// ==========================================
// HYDRATION DETECTION
// useSyncExternalStore: server snapshot = false, client snapshot = true
// No useEffect + setState → no cascading renders
// ==========================================
function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => { },           // subscribe — nothing to listen to
    () => true,               // getSnapshot  (client)
    () => false,              // getServerSnapshot (SSR / before hydration)
  );
}

// ==========================================
// USE DOMAIN STATUS HOOK
// Derived directly from tenant — no extra state
// + isHydrating: true until component mounts on client
// ==========================================

export function useDomainStatus(): DomainStatus & { isHydrating: boolean } {
  const tenant = useAuthStore((s) => s.tenant);
  const isClient = useIsClient();

  // isHydrating = true until mounted on client
  // After mount, isClient = true → isHydrating = false
  const isHydrating = !isClient;

  return useMemo(
    () => ({
      hasDomain: !!tenant?.customDomain,
      domain: tenant?.customDomain ?? null,
      isVerified: tenant?.customDomainVerified ?? false,
      sslStatus: (tenant?.sslStatus as DomainStatus['sslStatus']) ?? null,
      isFullyActive:
        !!tenant?.customDomainVerified && tenant?.sslStatus === 'active',
      dnsRecords: (tenant?.dnsRecords as DnsRecord[]) ?? [],
      isHydrating,
    }),
    [tenant, isHydrating],
  );
}

// ==========================================
// USE DOMAIN SETUP HOOK
// Simple — only 3 actions: request, checkStatus, remove
// No polling, no layered wizard state
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
  // User inputs domain → save to DB + add to Vercel
  // → Vercel returns DNS records (apex/subdomain-aware) → show to user
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

        // Update tenant store with latest data from backend
        setTenant(response.tenant);

        toast.success(
          'Domain added!',
          'Add DNS records at your registrar, then click "Verify DNS"',
        );
        return true;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Failed to add domain', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [tenantId, setTenant],
  );

  // ========================================
  // CHECK STATUS (Manual — user-triggered)
  // Ask Vercel: verified? SSL active?
  // ========================================

  const checkStatus = useCallback(async (): Promise<void> => {
    if (!tenantId) return;

    setIsChecking(true);
    setError(null);

    try {
      const result: DomainStatusResponse = await domainApi.checkStatus(tenantId);

      if (!tenant) return;

      const now = new Date().toISOString();

      // Update tenant store with latest status
      setTenant({
        ...tenant,
        customDomainVerified: result.verified,
        sslStatus:
          result.sslStatus === 'not_configured' ? null : result.sslStatus,
        dnsRecords: result.dnsRecords as never,
        // Sync verifiedAt if newly verified
        ...(result.verified && !tenant.customDomainVerified
          ? { customDomainVerifiedAt: now }
          : {}),
        // Sync sslIssuedAt if SSL newly active
        ...(result.sslStatus === 'active' && tenant.sslStatus !== 'active'
          ? { sslIssuedAt: now }
          : {}),
      });

      // User feedback
      if (result.verified && result.sslStatus === 'active') {
        toast.success('Domain is live! 🎉', 'Your domain is active with HTTPS');
      } else if (result.verified) {
        toast.success(
          'DNS verified! ✅',
          'SSL certificate is being provisioned by Vercel...',
        );
      } else {
        toast.info(
          'Not yet verified',
          'Make sure your DNS records are configured at your domain registrar',
        );
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error('Verification failed', message);
    } finally {
      setIsChecking(false);
    }
  }, [tenantId, tenant, setTenant]);

  // ========================================
  // REMOVE DOMAIN
  // Remove from Vercel + reset DB fields
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

      toast.success('Domain removed', 'You can connect a new domain anytime');
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error('Failed to remove domain', message);
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