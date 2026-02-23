'use client';

import { useState } from 'react';
import { useDomainStatus } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle2, Clock, RefreshCw, Loader2, Trash2 } from 'lucide-react';

// ==========================================
// DNS INSTRUCTIONS
// Tampilkan DNS records dari Vercel
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
  // Guard: pastikan selalu array — backend bisa return object/null
  const dnsRecords = Array.isArray(rawDnsRecords) ? rawDnsRecords : [];
  const [copied, setCopied] = useState<string | null>(null);

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
          <strong>&#34;Cek Status&#34;</strong> untuk verifikasi.
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

      {/* DNS Records dari Vercel */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Records yang Harus Dipasang</CardTitle>
          <CardDescription>
            Login ke panel domain Anda (Niagahoster, GoDaddy, Cloudflare, dll) dan tambahkan records berikut:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dnsRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada DNS records. Coba hapus dan daftarkan ulang domain Anda.
            </p>
          ) : (
            dnsRecords.map((record, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{record.type}</Badge>
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

      {/* Panduan Singkat */}
      <Card>
        <CardHeader>
          <CardTitle>Panduan Singkat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Login ke panel domain Anda</li>
            <li>Cari menu <strong>DNS Management</strong> atau <strong>DNS Settings</strong></li>
            <li>Tambahkan records di atas (klik tombol copy untuk menyalin)</li>
            <li>Simpan perubahan</li>
            <li>Kembali ke halaman ini dan klik <strong>&#34;Cek Status&#34;</strong></li>
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
          💡 <strong>Tips:</strong> Anda bisa meninggalkan halaman ini dan kembali lagi nanti setelah DNS terpropagasi. Klik &ldquo;Cek Status&rdquo; kapan saja untuk memverifikasi.
        </AlertDescription>
      </Alert>
    </div>
  );
}