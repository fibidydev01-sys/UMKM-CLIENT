'use client';

// ─── Step 3: Pricing ───────────────────────────────────────────────────────
// Sale price, compare-at price, price-on-request toggle

import { MessageCircle, Tag, TrendingDown } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/shared/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/shared/validations';
import type { ProductType } from './types';

interface StepPricingProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  showPrice: boolean;
  onShowPriceChange: (val: boolean) => void;
  currency: string;
}

// ─── Currency prefix ──────────────────────────────────────────────────────
function CurrencyInput({
  currency,
  placeholder,
  field,
  onChange,
  value,
}: {
  currency: string;
  placeholder: string;
  field: Record<string, unknown>;
  onChange: (val: number | undefined) => void;
  value: number | undefined;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none pointer-events-none">
        {currency}
      </span>
      <Input
        type="number"
        min="0"
        placeholder={placeholder}
        className={cn('h-11 font-medium tabular-nums', currency.length <= 3 ? 'pl-14' : 'pl-16')}
        {...field}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      />
    </div>
  );
}

export function StepPricing({
  form,
  productType,
  showPrice,
  onShowPriceChange,
  currency,
}: StepPricingProps) {
  const isService = productType === 'service';

  return (
    <div className="space-y-6">

      {/* ── Price on request toggle ──────────────────────────────── */}
      <div className={cn(
        'flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200',
        !showPrice ? 'border-orange-400/30 bg-orange-500/5' : 'border-border bg-background'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors',
            !showPrice ? 'bg-orange-500/10' : 'bg-muted'
          )}>
            {showPrice
              ? <Tag className="h-4 w-4 text-muted-foreground" />
              : <MessageCircle className="h-4 w-4 text-orange-500" />
            }
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              {showPrice ? 'Display price publicly' : 'Price on request'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {showPrice
                ? 'Customers see the price on your listing'
                : 'Customers will see a "Contact us" button instead'
              }
            </p>
          </div>
        </div>
        <Switch
          checked={showPrice}
          onCheckedChange={onShowPriceChange}
          className="shrink-0"
        />
      </div>

      {/* ── Price on request notice ──────────────────────────────── */}
      {!showPrice && (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-orange-400/40 bg-orange-500/5 px-4 py-3.5">
          <MessageCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
              Price on request enabled
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              No price fields are required. Customers will contact you directly to negotiate or inquire.
            </p>
          </div>
        </div>
      )}

      {/* ── Price fields ─────────────────────────────────────────── */}
      {showPrice && (
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Sale price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  {isService ? 'Service rate' : 'Sale price'}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    currency={currency}
                    placeholder="0"
                    field={field}
                    value={field.value as number | undefined}
                    onChange={(v) => field.onChange(v ?? 0)}
                  />
                </FormControl>
                <FormDescription>
                  {isService ? 'Per session, hour, or package' : 'Price shown to customers'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Compare-at price */}
          <FormField
            control={form.control}
            name="comparePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                  Compare-at price
                </FormLabel>
                <FormControl>
                  <CurrencyInput
                    currency={currency}
                    placeholder="0"
                    field={field}
                    value={field.value as number | undefined}
                    onChange={(v) => field.onChange(v)}
                  />
                </FormControl>
                <FormDescription>
                  Original price before discount — shown as strikethrough
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
      )}

    </div>
  );
}