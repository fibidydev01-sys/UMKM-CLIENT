'use client';

import { Building2, Wallet, Banknote, Coins, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewModal } from '@/components/settings/preview-modal';
import { getAseanCurrencyMeta } from '@/types';
import type { PembayaranFormData } from '@/types';

// ─── E-wallet color accents ────────────────────────────────────────────────
const PROVIDER_COLORS: Record<string, string> = {
  // Indonesia
  GoPay: 'text-emerald-600',
  OVO: 'text-purple-600',
  DANA: 'text-blue-600',
  ShopeePay: 'text-orange-600',
  'ShopeePay MY': 'text-orange-600',
  'ShopeePay TH': 'text-orange-600',
  'ShopeePay PH': 'text-orange-600',
  'ShopeePay VN': 'text-orange-600',
  LinkAja: 'text-red-600',
  QRIS: 'text-gray-700',
  // Malaysia
  'Touch n Go': 'text-blue-700',
  'GrabPay MY': 'text-green-500',
  Boost: 'text-red-500',
  MAE: 'text-yellow-600',
  // Singapore
  PayNow: 'text-red-500',
  'GrabPay SG': 'text-green-500',
  'DBS PayLah': 'text-red-600',
  NETS: 'text-blue-800',
  // Thailand
  TrueMoney: 'text-yellow-600',
  PromptPay: 'text-blue-600',
  'Rabbit LINE Pay': 'text-green-600',
  // Philippines
  GCash: 'text-blue-500',
  Maya: 'text-green-600',
  'GrabPay PH': 'text-green-500',
  // Vietnam
  MoMo: 'text-pink-600',
  ZaloPay: 'text-blue-500',
  VNPay: 'text-red-600',
  // Brunei
  'Progresif Pay': 'text-purple-500',
  // Regional
  GrabPay: 'text-green-500',
  'Apple Pay': 'text-foreground',
  'Google Pay': 'text-blue-500',
  PayPal: 'text-blue-700',
  Alipay: 'text-blue-600',
  'WeChat Pay': 'text-green-600',
  Other: 'text-muted-foreground',
};

// ─── Section Header ────────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  count,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/8 shrink-0">
          <Icon className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-foreground/80">
          {title}
        </span>
      </div>
      {count !== undefined && (
        <span className={cn(
          'text-[10px] font-semibold tabular-nums px-2 py-0.5 rounded-full',
          count > 0
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        )}>
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      'rounded-xl border border-border/60 bg-card overflow-hidden',
      className
    )}>
      <div className="px-4 pt-4 pb-3">
        {children}
      </div>
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
function EmptyRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
      <p className="text-xs text-muted-foreground/60 italic">{label}</p>
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────
function StatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0',
      enabled
        ? 'bg-emerald-500/10 text-emerald-600'
        : 'bg-muted text-muted-foreground/50'
    )}>
      {enabled
        ? <CheckCircle2 className="w-2.5 h-2.5" />
        : <XCircle className="w-2.5 h-2.5" />
      }
      {enabled ? 'on' : 'off'}
    </span>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────
function RowDivider() {
  return <div className="border-t border-border/40 my-2" />;
}

// ─── Props ────────────────────────────────────────────────────────────────
interface PaymentPreviewProps {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  formData: PembayaranFormData;
}

// ─── Component ────────────────────────────────────────────────────────────
export function PaymentPreview({
  open,
  onClose,
  onSave,
  isSaving,
  formData,
}: PaymentPreviewProps) {
  // ✅ Pakai getAseanCurrencyMeta — ada fallback kalau currency tidak dikenal
  const currency = getAseanCurrencyMeta(formData.currency);
  const { bankAccounts, eWallets, cod } = formData.paymentMethods;
  const enabledBanks = bankAccounts.filter((b) => b.enabled).length;
  const enabledWallets = eWallets.filter((e) => e.enabled).length;

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
      title="Payment Settings Preview"
    >
      <div className="space-y-3 mt-5">

        {/* ── Summary strip ──────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-1">
          {[
            { label: 'Currency', value: currency.code },
            { label: 'Tax', value: formData.taxRate > 0 ? `${formData.taxRate}%` : '—' },
            { label: 'Banks', value: `${enabledBanks}/${bankAccounts.length}` },
            { label: 'Wallets', value: `${enabledWallets}/${eWallets.length}` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg bg-muted/40 border border-border/50 px-3 py-2.5 text-center"
            >
              <p className="text-[10px] text-muted-foreground mb-0.5 tracking-wide">{label}</p>
              <p className="text-sm font-bold tabular-nums tracking-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Currency & Tax ─────────────────────────────────────── */}
        <SectionCard>
          <SectionHeader icon={Coins} title="Currency & Tax" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none">{currency.flag}</span>
              <div>
                <p className="text-sm font-semibold leading-tight">{currency.code}</p>
                <p className="text-xs text-muted-foreground leading-tight">{currency.name}</p>
              </div>
            </div>
            {formData.taxRate > 0 ? (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tax</p>
                <p className="text-sm font-bold text-primary">{formData.taxRate}%</p>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground/50 italic">No tax</span>
            )}
          </div>
        </SectionCard>

        {/* ── Bank Accounts ──────────────────────────────────────── */}
        <SectionCard>
          <SectionHeader icon={Building2} title="Bank Accounts" count={bankAccounts.length} />
          {bankAccounts.length === 0 ? (
            <EmptyRow label="No bank accounts added" />
          ) : (
            <div className="space-y-0">
              {bankAccounts.map((bank, i) => (
                <div key={bank.id}>
                  {i > 0 && <RowDivider />}
                  <div className="flex items-center gap-2.5 py-0.5">
                    <StatusBadge enabled={bank.enabled} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-sm font-semibold shrink-0" title={bank.bank}>
                          {bank.bank}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {bank.accountNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{bank.accountName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── E-Wallets ──────────────────────────────────────────── */}
        <SectionCard>
          <SectionHeader icon={Wallet} title="E-Wallets" count={eWallets.length} />
          {eWallets.length === 0 ? (
            <EmptyRow label="No e-wallets added" />
          ) : (
            <div className="space-y-0">
              {eWallets.map((ew, i) => (
                <div key={ew.id}>
                  {i > 0 && <RowDivider />}
                  <div className="flex items-center gap-2.5 py-0.5">
                    <StatusBadge enabled={ew.enabled} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className={cn(
                          'text-sm font-semibold shrink-0',
                          PROVIDER_COLORS[ew.provider] ?? 'text-foreground'
                        )}>
                          {ew.provider}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono truncate">
                          {ew.number}
                        </span>
                      </div>
                      {ew.name && (
                        <p className="text-[11px] text-muted-foreground truncate">{ew.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Cash on Delivery ───────────────────────────────────── */}
        <SectionCard>
          <SectionHeader icon={Banknote} title="Cash on Delivery" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {cod.enabled && cod.note ? (
                <p className="text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{cod.note}&rdquo;
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/50 italic">
                  {cod.enabled ? 'No note set' : 'Not available at checkout'}
                </p>
              )}
            </div>
            <StatusBadge enabled={cod.enabled} />
          </div>
        </SectionCard>

      </div>
    </PreviewModal>
  );
}