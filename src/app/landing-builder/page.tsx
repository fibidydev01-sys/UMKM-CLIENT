/**
 * ============================================================================
 * FILE: app/landing-builder/page.tsx
 * ============================================================================
 * Route: /landing-builder
 * Description: Full-Screen Landing Page Builder (Isolated from Dashboard)
 * Layout: Sidebar (left) | Preview (center) | Wide Sheet (right overlay)
 * ============================================================================
 */
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LivePreview,
  LandingErrorBoundary,
  BuilderSidebar,
  BlockDrawer,
  BuilderLoadingSteps,
} from '@/components/landing-builder';
import type { SectionType, DrawerState } from '@/components/landing-builder';
import { useTenant } from '@/hooks';
import { useLandingConfig } from '@/hooks/use-landing-config';
import { productsApi } from '@/lib/api';
import { mergeWithTemplateDefaults, type TemplateId } from '@/lib/landing';
import { Save, Home, PanelLeftClose, PanelLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import type { TenantLandingConfig, Product } from '@/types';

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
  const [activeSection, setActiveSection] = useState<SectionType>('hero'); // 🚀 Default to hero so drawer shows
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('collapsed'); // Start collapsed, user can expand manually
  const [loadingComplete, setLoadingComplete] = useState(false); // 🚀 Track when loading screen dismissed

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

  // 🚀 Section order state - default order if not in config
  const defaultSectionOrder: SectionType[] = ['hero', 'about', 'products', 'testimonials', 'cta', 'contact'];
  const sectionOrder = landingConfig?.sectionOrder || defaultSectionOrder;

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
        console.error('[LandingBuilder] Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [tenant]);

  // ============================================================================
  // INITIAL TEMPLATE APPLICATION
  // ============================================================================

  useEffect(() => {
    if (!tenant) return;
    if (!initialTemplateParam) return;
    if (landingConfig?.template === initialTemplateParam) return;

    const mergedConfig = mergeWithTemplateDefaults(
      landingConfig,
      initialTemplateParam as TemplateId,
      {
        name: tenant.name,
        category: tenant.category,
      }
    );

    setLandingConfig(mergedConfig as TenantLandingConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplateParam, tenant?.name, tenant?.category]);

  // ============================================================================
  // SIDEBAR & SHEET HANDLERS
  // ============================================================================

  // Step 1: User clicks section → Switch section, AUTO EXPAND drawer
  const handleSectionClick = useCallback((section: SectionType) => {
    setActiveSection(section);
    // 🚀 AUTO EXPAND drawer to show blocks immediately!
    setDrawerState('expanded');
  }, []);

  // Step 2: User clicks block → Update config (NO form sheet - data edited in Settings)
  const handleBlockSelect = useCallback((block: string) => {
    if (!activeSection || !landingConfig) return;

    // Update block in config
    const currentSection = landingConfig[activeSection] || {};
    setLandingConfig({
      ...landingConfig,
      [activeSection]: {
        ...currentSection,
        block,
      },
    } as TenantLandingConfig);

    // NO form sheet - just update config directly
  }, [activeSection, landingConfig, setLandingConfig]);

  // 🚀 Quick toggle from sidebar (any section)
  const handleSidebarToggleSection = useCallback((section: SectionType, enabled: boolean) => {
    if (!landingConfig) return;

    const currentSection = landingConfig[section] || {};
    setLandingConfig({
      ...landingConfig,
      [section]: {
        ...currentSection,
        enabled,
      },
    } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  // 🚀 Get section enabled status
  const getSectionEnabled = useCallback((section: SectionType): boolean => {
    return landingConfig?.[section]?.enabled ?? true;
  }, [landingConfig]);

  // 🚀 Handle section reordering
  const handleSectionOrderChange = useCallback((newOrder: SectionType[]) => {
    if (!landingConfig) return;

    setLandingConfig({
      ...landingConfig,
      sectionOrder: newOrder,
    } as TenantLandingConfig);
  }, [landingConfig, setLandingConfig]);

  // ============================================================================
  // PREVENT BODY SCROLL - Override body overflow for this page only
  // ⚠️ MUST be before any conditional returns to follow Rules of Hooks!
  // ============================================================================

  useEffect(() => {
    // Hide body scrollbar to prevent double scrollbar (preview has its own scroll)
    document.body.style.overflow = 'hidden';
    return () => {
      // Restore body overflow when leaving page
      document.body.style.overflow = '';
    };
  }, []);

  // ============================================================================
  // LOADING STATE - Real loading based on actual data fetching
  // ============================================================================

  const tenantLoading = tenant === null;
  const configReady = landingConfig !== null && landingConfig !== undefined;
  const isStillLoading = tenantLoading || productsLoading || !configReady;

  // Show loading screen while data is loading OR until animation completes
  // Key prop forces remount on navigation to reset internal state
  if (isStillLoading || !loadingComplete) {
    return (
      <BuilderLoadingSteps
        key="builder-loading" // Reset on remount
        loadingStates={{
          tenantLoading,
          productsLoading,
          configReady,
        }}
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
  // RENDER: FULL SCREEN ISOLATED LAYOUT
  // ============================================================================

  return (
    <div className="h-screen flex flex-col">
      {/* Custom Header (Minimal, not PageHeader) */}
      <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="gap-2"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          <div className="h-6 w-px bg-border" />

          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-lg">Landing Page Builder</h1>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-500">
              Unsaved
            </Badge>
          )}
          {validationErrors.length > 0 && (
            <Badge variant="destructive">{validationErrors.length} Error(s)</Badge>
          )}
          {hasUnsavedChanges && (
            <Button variant="outline" size="sm" onClick={handleDiscard} disabled={isSaving}>
              Discard
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
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

      {/* Main Layout: Sidebar + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Section Sidebar (Fixed) */}
        <BuilderSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          collapsed={sidebarCollapsed}
          sectionOrder={sectionOrder}
          onSectionOrderChange={handleSectionOrderChange}
          getSectionEnabled={getSectionEnabled}
          onToggleSection={handleSidebarToggleSection}
        />

        {/* CENTER: Live Preview */}
        <div className="flex-1 overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/30">
          <LandingErrorBoundary>
            <LivePreview
              config={landingConfig}
              tenant={tenant}
              products={products}
              isLoading={productsLoading}
              activeSection={activeSection} // 🚀 Pass active section for auto-scroll
            />
          </LandingErrorBoundary>
        </div>
      </div>

      {/* BOTTOM OVERLAY: Block Drawer (2 states: collapsed/expanded) */}
      {/* Drawer ALWAYS VISIBLE - never fully closes */}
      {/* Drawer uses fixed positioning to overlay at bottom - must be outside flex container */}
      <BlockDrawer
        state={drawerState}
        onStateChange={setDrawerState}
        section={activeSection}
        currentBlock={landingConfig?.[activeSection]?.block}
        onBlockSelect={handleBlockSelect}
      />
    </div>
  );
}
