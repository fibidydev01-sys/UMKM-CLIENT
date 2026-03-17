/**
 * ============================================================================
 * FILE: app/landing-builder/page.tsx
 * ============================================================================
 *
 * ✅ CANVA STRATEGY:
 * - User bisa explore & pilih semua block bebas
 * - Saat klik Publish → cek hasProBlocks()
 * - Kalau ada Pro block aktif + plan STARTER → block publish + UpgradeModal
 * - Publish button tampilkan badge Pro kalau ada Pro block aktif
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu,
  MenubarSeparator, MenubarTrigger,
} from '@/components/ui/menubar';
import {
  LivePreview, LandingErrorBoundary, BuilderSidebar,
  BlockDrawer, BuilderLoadingSteps, FullPreviewDrawer,
} from '@/components/landing-builder';
import type { SectionType, DrawerState } from '@/components/landing-builder';
import { UpgradeModal } from '@/components/dashboard/upgrade-modal';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/dashboard/use-landing-config';
import { useSubscriptionPlan } from '@/hooks/dashboard/use-subscription-plan';
import { productsApi } from '@/lib/api';
import { mergeWithTemplateDefaults, type TemplateId } from '@/lib/public';
import { hasProBlocks } from '@/components/landing-builder/block-options';
import {
  Save, PanelLeftClose, PanelLeft, RotateCcw,
  Menu, ExternalLink, Eye, Crown,
} from 'lucide-react';
import type { TenantLandingConfig, Product } from '@/types';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export default function LandingBuilderPage() {
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Plan info — untuk badge hint dan publish gate
  const { blockVariantLimit, isBusiness } = useSubscriptionPlan();

  // Upgrade modal state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // UI State
  const [activeSection, setActiveSection] = useState<SectionType>('hero');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [drawerState, setDrawerState] = useState<DrawerState>('collapsed');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [device] = useState<DeviceType>('desktop');
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

  const {
    config: landingConfig,
    hasUnsavedChanges,
    isSaving,
    validationErrors,
    updateConfig: setLandingConfig,
    publishChanges: publishToServer,
    discardChanges: handleDiscard,
    resetToDefaults: handleReset,
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  const defaultSectionOrder: SectionType[] = ['hero', 'about', 'products', 'testimonials', 'cta', 'contact'];
  const sectionOrder = landingConfig?.sectionOrder || defaultSectionOrder;

  // ============================================================
  // Cek apakah config punya Pro block aktif
  // ============================================================
  const configHasProBlocks = !isBusiness && hasProBlocks(landingConfig, blockVariantLimit);

  // ============================================================
  // PUBLISH HANDLER — intercept kalau ada Pro block
  // ============================================================
  const handlePublish = useCallback(async () => {
    // Kalau STARTER dan ada Pro block aktif → block + UpgradeModal
    if (configHasProBlocks) {
      setUpgradeModalOpen(true);
      return;
    }
    // Kalau aman → publish normal
    await publishToServer();
  }, [configHasProBlocks, publishToServer]);

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================
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

  // ============================================================
  // INITIAL TEMPLATE
  // ============================================================
  useEffect(() => {
    if (!tenant || !initialTemplateParam) return;
    if (landingConfig?.template === initialTemplateParam) return;
    const mergedConfig = mergeWithTemplateDefaults(
      landingConfig,
      initialTemplateParam as TemplateId,
      { name: tenant.name, category: tenant.category }
    );
    setLandingConfig(mergedConfig as TenantLandingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateParam, tenant?.name, tenant?.category]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleSectionClick = useCallback((section: SectionType) => setActiveSection(section), []);

  const handleBlockSelect = useCallback((block: string) => {
    if (!activeSection || !landingConfig) return;
    const currentSection = landingConfig[activeSection] || {};
    setLandingConfig({ ...landingConfig, [activeSection]: { ...currentSection, block } } as TenantLandingConfig);
  }, [activeSection, landingConfig, setLandingConfig]);

  const handleSidebarToggleSection = useCallback((section: SectionType, enabled: boolean) => {
    if (!landingConfig) return;
    const currentSection = landingConfig[section] || {};
    setLandingConfig({ ...landingConfig, [section]: { ...currentSection, enabled } } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  const getSectionEnabled = useCallback((section: SectionType): boolean => {
    return landingConfig?.[section]?.enabled ?? true;
  }, [landingConfig]);

  const handleSectionOrderChange = useCallback((newOrder: SectionType[]) => {
    if (!landingConfig) return;
    setLandingConfig({ ...landingConfig, sectionOrder: newOrder } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  // ============================================================
  // PREVENT BODY SCROLL
  // ============================================================
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ============================================================
  // LOADING
  // ============================================================
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>

          <Menubar className="border-0 bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="gap-2 cursor-pointer">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Actions</span>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setFullPreviewOpen(true)} className="gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  Full Preview
                </MenubarItem>
                <MenubarSeparator />
                {hasUnsavedChanges && (
                  <>
                    <MenubarItem onClick={handleDiscard} disabled={isSaving} className="gap-2 cursor-pointer">
                      Discard Changes
                    </MenubarItem>
                    <MenubarSeparator />
                  </>
                )}
                <MenubarItem onClick={handleReset} disabled={isSaving} className="gap-2 cursor-pointer">
                  <RotateCcw className="h-4 w-4" />
                  Reset to Defaults
                </MenubarItem>
                <MenubarSeparator />
                {/* ✅ Publish di Menubar juga intercept */}
                <MenubarItem
                  onClick={handlePublish}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Publishing...' : 'Publish'}
                  {configHasProBlocks && <Crown className="h-3 w-3 text-amber-500 ml-1" />}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <a href={`/store/${tenant?.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Landing Page
                  </a>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right: Publish button + badges */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500">
              Unsaved
            </Badge>
          )}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">{validationErrors.length} Error(s)</Badge>
          )}

          {/* ✅ Publish button — tampilkan badge Pro kalau ada Pro block aktif */}
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isSaving || !hasUnsavedChanges}
            className={cn(
              'gap-2',
              configHasProBlocks && 'border-amber-400 dark:border-amber-600'
            )}
            variant={configHasProBlocks ? 'outline' : 'default'}
          >
            {isSaving ? (
              <>Saving...</>
            ) : configHasProBlocks ? (
              <>
                <Crown className="h-4 w-4 text-amber-500" />
                Publish
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700 rounded-full px-1.5 py-0.5">
                  Pro
                </span>
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

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        <BuilderSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          collapsed={sidebarCollapsed}
          sectionOrder={sectionOrder}
          onSectionOrderChange={handleSectionOrderChange}
          getSectionEnabled={getSectionEnabled}
          onToggleSection={handleSidebarToggleSection}
        />

        <div className="flex-1 overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30">
          <LandingErrorBoundary>
            <LivePreview
              config={landingConfig}
              tenant={tenant}
              products={products}
              isLoading={productsLoading}
              activeSection={activeSection}
              device={device}
              mode="isolated"
            />
          </LandingErrorBoundary>
        </div>
      </div>

      {/* Block Drawer — badge hint saja, tidak lock */}
      <BlockDrawer
        state={drawerState}
        onStateChange={setDrawerState}
        section={activeSection}
        currentBlock={landingConfig?.[activeSection]?.block}
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

      {/* ✅ Upgrade Modal — muncul saat Publish dengan Pro block */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        title="Upgrade to publish Pro blocks"
        description="You're using Pro block designs (block 4+). Upgrade to Business plan to publish and make them live on your store."
      />
    </div>
  );
}

// Helper cn import
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}