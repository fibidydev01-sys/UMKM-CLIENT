'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AutoSaveStatus } from '@/components/dashboard/settings/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { CourierName, PengirimanFormData, ShippingMethods } from '@/types';
import { StepCarriers, PreviewPengiriman } from '.';

const COURIER_OPTIONS: CourierName[] = [
  'JNE', 'J&T Express', 'SiCepat', 'SPX Express',
  'Ninja Express', 'Paxel', 'Lion Parcel', 'Pos Indonesia', 'TIKI',
];

const DEFAULT_SHIPPING_METHODS: ShippingMethods = {
  couriers: COURIER_OPTIONS.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    enabled: ['JNE', 'J&T Express', 'SiCepat'].includes(name),
    note: '',
  })),
};

function mergeCouriers(saved: ShippingMethods): ShippingMethods {
  const savedMap = new Map(saved.couriers.map((c) => [c.id, c]));
  const merged = DEFAULT_SHIPPING_METHODS.couriers.map((def) => {
    const existing = savedMap.get(def.id);
    if (existing) return { ...def, enabled: existing.enabled, note: existing.note ?? '' };
    return def;
  });
  return { couriers: merged };
}

export function PengirimanSection() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<PengirimanFormData>(() => ({
    shippingMethods: tenant?.shippingMethods
      ? mergeCouriers(tenant.shippingMethods)
      : DEFAULT_SHIPPING_METHODS,
  }));

  const { status: autoSaveStatus } = useAutoSave(formData);

  const handleToggleCourier = (id: string) =>
    setFormData((p) => ({
      ...p,
      shippingMethods: {
        ...p.shippingMethods,
        couriers: p.shippingMethods.couriers.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c),
      },
    }));

  const handleCourierNoteChange = (id: string, note: string) =>
    setFormData((p) => ({
      ...p,
      shippingMethods: {
        ...p.shippingMethods,
        couriers: p.shippingMethods.couriers.map((c) => c.id === id ? { ...c, note } : c),
      },
    }));

  const handlePreview = () => {
    if (!formData.shippingMethods.couriers.some((c) => c.enabled))
      toast.info('Enable at least 1 courier for best results');
    setShowPreview(true);
  };

  const handleSave = async () => {
    if (!tenant) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({ shippingMethods: formData.shippingMethods });
      await refresh();
      toast.success('Shipping settings saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save shipping settings');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">

        {/* ── DESKTOP SKELETON ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:h-full">

          {/* Header row: AutoSaveStatus + title (no StepIndicator) */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-44 rounded-md" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pb-20 min-h-[280px]">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-[11px] w-36 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-[52px] w-full rounded-lg" />
                ))}
              </div>
              <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5 space-y-1">
                <Skeleton className="h-3 w-full max-w-md rounded-full" />
                <Skeleton className="h-3 w-3/4 max-w-sm rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE SKELETON ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col pb-24">
          <div className="mb-6 text-center space-y-0.5">
            <div className="flex justify-center">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-14 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-36 rounded-md mx-auto" />
          </div>
          <div className="flex flex-col items-center gap-3 min-h-[260px]">
            <div className="flex items-center gap-2">
              <Skeleton className="h-[11px] w-10 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="w-full max-w-sm space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[46px] w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* ── FIXED BOTTOM DESKTOP */}
        <div
          className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
          style={{ left: 'var(--sidebar-width)' }}
        >
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>

        {/* ── FIXED BOTTOM MOBILE */}
        <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
          <div className="px-4 py-3 flex items-center justify-end">
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      {/* DESKTOP */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
          <div className="space-y-1">
            <AutoSaveStatus status={autoSaveStatus} />
            <h2 className="text-2xl font-bold tracking-tight leading-none">Shipping Couriers</h2>
          </div>
        </div>

        <div className="flex-1 pb-20 min-h-[280px]">
          <StepCarriers formData={formData} onToggle={handleToggleCourier} onNoteChange={handleCourierNoteChange} isDesktop />
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col pb-24">
        <div className="mb-6 text-center space-y-0.5">
          <div className="flex justify-center">
            <AutoSaveStatus status={autoSaveStatus} />
          </div>
          <h3 className="text-base font-bold tracking-tight">Shipping Couriers</h3>
        </div>
        <div className="min-h-[260px]">
          <StepCarriers formData={formData} onToggle={handleToggleCourier} onNoteChange={handleCourierNoteChange} />
        </div>
      </div>

      {/* Desktop - fixed bottom */}
      <div
        className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <Button onClick={handlePreview} className="gap-1.5 h-9 text-sm">
          <Eye className="h-3.5 w-3.5" />Preview &amp; Save
        </Button>
      </div>

      {/* Mobile - fixed bottom */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-end">
          <Button size="sm" onClick={handlePreview} className="h-9 px-4 text-xs font-medium">
            Preview
          </Button>
        </div>
      </div>

      <PreviewPengiriman
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        formData={formData}
      />
    </div>
  );
}