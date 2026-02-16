'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useDomainSetup } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DomainInputForm } from './domain-input-form';
import { DnsSetupModal, getOngoingDnsSetup } from './dns-setup-modal';
import { DomainStatusCard } from './domain-status-card';

export function CustomDomainSetup() {
  const {
    step,
    error,
    dnsInstructions,
    sslStatus,
    dnsStatus,
    requestDomain,
    removeDomain,
    resetError,
  } = useDomainSetup();

  // ✅ FIX 1: Derive showSetupBanner from step + localStorage (no useState!)
  const showSetupBanner = useMemo(() => {
    if (step !== 'instructions') return false;

    const ongoing = getOngoingDnsSetup();
    return !!ongoing;
  }, [step]);

  // Handle domain input submission
  const handleDomainSubmit = useCallback(
    async (domain: string) => {
      const success = await requestDomain(domain);
      return success;
    },
    [requestDomain],
  );

  // Handle domain removal
  const handleRemove = useCallback(async () => {
    await removeDomain();
  }, [removeDomain]);

  return (
    <div className="space-y-6">
      {/* ✅ SMART BANNER: Show when user returns and setup is ongoing */}
      {showSetupBanner && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <strong>🔄 Setup DNS Sedang Berlangsung</strong>
                <p className="text-sm mt-1">
                  Sistem masih menunggu DNS propagasi. Auto-polling aktif setiap 10 detik.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* ✅ DNS SETUP MODAL */}
      {step === 'instructions' && dnsInstructions && (
        <DnsSetupModal
          isOpen={true}
          domain={dnsInstructions.cname.value.replace('cname.vercel-dns.com', '')}
          instructions={dnsInstructions}
          dnsStatus={dnsStatus}
          onCancel={handleRemove}
        />
      )}

      {/* Global Error Alert */}
      {error && step !== 'instructions' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={resetError}
              className="text-sm underline hover:no-underline"
            >
              Tutup
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Step: Idle - No domain configured */}
      {step === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Custom Domain</CardTitle>
            <CardDescription>
              Gunakan domain sendiri (contoh: tokoku.com) untuk toko online Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DomainInputForm onSubmit={handleDomainSubmit} />
          </CardContent>
        </Card>
      )}

      {/* Step: Input - User is inputting */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Custom Domain</CardTitle>
            <CardDescription>
              Gunakan domain sendiri (contoh: tokoku.com) untuk toko online Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DomainInputForm onSubmit={handleDomainSubmit} />
          </CardContent>
        </Card>
      )}

      {/* Step: Verifying - Loading state */}
      {step === 'verifying' && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Memverifikasi DNS Records</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Sedang memeriksa CNAME dan TXT records di domain Anda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Verified - DNS OK, waiting for SSL */}
      {step === 'verified' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              DNS Terverifikasi!
            </CardTitle>
            <CardDescription>
              Domain Anda sudah terhubung. Menunggu SSL certificate...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                ✅ DNS records berhasil diverifikasi!
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <h4 className="font-medium mb-2">Sedang Memproses SSL Certificate</h4>
                <p className="text-sm text-muted-foreground">
                  Vercel sedang menerbitkan SSL certificate untuk domain Anda.
                  Proses ini biasanya memakan waktu 2-5 menit.
                </p>
              </div>
              {sslStatus && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Status: <code className="bg-muted px-2 py-0.5 rounded">{sslStatus.sslStatus}</code>
                  </p>
                </div>
              )}
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                💡 <strong>Info:</strong> Halaman ini akan otomatis update ketika SSL certificate sudah aktif.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Step: Active - Domain fully live */}
      {step === 'active' && (
        <DomainStatusCard onRemove={handleRemove} />
      )}
    </div>
  );
}