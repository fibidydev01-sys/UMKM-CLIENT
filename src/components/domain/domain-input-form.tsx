'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

interface DomainInputFormProps {
  onSubmit: (domain: string) => Promise<boolean>;
}

export function DomainInputForm({ onSubmit }: DomainInputFormProps) {
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate domain format
    const cleanDomain = domain.toLowerCase().trim();
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;

    if (!cleanDomain) {
      alert('Silakan masukkan domain Anda');
      return;
    }

    if (!domainRegex.test(cleanDomain)) {
      alert('Format domain tidak valid. Contoh: tokoku.com');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(cleanDomain);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
              onChange={(e) => setDomain(e.target.value)}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !domain}>
            {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Masukkan domain yang sudah Anda miliki (tanpa www)
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-medium">Persyaratan:</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Anda harus sudah membeli domain dari registrar (Niagahoster, GoDaddy, dll)</li>
          <li>Anda memiliki akses ke pengaturan DNS domain tersebut</li>
          <li>Proses setup memakan waktu 10-30 menit</li>
        </ul>
      </div>
    </form>
  );
}