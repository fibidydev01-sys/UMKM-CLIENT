'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PengirimanFormData } from '@/types';

interface StepBiayaProps {
  formData: PengirimanFormData;
  onFreeShippingChange: (value: string) => void;
  onDefaultCostChange: (value: string) => void;
  isDesktop?: boolean;
}

const formatRp = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// ─── Live checkout simulator ───────────────────────────────────────────────
function CheckoutSimulator({
  threshold,
  defaultCost,
}: {
  threshold: number | null;
  defaultCost: number;
}) {
  const scenarios = [50_000, 100_000, 200_000, 500_000];
  return (
    <div className="rounded-lg bg-muted/20 border px-4 py-3 space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
        Simulasi Checkout
      </p>
      {scenarios.map((total) => {
        const isFree = threshold !== null && threshold > 0 && total >= threshold;
        const cost = isFree ? 0 : defaultCost;
        return (
          <div key={total} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Belanja {formatRp(total)}</span>
            <span className={cn(
              'font-semibold flex items-center gap-1',
              isFree ? 'text-primary' : 'text-foreground'
            )}>
              {isFree
                ? <><PackageCheck className="h-3 w-3" /> Gratis Ongkir</>
                : `+ ${formatRp(cost)}`
              }
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function StepBiaya({ formData, onFreeShippingChange, onDefaultCostChange, isDesktop = false }: StepBiayaProps) {

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_280px] gap-10 items-start">

        {/* Left — fields */}
        <div className="space-y-6 max-w-lg">

          {/* Gratis ongkir */}
          <div className="space-y-2">
            <Label htmlFor="free-ship-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Batas Gratis Ongkir (Rp)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium shrink-0">Rp</span>
              <Input
                id="free-ship-d"
                type="number"
                min="0"
                step="1000"
                placeholder="100000"
                value={formData.freeShippingThreshold || ''}
                onChange={(e) => onFreeShippingChange(e.target.value)}
                className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Formatted display */}
            {formData.freeShippingThreshold && formData.freeShippingThreshold > 0 && (
              <p className="text-xs text-primary font-medium">
                = {formatRp(formData.freeShippingThreshold)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Pesanan di atas nilai ini gratis ongkir —{' '}
              <span className="font-medium text-foreground">kosongkan jika tidak ada</span>
            </p>
          </div>

          {/* Ongkir default */}
          <div className="space-y-2">
            <Label htmlFor="default-cost-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              Ongkos Kirim Default (Rp)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium shrink-0">Rp</span>
              <Input
                id="default-cost-d"
                type="number"
                min="0"
                step="1000"
                placeholder="15000"
                value={formData.defaultShippingCost || ''}
                onChange={(e) => onDefaultCostChange(e.target.value)}
                className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>
            {formData.defaultShippingCost > 0 && (
              <p className="text-xs text-muted-foreground font-medium">
                = {formatRp(formData.defaultShippingCost)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Ongkir untuk pesanan di bawah batas gratis ongkir
            </p>
          </div>

          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Tips:</span>{' '}
              Gratis ongkir di Rp 100.000–200.000 efektif meningkatkan average order value. Atur ongkir default sesuai biaya kurir rata-rata kamu.
            </p>
          </div>
        </div>

        {/* Right — live simulator */}
        <div className="space-y-2 sticky top-0">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Simulasi
          </p>
          <CheckoutSimulator
            threshold={formData.freeShippingThreshold}
            defaultCost={formData.defaultShippingCost}
          />
          <p className="text-[11px] text-muted-foreground text-center">
            Update otomatis sesuai input
          </p>
        </div>

      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-5">

          {/* Gratis ongkir */}
          <div className="space-y-2">
            <Label htmlFor="free-ship-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Batas Gratis Ongkir (Rp)
            </Label>
            <Input
              id="free-ship-m"
              type="number"
              min="0"
              step="1000"
              placeholder="100000"
              value={formData.freeShippingThreshold || ''}
              onChange={(e) => onFreeShippingChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            {formData.freeShippingThreshold && formData.freeShippingThreshold > 0 && (
              <p className="text-xs text-primary font-medium text-center">
                {formatRp(formData.freeShippingThreshold)}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground text-center">
              Kosongkan jika tidak ada gratis ongkir
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Ongkir default */}
          <div className="space-y-2">
            <Label htmlFor="default-cost-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Ongkos Kirim Default (Rp)
            </Label>
            <Input
              id="default-cost-m"
              type="number"
              min="0"
              step="1000"
              placeholder="15000"
              value={formData.defaultShippingCost || ''}
              onChange={(e) => onDefaultCostChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            {formData.defaultShippingCost > 0 && (
              <p className="text-xs text-muted-foreground text-center font-medium">
                {formatRp(formData.defaultShippingCost)}
              </p>
            )}
          </div>

          <div className="w-full border-t" />

          {/* Mini simulator */}
          <CheckoutSimulator
            threshold={formData.freeShippingThreshold}
            defaultCost={formData.defaultShippingCost}
          />

        </CardContent>
      </Card>
    </div>
  );
}