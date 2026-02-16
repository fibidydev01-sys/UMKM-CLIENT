'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import type { DnsInstructions as DnsInstructionsType, DnsStatusResponse } from '@/types';
import { DnsStatusBadge } from './dns-status-badge';

interface DnsInstructionsProps {
  instructions: DnsInstructionsType;
  dnsStatus: DnsStatusResponse;
  onCancel: () => Promise<void>;
  isInsideModal?: boolean; // ✅ NEW: Flag to hide duplicate buttons when inside modal
}

export function DnsInstructions({
  instructions,
  dnsStatus,
  onCancel,
  isInsideModal = false, // ✅ Default: not inside modal
}: DnsInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const records = [
    { label: 'CNAME Root', record: instructions.cname, status: dnsStatus.cname },
    { label: 'CNAME WWW', record: instructions.cnameWWW, status: dnsStatus.cnameWWW },
    { label: 'TXT Verification', record: instructions.txtVerification, status: dnsStatus.txt },
  ];

  return (
    <div className="space-y-6">
      {/* Auto-Polling Status */}
      {!dnsStatus.allVerified && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertDescription>
            🔄 Memeriksa DNS otomatis setiap 10 detik...
            {dnsStatus.lastChecked && (
              <span className="ml-2 text-xs opacity-75">
                (Terakhir dicek: {new Date(dnsStatus.lastChecked).toLocaleTimeString('id-ID')})
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Propagation Warning */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Tambahkan DNS records berikut di registrar domain Anda. Proses propagasi DNS memakan waktu{' '}
          <strong>10-30 menit</strong>.
        </AlertDescription>
      </Alert>

      {/* DNS Records Card */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Records yang Harus Ditambahkan</CardTitle>
          <CardDescription>
            Login ke panel domain Anda (Niagahoster, GoDaddy, Cloudflare, dll) dan tambahkan records berikut:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {records.map(({ label, record, status }) => (
            <div key={label} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{record.type}</Badge>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <DnsStatusBadge status={status} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Name/Host:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{record.name}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(record.name, `${label}-name`)}
                    >
                      {copied === `${label}-name` ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Value:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded max-w-xs truncate">
                      {record.value}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(record.value, `${label}-value`)}
                    >
                      {copied === `${label}-value` ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">TTL:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{record.ttl}</code>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">{record.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tutorial Card */}
      <Card>
        <CardHeader>
          <CardTitle>Panduan Singkat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Login ke panel domain Anda</li>
            <li>Cari menu <strong>DNS Management</strong> atau <strong>DNS Settings</strong></li>
            <li>Tambahkan 3 records di atas (klik tombol copy untuk menyalin)</li>
            <li>Simpan perubahan</li>
            <li>Tunggu 10-30 menit - sistem akan otomatis mendeteksi ketika DNS sudah siap!</li>
          </ol>

          <div className="flex gap-2 pt-4">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://www.youtube.com/results?search_query=cara+setting+dns+record"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Tutorial Video
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Hide if inside modal (modal has its own footer) */}
      {!isInsideModal && (
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Hapus Domain
          </Button>
        </div>
      )}

      {/* Tips Alert */}
      <Alert>
        <AlertDescription className="text-xs">
          💡 <strong>Tips:</strong> {isInsideModal
            ? 'Anda bisa minimize browser dan kembali lagi nanti. Modal ini akan tetap terbuka hingga DNS terverifikasi atau Anda membatalkan setup.'
            : 'Anda bisa meninggalkan halaman ini. Sistem akan otomatis memverifikasi DNS records setiap 10 detik. Kembali lagi nanti untuk melihat hasilnya!'
          }
        </AlertDescription>
      </Alert>
    </div>
  );
}