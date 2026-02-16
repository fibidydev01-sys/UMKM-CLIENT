'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/upload';
import { PreviewModal } from '@/components/settings';
import { Testimonials1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

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
export default function TestimonialsPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<{
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonials: Testimonial[];
  } | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        testimonialsTitle: tenant.testimonialsTitle || '',
        testimonialsSubtitle: tenant.testimonialsSubtitle || '',
        testimonials: (tenant.testimonials as Testimonial[]) || [],
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
                    <Label htmlFor="testimonialsTitle">Judul Section</Label>
                    <Input
                      id="testimonialsTitle"
                      placeholder="Kata Mereka"
                      value={formData.testimonialsTitle}
                      onChange={(e) => updateFormData('testimonialsTitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Heading utama Testimonials Section</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonialsSubtitle">Subtitle Section</Label>
                    <Input
                      id="testimonialsSubtitle"
                      placeholder="Apa kata pelanggan tentang kami"
                      value={formData.testimonialsSubtitle}
                      onChange={(e) => updateFormData('testimonialsSubtitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Sub-heading di bawah judul</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Daftar Testimonial</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newTestimonial: Testimonial = {
                          id: Math.random().toString(36).substring(2, 9),
                          name: '',
                          role: '',
                          content: '',
                        };
                        updateFormData('testimonials', [...formData.testimonials, newTestimonial]);
                      }}
                    >
                      + Tambah Testimonial
                    </Button>
                  </div>

                  {formData.testimonials.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Belum ada testimonial. Klik &quot;Tambah Testimonial&quot; untuk menambahkan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.testimonials.map((testimonial, index) => (
                        <Card key={testimonial.id || index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Testimonial #{index + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  const updated = formData.testimonials.filter((_, i) => i !== index);
                                  updateFormData('testimonials', updated);
                                }}
                              >
                                Hapus
                              </Button>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Nama Pelanggan</Label>
                                <Input
                                  placeholder="John Doe"
                                  value={testimonial.name}
                                  onChange={(e) => {
                                    const updated = [...formData.testimonials];
                                    updated[index] = { ...updated[index], name: e.target.value };
                                    updateFormData('testimonials', updated);
                                  }}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Role/Pekerjaan (Opsional)</Label>
                                <Input
                                  placeholder="Food Blogger"
                                  value={testimonial.role}
                                  onChange={(e) => {
                                    const updated = [...formData.testimonials];
                                    updated[index] = { ...updated[index], role: e.target.value };
                                    updateFormData('testimonials', updated);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Avatar (Opsional)</Label>
                              <div className="max-w-[120px]">
                                <ImageUpload
                                  value={testimonial.avatar}
                                  onChange={(url) => {
                                    const updated = [...formData.testimonials];
                                    updated[index] = { ...updated[index], avatar: url };
                                    updateFormData('testimonials', updated);
                                  }}
                                  onRemove={() => {
                                    const updated = [...formData.testimonials];
                                    updated[index] = { ...updated[index], avatar: '' };
                                    updateFormData('testimonials', updated);
                                  }}
                                  folder="fibidy/testimonial-avatars"
                                  aspectRatio={1}
                                  placeholder="Upload avatar"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">Square 200x200px, PNG/JPG</p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Isi Testimoni</Label>
                              <Textarea
                                placeholder="Produknya sangat berkualitas dan pelayanannya memuaskan!"
                                rows={3}
                                value={testimonial.content}
                                onChange={(e) => {
                                  const updated = [...formData.testimonials];
                                  updated[index] = { ...updated[index], content: e.target.value };
                                  updateFormData('testimonials', updated);
                                }}
                              />
                              <p className="text-xs text-muted-foreground">Rekomendasi: 50-150 kata</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
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
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview Testimonials Section">
        {formData && (
          <>
            <style
              dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }}
            />
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
