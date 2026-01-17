/**
 * ============================================================================
 * FILE: app/(dashboard)/dashboard/landing-builder/customize/page.tsx
 * ============================================================================
 * Route: /dashboard/landing-builder/customize
 * Description: Live Landing Page Customization with Split Layout
 * LEFT: Edit Panel (40%) | RIGHT: Live Preview (60%)
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/dashboard';
import { LandingBuilder, LivePreview, LandingErrorBoundary } from '@/components/landing-builder';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { productsApi } from '@/lib/api';
import { getAllTemplates, getTemplateDefaults, mergeWithTemplateDefaults } from '@/lib/landing';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { TenantLandingConfig, Product } from '@/types';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CustomizeLandingPage() {
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // ============================================================================
  // LANDING CONFIG HOOK
  // ============================================================================

  const {
    config: landingConfig,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig: setLandingConfig,
    publishChanges: handlePublish,
    discardChanges: handleDiscard,
    resetToDefaults: handleReset,
    clearValidationErrors: clearErrors,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  // ============================================================================
  // FETCH PRODUCTS FOR PREVIEW
  // ============================================================================

  useEffect(() => {
    const fetchProducts = async () => {
      if (!tenant) return;

      try {
        setProductsLoading(true);
        const response = await productsApi.getByStore(tenant.slug, {
          isActive: true,
          limit: 12,
        });
        setProducts(response.data);
      } catch (error) {
        console.error('[CustomizeLanding] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [tenant]);

  // ============================================================================
  // TEMPLATE SWITCHING
  // ============================================================================

  const templates = getAllTemplates();
  const currentTemplateId = landingConfig?.template || 'suspended-minimalist';

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      if (!tenant) return;

      // Get template defaults
      const templateDefaults = getTemplateDefaults(templateId as any, {
        name: tenant.name,
        category: tenant.category,
      });

      // Merge with existing config (preserve user edits where possible)
      const mergedConfig = mergeWithTemplateDefaults(
        landingConfig,
        templateId as any,
        {
          name: tenant.name,
          category: tenant.category,
        }
      );

      // Update config
      setLandingConfig(mergedConfig as TenantLandingConfig);
    },
    [tenant, landingConfig, setLandingConfig]
  );

  // ============================================================================
  // INITIAL TEMPLATE APPLICATION
  // ============================================================================

  useEffect(() => {
    if (!tenant) return;
    if (!initialTemplateParam) return;
    if (landingConfig?.template === initialTemplateParam) return;

    // Apply initial template from URL param
    // Get template defaults
    const templateDefaults = getTemplateDefaults(initialTemplateParam as any, {
      name: tenant.name,
      category: tenant.category,
    });

    // Merge with existing config (preserve user edits where possible)
    const mergedConfig = mergeWithTemplateDefaults(
      landingConfig,
      initialTemplateParam as any,
      {
        name: tenant.name,
        category: tenant.category,
      }
    );

    // Update config
    setLandingConfig(mergedConfig as TenantLandingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateParam, tenant?.name, tenant?.category]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  const tenantLoading = tenant === null;

  if (tenantLoading) {
    return (
      <div>
        <PageHeader
          title="Landing Page Builder"
          description="Customize your landing page with live preview"
        />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div>
        <PageHeader
          title="Landing Page Builder"
          description="Customize your landing page with live preview"
        />
        <p className="text-muted-foreground mt-6">Gagal memuat data tenant</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER: SPLIT LAYOUT
  // ============================================================================

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <PageHeader
        title="Landing Page Builder"
        description="Edit kiri, lihat perubahan langsung di kanan"
        action={
          <Link href="/dashboard/landing-builder/gallery">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        }
      />

      {/* Top Bar: Template Selector + Actions */}
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-muted/30 mt-4">
        <div className="flex items-center gap-4">
          {/* Template Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Template:</span>
            <Select value={currentTemplateId} onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unsaved Changes Badge */}
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              Unsaved Changes
            </Badge>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">
              {validationErrors.length} Error(s)
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
            >
              Discard
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            onClick={handlePublish}
            disabled={isSaving || !hasUnsavedChanges}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Split Layout: Edit Panel (LEFT) + Live Preview (RIGHT) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Edit Panel (40%) */}
        <div className="w-[40%] border-r overflow-auto">
          <LandingErrorBoundary>
            <LandingBuilder
              config={landingConfig}
              onConfigChange={setLandingConfig}
              tenantSlug={tenant.slug}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
              validationErrors={validationErrors}
              onPublish={handlePublish}
              onDiscard={handleDiscard}
              onReset={handleReset}
              onClearErrors={clearErrors}
            />
          </LandingErrorBoundary>
        </div>

        {/* RIGHT: Live Preview (60%) */}
        <div className="w-[60%] overflow-hidden">
          <LandingErrorBoundary>
            <LivePreview
              config={landingConfig}
              tenant={tenant}
              products={products}
              isLoading={productsLoading}
            />
          </LandingErrorBoundary>
        </div>
      </div>
    </div>
  );
}
