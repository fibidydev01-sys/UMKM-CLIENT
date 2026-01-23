'use client';

import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// TYPES
// ==========================================

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function CategoryCard({
  icon: Icon,
  label,
  color,
  isSelected,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200',
        'hover:scale-105 hover:shadow-md',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Label */}
      <span className="text-sm font-medium text-center">
        {label}
      </span>
    </button>
  );
}
