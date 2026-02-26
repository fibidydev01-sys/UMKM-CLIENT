'use client';

// ─── Preview Product Sheet ─────────────────────────────────────────────────
// Shopify-style sheet that slides in before final save
// Shows a summary of all fields for review before committing

import {
  Package,
  Wrench,
  Eye,
  EyeOff,
  Star,
  Tag,
  MessageCircle,
  Image as ImageIcon,
  Check,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductFormData } from '@/lib/validations';
import type { ProductType } from './types';

// ─── Props ────────────────────────────────────────────────────────────────
interface PreviewProductProps {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  formData: ProductFormData;
  productType: ProductType;
  showPrice: boolean;
  currency: string;
  isEditing: boolean;
}

// ─── Section Header ───────────────────────────────────────────────────────
function PreviewSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────
function PreviewRow({
  label,
  value,
  valueClass,
  missing,
}: {
  label: string;
  value?: string | null;
  valueClass?: string;
  missing?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
      <p className="text-xs text-muted-foreground shrink-0">{label}</p>
      {value ? (
        <p className={cn('text-xs font-medium text-right', valueClass)}>{value}</p>
      ) : (
        <p className="text-xs text-muted-foreground/40 italic">{missing ?? '—'}</p>
      )}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────
function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full',
      active
        ? 'bg-emerald-500/10 text-emerald-600'
        : 'bg-muted text-muted-foreground'
    )}>
      {active
        ? <Check className="w-2.5 h-2.5" />
        : <span className="w-2 h-2 rounded-full bg-current opacity-40" />
      }
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────
export function PreviewProduct({
  open,
  onClose,
  onSave,
  isSaving,
  formData,
  productType,
  showPrice,
  currency,
  isEditing,
}: PreviewProductProps) {
  const isService = productType === 'service';
  const images = formData.images || [];
  const firstImage = images[0];

  const formatPrice = (val?: number | null) =>
    val ? `${currency} ${val.toLocaleString()}` : null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col gap-0 p-0 overflow-hidden"
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle className="text-base font-bold">
            {isEditing ? 'Review changes' : 'Review & publish'}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Double-check your listing details before {isEditing ? 'saving' : 'publishing'}.
          </SheetDescription>
        </SheetHeader>

        {/* ── Scrollable content ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Thumbnail + type badge */}
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted shrink-0">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt="Product thumbnail"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-7 w-7 text-muted-foreground/30" />
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-[9px] rounded font-medium">
                  +{images.length - 1}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isService
                  ? <Wrench className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  : <Package className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                }
                <span className={cn(
                  'text-[11px] font-semibold',
                  isService ? 'text-blue-600' : 'text-emerald-600'
                )}>
                  {isService ? 'Service' : 'Product'}
                </span>
              </div>
              <p className="text-base font-bold leading-tight truncate">
                {formData.name || <span className="text-muted-foreground font-normal italic text-sm">No name</span>}
              </p>
              {formData.category && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{formData.category}</p>
              )}
            </div>
          </div>

          {/* Details */}
          <PreviewSection label="Details">
            <div className="rounded-xl border bg-card overflow-hidden px-3 py-1">
              <PreviewRow label="Name" value={formData.name} missing="No name set" />
              <PreviewRow label="Category" value={formData.category} missing="No category" />
              {!isService && <PreviewRow label="SKU" value={formData.sku} missing="No SKU" />}
              <PreviewRow
                label="Description"
                value={formData.description ? `${formData.description.slice(0, 60)}${formData.description.length > 60 ? '…' : ''}` : null}
                missing="No description"
              />
            </div>
          </PreviewSection>

          {/* Media */}
          <PreviewSection label="Media">
            <div className="rounded-xl border bg-card px-3 py-1">
              <PreviewRow
                label="Photos"
                value={images.length > 0 ? `${images.length} image${images.length > 1 ? 's' : ''} uploaded` : null}
                missing="No images"
                valueClass={images.length > 0 ? 'text-emerald-600' : undefined}
              />
            </div>
          </PreviewSection>

          {/* Pricing */}
          <PreviewSection label="Pricing">
            <div className="rounded-xl border bg-card overflow-hidden px-3 py-1">
              {showPrice ? (
                <>
                  <PreviewRow
                    label="Sale price"
                    value={formatPrice(formData.price)}
                    missing="Not set"
                    valueClass="text-primary"
                  />
                  <PreviewRow
                    label="Compare-at"
                    value={formatPrice(formData.comparePrice)}
                    missing="—"
                  />
                  {!isService && (
                    <PreviewRow
                      label="Cost per item"
                      value={formatPrice(formData.costPrice)}
                      missing="—"
                    />
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 py-2.5">
                  <MessageCircle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <p className="text-xs font-medium text-orange-600">Price on request</p>
                </div>
              )}
            </div>
          </PreviewSection>

          {/* Inventory — Product only */}
          {!isService && (
            <PreviewSection label="Inventory">
              <div className="rounded-xl border bg-card overflow-hidden px-3 py-1">
                <PreviewRow
                  label="Track inventory"
                  value={formData.trackStock ? 'Enabled' : 'Disabled'}
                  valueClass={formData.trackStock ? 'text-emerald-600' : undefined}
                />
                {formData.trackStock && (
                  <>
                    <PreviewRow
                      label="Quantity in stock"
                      value={formData.stock != null ? String(formData.stock) : null}
                      missing="Not set"
                    />
                    <PreviewRow
                      label="Low stock alert"
                      value={formData.minStock != null ? `≤ ${formData.minStock}` : null}
                      missing="Not set"
                    />
                  </>
                )}
                <PreviewRow label="Unit" value={formData.unit ?? 'pcs'} />
              </div>
            </PreviewSection>
          )}

          {/* Publish */}
          <PreviewSection label="Publish settings">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge
                active={formData.isActive}
                activeLabel="Visible"
                inactiveLabel="Hidden"
              />
              <StatusBadge
                active={formData.isFeatured}
                activeLabel="Featured"
                inactiveLabel="Not featured"
              />
              {isService && formData.unit && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-500/10 text-blue-600">
                  <Wrench className="w-2.5 h-2.5" />
                  {formData.unit}
                </span>
              )}
            </div>
          </PreviewSection>

        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        <SheetFooter className="px-6 py-4 border-t bg-muted/30 shrink-0 flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSaving}
          >
            Back to edit
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Publishing...'}
              </>
            ) : (
              <>
                {isEditing
                  ? <><Check className="h-4 w-4" />Save changes</>
                  : <><Eye className="h-4 w-4" />Publish listing</>
                }
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}