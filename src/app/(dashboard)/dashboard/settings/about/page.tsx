'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal } from '@/components/settings';
import { About1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { AboutFormData, FeatureItem } from '@/types';
import { StepIdentitas, StepKonten, StepFitur } from '@/components/settings/about-section';

// ─── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Identitas Section', desc: 'Judul dan subtitle untuk About Section' },
  { title: 'Konten & Visual', desc: 'Deskripsi lengkap dan gambar ilustrasi' },
  { title: 'Fitur Unggulan', desc: 'Highlight keunggulan toko Anda' },
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
export default function AboutPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingAboutImage, setIsRemovingAboutImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<AboutFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        aboutTitle: tenant.aboutTitle || '',
        aboutSubtitle: tenant.aboutSubtitle || '',
        aboutContent: tenant.aboutContent || '',
        aboutImage: tenant.aboutImage || '',
        aboutFeatures: (tenant.aboutFeatures as FeatureItem[]) || [],
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  // ─── Remove handler ────────────────────────────────────────────────────
  const handleRemoveAboutImage = async () => {
    if (!tenant || !formData) return;
    setIsRemovingAboutImage(true);
    try {
      setFormData({ ...formData, aboutImage: '' });
      await tenantsApi.update({ aboutImage: '' });
      await refresh();
      toast.success('About image berhasil dihapus');
    } catch (error) {
      console.error('Failed to remove about image:', error);
      toast.error('Gagal menghapus about image');
      setFormData({ ...formData, aboutImage: tenant.aboutImage || '' });
    } finally {
      setIsRemovingAboutImage(false);
    }
  };

  // ─── Soft warning ──────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.aboutTitle) missing.push('Judul Section');
      if (!formData.aboutSubtitle) missing.push('Subtitle');
    } else if (currentStep === 1) {
      if (!formData.aboutContent) missing.push('Deskripsi Lengkap');
      if (!formData.aboutImage) missing.push('About Image');
    } else if (currentStep === 2) {
      if (formData.aboutFeatures.length === 0) missing.push('Minimal 1 Fitur');
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
        aboutTitle: formData.aboutTitle,
        aboutSubtitle: formData.aboutSubtitle,
        aboutContent: formData.aboutContent,
        aboutImage: formData.aboutImage,
        aboutFeatures: formData.aboutFeatures,
      });
      await refresh();
      toast.success('About Section berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save about section:', error);
      toast.error('Gagal menyimpan about section');
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
                <StepIdentitas formData={formData} updateFormData={updateFormData} />
              )}
              {currentStep === 1 && (
                <StepKonten
                  formData={formData}
                  updateFormData={updateFormData}
                  onRemoveAboutImage={handleRemoveAboutImage}
                  isRemovingAboutImage={isRemovingAboutImage}
                />
              )}
              {currentStep === 2 && (
                <StepFitur formData={formData} updateFormData={updateFormData} />
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
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview About Section">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <About1
                title={formData.aboutTitle || 'Tentang Kami'}
                subtitle={formData.aboutSubtitle}
                content={formData.aboutContent}
                image={formData.aboutImage}
                features={formData.aboutFeatures}
              />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}