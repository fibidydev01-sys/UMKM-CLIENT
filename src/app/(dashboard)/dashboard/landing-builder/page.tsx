'use client';

/**
 * Landing Builder — Hero only
 */

import { useState, useCallback, useEffect } from 'react';
import {
  LivePreview, LandingErrorBoundary,
  BlockDrawer, BuilderLoadingSteps, FullPreviewDrawer,
} from '@/components/landing-builder';
import { BuilderHeader } from '@/components/landing-builder/builder-header';
import { UpgradeModal } from '@/components/dashboard/shared/upgrade-modal';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/dashboard/use-landing-config';
import { useSubscriptionPlan } from '@/hooks/dashboard/use-subscription-plan';
import { productsApi } from '@/lib/api';
import { hasProBlocks } from '@/components/landing-builder/block-options';
import type { TenantLandingConfig, Product } from '@/types';

export default function LandingBuilderPage() {
  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const { blockVariantLimit, isBusiness } = useSubscriptionPlan();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  const {
    config: landingConfig,
    hasUnsavedChanges,
    isSaving,
    updateConfig: setLandingConfig,
    publishChanges: publishToServer,
    discardChanges: handleDiscard,
    resetToDefaults: handleReset,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  const configHasProBlocks = !isBusiness && hasProBlocks(landingConfig, blockVariantLimit);

  const handlePublish = useCallback(async () => {
    if (configHasProBlocks) {
      setUpgradeModalOpen(true);
      return;
    }
    await publishToServer();
  }, [configHasProBlocks, publishToServer]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!tenant) return;
      try {
        setProductsLoading(true);
        const response = await productsApi.getByStore(tenant.slug, { isActive: true, limit: 12 });
        setProducts(response.data);
      } catch {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [tenant]);

  const handleBlockSelect = useCallback((block: string) => {
    if (!landingConfig) return;
    const currentHero = landingConfig.hero || {};
    setLandingConfig({ ...landingConfig, hero: { ...currentHero, block } } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  const handleEnableHero = useCallback(() => {
    if (!landingConfig) return;
    setLandingConfig({
      ...landingConfig,
      hero: { ...landingConfig.hero, enabled: true },
    } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  // Loading
  const tenantLoading = tenant === null;
  const configReady = landingConfig !== null && landingConfig !== undefined;
  const isStillLoading = tenantLoading || productsLoading || !configReady;

  if (isStillLoading || !loadingComplete) {
    return (
      <BuilderLoadingSteps
        key="builder-loading"
        loadingStates={{ tenantLoading, productsLoading, configReady }}
        onComplete={() => setLoadingComplete(true)}
      />
    );
  }

  if (!tenant) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load store data</p>
      </div>
    );
  }

  return (
    <>
      <BuilderHeader
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        configHasProBlocks={configHasProBlocks}
        tenantSlug={tenant.slug}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
        onReset={handleReset}
        onFullPreview={() => setFullPreviewOpen(true)}
      />

      <div className="fixed inset-0 top-14 overflow-hidden">
        <LandingErrorBoundary>
          <LivePreview
            config={landingConfig}
            tenant={tenant}
            onEnableHero={handleEnableHero}
          />
        </LandingErrorBoundary>
      </div>

      <BlockDrawer
        section="hero"
        currentBlock={landingConfig?.hero?.block}
        onBlockSelect={handleBlockSelect}
        blockVariantLimit={blockVariantLimit}
      />

      <FullPreviewDrawer
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
        config={landingConfig}
        tenant={tenant}
        products={products}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        title="Upgrade to publish Pro blocks"
        description="You're using a Pro hero design (block 4+). Upgrade to Business plan to publish."
      />
    </>
  );
}