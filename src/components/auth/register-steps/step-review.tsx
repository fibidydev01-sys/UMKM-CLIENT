'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryConfig } from '@/config/categories';
import { Store, Mail, Lock, Phone, Edit2 } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface StepReviewProps {
  data: {
    category?: string;
    name?: string;
    slug?: string;
    description?: string;
    email?: string;
    password?: string;
    whatsapp?: string;
  };
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// ==========================================
// COMPONENT — no header, no nav (handled by parent)
// ==========================================

export function StepReview({ data, onEdit }: StepReviewProps) {
  const categoryConfig = data.category ? getCategoryConfig(data.category) : null;

  return (
    <div className="space-y-3 max-w-md">

      {/* Business Type */}
      <ReviewCard
        label="Business type"
        onEdit={() => onEdit(2)}
      >
        <p className="text-sm font-medium">
          {categoryConfig?.label ?? data.category ?? '—'}
        </p>
        {categoryConfig?.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {categoryConfig.description}
          </p>
        )}
      </ReviewCard>

      {/* Store Info */}
      <ReviewCard
        label="Store info"
        icon={<Store className="h-3.5 w-3.5 text-muted-foreground" />}
        onEdit={() => onEdit(3)}
      >
        <div className="space-y-1.5">
          <div>
            <p className="text-xs text-muted-foreground">Store name</p>
            <p className="text-sm font-medium">{data.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Store URL</p>
            <p className="text-sm font-medium text-primary">
              {data.slug || '—'}.fibidy.com
            </p>
          </div>
          {data.description && (
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{data.description}</p>
            </div>
          )}
        </div>
      </ReviewCard>

      {/* Account */}
      <ReviewCard
        label="Account"
        icon={<Mail className="h-3.5 w-3.5 text-muted-foreground" />}
        onEdit={() => onEdit(4)}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm">{data.email || '—'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm">••••••••</p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className="text-sm">+{data.whatsapp || '—'}</p>
          </div>
        </div>
      </ReviewCard>

      {/* Terms */}
      <p className="text-xs text-muted-foreground pt-1">
        By creating your store, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </div>
  );
}

// ==========================================
// REVIEW CARD
// ==========================================

function ReviewCard({
  label,
  icon,
  onEdit,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-1.5">
            {icon}
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              {label}
            </p>
          </div>
          {children}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="shrink-0 h-7 w-7 p-0"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}