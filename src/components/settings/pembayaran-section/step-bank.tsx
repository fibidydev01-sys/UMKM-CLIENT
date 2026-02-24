'use client';

import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { BankAccount, PembayaranFormData } from '@/types';

interface StepBankProps {
  formData: PembayaranFormData;
  onAdd: () => void;
  onEdit: (bank: BankAccount) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isDesktop?: boolean;
}

// ─── Shared bank card ─────────────────────────────────────────────────────
function BankCard({
  bank,
  onEdit,
  onDelete,
  onToggle,
  compact = false,
}: {
  bank: BankAccount;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-lg border transition-colors',
      compact ? 'px-4 py-3' : 'px-5 py-4',
      bank.enabled ? 'bg-background' : 'bg-muted/30 opacity-60'
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <Switch
          checked={bank.enabled}
          onCheckedChange={onToggle}
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className={cn('font-semibold tracking-tight truncate', compact ? 'text-sm' : 'text-base')}>
            {bank.bank}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate">
            {bank.accountNumber}
            <span className="font-sans mx-1">·</span>
            {bank.accountName}
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

export function StepBank({ formData, onAdd, onEdit, onDelete, onToggle, isDesktop = false }: StepBankProps) {
  const banks = formData.paymentMethods.bankAccounts;
  const isEmpty = banks.length === 0;
  const enabled = banks.filter((b) => b.enabled).length;

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-5 max-w-xl">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Rekening Bank
            </p>
            {!isEmpty && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary tabular-nums">
                {enabled} aktif / {banks.length}
              </span>
            )}
          </div>
          <Button size="sm" onClick={onAdd} className="gap-1.5 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />Tambah Bank
          </Button>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div
            onClick={onAdd}
            className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-colors group"
          >
            <Building2 className="h-10 w-10 mb-3 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Belum ada rekening bank
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Klik untuk menambahkan rekening
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {banks.map((bank) => (
              <BankCard
                key={bank.id}
                bank={bank}
                onEdit={() => onEdit(bank)}
                onDelete={() => onDelete(bank.id)}
                onToggle={() => onToggle(bank.id)}
              />
            ))}
          </div>
        )}

        {!isEmpty && (
          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground">
              Toggle untuk mengaktifkan/nonaktifkan rekening tanpa menghapusnya
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
        <Plus className="h-3.5 w-3.5" />Tambah Bank
      </Button>

      {isEmpty ? (
        <div className="text-center py-10 text-muted-foreground w-full max-w-sm border-2 border-dashed rounded-lg">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Belum ada rekening bank</p>
          <p className="text-xs mt-1">Tambahkan untuk menerima transfer</p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-2.5">
          {banks.map((bank) => (
            <BankCard
              key={bank.id}
              bank={bank}
              onEdit={() => onEdit(bank)}
              onDelete={() => onDelete(bank.id)}
              onToggle={() => onToggle(bank.id)}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}