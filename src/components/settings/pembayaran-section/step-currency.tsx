'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
  ASEAN_CURRENCY_META,
  ASEAN_CURRENCIES,
  ASEAN_TAX_TIPS,
  ASEAN_SIMULATION_PRICES,
  formatAseanPrice,
} from '@/types';
import type { PembayaranFormData } from '@/types';

// ─── Currency list dari ASEAN_CURRENCY_META (single source of truth) ──────
const CURRENCY_LIST = ASEAN_CURRENCIES.map((code) => ASEAN_CURRENCY_META[code]);

// ─── Helpers ──────────────────────────────────────────────────────────────
function getSimulationPrices(currency: string): number[] {
  return ASEAN_SIMULATION_PRICES[currency as keyof typeof ASEAN_SIMULATION_PRICES]
    ?? [10, 25, 100];
}

function getTaxTip(currency: string): string {
  return ASEAN_TAX_TIPS[currency as keyof typeof ASEAN_TAX_TIPS]
    ?? 'Check your local tax authority for the applicable VAT/GST rate.';
}

// ─── Currency Combobox ────────────────────────────────────────────────────
function CurrencyCombobox({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = ASEAN_CURRENCY_META[value as keyof typeof ASEAN_CURRENCY_META];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10 px-3"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <span>{selected.flag}</span>
              <span className="font-semibold">{selected.code}</span>
              <span className="text-muted-foreground text-xs">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select currency...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList className="max-h-64">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup heading="ASEAN Currencies">
              {CURRENCY_LIST.map((c) => (
                <CommandItem
                  key={c.code}
                  value={`${c.code} ${c.name}`}
                  onSelect={() => {
                    onValueChange(c.code);
                    setOpen(false);
                  }}
                  className="gap-2"
                >
                  <Check
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value === c.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <span>{c.flag}</span>
                  <span className="font-semibold w-10 shrink-0 tabular-nums">{c.code}</span>
                  <span className="text-muted-foreground text-xs truncate">{c.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────
interface StepCurrencyProps {
  formData: PembayaranFormData;
  onCurrencyChange: (value: string) => void;
  onTaxRateChange: (value: string) => void;
  isDesktop?: boolean;
}

// ─── Main Component ────────────────────────────────────────────────────────
export function StepCurrency({
  formData,
  onCurrencyChange,
  onTaxRateChange,
  isDesktop = false,
}: StepCurrencyProps) {
  const simulationPrices = getSimulationPrices(formData.currency);
  const taxTip = getTaxTip(formData.currency);

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-2xl">

        {/* Store Currency */}
        <div className="space-y-2">
          <Label className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Store Currency
          </Label>
          <CurrencyCombobox
            value={formData.currency}
            onValueChange={onCurrencyChange}
          />
          <p className="text-xs text-muted-foreground">
            Currency used across your entire store
          </p>
        </div>

        {/* Tax Rate */}
        <div className="space-y-2">
          <Label htmlFor="tax-rate-d" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Tax Rate (%)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="tax-rate-d"
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="0"
              value={formData.taxRate || ''}
              onChange={(e) => onTaxRateChange(e.target.value)}
              className="h-11 text-base font-semibold tracking-tight w-32 placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <span className="text-sm text-muted-foreground font-medium">%</span>
          </div>

          {/* Tax simulation */}
          <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-1.5 mt-2">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              Simulation
            </p>
            {simulationPrices.map((price) => {
              const tax = (price * (formData.taxRate || 0)) / 100;
              return (
                <div key={price} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {formatAseanPrice(price, formData.currency)} →
                  </span>
                  <span className="font-medium">
                    + {formatAseanPrice(tax, formData.currency)} tax
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Enter <span className="font-medium text-foreground">0</span> if no tax applies — tax is shown at checkout
          </p>
        </div>

        {/* Dynamic tip */}
        <div className="col-span-2 border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tip:</span>{' '}
            {taxTip}
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

          {/* Store Currency */}
          <div className="space-y-2">
            <Label className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Store Currency
            </Label>
            <CurrencyCombobox
              value={formData.currency}
              onValueChange={onCurrencyChange}
            />
          </div>

          <div className="w-full border-t" />

          {/* Tax Rate */}
          <div className="space-y-2">
            <Label htmlFor="tax-rate-m" className="block text-center text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Tax Rate (%)
            </Label>
            <Input
              id="tax-rate-m"
              type="number"
              min="0"
              max="100"
              step="0.5"
              placeholder="0"
              value={formData.taxRate || ''}
              onChange={(e) => onTaxRateChange(e.target.value)}
              className="text-center h-10 text-sm font-semibold placeholder:font-normal placeholder:text-muted-foreground/50"
            />
            <p className="text-[11px] text-muted-foreground text-center">
              Enter 0 if no tax applies
            </p>
          </div>

          {/* Mobile simulation — only when taxRate > 0 */}
          {formData.taxRate > 0 && (
            <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-1.5">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide text-center">
                Simulation
              </p>
              {simulationPrices.map((price) => {
                const tax = (price * (formData.taxRate || 0)) / 100;
                return (
                  <div key={price} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {formatAseanPrice(price, formData.currency)}
                    </span>
                    <span className="font-medium text-foreground">
                      +{formatAseanPrice(tax, formData.currency)} tax
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}