'use client';

import { useState } from 'react';
import { useDomainSetup, useDomainStatus } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// CUSTOM DOMAIN — Crisp Editorial SaaS
//
// Flow:
// 1. List domain + tombol "+ Add Domain"
// 2. Klik "Add Domain" → modal input
// 3. Setelah save → row "Waiting for DNS · Show DNS Records"
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

  const isSubdomainDomain = dnsRecords.length === 1 && dnsRecords[0]?.type === 'CNAME';
  const isActive = isFullyActive && sslStatus === 'active';

  // ─── Handlers ──────────────────────────────────────────────────────────
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
    if (success) { setShowAddModal(false); setInputDomain(''); }
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

  // ─── Loading ────────────────────────────────────────────────────────────
  if (isHydrating) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Memuat...</span>
      </div>
    );
  }

  // ─── Main ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="border-l-2 border-destructive pl-4 py-1 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <button
            onClick={resetError}
            className="text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            TUTUP
          </button>
        </div>
      )}

      {/* ── Section header ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Public Networking
          </p>
          <h2 className="text-2xl font-bold tracking-tight leading-none">Custom Domain</h2>
          <p className="text-sm text-muted-foreground pt-0.5">
            Hubungkan domain milik Anda ke toko ini
          </p>
        </div>
        {!hasDomain && (
          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            disabled={isLoading}
            className="gap-1.5 h-8 text-xs shrink-0 mt-1"
          >
            <Plus className="h-3.5 w-3.5" />Add Domain
          </Button>
        )}
      </div>

      {/* ── Domain card ───────────────────────────────────────────────── */}
      {!hasDomain ? (
        /* Empty state */
        <div
          onClick={() => setShowAddModal(true)}
          className="flex flex-col items-center justify-center py-14 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-colors group"
        >
          <Globe className="h-10 w-10 mb-3 text-muted-foreground/30 group-hover:text-primary/40 transition-colors" />
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Belum ada custom domain
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Klik untuk menambahkan domain
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="h-3.5 w-3.5" />Add Domain
          </div>
        </div>
      ) : (
        /* Domain row */
        <DomainRow
          domain={domain!}
          isActive={isActive}
          isVerified={isVerified}
          sslStatus={sslStatus}
          isChecking={isChecking}
          isLoading={isLoading}
          onShowDns={() => setShowDnsModal(true)}
          onCheckStatus={checkStatus}
          onDelete={() => setShowDeleteModal(true)}
        />
      )}

      {/* DNS propagation hint */}
      {hasDomain && !isActive && (
        <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            DNS propagasi bisa memakan waktu <span className="font-medium text-foreground">10 menit – 48 jam</span>.
            Klik <span className="font-medium text-foreground">Cek Status</span> setelah DNS dipasang di registrar Anda.
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ADD DOMAIN
          ══════════════════════════════════════════════════════════════ */}
      <Dialog
        open={showAddModal}
        onOpenChange={(open) => {
          setShowAddModal(open);
          if (!open) { setInputDomain(''); setInputError(null); }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Add Custom Domain</DialogTitle>
            <DialogDescription className="text-sm">
              Masukkan domain yang sudah Anda miliki dari registrar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                Domain
              </p>
              <Input
                placeholder="tokoku.com"
                value={inputDomain}
                onChange={(e) => { setInputDomain(e.target.value); setInputError(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                disabled={isLoading}
                autoFocus
                className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/40"
              />
              {inputError && (
                <p className="text-xs text-destructive">{inputError}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Contoh:</span>
              <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">tokoku.com</code>
              <span>atau</span>
              <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">shop.tokoku.com</code>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              disabled={isLoading}
              className="h-9 text-sm"
            >
              Batal
            </Button>
            <Button
              onClick={handleAddDomain}
              disabled={isLoading || !inputDomain.trim()}
              className="h-9 text-sm gap-1.5"
            >
              {isLoading
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Menyimpan...</>
                : <>Add Domain<ArrowRight className="h-3.5 w-3.5" /></>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: DNS RECORDS
          ══════════════════════════════════════════════════════════════ */}
      <Dialog open={showDnsModal} onOpenChange={setShowDnsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Configure DNS Records</DialogTitle>
            <DialogDescription className="text-sm">
              Tambahkan records berikut di panel registrar domain Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">

            {/* Domain type hint */}
            <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isSubdomainDomain
                  ? <>Subdomain terdeteksi — cukup tambah <span className="font-medium text-foreground">1 CNAME record</span> saja.</>
                  : <>Root domain terdeteksi — tambah <span className="font-medium text-foreground">A record</span> dan <span className="font-medium text-foreground">CNAME www</span>.</>
                }
              </p>
            </div>

            {/* Target domain */}
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Records untuk{' '}
              <span className="normal-case font-semibold text-foreground tracking-normal">{domain}</span>
            </p>

            {/* Records table */}
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b">
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-widest uppercase text-muted-foreground w-20">Type</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-widest uppercase text-muted-foreground w-20">Name</th>
                    <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-widest uppercase text-muted-foreground">Value</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dnsRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        Tidak ada records. Coba hapus dan daftarkan ulang domain.
                      </td>
                    </tr>
                  ) : (
                    dnsRecords.map((record, i) => (
                      <tr key={i} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 text-[11px] font-bold font-mono tracking-wide border rounded bg-muted/30">
                            {record.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs font-semibold">{record.name}</code>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs text-muted-foreground break-all leading-relaxed">
                            {record.value}
                          </code>
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => copyToClipboard(record.value, `${i}`)}
                            className="p-1.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy value"
                          >
                            {copied === `${i}`
                              ? <CheckCheck className="h-3.5 w-3.5 text-primary" />
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
            <div className="space-y-1.5">
              {[
                'Login ke panel domain (Niagahoster, GoDaddy, Cloudflare, dll)',
                <>Cari menu <span className="font-medium text-foreground">DNS Management</span></>,
                'Tambahkan records di atas, lalu simpan perubahan',
                <>Kembali ke sini dan klik <span className="font-medium text-foreground">Cek Status</span></>,
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-muted text-[11px] font-bold flex items-center justify-center shrink-0 text-muted-foreground mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground leading-5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
              <a
                href="https://www.youtube.com/results?search_query=cara+setting+dns+record+custom+domain"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />Dokumentasi
              </a>
            </Button>
            <Button size="sm" onClick={() => setShowDnsModal(false)} className="h-8 text-xs">
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: CONFIRM DELETE
          ══════════════════════════════════════════════════════════════ */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">Hapus Domain?</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Domain <span className="font-semibold text-foreground">{domain}</span> akan dilepas.
              Toko akan kembali ke subdomain default.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
              className="h-9 text-sm"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="h-9 text-sm gap-1.5"
            >
              {isLoading
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Menghapus...</>
                : <><Trash2 className="h-3.5 w-3.5" />Hapus Domain</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// ==========================================
// DOMAIN ROW
// ==========================================

interface DomainRowProps {
  domain: string;
  isActive: boolean;
  isVerified: boolean;
  sslStatus: string | null;
  isChecking: boolean;
  isLoading: boolean;
  onShowDns: () => void;
  onCheckStatus: () => Promise<void>;
  onDelete: () => void;
}

function DomainRow({
  domain,
  isActive,
  isVerified,
  sslStatus,
  isChecking,
  isLoading,
  onShowDns,
  onCheckStatus,
  onDelete,
}: DomainRowProps) {

  // ─── Status config ────────────────────────────────────────────────────
  const status = isActive
    ? { color: 'text-primary', dot: 'bg-primary', label: 'Aktif' }
    : isVerified
      ? { color: 'text-amber-500', dot: 'bg-amber-400', label: 'Menunggu SSL' }
      : { color: 'text-muted-foreground', dot: 'bg-muted-foreground/50', label: 'Menunggu DNS' };

  return (
    <div className="rounded-lg border overflow-hidden">

      {/* Main row */}
      <div className="flex items-center justify-between px-5 py-4 group hover:bg-muted/10 transition-colors">

        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">

          {/* Status dot */}
          <div className="relative shrink-0">
            <span className={cn('w-2 h-2 rounded-full block', status.dot)} />
            {isActive && (
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
            )}
          </div>

          {/* Domain + status */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm font-semibold tracking-tight">{domain}</span>
              <span className={cn('text-[11px] font-medium', status.color)}>
                {status.label}
              </span>
              {isActive && sslStatus === 'active' && (
                <span className="flex items-center gap-1 text-[11px] text-primary/70">
                  <Shield className="h-3 w-3" />HTTPS
                </span>
              )}
            </div>

            {/* Action links row */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {!isActive && (
                <>
                  <button
                    onClick={onShowDns}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Show DNS Records
                  </button>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <button
                    onClick={onCheckStatus}
                    disabled={isChecking}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {isChecking
                      ? <><Loader2 className="h-3 w-3 animate-spin" />Checking...</>
                      : 'Cek Status'
                    }
                  </button>
                </>
              )}
              {isActive && (
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Buka Toko
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
          {!isActive && (
            <button
              onClick={onShowDns}
              className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Show DNS Records"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
            title="Hapus Domain"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom info strip — DNS pending */}
      {!isActive && (
        <div className="border-t bg-muted/20 px-5 py-2.5 flex items-center gap-2">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <p className="text-[11px] text-muted-foreground">
            {isVerified
              ? 'DNS terverifikasi — SSL sedang diterbitkan, tunggu beberapa menit'
              : 'Pasang DNS records di registrar Anda, lalu klik Cek Status'
            }
          </p>
        </div>
      )}
    </div>
  );
}