'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AutoSaveStatus } from '@/components/dashboard/settings/shared';
import { toast } from 'sonner';
import { useTenant, useAutoSave } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { SeoFormData, SocialLinks } from '@/types';
import { StepSocialLinks } from '.';
import { PreviewModal } from '@/components/dashboard/settings/shared';

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: '',
  twitter: '',
  threads: '',
  whatsapp: '',
  telegram: '',
  pinterest: '',
  behance: '',
  dribbble: '',
  vimeo: '',
  linkedin: '',
};

// ─── Social Preview ────────────────────────────────────────────────────────
function SocialPreview({ socialLinks }: { socialLinks: SocialLinks }) {
  const filled = Object.entries(socialLinks).filter(([, v]) => v);

  return (
    <div className="space-y-5 mt-4">
      <div className="space-y-2">
        <p className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground">
          Active Links ({filled.length})
        </p>
        <div className="rounded-lg border p-4 bg-muted/20">
          {filled.length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links added yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filled.map(([key, url]) => (
                <div key={key} className="flex items-center gap-3 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-[11px] font-semibold uppercase text-muted-foreground w-20 shrink-0">
                    {key}
                  </span>
                  <span className="text-xs text-foreground truncate font-mono">{url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SocialSection() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<SeoFormData>(() => ({
    socialLinks: {
      ...DEFAULT_SOCIAL_LINKS,
      ...(tenant?.socialLinks as SocialLinks | null ?? {}),
    },
  }));

  const { status: autoSaveStatus } = useAutoSave(formData);

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  const handlePreview = () => setShowPreview(true);

  const handleSave = async () => {
    if (!tenant) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({ socialLinks: formData.socialLinks });
      await refresh();
      toast.success('Social links saved successfully');
      setShowPreview(false);
    } catch {
      toast.error('Failed to save social links');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = tenant === null;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">

        {/* ── DESKTOP SKELETON ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:flex-col lg:h-full">

          {/* Header */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-44 rounded-md" />
            </div>
          </div>

          {/* Content — count pill + 3 groups */}
          <div className="flex-1 pb-20 min-h-[280px]">
            <div className="space-y-7">
              {/* Count pill */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-[11px] w-24 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              {/* Group 1: Social Media — 6 fields, 2-col */}
              <div className="space-y-3">
                <Skeleton className="h-[11px] w-28 rounded-full" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-[11px] w-20 rounded-full" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Group 2: Messaging — 2 fields */}
              <div className="space-y-3">
                <Skeleton className="h-[11px] w-20 rounded-full" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-[11px] w-20 rounded-full" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Group 3: Creative — 5 fields */}
              <div className="space-y-3">
                <Skeleton className="h-[11px] w-36 rounded-full" />
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Skeleton className="h-[11px] w-20 rounded-full" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Tip border-l */}
              <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5 space-y-1">
                <Skeleton className="h-3 w-full max-w-md rounded-full" />
                <Skeleton className="h-3 w-3/4 max-w-sm rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── MOBILE SKELETON ──────────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col pb-24">

          {/* AutoSaveStatus + title centered */}
          <div className="mb-6 text-center space-y-0.5">
            <div className="flex justify-center">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-3.5 h-3.5 rounded-sm" />
                <Skeleton className="h-[11px] w-14 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-36 rounded-md mx-auto" />
          </div>

          {/* Card skeleton */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm border rounded-lg p-6 space-y-4">
              <div className="flex justify-center gap-2">
                <Skeleton className="h-[11px] w-20 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-px w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-[11px] w-20 rounded-full" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FIXED BOTTOM DESKTOP */}
        <div
          className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
          style={{ left: 'var(--sidebar-width)' }}
        >
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>

        {/* ── FIXED BOTTOM MOBILE */}
        <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
          <div className="px-4 py-3 flex items-center justify-end">
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      {/* DESKTOP */}
      <div className="hidden lg:flex lg:flex-col lg:h-full">
        <div className="flex items-start justify-between gap-8 pb-6 border-b mb-8">
          <div className="space-y-1">
            <AutoSaveStatus status={autoSaveStatus} />
            <h2 className="text-2xl font-bold tracking-tight leading-none">Social Links</h2>
          </div>
        </div>

        <div className="flex-1 pb-20 min-h-[280px]">
          <StepSocialLinks
            formData={formData}
            onSocialLinkChange={handleSocialLinkChange}
            isDesktop
          />
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden flex flex-col pb-24">
        <div className="mb-6 text-center space-y-0.5">
          <div className="flex justify-center">
            <AutoSaveStatus status={autoSaveStatus} />
          </div>
          <h3 className="text-base font-bold tracking-tight">Social Links</h3>
        </div>
        <div className="min-h-[260px]">
          <StepSocialLinks
            formData={formData}
            onSocialLinkChange={handleSocialLinkChange}
          />
        </div>
      </div>

      {/* Desktop - fixed bottom */}
      <div
        className="hidden lg:flex fixed bottom-0 right-0 z-40 items-center justify-end px-8 py-4 bg-background/90 backdrop-blur-sm border-t"
        style={{ left: 'var(--sidebar-width)' }}
      >
        <Button onClick={handlePreview} className="gap-1.5 h-9 text-sm">
          <Eye className="h-3.5 w-3.5" />Preview &amp; Save
        </Button>
      </div>

      {/* Mobile - fixed bottom */}
      <div className="lg:hidden fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t">
        <div className="px-4 py-3 flex items-center justify-end">
          <Button size="sm" onClick={handlePreview} className="h-9 px-4 text-xs font-medium">
            Preview
          </Button>
        </div>
      </div>

      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onSave={handleSave}
        isSaving={isSaving}
        title="Social Links Preview"
      >
        <SocialPreview socialLinks={formData.socialLinks} />
      </PreviewModal>
    </div>
  );
}