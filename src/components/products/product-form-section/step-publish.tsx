'use client';

// ─── Step 5: Publish ───────────────────────────────────────────────────────
// Active toggle, featured toggle, service unit selector, status summary

import { Eye, EyeOff, Star, Wrench } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { UNIT_OPTIONS_JASA } from '@/config/constants';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/validations';
import type { ProductType } from './types';

interface StepPublishProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  showPrice: boolean;
  isEditing: boolean;
}

export function StepPublish({
  form,
  productType,
  showPrice,
  isEditing,
}: StepPublishProps) {
  const isService = productType === 'service';
  const watchIsActive = form.watch('isActive');
  const watchIsFeatured = form.watch('isFeatured');

  return (
    <div className="space-y-6">

      {/* ── Visibility ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Visibility
        </p>

        {/* Active */}
        <div className={cn(
          'flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200',
          watchIsActive ? 'border-primary/30 bg-primary/5' : 'border-border bg-background'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors',
              watchIsActive ? 'bg-primary/10' : 'bg-muted'
            )}>
              {watchIsActive
                ? <Eye className="h-4 w-4 text-primary" />
                : <EyeOff className="h-4 w-4 text-muted-foreground" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {watchIsActive ? 'Visible in store' : 'Hidden from store'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {watchIsActive
                  ? 'Customers can find and view this listing'
                  : 'Only you can see this — not visible to customers'
                }
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="isActive"
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

        {/* Featured */}
        <div className={cn(
          'flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200',
          watchIsFeatured ? 'border-amber-400/40 bg-amber-500/5' : 'border-border bg-background'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors',
              watchIsFeatured ? 'bg-amber-500/10' : 'bg-muted'
            )}>
              <Star className={cn(
                'h-4 w-4 transition-colors',
                watchIsFeatured ? 'text-amber-500' : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Featured listing</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Highlighted on your store&apos;s homepage and featured section
              </p>
            </div>
          </div>
          <FormField
            control={form.control}
            name="isFeatured"
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
      </div>

      {/* ── Service unit ─────────────────────────────────────────── */}
      {isService && (
        <>
          <Separator />
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Service unit
            </p>
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="max-w-[200px]">
                  <FormLabel className="text-sm font-semibold flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                    Billing unit
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || 'hour'}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNIT_OPTIONS_JASA.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How this service is billed — per hour, session, project, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      {/* ── Listing summary ──────────────────────────────────────── */}
      <Separator />
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Listing summary
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: 'Type',
              value: isService ? 'Service' : 'Product',
              color: isService ? 'text-blue-600' : 'text-emerald-600',
            },
            {
              label: 'Price display',
              value: showPrice ? 'Public price' : 'On request',
              color: showPrice ? 'text-foreground' : 'text-orange-600',
            },
            {
              label: 'Visibility',
              value: watchIsActive ? 'Active' : 'Hidden',
              color: watchIsActive ? 'text-emerald-600' : 'text-muted-foreground',
            },
            {
              label: 'Featured',
              value: watchIsFeatured ? 'Yes' : 'No',
              color: watchIsFeatured ? 'text-amber-600' : 'text-muted-foreground',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg bg-muted/40 border border-border/50 px-3 py-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
              <p className={cn('text-sm font-semibold', color)}>{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {isEditing
            ? 'Changes take effect immediately after saving.'
            : 'You can change these settings at any time after publishing.'}
        </p>
      </div>
    </div>
  );
}