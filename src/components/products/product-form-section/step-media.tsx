'use client';

// ─── Step 2: Media ─────────────────────────────────────────────────────────
// Product photos / service portfolio images

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { MultiImageUpload } from '@/components/upload';
import { cn } from '@/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/validations';
import type { ProductType } from './types';

interface StepMediaProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
}

export function StepMedia({ form, productType }: StepMediaProps) {
  const isService = productType === 'service';

  return (
    <div className="space-y-5">

      {/* ── Context label ────────────────────────────────────────── */}
      <div className={cn(
        'rounded-xl border px-4 py-3 text-sm',
        isService
          ? 'bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400'
          : 'bg-muted/50 border-border text-muted-foreground'
      )}>
        {isService ? (
          <p>
            <span className="font-semibold">Portfolio mode —</span>{' '}
            upload samples of your work to showcase your quality. The first image becomes your thumbnail.
          </p>
        ) : (
          <p>
            <span className="font-semibold">Product photos —</span>{' '}
            upload up to 5 images. Clear, well-lit photos significantly improve conversion rates.
            The first image becomes your main thumbnail.
          </p>
        )}
      </div>

      {/* ── Upload field ─────────────────────────────────────────── */}
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <MultiImageUpload
                value={field.value || []}
                onChange={field.onChange}
                folder="fibidy/products"
                maxImages={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* ── Tips ─────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { emoji: '📐', tip: 'Square images (1:1) work best across all layouts' },
          { emoji: '💡', tip: 'Natural lighting produces the most appealing results' },
          { emoji: '🎨', tip: 'Consistent style across images builds brand trust' },
        ].map(({ emoji, tip }) => (
          <div key={tip} className="flex items-start gap-2.5 rounded-lg bg-muted/30 px-3 py-2.5">
            <span className="text-base shrink-0 mt-px">{emoji}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}