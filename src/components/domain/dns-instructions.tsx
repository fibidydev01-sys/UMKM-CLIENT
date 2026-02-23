'use client';

import { useState } from 'react';
import { useDomainStatus } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  RefreshCw,
  Loader2,
  Trash2,
  Info,
} from 'lucide-react';

// ==========================================
// DNS INSTRUCTIONS
// Tampilkan DNS records dari Vercel (sudah apex/subdomain-aware dari backend)
// Label panduan dinamis berdasarkan records yang diterima
// Manual refresh — user yang klik "Cek Status"
// Tidak ada auto-polling!
// ==========================================

interface DnsInstructionsProps {
  onCheckStatus: () => Promise<void>;
  onRemove: () => Promise<void>;
  isChecking: boolean;
  isLoading: boolean;
}

export function DnsInstructions({
  onCheckStatus,
  onRemove,
  isChecking,
  isLoading,
}: DnsInstructionsProps) {
  const { domain, dnsRecords: rawDnsRecords } = useDomainStatus();

  // Guard: pastikan selalu array
  const dnsRecords = Array.isArray(rawDnsRecords) ? rawDnsRecords : [];
  const [copied, setCopied] = useState<string | null>(null);

  // ==========================================
  // DETECT APEX VS SUBDOMAIN
  // Dari records yang dikasih backend (sudah pakai tldts di backend!)
  // Subdomain  → 1 CNAME record saja
  // Apex domain → A record + CNAME www
  // ==========================================
  const isSubdomainDomain =
    dnsRecords.length === 1 && dnsRecords[0]?.type === 'CNAME';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!domain) return null;

  return (
    <div className="space-y-6">

      {/* Header Info */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Tambahkan DNS records berikut di registrar domain Anda. DNS propagasi membutuhkan waktu{' '}
          <strong>10 menit – 48 jam</strong>. Setelah dipasang, klik{' '}
          <strong>&ldquo;Cek Status&rdquo;</strong> untuk verifikasi.
        </AlertDescription>
      </Alert>

      {/* Domain yang didaftarkan */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Terdaftar</CardTitle>
          <CardDescription>
            Domain berikut sedang menunggu verifikasi DNS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <code className="text-sm font-bold">{domain}</code>
            <Badge variant="secondary">Menunggu DNS</Badge>
          </div>
        </CardContent>
      </Card>

      {/* DNS Records dari Vercel — sudah apex/subdomain aware! */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Records yang Harus Dipasang</CardTitle>
          <CardDescription>
            Login ke panel domain Anda (Niagahoster, GoDaddy, Cloudflare, dll) dan tambahkan
            records berikut:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Info tipe domain */}
          {dnsRecords.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-200 space-y-0.5">
                {isSubdomainDomain ? (
                  <>
                    <p className="font-semibold">Domain subdomain terdeteksi</p>
                    <p>Cukup tambah <strong>1 CNAME record</strong> saja — tidak perlu A record atau CNAME www.</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Root domain (apex) terdeteksi</p>
                    <p>Tambah <strong>A record</strong> untuk root domain dan <strong>CNAME www</strong> untuk subdomain www.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {dnsRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada DNS records. Coba hapus dan daftarkan ulang domain Anda.
            </p>
          ) : (
            dnsRecords.map((record, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{record.type}</Badge>
                  {/* Label kontekstual per record */}
                  <span className="text-xs text-muted-foreground">
                    {record.type === 'A' && record.name === '@' && 'Root domain'}
                    {record.type === 'CNAME' && record.name === 'www' && 'Subdomain www'}
                    {record.type === 'CNAME' && record.name !== 'www' && `Subdomain ${record.name}`}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Name */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground w-16">Name:</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{record.name}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => copyToClipboard(record.name, `${index}-name`)}
                      >
                        {copied === `${index}-name` ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground w-16">Value:</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-xs truncate">
                        {record.value}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => copyToClipboard(record.value, `${index}-value`)}
                      >
                        {copied === `${index}-value` ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* TTL */}
                  {record.ttl && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground w-16">TTL:</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{record.ttl}</code>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Panduan Singkat — dinamis berdasarkan tipe domain */}
      <Card>
        <CardHeader>
          <CardTitle>Panduan Singkat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Login ke panel domain Anda (Niagahoster, GoDaddy, Cloudflare, dll)</li>
            <li>Cari menu <strong>DNS Management</strong> atau <strong>DNS Settings</strong></li>
            {isSubdomainDomain ? (
              <li>
                Tambah <strong>1 CNAME record</strong>:{' '}
                <code className="text-xs bg-muted px-1 rounded">
                  {dnsRecords[0]?.name} → {dnsRecords[0]?.value}
                </code>
              </li>
            ) : (
              <li>
                Tambah <strong>A record</strong> (untuk <code className="text-xs bg-muted px-1 rounded">@</code>)
                {' '}dan <strong>CNAME</strong> (untuk <code className="text-xs bg-muted px-1 rounded">www</code>)
              </li>
            )}
            <li>Simpan perubahan</li>
            <li>Kembali ke halaman ini dan klik <strong>&ldquo;Cek Status&rdquo;</strong></li>
          </ol>

          <Button asChild variant="outline" size="sm" className="mt-2">
            <a
              href="https://www.youtube.com/results?search_query=cara+setting+dns+record+custom+domain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Tutorial Video
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
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
              Cek Status DNS
            </>
          )}
        </Button>

        <Button
          onClick={onRemove}
          disabled={isLoading || isChecking}
          variant="outline"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          💡 <strong>Tips:</strong> Anda bisa meninggalkan halaman ini dan kembali lagi nanti
          setelah DNS terpropagasi. Klik &ldquo;Cek Status&rdquo; kapan saja untuk memverifikasi.
        </AlertDescription>
      </Alert>
    </div>
  );
}