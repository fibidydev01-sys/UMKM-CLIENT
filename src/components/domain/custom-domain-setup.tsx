'use client';

import { useCallback, useState } from 'react';
import { useDomainSetup } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DomainInputForm } from './domain-input-form';
import { DnsSetupModal } from './dns-setup-modal';
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

  // ✅ State terpisah untuk modal — tidak terikat ke step
  const [isModalOpen, setIsModalOpen] = useState(true);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDomainSubmit = useCallback(
    async (domain: string) => {
      const success = await requestDomain(domain);
      if (success) {
        // Otomatis buka modal saat domain baru berhasil didaftarkan
        setIsModalOpen(true);
      }
      return success;
    },
    [requestDomain],
  );

  const handleRemove = useCallback(async () => {
    await removeDomain();
    setIsModalOpen(false);
  }, [removeDomain]);

  // ✅ Tutup modal TANPA hapus domain — polling tetap jalan di background!
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // ✅ Buka modal lagi dari banner
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ============================================
          BANNER: Muncul saat step=instructions
          DAN modal sedang ditutup
          ============================================ */}
      {step === 'instructions' && !isModalOpen && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">🔄 Setup DNS Sedang Berlangsung</p>
                <p className="text-sm mt-0.5">
                  Auto-polling aktif setiap 10 detik. Halaman akan otomatis update saat DNS terverifikasi.
                </p>
              </div>
              {/* ✅ TOMBOL BUKA MODAL LAGI */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpenModal}
                className="shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900"
              >
                <Eye className="h-4 w-4 mr-2" />
                Lihat Status DNS
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* ============================================
          DNS SETUP MODAL
          isOpen dikontrol state — BUKAN hardcoded true
          ============================================ */}
      {step === 'instructions' && dnsInstructions && (
        <DnsSetupModal
          isOpen={isModalOpen}
          domain={dnsInstructions.cname.value.replace('cname.vercel-dns.com', '')}
          instructions={dnsInstructions}
          dnsStatus={dnsStatus}
          onClose={handleCloseModal}  // ← Tutup modal saja, polling tetap jalan
          onCancel={handleRemove}     // ← Hapus domain, keluar dari flow
        />
      )}

      {/* ============================================
          ERROR ALERT (di luar modal)
          ============================================ */}
      {error && step !== 'instructions' && (
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
          STATE 1: IDLE / INPUT
          Belum ada domain → tampil form
          ============================================ */}
      {(step === 'idle' || step === 'input') && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Custom Domain</CardTitle>
            <CardDescription>
              Gunakan domain sendiri (contoh: tokoku.com) untuk toko online Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* DomainInputForm handle cek re-request dari tenant store */}
            <DomainInputForm onSubmit={handleDomainSubmit} />
          </CardContent>
        </Card>
      )}

      {/* ============================================
          STATE 2: INSTRUCTIONS
          Domain tersimpan di DB, menunggu DNS
          → Ditangani DnsSetupModal + Banner di atas
          ============================================ */}

      {/* ============================================
          STATE: VERIFYING (manual fallback)
          ============================================ */}
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

      {/* ============================================
          STATE 3: VERIFIED
          DNS ok, menunggu SSL certificate
          ============================================ */}
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
                  Proses ini biasanya memakan waktu 2–5 menit.
                </p>
              </div>
              {sslStatus && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Status:{' '}
                    <code className="bg-muted px-2 py-0.5 rounded">{sslStatus.sslStatus}</code>
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

      {/* ============================================
          STATE 4: ACTIVE 🎉
          Domain fully live dengan HTTPS
          ============================================ */}
      {step === 'active' && (
        <DomainStatusCard onRemove={handleRemove} />
      )}

    </div>
  );
}