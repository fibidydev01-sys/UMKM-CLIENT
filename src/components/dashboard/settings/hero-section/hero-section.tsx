'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal, AutoSaveStatus, StepIndicator, StepDots } from '@/components/dashboard/settings/shared';
import { Hero1 } from '@/components/public/store';
import { generateThemeCSS } from '@/lib/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/shared/utils';
import type { HeroFormData } from '@/types';
import { StepIdentity, StepStory, StepAppearance } from '.';

const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Orange', value: '#f97316' },
] as const;

const STEPS = [
  { title: 'Brand Identity', desc: 'Name, logo & category' },
  { title: 'Brand Story', desc: 'Headline & description' },
  { title: 'Appearance', desc: 'Colors, background & CTA' },
] as const;

export function HeroSection() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [isRemovingHeroBg, setIsRemovingHeroBg] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<HeroFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      const themeData = tenant.theme as { primaryColor?: string } | null;
      setFormData({
        name: tenant.name || '',
        description: tenant.description || '',
        heroTitle: tenant.heroTitle || '',
        heroSubtitle: tenant.heroSubtitle || '',
        heroCtaText: tenant.heroCtaText || '',
        heroBackgroundImage: tenant.heroBackgroundImage || '',
        logo: tenant.logo || '',
        primaryColor: themeData?.primaryColor || THEME_COLORS[0].value,
        category: tenant.category || '',
      });
    }
  }, [tenant, formData]);

  const { status: autoSaveStatus } = useAutoSave(
    formData ? {
      name: formData.name,
      description: formData.description,
      heroTitle: formData.heroTitle,
      heroSubtitle: formData.heroSubtitle,
      heroCtaText: formData.heroCtaText,
      category: formData.category,
      theme: { primaryColor: formData.primaryColor },
    } : null
  );

  const updateFormData = <K extends keyof HeroFormData>(key: K, value: HeroFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const handleRemoveLogo = async () => {
    if (!tenant || !formData) return;
    setIsRemovingLogo(true);
    try {
      setFormData({ ...formData, logo: '' });
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo removed successfully');
    } catch {
      toast.error('Failed to remove logo');
      setFormData({ ...formData, logo: tenant.logo || '' });
    } finally {
      setIsRemovingLogo(false);
    }
  };

  const handleRemoveHeroBg = async () => {
    if (!tenant || !formData) return;
    setIsRemovingHeroBg(true);
    try {
      setFormData({ ...formData, heroBackgroundImage: '' });
      await tenantsApi.update({ heroBackgroundImage: '' });
      await refresh();
      toast.success('Background image removed successfully');
    } catch {
      toast.error('Failed to remove background image');
      setFormData({ ...formData, heroBackgroundImage: tenant.heroBackgroundImage || '' });
    } finally {
      setIsRemovingHeroBg(false);
    }
  };

  const handleCtaTextChange = (value: string) => {
    if (value.length > 15) return;
    if (value.split(/\s+/).filter(Boolean).length > 2) return;
    updateFormData('heroCtaText', value);
  };

  const checkEmptyFields = () => {
    if (!formData) return;
    const map: Record<number, { key: keyof HeroFormData; label: string }[]> = {
      0: [{ key: 'name', label: 'Store Name' }, { key: 'logo', label: 'Logo' }],
      1: [{ key: 'heroTitle', label: 'Headline' }, { key: 'heroSubtitle', label: 'Subheading' }, { key: 'description', label: 'Store Tagline' }],
      2: [{ key: 'heroBackgroundImage', label: 'Background Image' }, { key: 'heroCtaText', label: 'Button Label' }],
    };
    const missing = (map[currentStep] || []).filter(({ key }) => !formData[key]).map(({ label }) => label);
    if (missing.length) toast.info(`Fill in ${missing.join(', ')} for best results`);
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
        name: formData.name || undefined,
        description: formData.description || undefined,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        heroCtaText: formData.heroCtaText,
        heroCtaLink: '/products',
        heroBackgroundImage: formData.heroBackgroundImage,
        logo: formData.logo || undefined,
        theme: { primaryColor: formData.primaryColor },
      });
      await refresh();
      toast.success('Hero section saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save hero section');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;
  const isLastStep = currentStep === STEPS.length - 1;
  const stepProps = { formData: formData!, updateFormData };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 py-6">
        <div className="hidden lg:flex items-center justify-between pb-6 border-b">
          <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-7 w-44" /></div>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                {i < 2 && <Skeleton className="w-14 h-px" />}
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="hidden lg:block h-[360px] w-full rounded-lg" />
        <div className="lg:hidden space-y-4">
          <div className="flex justify-center gap-3">{[0, 1, 2].map(i => <Skeleton key={i} className="w-6 h-6 rounded-full" />)}</div>
          <Skeleton className="h-[300px] w-full max-w-sm mx-auto rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      {/* ══════════════════════ DESKTOP ══════════════════════════ */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
          <div className="space-y-1">
            {/* ✅ AutoSaveStatus di atas judul */}
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
          {currentStep === 0 && <StepIdentity {...stepProps} onRemoveLogo={handleRemoveLogo} isRemovingLogo={isRemovingLogo} isDesktop />}
          {currentStep === 1 && <StepStory {...stepProps} isDesktop />}
          {currentStep === 2 && <StepAppearance {...stepProps} onRemoveHeroBg={handleRemoveHeroBg} isRemovingHeroBg={isRemovingHeroBg} onCtaTextChange={handleCtaTextChange} isDesktop />}
        </div>
      </div>

      {/* ══════════════════════ MOBILE ═══════════════════════════ */}
      <div className="lg:hidden flex flex-col pb-24">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <StepIndicator steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} size="sm" />
          </div>
          <div className="text-center space-y-0.5">
            {/* ✅ AutoSaveStatus di atas judul */}
            <div className="flex justify-center">
              <AutoSaveStatus status={autoSaveStatus} />
            </div>
            <h3 className="text-base font-bold tracking-tight">{STEPS[currentStep].title}</h3>
          </div>
        </div>
        <div className="min-h-[300px]">
          {currentStep === 0 && <StepIdentity {...stepProps} onRemoveLogo={handleRemoveLogo} isRemovingLogo={isRemovingLogo} />}
          {currentStep === 1 && <StepStory {...stepProps} />}
          {currentStep === 2 && <StepAppearance {...stepProps} onRemoveHeroBg={handleRemoveHeroBg} isRemovingHeroBg={isRemovingHeroBg} onCtaTextChange={handleCtaTextChange} />}
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

      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Hero Section Preview">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(formData.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Hero1
                title={formData.heroTitle || formData.name || ''}
                subtitle={formData.heroSubtitle || formData.description}
                ctaText={formData.heroCtaText || 'Shop Now'}
                ctaLink="/products"
                showCta={true}
                backgroundImage={formData.heroBackgroundImage}
                logo={formData.logo}
                storeName={formData.name}
              />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}