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
import { About1 } from '@/components/landing/blocks';
import { generateThemeCSS } from '@/lib/theme';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { FeatureItem } from '@/types';

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
export default function AboutPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingAboutImage, setIsRemovingAboutImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<{
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    aboutImage: string;
    aboutFeatures: FeatureItem[];
  } | null>(null);

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

  const updateFormData = <K extends keyof NonNullable<typeof formData>>(
    key: K,
    value: NonNullable<typeof formData>[K]
  ) => {
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

  // ─── Soft warning: kabari kalau ada field kosong ──────────────────────
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
                    <Label htmlFor="aboutTitle">Judul Section</Label>
                    <Input
                      id="aboutTitle"
                      placeholder="Tentang Kami"
                      value={formData.aboutTitle}
                      onChange={(e) => updateFormData('aboutTitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Heading utama About Section</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutSubtitle">Subtitle Section</Label>
                    <Input
                      id="aboutSubtitle"
                      placeholder="Cerita di balik toko kami"
                      value={formData.aboutSubtitle}
                      onChange={(e) => updateFormData('aboutSubtitle', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Sub-heading di bawah judul</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="aboutContent">Deskripsi Lengkap</Label>
                    <Textarea
                      id="aboutContent"
                      placeholder="Ceritakan tentang toko Anda, misi, visi, dan apa yang membuat Anda berbeda..."
                      rows={6}
                      value={formData.aboutContent}
                      onChange={(e) => updateFormData('aboutContent', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Rekomendasi: 150-300 kata untuk readability
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>About Section Image</Label>
                    <ImageUpload
                      value={formData.aboutImage}
                      onChange={(url) => updateFormData('aboutImage', url)}
                      onRemove={handleRemoveAboutImage}
                      disabled={isRemovingAboutImage}
                      folder="fibidy/about-images"
                      aspectRatio={1.5}
                      placeholder="Upload about image"
                    />
                    <p className="text-xs text-muted-foreground">
                      800x533px atau 1200x800px, JPG/PNG
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Fitur-Fitur Unggulan</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newFeature: FeatureItem = { title: '', description: '' };
                        updateFormData('aboutFeatures', [...formData.aboutFeatures, newFeature]);
                      }}
                    >
                      + Tambah Fitur
                    </Button>
                  </div>

                  {formData.aboutFeatures.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Belum ada fitur. Klik &quot;Tambah Fitur&quot; untuk menambahkan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.aboutFeatures.map((feature, index) => (
                        <Card key={index} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Fitur #{index + 1}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  const updated = formData.aboutFeatures.filter((_, i) => i !== index);
                                  updateFormData('aboutFeatures', updated);
                                }}
                              >
                                Hapus
                              </Button>
                            </div>
                            <div className="grid gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Feature Icon (Opsional)</Label>
                                <div className="max-w-[120px]">
                                  <ImageUpload
                                    value={feature.icon}
                                    onChange={(url) => {
                                      const updated = [...formData.aboutFeatures];
                                      updated[index] = { ...updated[index], icon: url };
                                      updateFormData('aboutFeatures', updated);
                                    }}
                                    onRemove={() => {
                                      const updated = [...formData.aboutFeatures];
                                      updated[index] = { ...updated[index], icon: '' };
                                      updateFormData('aboutFeatures', updated);
                                    }}
                                    folder="fibidy/feature-icons"
                                    aspectRatio={1}
                                    placeholder="Upload icon"
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">Square 200x200px, PNG</p>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-1">
                                  <Label className="text-xs">Judul Fitur</Label>
                                  <Input
                                    placeholder="Kualitas Terjamin"
                                    value={feature.title}
                                    onChange={(e) => {
                                      const updated = [...formData.aboutFeatures];
                                      updated[index] = { ...updated[index], title: e.target.value };
                                      updateFormData('aboutFeatures', updated);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs">Deskripsi Fitur</Label>
                                  <Input
                                    placeholder="Produk berkualitas tinggi"
                                    value={feature.description}
                                    onChange={(e) => {
                                      const updated = [...formData.aboutFeatures];
                                      updated[index] = {
                                        ...updated[index],
                                        description: e.target.value,
                                      };
                                      updateFormData('aboutFeatures', updated);
                                    }}
                                  />
                                </div>
                              </div>
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
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview About Section">
        {formData && (
          <>
            <style
              dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }}
            />
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
