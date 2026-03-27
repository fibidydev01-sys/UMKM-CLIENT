'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PreviewModal, AutoSaveStatus } from '@/components/dashboard/settings/shared';
import { About1 } from '@/components/public/store';
import { generateThemeCSS } from '@/lib/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
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
      setFormData({ aboutFeatures: (tenant.aboutFeatures as FeatureItem[]) || [] });
    }
  }, [tenant, formData]);

  const { status: autoSaveStatus } = useAutoSave(formData ?? null);

  const updateFormData = <K extends keyof AboutFormData>(key: K, value: AboutFormData[K]) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const handleSave = async () => {
    if (!tenant || !formData) return;
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

  const isLoading = tenant === null || formData === null;
  const stepProps = { formData: formData!, updateFormData };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">

        {/* ── DESKTOP SKELETON ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:h-full">

          {/* Header row: AutoSaveStatus + title (no StepIndicator) */}
          <div className="pb-6 border-b mb-8 space-y-1">
            {/* AutoSaveStatus: icon w-3.5 h-3.5 + text h-[11px] */}
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-3.5 h-3.5 rounded-sm" />
              <Skeleton className="h-[11px] w-16 rounded-full" />
            </div>
            {/* h2 text-2xl font-bold leading-none */}
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>

          {/* Content — mirrors StepHighlights desktop: space-y-6 */}
          <div className="flex-1 pb-20 min-h-[280px]">
            <div className="space-y-6">
              {/* Header row: label+desc LEFT | Add Highlight btn RIGHT */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {/* "KEY HIGHLIGHTS" label text-[11px] uppercase */}
                  <Skeleton className="h-[11px] w-28 rounded-full" />
                  {/* sub-desc text-xs */}
                  <Skeleton className="h-3 w-52 rounded-full" />
                </div>
                {/* Add Highlight btn: h-8 text-xs */}
                <Skeleton className="h-8 w-36 rounded-md" />
              </div>
              {/* Empty state: h-[300px] border-2 dashed rounded-lg */}
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* ── MOBILE SKELETON ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col pb-24">
          <div className="flex flex-col items-center gap-4">
            {/* Add Highlight btn: h-8 */}
            <Skeleton className="h-8 w-36 rounded-md" />
            {/* Empty state: min-h-[200px] max-w-sm border-2 dashed */}
            <Skeleton className="h-[200px] w-full max-w-sm rounded-lg" />
          </div>
        </div>

        {/* ── FIXED BOTTOM DESKTOP — rendered in skeleton to prevent layout shift */}
        <div
          className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
          style={{ left: 'var(--sidebar-width)' }}
        >
          {/* Preview & Save btn: gap-1.5 h-9 text-sm */}
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>

        {/* ── FIXED BOTTOM MOBILE */}
        <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
          <div className="px-4 py-3 flex items-center justify-end">
            {/* Preview btn: h-9 px-4 text-xs */}
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="pb-6 border-b mb-8 space-y-1">
        {/* ✅ AutoSaveStatus di atas judul */}
        <AutoSaveStatus status={autoSaveStatus} />
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

      {/* Mobile header — di atas StepHighlights mobile */}
      <div className="lg:hidden fixed top-[var(--header-height,56px)] left-0 right-0 z-10 px-4 pt-4 pb-2 flex justify-center">
        <AutoSaveStatus status={autoSaveStatus} />
      </div>

      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} onSave={handleSave} isSaving={isSaving} title="Highlights Preview">
        {formData && (
          <>
            <style dangerouslySetInnerHTML={{ __html: generateThemeCSS(tenant?.theme?.primaryColor) }} />
            <div className="tenant-theme border rounded-lg overflow-hidden mt-4">
              <About1 features={formData.aboutFeatures} title="" />
            </div>
          </>
        )}
      </PreviewModal>
    </div>
  );
}