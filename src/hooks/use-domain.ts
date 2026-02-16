'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { domainApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import { useAuthStore } from '@/stores';
import type {
  DnsInstructions,
  DomainSetupStep,
  DomainStatus,
  SslStatusResponse,
  DnsStatusResponse,
} from '@/types';

// ==========================================
// USE DOMAIN STATUS HOOK
// Derive domain status from tenant
// ==========================================

export function useDomainStatus(): DomainStatus {
  const tenant = useAuthStore((s) => s.tenant);

  return {
    hasDomain: !!tenant?.customDomain,
    domain: tenant?.customDomain ?? null,
    isVerified: tenant?.customDomainVerified ?? false,
    sslStatus: tenant?.sslStatus ?? null,
    isFullyActive:
      !!tenant?.customDomainVerified && tenant?.sslStatus === 'active',
  };
}

// ==========================================
// 🆕 USE DNS POLLING HOOK (ULTIMATE SOLUTION!)
// ✅ ZERO setState in useEffect
// ✅ Uses useMemo + useEffect with callback pattern only
// ==========================================

function useDnsPolling(domain: string | null, enabled: boolean) {
  // ✅ ULTIMATE SOLUTION: Store only API response, derive reset logic
  const [apiResponse, setApiResponse] = useState<DnsStatusResponse | null>(null);
  const isMounted = useRef(true);

  // ✅ Effect only for polling (setState in CALLBACK, not synchronously!)
  useEffect(() => {
    // Early return if disabled/no domain (no setState!)
    if (!enabled || !domain) {
      return;
    }

    const checkDns = async () => {
      if (!isMounted.current) return;

      try {
        const result = await domainApi.checkDnsStatus(domain);

        if (!isMounted.current) return;

        // ✅ setState in ASYNC CALLBACK (allowed!)
        setApiResponse(result);

        // Stop polling if all verified
        if (result.allVerified) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('[DNS Polling] Error:', error);
        // Continue polling even if error
      }
    };

    // Check immediately
    checkDns();

    // Then poll every 10 seconds
    const interval = setInterval(checkDns, 10_000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [domain, enabled]);

  // ✅ DERIVE final status from enabled/domain/apiResponse (no useEffect!)
  const dnsStatus: DnsStatusResponse = useMemo(() => {
    // If disabled or no domain, return default
    if (!enabled || !domain) {
      return {
        cname: 'pending',
        cnameWWW: 'pending',
        txt: 'pending',
        allVerified: false,
      };
    }

    // Otherwise, return API response or default
    return apiResponse ?? {
      cname: 'pending',
      cnameWWW: 'pending',
      txt: 'pending',
      allVerified: false,
    };
  }, [enabled, domain, apiResponse]);

  return { dnsStatus };
}

// ==========================================
// USE DOMAIN SETUP HOOK
// Main hook for the CustomDomainSetup component
// ==========================================

interface UseDomainSetupReturn {
  // State
  step: DomainSetupStep;
  isLoading: boolean;
  error: string | null;
  dnsInstructions: DnsInstructions | null;
  sslStatus: SslStatusResponse | null;
  dnsStatus: DnsStatusResponse;

  // Actions
  requestDomain: (domain: string) => Promise<boolean>;
  verifyDomain: () => Promise<boolean>;
  removeDomain: () => Promise<boolean>;
  resetError: () => void;
  goToStep: (step: DomainSetupStep) => void;
}

export function useDomainSetup(): UseDomainSetupReturn {
  const { tenant, setTenant } = useAuthStore();
  const tenantId = tenant?.id ?? '';

  // ========================================
  // STATE
  // ========================================

  const [step, setStep] = useState<DomainSetupStep>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dnsInstructions, setDnsInstructions] =
    useState<DnsInstructions | null>(null);
  const [sslStatus, setSslStatus] = useState<SslStatusResponse | null>(null);

  // Ref for SSL polling interval
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Track if we've initialized to prevent loops
  const hasInitialized = useRef(false);

  // ========================================
  // 🆕 ADD DNS POLLING (ULTIMATE SOLUTION!)
  // ========================================

  const { dnsStatus } = useDnsPolling(
    tenant?.customDomain ?? null,
    step === 'instructions' && !tenant?.customDomainVerified,
  );

  // ========================================
  // SSL POLLING
  // ========================================

  const stopSslPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startSslPolling = useCallback(() => {
    // Don't start if already polling
    if (pollRef.current) return;

    const poll = async () => {
      if (!isMounted.current || !tenantId) return;

      try {
        const result = await domainApi.sslStatus(tenantId);

        if (!isMounted.current) return;

        setSslStatus(result);

        if (result.sslStatus === 'active') {
          setStep('active');
          stopSslPolling();

          // Update tenant in store
          if (tenant) {
            setTenant({ ...tenant, sslStatus: 'active', sslIssuedAt: result.issuedAt ?? null });
          }

          toast.success('SSL aktif!', 'Domain kamu sudah live dengan HTTPS');
        }
      } catch {
        // Silently fail, will retry next interval
      }
    };

    // Poll immediately then every 10 seconds
    poll();
    pollRef.current = setInterval(poll, 10_000);
  }, [tenantId, tenant, setTenant, stopSslPolling]);

  // ========================================
  // INIT: Determine step from existing tenant data
  // ========================================

  useEffect(() => {
    // Skip if already initialized or no tenant yet
    if (hasInitialized.current || !tenant) return;

    // Mark as initialized
    hasInitialized.current = true;

    if (!tenant.customDomain) {
      setStep('idle');
    } else if (!tenant.customDomainVerified) {
      setStep('instructions');
      // Restore DNS instructions from tenant
      if (tenant.dnsRecords) {
        setDnsInstructions(tenant.dnsRecords as DnsInstructions);
      }
    } else if (tenant.sslStatus === 'active') {
      setStep('active');
    } else {
      setStep('verified');
      // Start SSL polling
      startSslPolling();
    }

    return () => {
      isMounted.current = false;
      stopSslPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  // ========================================
  // 🆕 AUTO-TRANSITION: When DNS verified
  // ========================================

  useEffect(() => {
    if (step === 'instructions' && dnsStatus.allVerified && tenant) {
      // Auto-transition to verified state
      setStep('verified');

      // Update tenant in store
      setTenant({
        ...tenant,
        customDomainVerified: true,
        customDomainVerifiedAt: new Date().toISOString(),
        sslStatus: 'pending',
      });

      // Start SSL polling
      startSslPolling();

      toast.success('DNS terverifikasi!', 'Menunggu SSL certificate...');
    }
  }, [dnsStatus.allVerified, step, tenant, setTenant, startSslPolling]);

  // ========================================
  // REQUEST DOMAIN
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

        if (!isMounted.current) return false;

        // Update tenant in store
        setTenant(response.tenant);

        // Store DNS instructions
        setDnsInstructions(response.instructions);

        // Go to instructions step
        setStep('instructions');

        toast.success(
          'Domain terdaftar!',
          'Silakan tambahkan DNS records di registrar Anda',
        );

        return true;
      } catch (err) {
        if (!isMounted.current) return false;

        const message = getErrorMessage(err);
        setError(message);
        toast.error('Gagal mendaftarkan domain', message);
        return false;
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    },
    [tenantId, setTenant],
  );

  // ========================================
  // VERIFY DOMAIN (Manual fallback - rarely used with auto-polling)
  // ========================================

  const verifyDomain = useCallback(async (): Promise<boolean> => {
    if (!tenantId) return false;

    setIsLoading(true);
    setError(null);
    setStep('verifying');

    try {
      await domainApi.verify({ tenantId });

      if (!isMounted.current) return false;

      // Mark as verified, start SSL polling
      setStep('verified');
      startSslPolling();

      // Update tenant in store
      if (tenant) {
        setTenant({
          ...tenant,
          customDomainVerified: true,
          customDomainVerifiedAt: new Date().toISOString(),
          sslStatus: 'pending',
        });
      }

      toast.success(
        'DNS terverifikasi!',
        'Menunggu SSL certificate... (2-5 menit)',
      );

      return true;
    } catch (err) {
      if (!isMounted.current) return false;

      const message = getErrorMessage(err);
      setError(message);
      setStep('instructions'); // Go back to instructions

      toast.error('Verifikasi gagal', message);
      return false;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [tenantId, tenant, setTenant, startSslPolling]);

  // ========================================
  // REMOVE DOMAIN
  // ========================================

  const removeDomain = useCallback(async (): Promise<boolean> => {
    if (!tenantId) return false;

    setIsLoading(true);
    setError(null);

    try {
      await domainApi.remove({ tenantId });

      if (!isMounted.current) return false;

      // Stop any SSL polling
      stopSslPolling();

      // Reset initialization flag
      hasInitialized.current = false;

      // Reset state
      setStep('idle');
      setDnsInstructions(null);
      setSslStatus(null);

      // Update tenant in store
      if (tenant) {
        setTenant({
          ...tenant,
          customDomain: undefined,
          customDomainVerified: false,
          customDomainToken: undefined,
          sslStatus: undefined,
          sslIssuedAt: undefined,
          dnsRecords: undefined,
        });
      }

      toast.success('Domain dihapus');
      return true;
    } catch (err) {
      if (!isMounted.current) return false;

      const message = getErrorMessage(err);
      setError(message);
      toast.error('Gagal menghapus domain', message);
      return false;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [tenantId, tenant, setTenant, stopSslPolling]);

  // ========================================
  // HELPERS
  // ========================================

  const resetError = useCallback(() => setError(null), []);

  const goToStep = useCallback((newStep: DomainSetupStep) => {
    setStep(newStep);
    setError(null);
  }, []);

  // ========================================
  // RETURN
  // ========================================

  return {
    step,
    isLoading,
    error,
    dnsInstructions,
    sslStatus,
    dnsStatus,
    requestDomain,
    verifyDomain,
    removeDomain,
    resetError,
    goToStep,
  };
}