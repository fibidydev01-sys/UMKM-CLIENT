'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Cta1 } from '@/components/landing/blocks';
import { PreviewModal } from '@/components/settings';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

// ─── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Konten CTA', desc: 'Judul dan subtitle untuk Call to Action' },
  { title: 'Tombol CTA', desc: 'Teks, link, dan style tombol aksi' },
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
export default function CTAPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<{
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButtonText: string;
    ctaButtonLink: string;
    ctaButtonStyle: 'primary' | 'secondary' | 'outline';
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        ctaTitle: tenant.ctaTitle || '',
        ctaSubtitle: tenant.ctaSubtitle || '',
        ctaButtonText: tenant.ctaButtonText || '',
        ctaButtonLink: tenant.ctaButtonLink || '',
        ctaButtonStyle: tenant.ctaButtonStyle || 'primary',
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  // ─── Soft warning: kabari kalau ada field kosong ──────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.ctaTitle) missing.push('Judul CTA');
      if (!formData.ctaSubtitle) missing.push('Subtitle CTA');
    } else if (currentStep === 1) {
      if (!formData.ctaButtonText) missing.push('Teks Tombol');
      if (!formData.ctaButtonLink) missing.push('Link Tombol');
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
        ctaTitle: formData.ctaTitle,
        ctaSubtitle: formData.ctaSubtitle,
        ctaButtonText: formData.ctaButtonText,
        ctaButtonLink: formData.ctaButtonLink,
        ctaButtonStyle: formData.ctaButtonStyle,
      });
      await refresh();
      toast.success('CTA Section berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save CTA section:', error);
      toast.error('Gagal menyimpan CTA section');
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
            {/* ── Header ──────────────────────────────────────────── */}
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

            {/* ── Body ────────────────────────────────────────────── */}
            <div className="min-h-[280px]">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ctaTitle">Judul CTA</Label>
                    <Input
                      id="ctaTitle"
                      placeholder="Siap Memulai?"
                      value={formData.ctaTitle}
                      onChange={(e) => updateFormData('ctaTitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Heading utama CTA Section (pertanyaan atau pernyataan)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaSubtitle">Subtitle CTA</Label>
                    <Input
                      id="ctaSubtitle"
                      placeholder="Bergabunglah dengan ribuan pelanggan puas kami"
                      value={formData.ctaSubtitle}
                      onChange={(e) => updateFormData('ctaSubtitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Sub-heading yang menjelaskan value proposition
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ctaButtonText">Teks Tombol</Label>
                    <Input
                      id="ctaButtonText"
                      placeholder="Mulai Sekarang"
                      value={formData.ctaButtonText}
                      onChange={(e) => updateFormData('ctaButtonText', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Label pada tombol CTA (2-4 kata, action-oriented)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaButtonLink">Link Tombol</Label>
                    <Input
                      id="ctaButtonLink"
                      placeholder="/products"
                      value={formData.ctaButtonLink}
                      onChange={(e) => updateFormData('ctaButtonLink', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      URL tujuan saat tombol diklik (internal: /products atau external: https://...)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaButtonStyle">Gaya Tombol</Label>
                    <Select
                      value={formData.ctaButtonStyle}
                      onValueChange={(value: 'primary' | 'secondary' | 'outline') =>
                        updateFormData('ctaButtonStyle', value)
                      }
                    >
                      <SelectTrigger id="ctaButtonStyle">
                        <SelectValue placeholder="Pilih gaya tombol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary (Warna Tema)</SelectItem>
                        <SelectItem value="secondary">Secondary (Abu-abu)</SelectItem>
                        <SelectItem value="outline">Outline (Hanya Border)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Pilih gaya visual untuk tombol CTA</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Label>Preview Tombol</Label>
                    <div className="flex items-center gap-3 p-6 bg-muted/50 rounded-lg">
                      <Button
                        variant={
                          formData.ctaButtonStyle === 'primary'
                            ? 'default'
                            : (formData.ctaButtonStyle as 'secondary' | 'outline')
                        }
                        disabled
                      >
                        {formData.ctaButtonText || 'Mulai Sekarang'}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Preview tombol CTA Anda
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Nav ───────────────────────────────────────────── */}
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

      {/* ── Preview ──────────────────────────────────────────────── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview CTA Section">
        {formData && (
          <>
            <style
              dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }}
            />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <Cta1
                title={formData.ctaTitle || 'Siap Memulai?'}
                subtitle={formData.ctaSubtitle}
                buttonText={formData.ctaButtonText || 'Mulai Sekarang'}
                buttonLink={formData.ctaButtonLink || '/products'}
                buttonVariant={
                  formData.ctaButtonStyle === 'outline'
                    ? 'outline'
                    : formData.ctaButtonStyle === 'secondary'
                      ? 'secondary'
                      : 'default'
                }
              />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}
