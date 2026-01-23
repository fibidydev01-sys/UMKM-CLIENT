/**
 * SectionSheet Component
 *
 * Responsive wrapper for section editing:
 * - Mobile + Tablet (< 1024px): Drawer (slide from bottom)
 * - Desktop (>= 1024px): Sheet (slide from right)
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { SectionType } from './builder-sidebar';

interface SectionSheetProps {
  section: SectionType;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
}: SectionSheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if window width >= 1024px (lg breakpoint)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkDesktop();

    // Listen for resize
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Render Sheet for desktop, Drawer for mobile/tablet
  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-[50vw] lg:w-[45vw] xl:w-[40vw] max-w-none overflow-y-auto p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle>{title}</SheetTitle>
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="bottom">
      <DrawerContent className="max-h-[85vh]">
        <div className="flex flex-col h-full">
          <DrawerHeader className="px-4 pt-4 pb-3 border-b">
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {children}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
