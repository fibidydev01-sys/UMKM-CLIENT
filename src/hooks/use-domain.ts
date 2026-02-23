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
// USE DNS POLLING HOOK
// ==========================================

function useDnsPolling(domain: string | null, enabled: boolean) {
  const [apiResponse, setApiResponse] = useState<DnsStatusResponse | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (!enabled || !domain) return;

    const checkDns = async () => {
      if (!isMounted.current) return;

      try {
        const result = await domainApi.checkDnsStatus(domain);
        if (!isMounted.current) return;
        setApiResponse(result);
        if (result.allVerified) {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('[DNS Polling] Error:', error);
      }
    };

    checkDns();
    const interval = setInterval(checkDns, 10_000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [domain, enabled]);

  const dnsStatus: DnsStatusResponse = useMemo(() => {
    if (!enabled || !domain) {
      return { cname: 'pending', cnameWWW: 'pending', txt: 'pending', allVerified: false };
    }
    return apiResponse ?? { cname: 'pending', cnameWWW: 'pending', txt: 'pending', allVerified: false };
  }, [enabled, domain, apiResponse]);

  return { dnsStatus };
}

// ==========================================
// USE DOMAIN SETUP HOOK
// ==========================================

interface UseDomainSetupReturn {
  step: DomainSetupStep;
  isLoading: boolean;
  error: string | null;
  dnsInstructions: DnsInstructions | null;
  sslStatus: SslStatusResponse | null;
  dnsStatus: DnsStatusResponse;
  requestDomain: (domain: string) => Promise<boolean>;
  verifyDomain: () => Promise<boolean>;
  removeDomain: () => Promise<boolean>;
  resetError: () => void;
  goToStep: (step: DomainSetupStep) => void;
}

export function useDomainSetup(): UseDomainSetupReturn {
  const { tenant, setTenant } = useAuthStore();
  const tenantId = tenant?.id ?? '';

  const [step, setStep] = useState<DomainSetupStep>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dnsInstructions, setDnsInstructions] = useState<DnsInstructions | null>(null);
  const [sslStatus, setSslStatus] = useState<SslStatusResponse | null>(null);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  const hasInitialized = useRef(false);

  // DNS Polling — aktif hanya saat step = instructions & belum verified
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

          if (tenant) {
            setTenant({ ...tenant, sslStatus: 'active', sslIssuedAt: result.issuedAt ?? null });
          }

          toast.success('SSL aktif!', 'Domain kamu sudah live dengan HTTPS');
        }
      } catch {
        // Silently fail, retry next interval
      }
    };

    poll();
    pollRef.current = setInterval(poll, 10_000);
  }, [tenantId, tenant, setTenant, stopSslPolling]);

  // ========================================
  // INIT: Determine step dari tenant data
  // ========================================

  useEffect(() => {
    if (hasInitialized.current || !tenant) return;
    hasInitialized.current = true;

    if (!tenant.customDomain) {
      // ✅ Tidak ada domain → idle
      setStep('idle');
    } else if (!tenant.customDomainVerified) {
      // ✅ Ada domain tapi belum verified → instructions
      setStep('instructions');
      if (tenant.dnsRecords) {
        setDnsInstructions(tenant.dnsRecords as DnsInstructions);
      }
    } else if (tenant.sslStatus === 'active') {
      // ✅ DNS verified + SSL active → active
      setStep('active');
    } else {
      // ✅ DNS verified, SSL pending → verified + start SSL polling
      setStep('verified');
      startSslPolling();
    }

    return () => {
      isMounted.current = false;
      stopSslPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  // ========================================
  // AUTO-TRANSITION: Saat DNS verified
  // ========================================

  useEffect(() => {
    if (step === 'instructions' && dnsStatus.allVerified && tenant) {
      setStep('verified');
      setTenant({
        ...tenant,
        customDomainVerified: true,
        customDomainVerifiedAt: new Date().toISOString(),
        sslStatus: 'pending',
      });
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

        setTenant(response.tenant);
        setDnsInstructions(response.instructions);
        setStep('instructions');

        toast.success('Domain terdaftar!', 'Silakan tambahkan DNS records di registrar Anda');
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
  // VERIFY DOMAIN (Manual fallback)
  // ========================================

  const verifyDomain = useCallback(async (): Promise<boolean> => {
    if (!tenantId) return false;

    setIsLoading(true);
    setError(null);
    setStep('verifying');

    try {
      await domainApi.verify({ tenantId });
      if (!isMounted.current) return false;

      setStep('verified');
      startSslPolling();

      if (tenant) {
        setTenant({
          ...tenant,
          customDomainVerified: true,
          customDomainVerifiedAt: new Date().toISOString(),
          sslStatus: 'pending',
        });
      }

      toast.success('DNS terverifikasi!', 'Menunggu SSL certificate... (2-5 menit)');
      return true;
    } catch (err) {
      if (!isMounted.current) return false;
      const message = getErrorMessage(err);
      setError(message);
      setStep('instructions');
      toast.error('Verifikasi gagal', message);
      return false;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [tenantId, tenant, setTenant, startSslPolling]);

  // ========================================
  // REMOVE DOMAIN
  // ✅ Set customDomainRemovedAt di store
  //    → dipakai DomainInputForm untuk deteksi re-request
  // ========================================

  const removeDomain = useCallback(async (): Promise<boolean> => {
    if (!tenantId) return false;

    setIsLoading(true);
    setError(null);

    try {
      await domainApi.remove({ tenantId });
      if (!isMounted.current) return false;

      stopSslPolling();

      // Reset initialization flag agar init ulang setelah hapus
      hasInitialized.current = false;

      setStep('idle');
      setDnsInstructions(null);
      setSslStatus(null);

      // ✅ PENTING: Set customDomainRemovedAt = now()
      // Ini yang dipakai DomainInputForm untuk deteksi re-request
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
          customDomainRemovedAt: new Date().toISOString(), // ✅ TAMBAH INI
        });
      }

      toast.success('Domain dihapus', 'Kamu bisa mendaftarkan domain baru');
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