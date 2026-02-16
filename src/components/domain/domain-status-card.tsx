'use client';

import { useDomainStatus } from '@/hooks';
import { useAuthStore } from '@/stores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ExternalLink, Globe, Shield, Trash2 } from 'lucide-react';
import { getTenantFullUrl } from '@/lib/store-url';

interface DomainStatusCardProps {
  onRemove: () => Promise<void>;
}

export function DomainStatusCard({ onRemove }: DomainStatusCardProps) {
  const { domain, isVerified, sslStatus, isFullyActive } = useDomainStatus();
  const tenant = useAuthStore((s) => s.tenant);

  if (!domain || !tenant) return null;

  const domainUrl = getTenantFullUrl(tenant.slug, '/', domain);

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          🎉 Domain Anda sudah aktif dan dapat diakses dengan HTTPS!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Aktif
          </CardTitle>
          <CardDescription>Custom domain Anda sudah terhubung dengan toko online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Domain:</p>
              <p className="text-lg font-bold">{domain}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={domainUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Buka Toko
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">DNS Verified</span>
              </div>
              <Badge variant={isVerified ? 'default' : 'secondary'}>
                {isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">SSL Certificate</span>
              </div>
              <Badge variant={sslStatus === 'active' ? 'default' : 'secondary'}>
                {sslStatus === 'active' ? 'Aktif (HTTPS)' : sslStatus || 'Pending'}
              </Badge>
            </div>
          </div>

          {!isFullyActive && (
            <Alert>
              <AlertDescription className="text-xs">
                Domain sedang dalam proses aktivasi. Tunggu beberapa menit lagi.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pengaturan Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">URL Toko Anda:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  ✅ <strong>{domain}</strong> (Custom Domain)
                </li>
                <li>
                  ✅ <strong>www.{domain}</strong> (Otomatis redirect)
                </li>
                <li className="line-through opacity-50">
                  {tenant.slug}.fibidy.com (Tidak aktif)
                </li>
              </ul>
            </div>

            <Button
              onClick={onRemove}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Custom Domain
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Menghapus domain akan mengembalikan toko ke subdomain Fibidy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}