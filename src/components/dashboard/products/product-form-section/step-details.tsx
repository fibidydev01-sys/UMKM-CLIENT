'use client';

// ─── Step 1: Details ───────────────────────────────────────────────────────

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/shared/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/shared/validations';
import type { ProductType } from './types';

interface StepDetailsProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  onTypeChange: (type: ProductType) => void;
}

export function StepDetails({
  form,
  productType,
  onTypeChange,
}: StepDetailsProps) {
  const isService = productType === 'service';

  return (
    <div className="space-y-6">

      {/* ── Toggle tipe listing ──────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Listing type
        </p>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-xl w-fit">
          <button
            type="button"
            onClick={() => onTypeChange('product')}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              productType === 'product'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('service')}
            className={cn(
              'px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              productType === 'service'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Service
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {isService
            ? 'Service mode — inventory fields are hidden automatically.'
            : 'Product mode — all fields including inventory are available.'}
        </p>
      </div>

      {/* ── Nama ─────────────────────────────────────────────────── */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">
              {isService ? 'Service name' : 'Product name'}{' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isService
                    ? 'e.g. Logo Design, AC Service & Repair'
                    : 'e.g. Special Fried Rice, Wireless Headphones'
                }
                className="h-11"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ── Deskripsi ──────────────────────────────────────────── */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder={
                  isService
                    ? "Describe your service — what's included, turnaround time, and requirements..."
                    : 'Describe your product — materials, dimensions, key features...'
                }
                rows={4}
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A clear description helps customers make confident purchase decisions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

    </div>
  );
}