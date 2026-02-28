// ══════════════════════════════════════════════════════════════
// FULL PREVIEW DRAWER
// Shows complete landing page preview in a drawer
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';
import { LivePreview } from './live-preview';
import type { TenantLandingConfig, Product, Tenant } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface FullPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: TenantLandingConfig;
  tenant: Tenant;
  products: Product[];
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function FullPreviewDrawer({
  open,
  onOpenChange,
  config,
  tenant,
  products,
}: FullPreviewDrawerProps) {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  // Scroll to top when drawer opens
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [open]);

  // Sticky header detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = headerSentinelRef.current;

    if (!scrollContainer || !sentinel || !open) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderSticky(!entry.isIntersecting);
      },
      {
        root: scrollContainer,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open]);

  // Reset states when drawer closes
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setIsHeaderSticky(false); // eslint-disable-line react-hooks/set-state-in-effect
    }
    prevOpenRef.current = open;
  }, [open]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        {/* Content */}
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'max-h-[92vh] outline-none',
            'flex flex-col'
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
              Full landing page preview for {tenant.name}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Sticky Header */}
          <div
            className={cn(
              'px-4 pb-4 border-b shrink-0 transition-shadow duration-200',
              'sticky top-0 bg-background z-10',
              isHeaderSticky && 'shadow-md'
            )}
          >
            <div className="flex items-center justify-between min-w-0">
              {/* Left: Title */}
            </div>
          </div>

          {/* Scrollable Content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
            {/* Sentinel for sticky detection */}
            <div ref={headerSentinelRef} className="h-0" />

            {/* Landing Page Preview */}
            <LivePreview
              config={config}
              tenant={tenant}
              products={products}
              mode="full"
              activeSection={null}
              device="desktop"
            />
          </div>

        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}