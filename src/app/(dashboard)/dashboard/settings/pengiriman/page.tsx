'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { ShippingMethods, CourierName, PengirimanFormData } from '@/types';
import { StepBiaya, StepKurir } from '@/components/settings/pengiriman-section';

// ─── Constants ────────────────────────────────────────────────────────────────
const COURIER_OPTIONS: CourierName[] = [
  'JNE', 'J&T Express', 'SiCepat', 'AnterAja', 'Ninja Express',
  'ID Express', 'SAP Express', 'Lion Parcel', 'Pos Indonesia', 'TIKI', 'Other',
];

const DEFAULT_SHIPPING_METHODS: ShippingMethods = {
  couriers: COURIER_OPTIONS.slice(0, 5).map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    enabled: index < 2,
    note: '',
  })),
};

const formatRupiah = (value: number | null) => {
  if (value === null || value === 0) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

// ─── Wizard Steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'shipping-cost', title: 'Biaya Pengiriman', desc: 'Atur ongkos kirim dan batas gratis ongkir', icon: Package },
  { id: 'couriers', title: 'Kurir Pengiriman', desc: 'Pilih kurir yang tersedia untuk pengiriman', icon: Truck },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={cn('w-2 h-2 rounded-full transition-colors duration-200', i <= currentStep ? 'bg-primary' : 'bg-muted')} />
          {i < STEPS.length - 1 && (
            <div className={cn('w-8 h-px transition-colors duration-200', i < currentStep ? 'bg-primary' : 'bg-muted')} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PengirimanPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<PengirimanFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        freeShippingThreshold: tenant.freeShippingThreshold ?? null,
        defaultShippingCost: tenant.defaultShippingCost || 0,
        shippingMethods: tenant.shippingMethods || DEFAULT_SHIPPING_METHODS,
      });
    }
  }, [tenant, formData]);

  // ─── Update Helpers ─────────────────────────────────────────────────────────
  const handleFreeShippingChange = (value: string) => {
    if (formData) setFormData({ ...formData, freeShippingThreshold: value ? parseFloat(value) : null });
  };

  const handleDefaultCostChange = (value: string) => {
    if (formData) setFormData({ ...formData, defaultShippingCost: parseFloat(value) || 0 });
  };

  const handleToggleCourier = (id: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      shippingMethods: {
        ...formData.shippingMethods,
        couriers: formData.shippingMethods.couriers.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c),
      },
    });
  };

  const handleCourierNoteChange = (id: string, note: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      shippingMethods: {
        ...formData.shippingMethods,
        couriers: formData.shippingMethods.couriers.map((c) => c.id === id ? { ...c, note } : c),
      },
    });
  };

  // ─── Soft Warning ───────────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    if (currentStep === 1 && !formData.shippingMethods.couriers.some((c) => c.enabled)) {
      toast.info('Minimal 1 kurir aktif untuk hasil lebih baik');
    }
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = () => {
    checkEmptyFields();
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // ─── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        freeShippingThreshold: formData.freeShippingThreshold,
        defaultShippingCost: formData.defaultShippingCost,
        shippingMethods: formData.shippingMethods,
      });
      await refresh();
      toast.success('Pengaturan pengiriman berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      toast.error('Gagal menyimpan pengaturan pengiriman');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;

  return (
    <div>
      <div>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-2 w-24 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
            <Skeleton className="h-10 w-full max-w-sm mx-auto" />
          </div>
        ) : (
          <div className="flex flex-col pb-20 lg:pb-0">

            {/* ── Header ── */}
            <div>
              <div className="flex items-center justify-center lg:justify-between mb-5">
                <div className="hidden lg:flex">
                  <Button variant="ghost" size="sm" onClick={handlePrev} className={currentStep > 0 ? '' : 'invisible'}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>
                </div>
                <StepIndicator currentStep={currentStep} />
                <div className="hidden lg:flex">
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-sm font-semibold">{STEPS[currentStep].title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{STEPS[currentStep].desc}</p>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="min-h-[280px]">
              {currentStep === 0 && (
                <StepBiaya
                  formData={formData}
                  onFreeShippingChange={handleFreeShippingChange}
                  onDefaultCostChange={handleDefaultCostChange}
                />
              )}
              {currentStep === 1 && (
                <StepKurir
                  formData={formData}
                  onToggle={handleToggleCourier}
                  onNoteChange={handleCourierNoteChange}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Nav ── */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center justify-between z-40">
        <Button variant="ghost" size="sm" onClick={handlePrev} className={currentStep > 0 ? '' : 'invisible'}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNext}>
          {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* ── Preview ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview Pengaturan Pengiriman">
        {formData && (
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Biaya Pengiriman</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                <p className="text-sm"><span className="text-muted-foreground">Batas Gratis Ongkir:</span> {formData.freeShippingThreshold ? formatRupiah(formData.freeShippingThreshold) : 'Tidak ada'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Ongkos Kirim Default:</span> {formatRupiah(formData.defaultShippingCost)}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Kurir Pengiriman</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                {formData.shippingMethods.couriers.filter((c) => c.enabled).length > 0
                  ? formData.shippingMethods.couriers.filter((c) => c.enabled).map((courier) => (
                    <p key={courier.id} className="text-sm">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
                      {courier.name}{courier.note && <span className="text-muted-foreground"> - {courier.note}</span>}
                    </p>
                  ))
                  : <p className="text-sm text-muted-foreground">Belum ada kurir yang aktif</p>
                }
              </div>
            </div>
          </div>
        )}
      </PreviewModal>
    </div>
  );
}