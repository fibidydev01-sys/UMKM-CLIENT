'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

// ─── Theme colors ──────────────────────────────────────────────────────────
const THEME_COLORS = [
  { name: 'Sky', value: '#0ea5e9', class: 'bg-sky-500' },
  { name: 'Emerald', value: '#10b981', class: 'bg-emerald-500' },
  { name: 'Rose', value: '#f43f5e', class: 'bg-rose-500' },
  { name: 'Amber', value: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Violet', value: '#8b5cf6', class: 'bg-violet-500' },
  { name: 'Orange', value: '#f97316', class: 'bg-orange-500' },
] as const;

// ─── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Identitas Toko', desc: 'Nama, logo, dan kategori toko Anda' },
  { title: 'Cerita Toko', desc: 'Judul dan deskripsi di hero banner' },
  { title: 'Tampilan & CTA', desc: 'Warna tema, background, dan tombol aksi' },
] as const;

// ─── Step Indicator ────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-200',
              i <= currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                'w-8 h-px transition-colors duration-200',
                i < currentStep ? 'bg-primary' : 'bg-muted'
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

  // ─── Remove handlers ───────────────────────────────────────────────────
  const handleRemoveLogo = async () => {
    if (!tenant || !formData) return;
    setIsRemovingLogo(true);
    try {
      setFormData({ ...formData, logo: '' });
      await tenantsApi.update({ logo: '' });
      await refresh();
      toast.success('Logo berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove logo:', error);
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
    } catch (error) {
      console.error('Failed to remove hero background:', error);
      toast.error('Gagal menghapus hero background');
      setFormData({ ...formData, heroBackgroundImage: tenant.heroBackgroundImage || '' });
    } finally {
      setIsRemovingHeroBg(false);
    }
  };

  // ─── CTA text: max 2 kata, max 15 char ─────────────────────────────────
  const handleCtaTextChange = (value: string) => {
    if (value.length > 15) return;
    const words = value.split(/\s+/).filter(Boolean);
    if (words.length > 2) return;
    updateFormData('heroCtaText', value);
  };

  // ─── Soft warning ──────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.name) missing.push('Nama Toko');
      if (!formData.logo) missing.push('Logo');
    } else if (currentStep === 1) {
      if (!formData.heroTitle) missing.push('Hero Title');
      if (!formData.heroSubtitle) missing.push('Subtitle');
      if (!formData.description) missing.push('Deskripsi');
    } else if (currentStep === 2) {
      if (!formData.heroBackgroundImage) missing.push('Background');
      if (!formData.heroCtaText) missing.push('Teks CTA');
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
    } catch (error) {
      console.error('Failed to save hero section:', error);
      toast.error('Gagal menyimpan hero section');
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
                <StepIdentitas
                  formData={formData}
                  updateFormData={updateFormData}
                  onRemoveLogo={handleRemoveLogo}
                  isRemovingLogo={isRemovingLogo}
                />
              )}
              {currentStep === 1 && (
                <StepCerita
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 2 && (
                <StepTampilan
                  formData={formData}
                  updateFormData={updateFormData}
                  onRemoveHeroBg={handleRemoveHeroBg}
                  isRemovingHeroBg={isRemovingHeroBg}
                  onCtaTextChange={handleCtaTextChange}
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
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview Hero Section">
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