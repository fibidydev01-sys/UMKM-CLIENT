'use client';

// ─── Step 4: Publish ───────────────────────────────────────────────────────
// Active toggle

import { Eye, EyeOff } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/shared/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/lib/shared/validations';
import type { ProductType } from './types';

interface StepPublishProps {
  form: UseFormReturn<ProductFormData>;
  productType: ProductType;
  showPrice: boolean;
  isEditing: boolean;
}

export function StepPublish({
  form,
  isEditing,
}: StepPublishProps) {
  const watchIsActive = form.watch('isActive');

  return (
    <div className="space-y-6">

      {/* ── Visibility ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Visibility
        </p>

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
      </div>

      <p className="text-xs text-muted-foreground">
        {isEditing
          ? 'Changes take effect immediately after saving.'
          : 'You can change these settings at any time after publishing.'}
      </p>

    </div>
  );
}