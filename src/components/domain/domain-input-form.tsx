'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, AlertTriangle, Info, Trash2, RefreshCw } from 'lucide-react';

interface DomainInputFormProps {
  onSubmit: (domain: string) => Promise<boolean>;
}

export function DomainInputForm({ onSubmit }: DomainInputFormProps) {
  const tenant = useAuthStore((s) => s.tenant);

  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ==========================================
  // CEK KONDISI DARI TENANT DATA (FE ONLY)
  // ==========================================

  // Apakah tenant pernah punya domain sebelumnya (sudah dihapus)?
  const hadDomainBefore = !!tenant?.customDomainRemovedAt;

  // Apakah tenant saat ini sedang punya domain aktif/pending?
  // (harusnya ga sampai sini kalau ada domain, tapi safety check)
  const hasActiveDomain = !!tenant?.customDomain;

  // Hitung berapa kali sudah request (dari customDomainRemovedAt sebagai sinyal)
  // Kalau mau lebih strict bisa tambah field domainRequestCount di tenant
  const isReRequest = hadDomainBefore;

  // ==========================================
  // SUBMIT HANDLER
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanDomain = domain.toLowerCase().trim();
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

    if (!cleanDomain) {
      alert('Silakan masukkan domain Anda');
      return;
    }

    if (!domainRegex.test(cleanDomain)) {
      alert('Format domain tidak valid. Contoh: tokoku.com');
      return;
    }

    // Kalau ini re-request (pernah hapus), minta konfirmasi dulu
    if (isReRequest && !confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(cleanDomain);
      setConfirmDelete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // RENDER: Kalau ada domain aktif (safety guard)
  // ==========================================
  if (hasActiveDomain) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Kamu sudah memiliki domain aktif: <strong>{tenant?.customDomain}</strong>.
          Hapus domain tersebut terlebih dahulu sebelum mendaftarkan yang baru.
        </AlertDescription>
      </Alert>
    );
  }

  // ==========================================
  // RENDER: Form utama
  // ==========================================
  return (
    <div className="space-y-4">

      {/* ⚠️ WARNING: Kalau ini re-request setelah hapus domain */}
      {isReRequest && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-semibold">⚠️ Perhatian — Domain Tidak Bisa Di-rename</p>
            <p className="text-sm">
              Kamu sebelumnya sudah pernah mendaftarkan domain. Mendaftarkan domain baru
              berarti kamu harus <strong>setup DNS dari awal</strong> di registrar domain kamu.
            </p>
            <p className="text-sm">
              Domain lama:{' '}
              <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">
                dihapus pada {tenant?.customDomainRemovedAt
                  ? new Date(tenant.customDomainRemovedAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                  : '-'
                }
              </code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain">
            {isReRequest ? 'Domain Baru Anda' : 'Domain Anda'}
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="domain"
                type="text"
                placeholder="tokoku.com"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setConfirmDelete(false); // Reset konfirmasi kalau user edit domain
                }}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>

            {/* Tombol berubah jadi konfirmasi kalau re-request */}
            {confirmDelete ? (
              <Button
                type="submit"
                disabled={isSubmitting || !domain}
                variant="destructive"
                className="shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Ya, Daftar Domain Baru
                  </>
                )}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !domain}>
                {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
              </Button>
            )}
          </div>

          {/* Hint teks di bawah input */}
          {confirmDelete ? (
            <p className="text-xs text-destructive font-medium">
              ⚠️ Klik &#34;Ya, Daftar Domain Baru&#34; untuk konfirmasi. Kamu perlu setup DNS baru dari awal.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Masukkan domain yang sudah Anda miliki (tanpa www)
            </p>
          )}
        </div>

        {/* Cancel konfirmasi */}
        {confirmDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(false)}
            className="w-full"
          >
            Batal
          </Button>
        )}
      </form>

      {/* Info box */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <h4 className="text-sm font-medium">
            {isReRequest ? 'Yang perlu kamu siapkan:' : 'Persyaratan:'}
          </h4>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-6">
          <li>Kamu sudah membeli domain dari registrar (Niagahoster, GoDaddy, dll)</li>
          <li>Kamu punya akses ke pengaturan DNS domain tersebut</li>
          <li>Proses setup memakan waktu 10–30 menit</li>
          {isReRequest && (
            <li className="text-amber-600 dark:text-amber-400 font-medium">
              Domain tidak bisa di-rename — harus hapus lalu daftar ulang
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}