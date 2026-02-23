'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Trash2, CheckCircle2, RefreshCw, Clock } from 'lucide-react';
import { DnsInstructions } from './dns-instructions';
import type { DnsInstructions as DnsInstructionsType, DnsStatusResponse } from '@/types';

// ==========================================
// ONGOING DNS SETUP — localStorage helper
// Supaya banner muncul saat user kembali ke halaman
// ==========================================

const DNS_SETUP_KEY = 'fibidy_dns_setup';

export function saveOngoingDnsSetup(domain: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DNS_SETUP_KEY, JSON.stringify({
    domain,
    startedAt: new Date().toISOString(),
  }));
}

export function clearOngoingDnsSetup() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DNS_SETUP_KEY);
}

export function getOngoingDnsSetup(): { domain: string; startedAt: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DNS_SETUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ==========================================
// DNS RECORD STATUS BADGE
// ==========================================

type DnsRecordStatus = 'pending' | 'checking' | 'verified' | 'failed';

function StatusBadge({ status }: { status: DnsRecordStatus }) {
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

interface DnsSetupModalProps {
  isOpen: boolean;
  domain: string;
  instructions: DnsInstructionsType;
  dnsStatus: DnsStatusResponse;

  // ✅ PISAH: onClose = tutup modal saja (polling tetap jalan)
  onClose: () => void;

  // ✅ PISAH: onCancel = hapus domain (keluar dari flow)
  onCancel: () => Promise<void>;
}

// ==========================================
// COMPONENT
// ==========================================

export function DnsSetupModal({
  isOpen,
  domain,
  instructions,
  dnsStatus,
  onClose,
  onCancel,
}: DnsSetupModalProps) {

  // Simpan ke localStorage saat modal pertama kali muncul
  useEffect(() => {
    if (isOpen && domain) {
      saveOngoingDnsSetup(domain);
    }
  }, [isOpen, domain]);

  // Bersihkan localStorage saat DNS terverifikasi
  useEffect(() => {
    if (dnsStatus.allVerified) {
      clearOngoingDnsSetup();
    }
  }, [dnsStatus.allVerified]);

  // Hitung berapa record yang sudah verified
  const verifiedCount = [dnsStatus.cname, dnsStatus.cnameWWW, dnsStatus.txt]
    .filter((s) => s === 'verified').length;

  return (
    <Dialog
      open={isOpen}
      // ✅ Kalau user klik backdrop/ESC → close modal, BUKAN hapus domain
      onOpenChange={(open) => { if (!open) onClose(); }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ===== HEADER ===== */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-lg">
                {dnsStatus.allVerified ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                )}
                Setup DNS — {domain}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Propagasi DNS memerlukan 10–30 menit
              </DialogDescription>
            </div>

            {/* Progress Badge */}
            <Badge
              variant={dnsStatus.allVerified ? 'default' : 'secondary'}
              className="shrink-0"
            >
              {verifiedCount}/3 Verified
            </Badge>
          </div>
        </DialogHeader>

        {/* ===== BODY ===== */}
        <div className="mt-2">
          {/* Auto-polling status */}
          {!dnsStatus.allVerified && (
            <Alert className="mb-4">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription className="flex items-center justify-between">
                <span>🔄 Auto-cek DNS setiap 10 detik...</span>
                {dnsStatus.lastChecked && (
                  <span className="text-xs text-muted-foreground">
                    Terakhir: {new Date(dnsStatus.lastChecked).toLocaleTimeString('id-ID')}
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* DNS Records status ringkas di atas */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'CNAME Root', status: dnsStatus.cname },
              { label: 'CNAME WWW', status: dnsStatus.cnameWWW },
              { label: 'TXT Verify', status: dnsStatus.txt },
            ].map(({ label, status }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg text-center"
              >
                <span className="text-xs text-muted-foreground">{label}</span>
                <StatusBadge status={status as DnsRecordStatus} />
              </div>
            ))}
          </div>

          {/* DNS Instructions detail */}
          <DnsInstructions
            instructions={instructions}
            dnsStatus={dnsStatus}
            onCancel={onCancel}
            isInsideModal={true}
          />
        </div>

        {/* ===== FOOTER ===== */}
        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          {/* Info teks */}
          <p className="text-xs text-muted-foreground flex-1 self-center">
            💡 Tutup modal — polling tetap berjalan di background
          </p>

          <div className="flex gap-2">
            {/* ✅ Hapus Domain — keluar dari flow sepenuhnya */}
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Domain
            </Button>

            {/* ✅ Tutup — hanya menutup modal, polling tetap jalan */}
            <Button
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              Tutup
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}