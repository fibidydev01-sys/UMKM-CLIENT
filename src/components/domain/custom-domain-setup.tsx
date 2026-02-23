'use client';

import { useState } from 'react';
import { useDomainSetup, useDomainStatus } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  CheckCheck,
  Trash2,
  Loader2,
  Globe,
  Plus,
  ExternalLink,
  Shield,
  Info,
} from 'lucide-react';
import { ROOT_DOMAIN } from '@/config/constants';

// ==========================================
// CUSTOM DOMAIN SETUP — Railway-style
//
// Flow:
// 1. List domain + tombol "+ Add Domain"
// 2. Klik "Add Domain" → modal input
// 3. Setelah save → row "Waiting for DNS update · Show DNS Records"
// 4. Klik "Show DNS Records" → modal DNS records
// 5. Tombol delete per row (confirm modal)
// ==========================================

export function CustomDomainSetup() {
  const { isLoading, isChecking, error, requestDomain, checkStatus, removeDomain, resetError } =
    useDomainSetup();
  const { hasDomain, domain, isVerified, sslStatus, isFullyActive, dnsRecords, isHydrating } =
    useDomainStatus();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDnsModal, setShowDnsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputDomain, setInputDomain] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Detect subdomain dari dnsRecords (sudah diproses tldts di backend)
  const isSubdomainDomain = dnsRecords.length === 1 && dnsRecords[0]?.type === 'CNAME';

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleAddDomain = async () => {
    setInputError(null);
    const clean = inputDomain.toLowerCase().trim();

    if (!clean) { setInputError('Masukkan domain Anda'); return; }

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(clean)) {
      setInputError('Format tidak valid. Contoh: tokoku.com atau shop.tokoku.com');
      return;
    }

    const success = await requestDomain(clean);
    if (success) {
      setShowAddModal(false);
      setInputDomain('');
    }
  };

  const handleDelete = async () => {
    const success = await removeDomain();
    if (success) setShowDeleteModal(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isHydrating) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Memuat...</span>
      </div>
    );
  }

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="space-y-4">

      {/* ERROR */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={resetError} className="text-xs underline ml-4">Tutup</button>
          </AlertDescription>
        </Alert>
      )}

      {/* ==========================================
          DOMAIN LIST CARD
          ========================================== */}
      <div className="border rounded-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
          <div>
            <h3 className="text-sm font-semibold">Public Networking</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Akses toko Anda melalui custom domain
            </p>
          </div>
          {!hasDomain && (
            <Button size="sm" onClick={() => setShowAddModal(true)} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Domain
            </Button>
          )}
        </div>

        {/* Empty state */}
        {!hasDomain ? (
          <div className="px-4 py-10 text-center">
            <Globe className="h-8 w-8 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada custom domain</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Klik &quot;Add Domain&quot; untuk menghubungkan domain Anda
            </p>
          </div>
        ) : (
          /* Domain row */
          <DomainRow
            domain={domain!}
            isVerified={isVerified}
            isFullyActive={isFullyActive}
            sslStatus={sslStatus}
            isChecking={isChecking}
            isLoading={isLoading}
            onShowDns={() => setShowDnsModal(true)}
            onCheckStatus={checkStatus}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}
      </div>

      {/* Hint propagation */}
      {hasDomain && !isFullyActive && (
        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          DNS propagasi bisa memakan waktu 10 menit – 48 jam. Klik{' '}
          <strong>Cek Status</strong> setelah DNS dipasang di registrar Anda.
        </p>
      )}

      {/* ==========================================
          MODAL: ADD DOMAIN
          ========================================== */}
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) { setInputDomain(''); setInputError(null); }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Domain</DialogTitle>
            <DialogDescription>
              Masukkan domain yang sudah Anda miliki dari registrar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Input
              placeholder="tokoku.com"
              value={inputDomain}
              onChange={(e) => { setInputDomain(e.target.value); setInputError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
              disabled={isLoading}
              autoFocus
            />
            {inputError && (
              <p className="text-xs text-destructive">{inputError}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Contoh:{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">tokoku.com</code>
              {' '}atau{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">shop.tokoku.com</code>
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddDomain} disabled={isLoading || !inputDomain.trim()}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</>
              ) : (
                'Add Domain'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          MODAL: DNS RECORDS
          ========================================== */}
      <Dialog open={showDnsModal} onOpenChange={setShowDnsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Configure DNS Records</DialogTitle>
            <DialogDescription>
              Tambahkan DNS records berikut di panel registrar domain Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* Domain tipe info */}
            <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {isSubdomainDomain
                  ? <>Subdomain terdeteksi — cukup tambah <strong>1 CNAME record</strong> saja.</>
                  : <>Root domain terdeteksi — tambah <strong>A record</strong> dan <strong>CNAME www</strong>.</>
                }
              </p>
            </div>

            {/* Label */}
            <p className="text-sm text-muted-foreground">
              Add the following DNS records to{' '}
              <span className="text-foreground font-medium">{domain}</span>
            </p>

            {/* Records table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-20">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-20">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Value</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dnsRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-xs text-muted-foreground">
                        Tidak ada records. Coba hapus dan daftarkan ulang domain.
                      </td>
                    </tr>
                  ) : (
                    dnsRecords.map((record, i) => (
                      <tr key={i} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {record.type}
                          </Badge>
                        </td>
                        <td className="px-3 py-3">
                          <code className="text-xs font-medium">{record.name}</code>
                        </td>
                        <td className="px-3 py-3">
                          <code className="text-xs text-muted-foreground break-all">
                            {record.value}
                          </code>
                        </td>
                        <td className="px-2 py-3 text-right">
                          <button
                            onClick={() => copyToClipboard(record.value, `${i}`)}
                            className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy value"
                          >
                            {copied === `${i}`
                              ? <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                              : <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            }
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Steps */}
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Login ke panel domain Anda (Niagahoster, GoDaddy, Cloudflare, dll)</li>
              <li>Cari menu <strong className="text-foreground">DNS Management</strong></li>
              <li>Tambahkan records di atas, lalu simpan perubahan</li>
              <li>Kembali ke sini dan klik <strong className="text-foreground">Cek Status</strong></li>
            </ol>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://www.youtube.com/results?search_query=cara+setting+dns+record+custom+domain"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View Documentation
              </a>
            </Button>
            <Button size="sm" onClick={() => setShowDnsModal(false)}>
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          MODAL: CONFIRM DELETE
          ========================================== */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Domain?</DialogTitle>
            <DialogDescription>
              Domain <strong>{domain}</strong> akan dilepas dari toko Anda.
              Toko akan kembali menggunakan subdomain default.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menghapus...</>
                : 'Hapus Domain'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// ==========================================
// DOMAIN ROW — Railway style
// ==========================================

interface DomainRowProps {
  domain: string;
  isVerified: boolean;
  isFullyActive: boolean;
  sslStatus: string | null;
  isChecking: boolean;
  isLoading: boolean;
  onShowDns: () => void;
  onCheckStatus: () => Promise<void>;
  onDelete: () => void;
}

function DomainRow({
  domain,
  isVerified,
  isFullyActive,
  sslStatus,
  isChecking,
  isLoading,
  onShowDns,
  onCheckStatus,
  onDelete,
}: DomainRowProps) {
  const isActive = isFullyActive && sslStatus === 'active';

  return (
    <div className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/20 transition-colors group">

      {/* Left */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Status icon */}
        <div className="mt-0.5 shrink-0">
          {isActive
            ? <CheckCircle2 className="h-4 w-4 text-green-500" />
            : <AlertTriangle className="h-4 w-4 text-amber-400" />
          }
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{domain}</span>
            {isActive && (
              <Badge className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-600 border border-green-200 hover:bg-green-500/10">
                Active
              </Badge>
            )}
          </div>

          {/* Sub-info row */}
          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 mt-1">
            {isActive ? (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                HTTPS Active
              </span>
            ) : isVerified ? (
              <span className="text-xs text-muted-foreground">DNS verified · Waiting for SSL</span>
            ) : (
              <span className="text-xs text-muted-foreground">Waiting for DNS update</span>
            )}

            {/* Show DNS Records */}
            {!isActive && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <button
                  onClick={onShowDns}
                  className="text-xs text-primary hover:underline"
                >
                  Show DNS Records
                </button>
              </>
            )}

            {/* Cek Status */}
            {!isActive && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <button
                  onClick={onCheckStatus}
                  disabled={isChecking}
                  className="text-xs text-primary hover:underline disabled:opacity-50 flex items-center gap-1"
                >
                  {isChecking
                    ? <><Loader2 className="h-3 w-3 animate-spin" />Checking...</>
                    : 'Cek Status'
                  }
                </button>
              </>
            )}

            {/* Buka toko */}
            {isActive && (
              <>
                <span className="text-xs text-muted-foreground">·</span>
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Buka Toko
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: action icons — show on hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
        <button
          onClick={onShowDns}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Show DNS Records"
        >
          <Globe className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          title="Hapus Domain"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}