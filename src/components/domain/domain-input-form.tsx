'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Info, Loader2 } from 'lucide-react';

// ==========================================
// DOMAIN INPUT FORM
// Simple form — input domain → submit → done
// ==========================================

interface DomainInputFormProps {
  onSubmit: (domain: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function DomainInputForm({ onSubmit, isLoading = false }: DomainInputFormProps) {
  const [domain, setDomain] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanDomain = domain.toLowerCase().trim();

    // Validasi kosong
    if (!cleanDomain) {
      setValidationError('Silakan masukkan domain Anda');
      return;
    }

    // Validasi format domain
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(cleanDomain)) {
      setValidationError('Format domain tidak valid. Contoh: tokoku.com');
      return;
    }

    const success = await onSubmit(cleanDomain);
    if (success) {
      setDomain('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Custom Domain
        </CardTitle>
        <CardDescription>
          Hubungkan domain sendiri ke toko online Anda
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Anda</Label>
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
                    setValidationError(null);
                  }}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" disabled={isLoading || !domain}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>

            {validationError && (
              <p className="text-xs text-destructive">{validationError}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Masukkan domain yang sudah Anda miliki (tanpa www)
            </p>
          </div>
        </form>

        {/* Persyaratan */}
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

        {/* Info tambahan */}
        <Alert>
          <AlertDescription className="text-xs">
            💡 Setelah domain disimpan, kamu akan mendapat instruksi DNS records yang harus dipasang di registrar domain kamu.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}