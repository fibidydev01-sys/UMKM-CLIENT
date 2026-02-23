'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal } from '@/components/settings';
import { Testimonials1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { TestimonialsFormData, Testimonial } from '@/types';
import { StepHeader, StepTestimoni } from '@/components/settings/testimonials-section';

// ─── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Header Section', desc: 'Judul dan subtitle untuk Testimonials' },
  { title: 'Daftar Testimoni', desc: 'Testimoni dari pelanggan puas Anda' },
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
export default function TestimonialsPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<TestimonialsFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        testimonialsTitle: tenant.testimonialsTitle || '',
        testimonialsSubtitle: tenant.testimonialsSubtitle || '',
        testimonials: (tenant.testimonials as Testimonial[]) || [],
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof TestimonialsFormData>(key: K, value: TestimonialsFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  // ─── Soft warning ──────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.testimonialsTitle) missing.push('Judul Section');
      if (!formData.testimonialsSubtitle) missing.push('Subtitle');
    } else if (currentStep === 1) {
      if (formData.testimonials.length === 0) missing.push('Minimal 1 Testimonial');
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
        testimonialsTitle: formData.testimonialsTitle,
        testimonialsSubtitle: formData.testimonialsSubtitle,
        testimonials: formData.testimonials,
      });
      await refresh();
      toast.success('Testimonials berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save testimonials:', error);
      toast.error('Gagal menyimpan testimonials');
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
                <StepTestimoni formData={formData} updateFormData={updateFormData} />
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
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview Testimonials Section">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            {formData.testimonials.length === 0 ? (
              <div className="border rounded-lg p-8 bg-muted/20 text-center mt-4">
                <p className="text-muted-foreground">
                  Tambahkan minimal 1 testimonial untuk melihat preview
                </p>
              </div>
            ) : (
              <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
                <Testimonials1
                  title={formData.testimonialsTitle || 'Testimoni'}
                  subtitle={formData.testimonialsSubtitle}
                  items={formData.testimonials}
                />
              </div>
            )}
          </>
        )}
      </PreviewModal>
    </div>
  );
}