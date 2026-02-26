'use client';

// ─── Step 4: Inventory ─────────────────────────────────────────────────────
// Track inventory, quantity in stock, low stock alert, unit
// This step is ONLY rendered for Product type — Service skips it entirely.

import { Package, AlertTriangle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { UNIT_OPTIONS_PRODUK } from '@/config/constants';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/validations';

interface StepInventoryProps {
  form: UseFormReturn<ProductFormData>;
}

export function StepInventory({ form }: StepInventoryProps) {
  const watchTrackStock = form.watch('trackStock');
  const watchStock = form.watch('stock') ?? 0;
  const watchMinStock = form.watch('minStock') ?? 5;

  const isLowStock = watchTrackStock && watchStock > 0 && watchStock <= watchMinStock;

  return (
    <div className="space-y-6">

      {/* ── Track inventory toggle ───────────────────────────────── */}
      <div className={cn(
        'flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200',
        watchTrackStock ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors',
            watchTrackStock ? 'bg-primary/10' : 'bg-muted'
          )}>
            <Package className={cn(
              'h-4 w-4 transition-colors',
              watchTrackStock ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Track inventory</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitor stock levels and get low-stock alerts
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="trackStock"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="shrink-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* ── Stock fields — visible only when tracking ────────────── */}
      {watchTrackStock && (
        <div className="space-y-4">

          {/* Low stock warning */}
          {isLowStock && (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-amber-500/5 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Stock is at or below the low-stock alert threshold
              </p>
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4">

            {/* Quantity in stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Quantity in stock
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="h-11 tabular-nums font-medium"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Low stock alert */}
            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Low stock alert
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      className="h-11 tabular-nums font-medium"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormDescription>Alert when stock drops below this</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'pcs'}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNIT_OPTIONS_PRODUK.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {/* ── No tracking info ─────────────────────────────────────── */}
      {!watchTrackStock && (
        <div className="rounded-xl border border-dashed px-4 py-6 text-center">
          <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            Inventory tracking is off
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Enable tracking above to manage stock levels for this product
          </p>
        </div>
      )}

    </div>
  );
}