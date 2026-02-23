'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Copy, CheckCircle2, Clock, RefreshCw, Trash2,
  Globe, ExternalLink, AlertTriangle,
} from 'lucide-react';
import type { DnsInstructions, DnsStatusResponse, DnsRecordStatus } from '@/types';

// ==========================================
// STATUS BADGE
// ==========================================

function DnsStatusBadge({ status }: { status: DnsRecordStatus }) {
  const map: Record<DnsRecordStatus, { label: string; className: string }> = {
    pending: { label: 'Menunggu', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    checking: { label: 'Mengecek...', className: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' },
    verified: { label: '✓ Verified', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    failed: { label: '✗ Gagal', className: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' },
  };
  const { label, className } = map[status] ?? map.pending;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  );
}

// ==========================================
// PROPS
// ==========================================

interface DnsInstructionsCardProps {
  dnsInstructions: DnsInstructions;
  dnsStatus: DnsStatusResponse;
  onRemove: () => Promise<void>;
}

// ==========================================
// COMPONENT
// ==========================================

export function DnsInstructionsCard({
  dnsInstructions,
  dnsStatus,
  onRemove,
}: DnsInstructionsCardProps) {
  const tenant = useAuthStore((s) => s.tenant);
  const [copied, setCopied] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRemove = async () => {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    setIsRemoving(true);
    try {
      await onRemove();
    } finally {
      setIsRemoving(false);
      setConfirmRemove(false);
    }
  };

  // Hitung progress verifikasi
  const verifiedCount = [dnsStatus.cname, dnsStatus.cnameWWW, dnsStatus.txt]
    .filter((s) => s === 'verified').length;

  const records = [
    { key: 'cname', label: 'CNAME Root', record: dnsInstructions.cname, status: dnsStatus.cname },
    { key: 'cnameWWW', label: 'CNAME WWW', record: dnsInstructions.cnameWWW, status: dnsStatus.cnameWWW },
    { key: 'txt', label: 'TXT Verification', record: dnsInstructions.txtVerification, status: dnsStatus.txt },
  ];

  return (
    <div className="space-y-4">

      {/* ===== HEADER CARD ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {tenant?.customDomain}
              </CardTitle>
              <CardDescription className="mt-1">
                Domain tersimpan ✅ — Pasang DNS records di bawah ini di registrar kamu
              </CardDescription>
            </div>

            {/* Progress badge */}
            <Badge variant={dnsStatus.allVerified ? 'default' : 'secondary'} className="shrink-0">
              {dnsStatus.allVerified ? '✓ DNS Verified' : `${verifiedCount}/3 Verified`}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Auto-polling status */}
          {!dnsStatus.allVerified && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">🔄 Auto-cek DNS setiap 10 detik</span>
                {dnsStatus.lastChecked && (
                  <span className="text-xs text-muted-foreground">
                    Terakhir: {new Date(dnsStatus.lastChecked).toLocaleTimeString('id-ID')}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Propagation info */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Propagasi DNS memerlukan <strong>10–30 menit</strong> setelah records dipasang.
              Halaman ini akan otomatis update saat DNS terverifikasi.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* ===== DNS RECORDS ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">DNS Records</CardTitle>
          <CardDescription>
            Tambahkan 3 records berikut di panel DNS registrar kamu (Niagahoster, GoDaddy, Cloudflare, dll)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {records.map(({ key, label, record, status }) => (
            <div key={key} className="border rounded-lg p-4 space-y-3">
              {/* Record header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">{record.type}</Badge>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <DnsStatusBadge status={status} />
              </div>

              {/* Name */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Name / Host:</span>
                <div className="flex items-center gap-2 min-w-0">
                  <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                    {record.name}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                    onClick={() => copyToClipboard(record.name, `${key}-name`)}
                  >
                    {copied === `${key}-name`
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      : <Copy className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              </div>

              {/* Value */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Value / Points to:</span>
                <div className="flex items-center gap-2 min-w-0">
                  <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                    {record.value}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0"
                    onClick={() => copyToClipboard(record.value, `${key}-value`)}
                  >
                    {copied === `${key}-value`
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      : <Copy className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              </div>

              {/* TTL */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">TTL:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{record.ttl}</code>
              </div>

              {/* Note */}
              <p className="text-xs text-muted-foreground italic">{record.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ===== PANDUAN SINGKAT ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cara Pasang DNS Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
            <li>Login ke panel domain kamu (Niagahoster, GoDaddy, Cloudflare, dll)</li>
            <li>Cari menu <strong className="text-foreground">DNS Management</strong> atau <strong className="text-foreground">DNS Settings</strong></li>
            <li>Tambahkan 3 records di atas — klik tombol <Copy className="h-3 w-3 inline" /> untuk copy</li>
            <li>Simpan perubahan</li>
            <li>Tunggu 10–30 menit — halaman ini otomatis update!</li>
          </ol>

          <Button asChild variant="outline" size="sm" className="mt-2">
            <a
              href="https://www.youtube.com/results?search_query=cara+setting+dns+record+cname"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Tutorial Video
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* ===== HAPUS DOMAIN ===== */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Hapus Domain
          </CardTitle>
          <CardDescription>
            Hapus domain ini jika ingin mengganti dengan domain lain.
            Domain tidak bisa di-rename — harus hapus lalu daftar ulang.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {confirmRemove && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Yakin hapus domain <strong>{tenant?.customDomain}</strong>?
                Kamu perlu setup DNS dari awal jika mendaftar domain baru.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            {confirmRemove ? (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className="flex-1"
                >
                  {isRemoving ? (
                    <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Menghapus...</>
                  ) : (
                    <><Trash2 className="h-4 w-4 mr-2" />Ya, Hapus Domain</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmRemove(false)}
                  disabled={isRemoving}
                >
                  Batal
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Domain
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}