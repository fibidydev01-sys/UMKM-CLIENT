'use client';

import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Variant {
  value: string;
  label: string;
  description: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariant: string;
  onVariantChange: (variant: string) => void;
}

export function VariantSelector({ variants, selectedVariant, onVariantChange }: VariantSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {variants.map((variant) => {
        const isSelected = selectedVariant === variant.value;

        return (
          <Card
            key={variant.value}
            className={cn(
              'relative p-3 cursor-pointer transition-all duration-200 hover:shadow-md',
              'border-2',
              isSelected
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => onVariantChange(variant.value)}
          >
            {/* Selected Check */}
            {isSelected && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}

            {/* Variant Preview Placeholder */}
            <div
              className={cn(
                'aspect-video rounded-md mb-2 bg-gradient-to-br',
                'from-primary/10 via-primary/5 to-background',
                'flex items-center justify-center text-xs text-muted-foreground font-medium'
              )}
            >
              {variant.label}
            </div>

            {/* Variant Info */}
            <div>
              <p className={cn('text-xs font-semibold mb-0.5', isSelected && 'text-primary')}>
                {variant.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                {variant.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
