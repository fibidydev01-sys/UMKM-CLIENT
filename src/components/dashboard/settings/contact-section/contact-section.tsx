'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal, AutoSaveStatus, StepIndicator, StepDots } from '@/components/dashboard/settings/shared';
import { Contact1 } from '@/components/public/store';
import { generateThemeCSS } from '@/lib/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/shared/utils';
import type { ContactFormData } from '@/types';
import { StepContactInfo, StepLocation, StepDisplaySettings } from '.';

const STEPS = [
  { title: 'Contact Info', desc: 'Title, subheading & contact details' },
  { title: 'Location & Map', desc: 'Google Maps embed for your store' },
  { title: 'Display Settings', desc: 'Contact form & account info' },
] as const;

export function ContactSection() {
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

  const { status: autoSaveStatus } = useAutoSave(formData);

  const updateFormData = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const checkEmptyFields = () => {
    if (!formData) return;
    if (currentStep === 0) {
      const missing = [
        !formData.contactTitle && 'Section Title',
        !formData.whatsapp && 'WhatsApp',
      ].filter(Boolean) as string[];
      if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
    } else if (currentStep === 1 && !formData.contactMapUrl) {
      toast.info('Fill in the Google Maps URL for best results');
    }
  };

  const handleNext = () => {
    checkEmptyFields();
    if (currentStep < STEPS.length - 1) setCurrentStep((p) => p + 1);
    else setShowPreview(true);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

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
      toast.success('Contact section saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save contact section');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;
  const isLastStep = currentStep === STEPS.length - 1;
  const stepProps = { formData: formData!, updateFormData };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">

        {/* ── DESKTOP SKELETON ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:h-full">

          {/* Header row */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
            {/* Left: AutoSaveStatus + h2 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-40 rounded-md" />
            </div>

            {/* Right: StepIndicator size="lg" */}
            <div className="shrink-0 pt-0.5 flex items-start">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-[11px] w-20 rounded-full" />
                  </div>
                  {i < 2 && <Skeleton className="w-14 h-px mx-2 mt-4" />}
                </div>
              ))}
            </div>
          </div>

          {/* Content — mirrors StepContactInfo desktop: grid grid-cols-2 gap-8 */}
          <div className="flex-1 min-h-[340px] pb-20">
            <div className="grid grid-cols-2 gap-8">
              {/* Col 1: Section Title + Subheading + Address */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Skeleton className="h-[11px] w-24 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-[11px] w-28 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-md" />
                  <Skeleton className="h-3 w-44 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-[11px] w-20 rounded-full" />
                  {/* Textarea rows={4} ≈ h-[104px] */}
                  <Skeleton className="h-[104px] w-full rounded-md" />
                </div>
              </div>
              {/* Col 2: WhatsApp + Phone + tip */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Skeleton className="h-[11px] w-32 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-md" />
                  <Skeleton className="h-3 w-40 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-[11px] w-28 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
                <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5 space-y-1">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-3 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE SKELETON ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col pb-24">

          {/* StepIndicator sm + AutoSaveStatus + title */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="flex items-center">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    {i < 2 && <Skeleton className="w-8 h-px mx-2" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-14 rounded-full" />
              </div>
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
          </div>

          {/* Content — mirrors StepContactInfo mobile: Card max-w-sm */}
          <div className="min-h-[300px] flex justify-center">
            <div className="w-full max-w-sm border rounded-lg p-6 flex flex-col gap-5">
              {/* Section Title */}
              <div className="space-y-1.5">
                <Skeleton className="h-[11px] w-24 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="h-px w-full" />
              {/* Subheading */}
              <div className="space-y-1.5">
                <Skeleton className="h-[11px] w-28 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="h-px w-full" />
              {/* Phone */}
              <div className="space-y-1.5">
                <Skeleton className="h-[11px] w-24 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* WhatsApp */}
              <div className="space-y-1.5">
                <Skeleton className="h-[11px] w-20 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-3 w-44 rounded-full mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* ── FIXED BOTTOM DESKTOP */}
        <div
          className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
          style={{ left: 'var(--sidebar-width)' }}
        >
          <div className="min-w-[130px] h-9 invisible" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
            <Skeleton className="w-1.5 h-1.5 rounded-full" />
          </div>
          <Skeleton className="min-w-[130px] h-9 rounded-md" />
        </div>

        {/* ── FIXED BOTTOM MOBILE */}
        <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="h-9 w-9 invisible" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-5 h-1.5 rounded-full" />
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
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
            <h2 className="text-2xl font-bold tracking-tight leading-none">
              {STEPS[currentStep].title}
            </h2>
          </div>
          <div className="shrink-0 pt-0.5">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} size="lg" />
          </div>
        </div>

        <div className="flex-1 min-h-[340px] pb-20">
          {currentStep === 0 && <StepContactInfo {...stepProps} isDesktop />}
          {currentStep === 1 && <StepLocation {...stepProps} isDesktop />}
          {currentStep === 2 && <StepDisplaySettings {...stepProps} tenantEmail={tenant?.email || ''} tenantSlug={tenant?.slug || ''} isDesktop />}
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col pb-24">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} size="sm" />
          </div>
          <div className="text-center space-y-0.5">
            <div className="flex justify-center">
              <AutoSaveStatus status={autoSaveStatus} />
            </div>
            <h3 className="text-base font-bold tracking-tight">{STEPS[currentStep].title}</h3>
          </div>
        </div>
        <div className="min-h-[300px]">
          {currentStep === 0 && <StepContactInfo {...stepProps} />}
          {currentStep === 1 && <StepLocation {...stepProps} />}
          {currentStep === 2 && <StepDisplaySettings {...stepProps} tenantEmail={tenant?.email || ''} tenantSlug={tenant?.slug || ''} />}
        </div>
      </div>

      {/* Desktop - fixed bottom */}
      <div
        className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-between px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <Button variant="outline" onClick={handlePrev} className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}>
          <ChevronLeft className="h-3.5 w-3.5" />Previous
        </Button>
        <StepDots steps={STEPS} currentStep={currentStep} />
        <Button onClick={handleNext} className="gap-1.5 min-w-[130px] h-9 text-sm">
          {isLastStep ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Save</> : <>Next<ChevronRight className="h-3.5 w-3.5" /></>}
        </Button>
      </div>

      {/* Mobile - fixed bottom */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <Button variant="outline" size="icon" onClick={handlePrev} className={cn('h-9 w-9 shrink-0', currentStep === 0 && 'invisible')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <StepDots steps={STEPS} currentStep={currentStep} />
          {isLastStep ? (
            <Button size="sm" onClick={handleNext} className="h-9 px-4 text-xs font-medium shrink-0">Preview</Button>
          ) : (
            <Button size="icon" onClick={handleNext} className="h-9 w-9 shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Contact Section Preview">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Contact1
                title={formData.contactTitle || 'Contact Us'}
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