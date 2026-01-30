/**
 * ============================================================================
 * FILE: app/settings/seo/page.tsx
 * ============================================================================
 * Route: /settings/seo
 * Description: SEO & social media settings page
 * ============================================================================
 */
'use client';

import { useState, useEffect } from 'react';
import { SeoSettings } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { SocialLinks } from '@/types';

export default function SeoPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

  const [seoSettings, setSeoSettings] = useState<{
    metaTitle: string;
    metaDescription: string;
    socialLinks: SocialLinks;
  } | null>(null);

  // Initialize form data from tenant
  useEffect(() => {
    if (tenant && seoSettings === null) {
      setSeoSettings({
        metaTitle: tenant.metaTitle || '',
        metaDescription: tenant.metaDescription || '',
        socialLinks: tenant.socialLinks || {},
      });
    }
  }, [tenant, seoSettings]);

  const handleSave = async () => {
    if (!tenant || !seoSettings) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        metaTitle: seoSettings.metaTitle || undefined,
        metaDescription: seoSettings.metaDescription || undefined,
        socialLinks: seoSettings.socialLinks,
      });
      await refresh();
      toast.success('Pengaturan SEO berhasil disimpan');
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      toast.error('Gagal menyimpan pengaturan SEO');
    } finally {
      setIsSaving(false);
    }
  };

  const tenantLoading = tenant === null;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">SEO & Media Sosial</h1>
        <p className="text-muted-foreground mt-2">
          Optimasi mesin pencari dan integrasi media sosial untuk toko Anda.
        </p>
      </div>

      {/* Content */}
      <SeoSettings
        settings={seoSettings}
        tenantName={tenant?.name}
        tenantSlug={tenant?.slug}
        tenantDescription={tenant?.description}
        isLoading={tenantLoading}
        isSaving={isSaving}
        onSettingsChange={setSeoSettings}
        onSave={handleSave}
      />
    </>
  );
}
