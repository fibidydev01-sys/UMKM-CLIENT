'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Courier, PengirimanFormData } from '@/types';

interface StepKurirProps {
  formData: PengirimanFormData;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
  isDesktop?: boolean;
}

// ─── Single courier row ────────────────────────────────────────────────────
function CourierRow({
  courier,
  onToggle,
  onNoteChange,
  compact = false,
}: {
  courier: Courier;
  onToggle: () => void;
  onNoteChange: (note: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      'rounded-lg border transition-all duration-200',
      courier.enabled ? 'bg-background border-border' : 'bg-muted/20 border-border/50 opacity-60',
      compact ? 'px-3 py-2.5' : 'px-4 py-3'
    )}>
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Switch
            checked={courier.enabled}
            onCheckedChange={onToggle}
            className="shrink-0"
          />
          <span className={cn(
            'font-medium tracking-tight truncate',
            compact ? 'text-sm' : 'text-[13px]',
            courier.enabled ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {courier.name}
          </span>
        </div>
        {courier.enabled && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            Aktif
          </span>
        )}
      </div>

      {/* Note field — only when enabled */}
      {courier.enabled && (
        <div className={cn('mt-2', compact ? 'ml-9' : 'ml-10')}>
          <Input
            placeholder="Catatan opsional (REG, YES, OKE...)"
            value={courier.note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            className="h-8 text-xs placeholder:text-muted-foreground/40 border-dashed"
          />
        </div>
      )}
    </div>
  );
}

export function StepKurir({ formData, onToggle, onNoteChange, isDesktop = false }: StepKurirProps) {
  const couriers = formData.shippingMethods.couriers;
  const activeCount = couriers.filter((c) => c.enabled).length;

  // ── DESKTOP: 2-col grid ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Kurir Tersedia
          </p>
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
            activeCount > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          )}>
            {activeCount} aktif / {couriers.length}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {couriers.map((courier) => (
            <CourierRow
              key={courier.id}
              courier={courier}
              onToggle={() => onToggle(courier.id)}
              onNoteChange={(note) => onNoteChange(courier.id, note)}
            />
          ))}
        </div>

        <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tips:</span>{' '}
            Aktifkan kurir yang kamu benar-benar gunakan — kurir aktif ditampilkan saat pelanggan checkout. Catatan opsional untuk menjelaskan layanan (REG, YES, OKE, dll).
          </p>
        </div>
      </div>
    );
  }

  // ── MOBILE: vertical list ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-3">

      {/* Counter */}
      <div className="flex items-center gap-2 self-center">
        <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          Kurir
        </p>
        <span className={cn(
          'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
          activeCount > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          {activeCount}/{couriers.length} aktif
        </span>
      </div>

      <div className="w-full max-w-sm space-y-2">
        {couriers.map((courier) => (
          <CourierRow
            key={courier.id}
            courier={courier}
            onToggle={() => onToggle(courier.id)}
            onNoteChange={(note) => onNoteChange(courier.id, note)}
            compact
          />
        ))}
      </div>
    </div>
  );
}