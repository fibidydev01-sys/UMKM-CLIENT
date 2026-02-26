'use client';

import { Wallet, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { EWallet, PembayaranFormData } from '@/types';

interface StepEwalletProps {
  formData: PembayaranFormData;
  onAdd: () => void;
  onEdit: (ewallet: EWallet) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isDesktop?: boolean;
}

// ─── Provider color accents — full list ───────────────────────────────────
const PROVIDER_COLORS: Record<string, string> = {
  // Indonesia
  GoPay: 'text-emerald-600',
  OVO: 'text-purple-600',
  DANA: 'text-blue-600',
  ShopeePay: 'text-orange-600',
  LinkAja: 'text-red-600',
  QRIS: 'text-gray-700',
  // Malaysia
  'Touch n Go': 'text-blue-700',
  'GrabPay MY': 'text-green-500',
  Boost: 'text-red-500',
  MAE: 'text-yellow-600',
  'ShopeePay MY': 'text-orange-600',
  // Singapore
  PayNow: 'text-red-500',
  'GrabPay SG': 'text-green-500',
  'DBS PayLah': 'text-red-600',
  NETS: 'text-blue-800',
  // Thailand
  TrueMoney: 'text-yellow-600',
  PromptPay: 'text-blue-600',
  'Rabbit LINE Pay': 'text-green-600',
  'ShopeePay TH': 'text-orange-600',
  // Philippines
  GCash: 'text-blue-500',
  Maya: 'text-green-600',
  'GrabPay PH': 'text-green-500',
  'ShopeePay PH': 'text-orange-600',
  // Vietnam
  MoMo: 'text-pink-600',
  ZaloPay: 'text-blue-500',
  VNPay: 'text-red-600',
  'ShopeePay VN': 'text-orange-600',
  // Regional / Global
  GrabPay: 'text-green-500',
  'Apple Pay': 'text-foreground',
  'Google Pay': 'text-blue-500',
  PayPal: 'text-blue-700',
  Alipay: 'text-blue-600',
  'WeChat Pay': 'text-green-600',
  // Fallback
  Other: 'text-muted-foreground',
};

// ─── Shared ewallet card ──────────────────────────────────────────────────
function EwalletCard({
  ewallet,
  onEdit,
  onDelete,
  onToggle,
  compact = false,
}: {
  ewallet: EWallet;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  compact?: boolean;
}) {
  const providerColor = PROVIDER_COLORS[ewallet.provider] ?? 'text-muted-foreground';
  return (
    <div className={cn(
      'flex items-center justify-between rounded-lg border transition-colors',
      compact ? 'px-4 py-3' : 'px-5 py-4',
      ewallet.enabled ? 'bg-background' : 'bg-muted/30 opacity-60'
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <Switch
          checked={ewallet.enabled}
          onCheckedChange={onToggle}
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className={cn(
            'font-semibold tracking-tight truncate',
            compact ? 'text-sm' : 'text-base',
            providerColor
          )}>
            {ewallet.provider}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {ewallet.number}
            {ewallet.name && (
              <><span className="font-sans mx-1">·</span>{ewallet.name}</>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0 ml-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function StepEwallet({
  formData,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  isDesktop = false,
}: StepEwalletProps) {
  const ewallets = formData.paymentMethods.eWallets;
  const isEmpty = ewallets.length === 0;
  const enabled = ewallets.filter((e) => e.enabled).length;

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-5 max-w-xl">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              E-Wallets
            </p>
            {!isEmpty && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary tabular-nums">
                {enabled} active / {ewallets.length}
              </span>
            )}
          </div>
          <Button size="sm" onClick={onAdd} className="gap-1.5 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />Add E-Wallet
          </Button>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div
            onClick={onAdd}
            className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-colors group"
          >
            <Wallet className="h-10 w-10 mb-3 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              No e-wallets yet
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click to add an e-wallet
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {ewallets.map((ew) => (
              <EwalletCard
                key={ew.id}
                ewallet={ew}
                onEdit={() => onEdit(ew)}
                onDelete={() => onDelete(ew.id)}
                onToggle={() => onToggle(ew.id)}
              />
            ))}
          </div>
        )}

        {!isEmpty && (
          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground">
              Toggle to enable or disable a wallet without deleting it
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4">
      <Button size="sm" onClick={onAdd} className="gap-1.5 h-8 text-xs">
        <Plus className="h-3.5 w-3.5" />Add E-Wallet
      </Button>

      {isEmpty ? (
        <div className="text-center py-10 text-muted-foreground w-full max-w-sm border-2 border-dashed rounded-lg">
          <Wallet className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No e-wallets yet</p>
          <p className="text-xs mt-1">Add one to accept digital payments</p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-2.5">
          {ewallets.map((ew) => (
            <EwalletCard
              key={ew.id}
              ewallet={ew}
              onEdit={() => onEdit(ew)}
              onDelete={() => onDelete(ew.id)}
              onToggle={() => onToggle(ew.id)}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}