'use client';

import { useDomainSetup, useDomainStatus } from '@/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { DomainInputForm } from './domain-input-form';
import { DnsInstructions } from './dns-instructions';
import { DomainStatusCard } from './domain-status-card';

// ==========================================
// CUSTOM DOMAIN SETUP
// Orchestrator component — routing berdasarkan tenant state
// Tidak ada wizard step, tidak ada polling
// ==========================================

export function CustomDomainSetup() {
  const { isLoading, isChecking, error, requestDomain, checkStatus, removeDomain, resetError } =
    useDomainSetup();
  const { hasDomain, isVerified, sslStatus } = useDomainStatus();

  // Wrapper — karena removeDomain return boolean, props komponen expect void
  const handleRemove = async (): Promise<void> => {
    await removeDomain();
  };

  return (
    <div className="space-y-6">

      {/* ERROR ALERT */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={resetError}
              className="text-sm underline hover:no-underline ml-4"
            >
              Tutup
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* ============================================
          STATE 1: BELUM ADA DOMAIN
          → Tampilkan form input
          ============================================ */}
      {!hasDomain && (
        <DomainInputForm
          onSubmit={requestDomain}
          isLoading={isLoading}
        />
      )}

      {/* ============================================
          STATE 2: ADA DOMAIN, BELUM VERIFIED
          → Tampilkan DNS instructions
          ============================================ */}
      {hasDomain && !isVerified && (
        <DnsInstructions
          onCheckStatus={checkStatus}
          onRemove={handleRemove}
          isChecking={isChecking}
          isLoading={isLoading}
        />
      )}

      {/* ============================================
          STATE 3: VERIFIED (SSL pending atau active)
          → DomainStatusCard handle tampilan sendiri
             berdasarkan sslStatus di dalamnya
          ============================================ */}
      {hasDomain && isVerified && (
        <DomainStatusCard
          onCheckStatus={checkStatus}
          onRemove={handleRemove}
          isChecking={isChecking}
          isLoading={isLoading}
          sslStatus={sslStatus}
        />
      )}

    </div>
  );
}