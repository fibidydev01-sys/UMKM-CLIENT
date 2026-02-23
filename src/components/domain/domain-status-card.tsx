'use client';

import { useDomainStatus } from '@/hooks';
import { useAuthStore } from '@/stores';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Shield,
  Trash2,
  RefreshCw,
  Loader2,
  Clock,
} from 'lucide-react';
import { getTenantFullUrl } from '@/lib/store-url';
import { ROOT_DOMAIN } from '@/config/constants'; // ✅ Tidak hardcode 'fibidy.com'

// ==========================================
// DOMAIN STATUS CARD
// Dipakai untuk 2 state:
// 1. DNS verified, SSL pending  → tampil tombol "Cek SSL"
// 2. Fully active (SSL active)  → tampil domain live ✅
// DomainStatusCard handle sendiri berdasarkan sslStatus
// ==========================================

interface DomainStatusCardProps {
  onCheckStatus: () => Promise<void>;
  onRemove: () => Promise<void>;
  isChecking: boolean;
  isLoading: boolean;
  sslStatus: string | null;
}

export function DomainStatusCard({
  onCheckStatus,
  onRemove,
  isChecking,
  isLoading,
  sslStatus,
}: DomainStatusCardProps) {
  const { domain, isVerified, isFullyActive } = useDomainStatus();
  const tenant = useAuthStore((s) => s.tenant);

  if (!domain || !tenant) return null;

  const domainUrl = getTenantFullUrl(tenant.slug, '/', domain);
  const isActive = isFullyActive && sslStatus === 'active';

  return (
    <div className="space-y-6">

      {/* Status Banner */}
      {isActive ? (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            🎉 Domain Anda sudah aktif dan dapat diakses dengan HTTPS!
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            ✅ DNS terverifikasi! Vercel sedang menerbitkan SSL certificate...
            Klik <strong>&ldquo;Cek Status&rdquo;</strong> untuk memperbarui.
          </AlertDescription>
        </Alert>
      )}

      {/* Domain Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {isActive ? 'Domain Aktif' : 'SSL Pending'}
          </CardTitle>
          <CardDescription>
            {isActive
              ? 'Custom domain Anda sudah terhubung dengan toko online'
              : 'DNS sudah verified, menunggu SSL certificate dari Vercel'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Domain URL */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Domain:</p>
              <p className="text-lg font-bold">{domain}</p>
            </div>
            {isActive && (
              <Button asChild variant="outline" size="sm">
                <a href={domainUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka Toko
                </a>
              </Button>
            )}
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* DNS Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">DNS</span>
              </div>
              <Badge variant={isVerified ? 'default' : 'secondary'}>
                {isVerified ? '✅ Terverifikasi' : 'Belum Verified'}
              </Badge>
            </div>

            {/* SSL Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield
                  className={`h-4 w-4 ${isActive ? 'text-green-600' : 'text-amber-500'}`}
                />
                <span className="text-sm">SSL</span>
              </div>
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive
                  ? '✅ Aktif (HTTPS)'
                  : sslStatus === 'pending'
                    ? '⏳ Pending'
                    : sslStatus || 'Pending'}
              </Badge>
            </div>
          </div>

          {/* Active domain info — pakai ROOT_DOMAIN, bukan hardcode */}
          {isActive && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">URL Toko Anda:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✅ <strong>{domain}</strong> (Custom Domain)</li>
                <li>✅ <strong>www.{domain}</strong> (Redirect otomatis)</li>
                <li className="line-through opacity-50">
                  {tenant.slug}.{ROOT_DOMAIN} (Tidak aktif)
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* Cek Status — manual, hanya tampil kalau SSL belum active */}
        {!isActive && (
          <Button
            onClick={onCheckStatus}
            disabled={isChecking || isLoading}
            className="flex-1"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mengecek...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cek Status SSL
              </>
            )}
          </Button>
        )}

        {/* Hapus Domain */}
        <Button
          onClick={onRemove}
          disabled={isLoading || isChecking}
          variant={isActive ? 'destructive' : 'outline'}
          className={isActive ? 'w-full' : ''}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Domain
            </>
          )}
        </Button>
      </div>

      {isActive && (
        <p className="text-xs text-muted-foreground text-center">
          Menghapus domain akan mengembalikan toko ke subdomain Fibidy
        </p>
      )}
    </div>
  );
}