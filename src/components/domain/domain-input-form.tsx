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
  onCancel?: () => void;
}

export function DomainInputForm({ onSubmit, onCancel }: DomainInputFormProps) {
  const tenant = useAuthStore((s) => s.tenant);

  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hadDomainBefore = !!tenant?.customDomainRemovedAt;
  const hasActiveDomain = !!tenant?.customDomain;
  const isReRequest = hadDomainBefore;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🚀 [DomainInputForm] handleSubmit triggered');
    console.log('🔍 [DomainInputForm] domain value:', domain);
    console.log('🔍 [DomainInputForm] tenant id:', tenant?.id);
    console.log('🔍 [DomainInputForm] tenant customDomain:', tenant?.customDomain);

    const cleanDomain = domain.toLowerCase().trim();
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

    if (!cleanDomain) {
      console.warn('❌ domain kosong');
      alert('Silakan masukkan domain Anda');
      return;
    }

    if (!domainRegex.test(cleanDomain)) {
      console.warn('❌ format domain invalid:', cleanDomain);
      alert('Format domain tidak valid. Contoh: tokoku.com');
      return;
    }

    if (isReRequest && !confirmDelete) {
      console.log('⚠️ re-request, minta konfirmasi dulu');
      setConfirmDelete(true);
      return;
    }

    console.log('📡 memanggil onSubmit dengan domain:', cleanDomain);
    setIsSubmitting(true);
    try {
      const result = await onSubmit(cleanDomain);
      console.log('✅ onSubmit result:', result);
      setConfirmDelete(false);
    } catch (err) {
      console.error('❌ onSubmit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasActiveDomain) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Kamu sudah memiliki domain aktif: <strong>{tenant?.customDomain}</strong>.
          Hapus domain tersebih dahulu sebelum mendaftarkan yang baru.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {isReRequest && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 space-y-1">
            <p className="font-semibold">⚠️ Perhatian — Domain Tidak Bisa Di-rename</p>
            <p className="text-sm">
              Mendaftarkan domain baru berarti kamu harus{' '}
              <strong>setup DNS dari awal</strong> di registrar domain kamu.
            </p>
            <p className="text-sm">
              Domain lama dihapus pada:{' '}
              <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-xs">
                {tenant?.customDomainRemovedAt
                  ? new Date(tenant.customDomainRemovedAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                  : '-'}
              </code>
            </p>
          </AlertDescription>
        </Alert>
      )}

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
                  setConfirmDelete(false);
                }}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>

            {confirmDelete ? (
              <Button
                type="submit"
                disabled={isSubmitting || !domain}
                variant="destructive"
                className="shrink-0"
              >
                {isSubmitting ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Memproses...</>
                ) : (
                  <><Trash2 className="h-4 w-4 mr-2" />Ya, Daftar Domain Baru</>
                )}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !domain}>
                {isSubmitting ? 'Memproses...' : 'Simpan'}
              </Button>
            )}
          </div>

          {confirmDelete ? (
            <p className="text-xs text-destructive font-medium">
              ⚠️ Kamu perlu setup DNS baru dari awal.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Masukkan domain yang sudah Anda miliki (tanpa www)
            </p>
          )}
        </div>

        {confirmDelete && (
          <Button type="button" variant="ghost" size="sm"
            onClick={() => setConfirmDelete(false)} className="w-full">
            Batal
          </Button>
        )}

        {!confirmDelete && onCancel && (
          <Button type="button" variant="ghost" size="sm"
            onClick={onCancel} className="w-full" disabled={isSubmitting}>
            Batal
          </Button>
        )}
      </form>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <h4 className="text-sm font-medium">Persyaratan:</h4>
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-6">
          <li>Kamu sudah membeli domain dari registrar (Niagahoster, GoDaddy, dll)</li>
          <li>Kamu punya akses ke pengaturan DNS domain tersebut</li>
          <li>Setelah disimpan, kamu akan mendapat DNS records untuk dipasang di registrar</li>
        </ul>
      </div>
    </div>
  );
}