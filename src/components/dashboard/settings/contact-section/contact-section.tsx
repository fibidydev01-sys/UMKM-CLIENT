'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PreviewModal, AutoSaveStatus, StepIndicator, StepDots } from '@/components/dashboard/settings/shared';
import { TenantContact } from '@/components/public/store/contact/tenant-contact';
import { generateThemeCSS } from '@/lib/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/shared/utils';
import type { ContactFormData } from '@/types';
import { StepContactInfo, StepLocation, StepSectionHeading } from '.';

const STEPS = [
  { title: 'Contact Info', desc: 'WhatsApp, phone & address' },
  { title: 'Location & Map', desc: 'Google Maps embed for your store' },
  { title: 'Section Heading', desc: 'Title & subheading for contact section' },
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
      const missing = [!formData.whatsapp && 'WhatsApp'].filter(Boolean) as string[];
      if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
    } else if (currentStep === 1 && !formData.contactMapUrl) {
      toast.info('Fill in the Google Maps URL for best results');
    } else if (currentStep === 2) {
      const missing = [!formData.contactTitle && 'Section Title'].filter(Boolean) as string[];
      if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
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

  const isLastStep = currentStep === STEPS.length - 1;
  const stepProps = { formData: formData!, updateFormData };

  if (!tenant || !formData) return null;

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
          {currentStep === 2 && <StepSectionHeading {...stepProps} isDesktop />}
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
          {currentStep === 2 && <StepSectionHeading {...stepProps} />}
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
              <TenantContact tenant={{
                ...tenant,
                ...formData,
                contactTitle: formData.contactTitle || 'Contact Us',
              }} />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}