'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Contact1 } from '@/components/landing/blocks';
import { PreviewModal } from '@/components/settings';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { ContactFormData } from '@/types';
import { StepHeader, StepMaps, StepSettings } from '@/components/settings/contact-section';

// ─── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Header & Info Kontak', desc: 'Judul, subtitle, dan informasi kontak' },
  { title: 'Integrasi Maps', desc: 'Google Maps embed untuk lokasi toko' },
  { title: 'Preview & Form Settings', desc: 'Pengaturan tampilan form kontak' },
] as const;

// ─── Step Indicator ────────────────────────────────────────────────────────
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

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        contactTitle: tenant.contactTitle || '',
        contactSubtitle: tenant.contactSubtitle || '',
        contactMapUrl: tenant.contactMapUrl || '',
        contactShowMap: tenant.contactShowMap ?? false,
        contactShowForm: tenant.contactShowForm ?? true,
        phone: tenant.phone || '',
        whatsapp: tenant.whatsapp || '',
        address: tenant.address || '',
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  // ─── Soft warning ──────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.contactTitle) missing.push('Judul Section');
      if (!formData.whatsapp) missing.push('WhatsApp');
    } else if (currentStep === 1) {
      if (!formData.contactMapUrl) missing.push('URL Google Maps');
    }
    if (missing.length > 0) {
      toast.info(`Isi ${missing.join(', ')} untuk hasil lebih baik`);
    }
  };

  // ─── Navigation ────────────────────────────────────────────────────────
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

  // ─── Save ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        contactTitle: formData.contactTitle,
        contactSubtitle: formData.contactSubtitle,
        contactMapUrl: formData.contactMapUrl,
        contactShowMap: formData.contactShowMap,
        contactShowForm: formData.contactShowForm,
        phone: formData.phone || undefined,
        whatsapp: formData.whatsapp || undefined,
        address: formData.address || undefined,
      });
      await refresh();
      toast.success('Contact Section berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save contact section:', error);
      toast.error('Gagal menyimpan contact section');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
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
                    Selanjutnya
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
                <StepHeader formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 1 && (
                <StepMaps formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 2 && (
                <StepSettings
                  formData={formData}
                  updateFormData={updateFormData}
                  tenantEmail={tenant?.email || ''}
                  tenantSlug={tenant?.slug || ''}
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
          Selanjutnya
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* ── Preview ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview Contact Section">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Contact1
                title={formData.contactTitle || 'Hubungi Kami'}
                subtitle={formData.contactSubtitle}
                whatsapp={formData.whatsapp}
                phone={formData.phone}
                address={formData.address}
                storeName={tenant?.name || ''}
              />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}