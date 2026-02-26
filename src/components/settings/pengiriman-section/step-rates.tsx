'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatShippingCost } from './format-currency';
import { ASEAN_SIMULATION_PRICES } from '@/types';
import type { PengirimanFormData } from '@/types';

interface StepRatesProps {
  formData: PengirimanFormData;
  onFreeShippingChange: (value: string) => void;
  onDefaultCostChange: (value: string) => void;
  isDesktop?: boolean;
}

// ─── Simulation amounts — dari ASEAN_SIMULATION_PRICES (types/asean-currency.ts) ──
// Extend dengan 4 scenario (shipping needs more granularity than tax)
const SIMULATION_AMOUNTS: Record<string, number[]> = {
  IDR: [50_000, 100_000, 200_000, 500_000],
  VND: [100_000, 250_000, 500_000, 1_000_000],
  MYR: [15, 30, 60, 150],
  SGD: [10, 25, 50, 100],
  THB: [50, 150, 300, 600],
  PHP: [100, 300, 600, 1_200],
  BND: [10, 25, 50, 100],
  USD: [10, 25, 50, 100],
};
const DEFAULT_AMOUNTS = [10, 25, 50, 100];

function getSimulationAmounts(currency: string): number[] {
  return SIMULATION_AMOUNTS[currency] ?? DEFAULT_AMOUNTS;
}

// ─── Placeholder & step per ASEAN currency ────────────────────────────────
const THRESHOLD_PLACEHOLDER: Record<string, string> = {
  IDR: '100000',
  VND: '200000',
  MYR: '50',
  SGD: '30',
  THB: '200',
  PHP: '500',
  BND: '30',
  USD: '25',
};

const FLATRATE_PLACEHOLDER: Record<string, string> = {
  IDR: '15000',
  VND: '30000',
  MYR: '8',
  SGD: '4',
  THB: '30',
  PHP: '80',
  BND: '4',
  USD: '5',
};

// ─── Checkout Simulator ────────────────────────────────────────────────────
function CheckoutSimulator({
  threshold,
  defaultCost,
  currency,
}: {
  threshold: number | null;
  defaultCost: number;
  currency: string;
}) {
  const fmt = (v: number) => formatShippingCost(v, currency);
  const scenarios = getSimulationAmounts(currency);

  return (
    <div className="rounded-lg bg-muted/20 border px-4 py-3 space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">
        Checkout Simulation
      </p>
      {scenarios.map((total) => {
        const isFree = threshold !== null && threshold > 0 && total >= threshold;
        const cost = isFree ? 0 : defaultCost;
        return (
          <div key={total} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Order of {formatShippingCost(total, currency)}
            </span>
            <span className={cn(
              'font-semibold flex items-center gap-1',
              isFree ? 'text-primary' : 'text-foreground'
            )}>
              {isFree
                ? <><PackageCheck className="h-3 w-3" /> Free Shipping</>
                : `+ ${fmt(cost)}`
              }
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function StepRates({
  formData,
  onFreeShippingChange,
  onDefaultCostChange,
  isDesktop = false,
}: StepRatesProps) {
  const { currency } = formData;
  const fmt = (v: number) => formatShippingCost(v, currency);

  // Zero-decimal currencies: step 1000, else 0.5
  const isZeroDecimal = ['IDR', 'VND'].includes(currency);
  const step = isZeroDecimal ? '1000' : '0.5';

  const thresholdPlaceholder = THRESHOLD_PLACEHOLDER[currency] ?? '50';
  const flatratePlaceholder = FLATRATE_PLACEHOLDER[currency] ?? '5';

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-[1fr_280px] gap-10 items-start">

        {/* Left — fields */}
        <div className="space-y-6 max-w-lg">

          {/* Free Shipping Threshold */}
          <div className="space-y-2">
            <Label
              htmlFor="free-ship-d"
              className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground"
            >
              Free Shipping Threshold ({currency})
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium shrink-0">
                {currency}
              </span>
              <Input
                id="free-ship-d"
                type="number"
                min="0"
                step={step}
                placeholder={thresholdPlaceholder}
                value={formData.freeShippingThreshold || ''}
                onChange={(e) => onFreeShippingChange(e.target.value)}
                className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>
            {formData.freeShippingThreshold && formData.freeShippingThreshold > 0 && (
              <p className="text-xs text-primary font-medium">
                = {fmt(formData.freeShippingThreshold)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Orders above this amount qualify for free shipping —{' '}
              <span className="font-medium text-foreground">leave empty to disable</span>
            </p>
          </div>

          {/* Flat Rate */}
          <div className="space-y-2">
            <Label
              htmlFor="default-cost-d"
              className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground"
            >
              Flat Rate ({currency})
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium shrink-0">
                {currency}
              </span>
              <Input
                id="default-cost-d"
                type="number"
                min="0"
                step={step}
                placeholder={flatratePlaceholder}
                value={formData.defaultShippingCost || ''}
                onChange={(e) => onDefaultCostChange(e.target.value)}
                className="h-11 text-base font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground/50"
              />
            </div>
            {formData.defaultShippingCost > 0 && (
              <p className="text-xs text-muted-foreground font-medium">
                = {fmt(formData.defaultShippingCost)}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Shipping cost for orders below the free shipping threshold
            </p>
          </div>

          <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Tip:</span>{' '}
              A free shipping threshold encourages higher order values. Set the flat rate to match
              your average carrier cost.
            </p>
          </div>
        </div>

        {/* Right — live simulator */}
        <div className="space-y-2 sticky top-0">
          <p className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground">
            Live Preview
          </p>
          <CheckoutSimulator
            threshold={formData.freeShippingThreshold}
            defaultCost={formData.defaultShippingCost}
            currency={currency}
          />
          <p className="text-[11px] text-muted-foreground text-center">
            Updates live as you type
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

          {/* Free Shipping Threshold */}
          <div className="space-y-2">
            <Label
              htmlFor="free-ship-m"
              className="block text-center text-[11px] font-medium tracking-widests uppercase text-muted-foreground"
            >
              Free Shipping Threshold ({currency})
            </Label>
            <Input
              id="free-ship-m"
              type="number"
              min="0"
              step={step}
              placeholder={thresholdPlaceholder}
              value={formData.freeShippingThreshold || ''}
              onChange={(e) => onFreeShippingChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            {formData.freeShippingThreshold && formData.freeShippingThreshold > 0 && (
              <p className="text-xs text-primary font-medium text-center">
                {fmt(formData.freeShippingThreshold)}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground text-center">
              Leave empty to disable free shipping
            </p>
          </div>

          <div className="w-full border-t" />

          {/* Flat Rate */}
          <div className="space-y-2">
            <Label
              htmlFor="default-cost-m"
              className="block text-center text-[11px] font-medium tracking-widests uppercase text-muted-foreground"
            >
              Flat Rate ({currency})
            </Label>
            <Input
              id="default-cost-m"
              type="number"
              min="0"
              step={step}
              placeholder={flatratePlaceholder}
              value={formData.defaultShippingCost || ''}
              onChange={(e) => onDefaultCostChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            {formData.defaultShippingCost > 0 && (
              <p className="text-xs text-muted-foreground text-center font-medium">
                {fmt(formData.defaultShippingCost)}
              </p>
            )}
          </div>

          <div className="w-full border-t" />

          {/* Mini simulator */}
          <CheckoutSimulator
            threshold={formData.freeShippingThreshold}
            defaultCost={formData.defaultShippingCost}
            currency={currency}
          />

        </CardContent>
      </Card>
    </div>
  );
}