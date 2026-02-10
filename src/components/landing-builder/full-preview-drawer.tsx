/**
 * ============================================================================
 * FILE: src/components/landing-builder/full-preview-drawer.tsx
 * PURPOSE: Full page preview using Vaul Drawer (bottom sheet)
 * PATTERN: Same as FeedPreviewDrawer — consistent UX
 * FEATURES:
 *   - Device toggle tabs (Mobile / Tablet / Desktop)
 *   - Sticky header with shadow on scroll
 *   - Scrollable full landing page preview
 *   - Device frame centering for mobile/tablet
 * ============================================================================
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Smartphone, Tablet, Monitor, X } from 'lucide-react';
import { LivePreview } from './live-preview';
import type { TenantLandingConfig, Product, Tenant } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface FullPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: TenantLandingConfig;
  tenant: Tenant;
  products: Product[];
}

// ============================================================================
// DEVICE TABS CONFIG
// ============================================================================

const DEVICE_TABS: { value: DeviceType; label: string; icon: typeof Monitor }[] = [
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
  { value: 'desktop', label: 'Desktop', icon: Monitor },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function FullPreviewDrawer({
  open,
  onOpenChange,
  config,
  tenant,
  products,
}: FullPreviewDrawerProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  // ── Reset state when drawer opens ──────────────────────────
  useEffect(() => {
    if (open) {
      setDevice('desktop');
      setIsHeaderSticky(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [open]);

  // ── Sticky header detection ────────────────────────────────
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = headerSentinelRef.current;
    if (!scrollContainer || !sentinel || !open) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeaderSticky(!entry.isIntersecting),
      { root: scrollContainer, threshold: 0, rootMargin: '-1px 0px 0px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open]);

  // ── Reset scroll when device changes ───────────────────────
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [device]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'h-[92vh] outline-none',
            'flex flex-col',
          )}
          aria-describedby="full-preview-drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              Full Page Preview: {tenant.name}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="full-preview-drawer-description">
              Preview lengkap landing page {tenant.name}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* ── Sticky Header ─────────────────────────────────── */}
          <div
            className={cn(
              'px-4 pb-3 border-b shrink-0 transition-shadow duration-200',
              'sticky top-0 bg-background z-10',
              isHeaderSticky && 'shadow-md',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Left: Title */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
                  Full Preview
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {tenant.name}
                </p>
              </div>

              {/* ── Center: Device Tabs ──────────────────────── */}
              <div className="flex items-center gap-0.5 bg-muted rounded-lg p-1">
                {DEVICE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = device === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setDevice(tab.value)}
                      title={tab.label}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all',
                        isActive
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Close */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onOpenChange(false)}
                title="Tutup preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── Scrollable Content ────────────────────────────── */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20"
          >
            <div ref={headerSentinelRef} className="h-0" />

            <LivePreview
              config={config}
              tenant={tenant}
              products={products}
              mode="full"
              activeSection={null}
              device={device}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}