'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PreviewModal } from '@/components/dashboard/settings/shared';
import { TenantAbout } from '@/components/public/store/about/tenant-about';
import { generateThemeCSS } from '@/lib/shared';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { AboutFormData, FeatureItem } from '@/types';
import { StepHighlights } from '.';

export function AboutSection() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<AboutFormData | null>(null);

  useEffect(() => {
    if (tenant && formData === null) {
      const features = (tenant.aboutFeatures as FeatureItem[]) || [];
      const validFeatures = features.filter(
        (f) => f && typeof f === 'object' && !Array.isArray(f)
      );
      setFormData({ aboutFeatures: validFeatures });
    }
  }, [tenant, formData]);

  const updateFormData = <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const validate = (): boolean => {
    if (!formData) return false;

    const features = formData.aboutFeatures;

    // Boleh kosong — user memang mau hapus semua highlights
    if (features.length === 0) return true;

    for (let i = 0; i < features.length; i++) {
      const f = features[i];
      const num = `#${i + 1}`;

      if (!f.title?.trim()) {
        toast.error(`Highlight ${num}: Title is required`);
        return false;
      }

      if (!f.description?.trim()) {
        toast.error(`Highlight ${num}: Description is required`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!tenant || !formData) return;

    if (!validate()) return;

    setIsSaving(true);
    try {
      await tenantsApi.update({ aboutFeatures: formData.aboutFeatures });
      await refresh();
      toast.success('Highlights saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save highlights');
    } finally {
      setIsSaving(false);
    }
  };

  const stepProps = { formData: formData!, updateFormData };

  if (!tenant || !formData) return null;

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="pb-6 border-b mb-8 space-y-1">
        <h2 className="text-2xl font-bold tracking-tight leading-none">Key Highlights</h2>
      </div>

      {/* Content */}
      <div className="flex-1 pb-20">
        <div className="hidden lg:block">
          <StepHighlights {...stepProps} isDesktop />
        </div>
        <div className="lg:hidden pb-24">
          <StepHighlights {...stepProps} />
        </div>
      </div>

      {/* Desktop - fixed bottom */}
      <div
        className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <Button onClick={() => setShowPreview(true)} className="gap-1.5 h-9 text-sm">
          <Eye className="h-3.5 w-3.5" />Preview &amp; Save
        </Button>
      </div>

      {/* Mobile - fixed bottom */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-end">
          <Button size="sm" onClick={() => setShowPreview(true)} className="h-9 px-4 text-xs font-medium">
            Preview
          </Button>
        </div>
      </div>

      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Highlights Preview">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <TenantAbout features={formData.aboutFeatures} />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}