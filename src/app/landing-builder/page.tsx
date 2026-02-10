/**
 * ============================================================================
 * FILE: app/landing-builder/page.tsx
 * ============================================================================
 * Route: /landing-builder
 * Description: Full-Screen Landing Page Builder
 * Layout: Sidebar (left) | Isolated Preview (center) | Block Drawer (overlay)
 * NEW: Full Preview Drawer via Vaul bottom sheet
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  LivePreview,
  LandingErrorBoundary,
  BuilderSidebar,
  BlockDrawer,
  BuilderLoadingSteps,
  FullPreviewDrawer,
} from '@/components/landing-builder';
import type { SectionType, DrawerState } from '@/components/landing-builder';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { productsApi } from '@/lib/api';
import { mergeWithTemplateDefaults, type TemplateId } from '@/lib/landing';
import {
  Save,
  Home,
  PanelLeftClose,
  PanelLeft,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Menu,
  ExternalLink,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import type { TenantLandingConfig, Product } from '@/types';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LandingBuilderPage() {
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const { tenant, refresh } = useTenant();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // UI State
  const [activeSection, setActiveSection] = useState<SectionType>('hero');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('collapsed');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');

  // 🚀 Full Preview Drawer
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);

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
  } = useLandingConfig({
    initialConfig: tenant?.landingConfig,
    onSaveSuccess: () => refresh(),
  });

  const defaultSectionOrder: SectionType[] = ['hero', 'about', 'products', 'testimonials', 'cta', 'contact'];
  const sectionOrder = landingConfig?.sectionOrder || defaultSectionOrder;

  // ============================================================================
  // FETCH PRODUCTS
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
        console.error('[LandingBuilder] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [tenant]);

  // ============================================================================
  // INITIAL TEMPLATE
  // ============================================================================

  useEffect(() => {
    if (!tenant) return;
    if (!initialTemplateParam) return;
    if (landingConfig?.template === initialTemplateParam) return;

    const mergedConfig = mergeWithTemplateDefaults(
      landingConfig,
      initialTemplateParam as TemplateId,
      { name: tenant.name, category: tenant.category }
    );
    setLandingConfig(mergedConfig as TenantLandingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateParam, tenant?.name, tenant?.category]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSectionClick = useCallback((section: SectionType) => {
    setActiveSection(section);
  }, []);

  const handleBlockSelect = useCallback((block: string) => {
    if (!activeSection || !landingConfig) return;
    const currentSection = landingConfig[activeSection] || {};
    setLandingConfig({
      ...landingConfig,
      [activeSection]: { ...currentSection, block },
    } as TenantLandingConfig);
  }, [activeSection, landingConfig, setLandingConfig]);

  const handleSidebarToggleSection = useCallback((section: SectionType, enabled: boolean) => {
    if (!landingConfig) return;
    const currentSection = landingConfig[section] || {};
    setLandingConfig({
      ...landingConfig,
      [section]: { ...currentSection, enabled },
    } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  const getSectionEnabled = useCallback((section: SectionType): boolean => {
    return landingConfig?.[section]?.enabled ?? true;
  }, [landingConfig]);

  const handleSectionOrderChange = useCallback((newOrder: SectionType[]) => {
    if (!landingConfig) return;
    setLandingConfig({
      ...landingConfig,
      sectionOrder: newOrder,
    } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  // ============================================================================
  // PREVENT BODY SCROLL
  // ============================================================================

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ============================================================================
  // LOADING
  // ============================================================================

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
        <p className="text-muted-foreground">Gagal memuat data tenant</p>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="h-screen flex flex-col">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          <Menubar className="border-0 bg-transparent">
            {/* Dashboard */}
            <MenubarMenu>
              <MenubarTrigger className="gap-2 cursor-pointer">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Kembali ke Dashboard
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Device Preview (for isolated preview) */}
            <MenubarMenu>
              <MenubarTrigger className="gap-2 cursor-pointer">
                {device === 'mobile' && <Smartphone className="h-4 w-4" />}
                {device === 'tablet' && <Tablet className="h-4 w-4" />}
                {device === 'desktop' && <Monitor className="h-4 w-4" />}
                <span className="hidden sm:inline capitalize">{device}</span>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setDevice('mobile')} className="gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" /> Mobile
                </MenubarItem>
                <MenubarItem onClick={() => setDevice('tablet')} className="gap-2 cursor-pointer">
                  <Tablet className="h-4 w-4" /> Tablet
                </MenubarItem>
                <MenubarItem onClick={() => setDevice('desktop')} className="gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4" /> Desktop
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Actions */}
            <MenubarMenu>
              <MenubarTrigger className="gap-2 cursor-pointer">
                <Menu className="h-4 w-4" />
                <span className="hidden sm:inline">Actions</span>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  onClick={() => setFullPreviewOpen(true)}
                  className="gap-2 cursor-pointer"
                >
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
                <MenubarItem
                  onClick={handlePublish}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Publishing...' : 'Publish'}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem asChild>
                  <a
                    href={`/store/${tenant?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Landing Page
                  </a>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right: Full Preview Button + Badges */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullPreviewOpen(true)}
            className="gap-2 hidden sm:flex"
          >
            <Eye className="h-4 w-4" />
            Full Preview
          </Button>

          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500">
              Unsaved
            </Badge>
          )}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">{validationErrors.length} Error(s)</Badge>
          )}
        </div>
      </div>

      {/* ── Main Layout ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          collapsed={sidebarCollapsed}
          sectionOrder={sectionOrder}
          onSectionOrderChange={handleSectionOrderChange}
          getSectionEnabled={getSectionEnabled}
          onToggleSection={handleSidebarToggleSection}
        />

        {/* Isolated Preview */}
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

      {/* Block Drawer */}
      <BlockDrawer
        state={drawerState}
        onStateChange={setDrawerState}
        section={activeSection}
        currentBlock={landingConfig?.[activeSection]?.block}
        onBlockSelect={handleBlockSelect}
      />

      {/* 🚀 Full Preview Drawer */}
      <FullPreviewDrawer
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
        config={landingConfig}
        tenant={tenant}
        products={products}
      />
    </div>
  );
}