'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal } from '@/components/settings';
import { Hero1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { HeroFormData } from '@/types';
import { StepIdentitas, StepCerita, StepTampilan } from '@/components/settings/hero-section';

// ─── Constants ─────────────────────────────────────────────────────────────
const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

const STEPS = [
  { title: 'Identitas Toko', desc: 'Nama, logo, dan kategori' },
  { title: 'Cerita Toko', desc: 'Judul dan deskripsi hero' },
  { title: 'Tampilan', desc: 'Warna tema, background, CTA' },
] as const;

// ─── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  onStepClick,
  size = 'sm',
}: {
  currentStep: number;
  onStepClick?: (i: number) => void;
  size?: 'sm' | 'lg';
}) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            {/* Dot / number */}
            <button
              type="button"
              onClick={() => i < currentStep && onStepClick?.(i)}
              className={cn(
                'flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none',
                size === 'lg' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[11px]',
                i < currentStep
                  ? 'bg-primary text-primary-foreground cursor-pointer hover:opacity-75'
                  : i === currentStep
                    ? 'bg-primary text-primary-foreground ring-[3px] ring-primary/25 cursor-default'
                    : 'bg-muted text-muted-foreground/60 cursor-default'
              )}
            >
              {i < currentStep ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </button>

            {/* Label — desktop lg only */}
            {size === 'lg' && (
              <span
                className={cn(
                  'text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors',
                  i === currentStep ? 'text-foreground' : 'text-muted-foreground/60'
                )}
              >
                {step.title}
              </span>
            )}
          </div>

          {/* Connector */}
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'h-px mx-2 transition-colors duration-500',
                size === 'lg' ? 'w-14 mb-[22px]' : 'w-8',
                i < currentStep ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function HeroSectionPage() {
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
      toast.success('Logo berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus logo');
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
      toast.success('Hero background berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus hero background');
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
      0: [{ key: 'name', label: 'Nama Toko' }, { key: 'logo', label: 'Logo' }],
      1: [{ key: 'heroTitle', label: 'Hero Title' }, { key: 'heroSubtitle', label: 'Subtitle' }, { key: 'description', label: 'Deskripsi' }],
      2: [{ key: 'heroBackgroundImage', label: 'Background' }, { key: 'heroCtaText', label: 'Teks CTA' }],
    };
    const missing = (map[currentStep] || []).filter(({ key }) => !formData[key]).map(({ label }) => label);
    if (missing.length) toast.info(`Isi ${missing.join(', ')} untuk hasil lebih baik`);
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
      toast.success('Hero Section berhasil disimpan');
      setShowPreview(false);
    } catch {
      toast.error('Gagal menyimpan hero section');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null || formData === null;
  const isLastStep = currentStep === STEPS.length - 1;

  const stepProps = {
    formData: formData!,
    updateFormData,
  };

  return (
    <div className="h-full flex flex-col">

      {/* ══════════════════════════ LOADING ══════════════════════════ */}
      {isLoading ? (
        <div className="flex-1 space-y-6 py-6">
          <div className="hidden lg:flex items-center justify-between pb-6 border-b">
            <div className="space-y-2"><Skeleton className="h-7 w-44" /><Skeleton className="h-4 w-56" /></div>
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

      ) : (
        <>
          {/* ══════════════════════ DESKTOP ══════════════════════════ */}
          <div className="hidden lg:flex lg:flex-col lg:h-full">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
              <div className="space-y-1">
                {/* Micro label */}
                <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
                  Langkah {currentStep + 1} / {STEPS.length}
                </p>
                {/* Display heading */}
                <h2 className="text-2xl font-bold tracking-tight leading-none">
                  {STEPS[currentStep].title}
                </h2>
                {/* Subhead */}
                <p className="text-sm text-muted-foreground pt-0.5">
                  {STEPS[currentStep].desc}
                </p>
              </div>

              <div className="shrink-0 pt-0.5">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="lg"
                />
              </div>
            </div>

            {/* ── Body ──────────────────────────────────────────── */}
            <div className="flex-1 min-h-[340px]">
              {currentStep === 0 && (
                <StepIdentitas
                  {...stepProps}
                  onRemoveLogo={handleRemoveLogo}
                  isRemovingLogo={isRemovingLogo}
                  isDesktop
                />
              )}
              {currentStep === 1 && (
                <StepCerita {...stepProps} isDesktop />
              )}
              {currentStep === 2 && (
                <StepTampilan
                  {...stepProps}
                  onRemoveHeroBg={handleRemoveHeroBg}
                  isRemovingHeroBg={isRemovingHeroBg}
                  onCtaTextChange={handleCtaTextChange}
                  isDesktop
                />
              )}
            </div>

            {/* ── Footer nav ────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-6 border-t mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                className={cn('gap-1.5 min-w-[130px] h-9 text-sm', currentStep === 0 && 'invisible')}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </Button>

              {/* Progress pills */}
              <div className="flex items-center gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-full transition-all duration-300',
                      i === currentStep ? 'w-5 h-1.5 bg-primary' : i < currentStep ? 'w-1.5 h-1.5 bg-primary/40' : 'w-1.5 h-1.5 bg-border'
                    )}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="gap-1.5 min-w-[130px] h-9 text-sm"
              >
                {isLastStep
                  ? <><Eye className="h-3.5 w-3.5" />Preview &amp; Simpan</>
                  : <>Selanjutnya<ChevronRight className="h-3.5 w-3.5" /></>
                }
              </Button>
            </div>
          </div>

          {/* ══════════════════════ MOBILE ═══════════════════════════ */}
          <div className="lg:hidden flex flex-col pb-24">

            {/* ── Header ── */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <StepIndicator
                  currentStep={currentStep}
                  onStepClick={(i) => i < currentStep && setCurrentStep(i)}
                  size="sm"
                />
              </div>
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  Langkah {currentStep + 1} / {STEPS.length}
                </p>
                <h3 className="text-base font-bold tracking-tight">
                  {STEPS[currentStep].title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {STEPS[currentStep].desc}
                </p>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="min-h-[300px]">
              {currentStep === 0 && (
                <StepIdentitas
                  {...stepProps}
                  onRemoveLogo={handleRemoveLogo}
                  isRemovingLogo={isRemovingLogo}
                />
              )}
              {currentStep === 1 && (
                <StepCerita {...stepProps} />
              )}
              {currentStep === 2 && (
                <StepTampilan
                  {...stepProps}
                  onRemoveHeroBg={handleRemoveHeroBg}
                  isRemovingHeroBg={isRemovingHeroBg}
                  onCtaTextChange={handleCtaTextChange}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Mobile bottom nav ──────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
        <div className="bg-background/90 backdrop-blur-sm border-t px-4 py-3 flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className={cn('gap-1 flex-1 h-9 text-xs font-medium', currentStep === 0 && 'invisible')}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Sebelumnya
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1 flex-1 h-9 text-xs font-medium"
          >
            {isLastStep
              ? <><Eye className="h-3.5 w-3.5" />Preview</>
              : <>Selanjutnya<ChevronRight className="h-3.5 w-3.5" /></>
            }
          </Button>
        </div>
      </div>

      {/* ── Preview Modal ──────────────────────────────────────────── */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        title="Preview Hero Section"
      >
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(formData.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Hero1
                title={formData.heroTitle || formData.name || ''}
                subtitle={formData.heroSubtitle || formData.description}
                ctaText={formData.heroCtaText || 'Lihat Produk'}
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