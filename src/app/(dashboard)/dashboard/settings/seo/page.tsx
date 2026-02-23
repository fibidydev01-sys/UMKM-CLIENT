'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { SeoFormData, SocialLinks } from '@/types';
import { StepMeta, StepSosmed } from '@/components/settings/seo-section';

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string }[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'threads', label: 'Threads' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'behance', label: 'Behance' },
  { key: 'dribbble', label: 'Dribbble' },
  { key: 'vimeo', label: 'Vimeo' },
  { key: 'linkedin', label: 'LinkedIn' },
];

// ─── Wizard Steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'meta-seo', title: 'Meta SEO', desc: 'Optimasi untuk mesin pencari Google', icon: Search },
  { id: 'social-media', title: 'Social Media', desc: 'Link ke akun media sosial toko', icon: Share2 },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SeoPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<SeoFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      setFormData({
        metaTitle: tenant.metaTitle || '',
        metaDescription: tenant.metaDescription || '',
        socialLinks: tenant.socialLinks || {},
      });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof SeoFormData>(key: K, value: SeoFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    if (formData) setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [key]: value } });
  };

  // ─── Soft Warning ───────────────────────────────────────────────────────────
  const checkEmptyFields = () => {
    if (!formData) return;
    const missing: string[] = [];
    if (currentStep === 0) {
      if (!formData.metaTitle) missing.push('Meta Title');
      if (!formData.metaDescription) missing.push('Meta Description');
    } else if (currentStep === 1) {
      if (!Object.values(formData.socialLinks).some((v) => v)) missing.push('Minimal 1 link social media');
    }
    if (missing.length > 0) toast.info(`Isi ${missing.join(', ')} untuk hasil lebih baik`);
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────
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

  // ─── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!tenant || !formData) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        socialLinks: formData.socialLinks,
      });
      await refresh();
      toast.success('Pengaturan SEO berhasil disimpan');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      toast.error('Gagal menyimpan pengaturan SEO');
    } finally {
      setIsSaving(false);
    }
  };

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
                    {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
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
                <StepMeta
                  formData={formData}
                  updateFormData={updateFormData}
                  tenantName={tenant?.name}
                  tenantSlug={tenant?.slug}
                  tenantDescription={tenant?.description}
                />
              )}
              {currentStep === 1 && (
                <StepSosmed formData={formData} onSocialLinkChange={handleSocialLinkChange} />
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
          {currentStep === STEPS.length - 1 ? 'Preview' : 'Selanjutnya'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* ── Preview ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Preview SEO Settings">
        {formData && (
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Preview di Google</h4>
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {formData.metaTitle || tenant?.name || 'Nama Toko'}
                </p>
                <p className="text-green-700 text-sm">{tenant?.slug}.fibidy.com</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.metaDescription || tenant?.description || 'Deskripsi toko akan muncul di sini...'}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Social Media Links</h4>
              <div className="rounded-lg border p-4 bg-muted/30 space-y-2">
                {SOCIAL_FIELDS.filter(({ key }) => formData.socialLinks[key]).map(({ key, label }) => (
                  <p key={key} className="text-sm">
                    <span className="text-muted-foreground">{label}:</span>{' '}
                    {formData.socialLinks[key]}
                  </p>
                ))}
                {!Object.values(formData.socialLinks).some((v) => v) && (
                  <p className="text-sm text-muted-foreground">Belum ada social media yang diisi</p>
                )}
              </div>
            </div>
          </div>
        )}
      </PreviewModal>
    </div>
  );
}