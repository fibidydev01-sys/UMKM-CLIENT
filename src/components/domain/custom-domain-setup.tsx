'use client';

import { useCallback, useState } from 'react';
import { useDomainSetup } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle2, Plus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DomainInputForm } from './domain-input-form';
import { DnsInstructionsCard } from './dns-instructions-card';
import { DomainStatusCard } from './domain-status-card';

export function CustomDomainSetup() {
  const {
    step,
    error,
    dnsInstructions,
    dnsStatus,
    sslStatus,
    requestDomain,
    removeDomain,
    resetError,
  } = useDomainSetup();

  // Kontrol form input muncul/tidak
  const [showForm, setShowForm] = useState(false);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleDomainSubmit = useCallback(
    async (domain: string) => {
      const success = await requestDomain(domain);
      if (success) {
        setShowForm(false); // Tutup form setelah berhasil masuk DB
      }
      return success;
    },
    [requestDomain],
  );

  const handleRemove = useCallback(async () => {
    await removeDomain();
    setShowForm(false);
  }, [removeDomain]);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ERROR ALERT */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={resetError} className="text-sm underline hover:no-underline ml-4">
              Tutup
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* ============================================
          STATE 1: IDLE
          Belum ada domain → Tombol "Tambah Domain"
          Klik → Form muncul → Submit → Langsung ke DB
          ============================================ */}
      {(step === 'idle' || step === 'input') && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Custom Domain
                </CardTitle>
                <CardDescription className="mt-1">
                  Hubungkan domain sendiri ke toko online Anda
                </CardDescription>
              </div>

              {/* Tombol Tambah — hanya muncul kalau form belum terbuka */}
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Domain
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* Form input — muncul saat tombol diklik */}
            {showForm ? (
              <DomainInputForm
                onSubmit={handleDomainSubmit}
                onCancel={handleCancelForm}
              />
            ) : (
              /* Empty state */
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Belum ada custom domain</p>
                <p className="text-xs mt-1">
                  Klik &ldquo;Tambah Domain&rdquo; untuk menghubungkan domain kamu
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ============================================
          STATE 2: INSTRUCTIONS
          ✅ Domain SUDAH tersimpan di DB
          User tinggal copy DNS records & pasang di registrar
          Auto-polling jalan di background
          Bisa langsung hapus kalau mau ganti
          ============================================ */}
      {step === 'instructions' && dnsInstructions && (
        <DnsInstructionsCard
          dnsInstructions={dnsInstructions}
          dnsStatus={dnsStatus}
          onRemove={handleRemove}
        />
      )}

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
          STATE 3: VERIFIED — DNS ok, tunggu SSL
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
                💡 Halaman ini akan otomatis update ketika SSL certificate sudah aktif.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* ============================================
          STATE 4: ACTIVE 🎉
          ============================================ */}
      {step === 'active' && (
        <DomainStatusCard onRemove={handleRemove} />
      )}

    </div>
  );
}