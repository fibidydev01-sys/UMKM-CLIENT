/**
 * PreviewModal
 *
 * Responsive preview overlay for wizard pages:
 * - Desktop (>= 1024px): Sheet (slide from right, full width to sidebar)
 * - Mobile (< 1024px): Drawer (slide from bottom)
 */

'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
  title: string;
  children: React.ReactNode;
}

export function PreviewModal({ open, onClose, onSave, isSaving, title, children }: PreviewModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const topBar = (
    <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
      <Button variant="ghost" size="sm" onClick={onClose}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Kembali
      </Button>
      <Button size="sm" onClick={onSave} disabled={isSaving}>
        <Save className="h-4 w-4 mr-1" />
        {isSaving ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          side="right"
          hideClose
          className="max-w-none sm:max-w-none overflow-hidden"
          style={{ width: 'calc(100vw - 5rem)' }}
        >
          <SheetTitle className="sr-only">{title}</SheetTitle>
          {topBar}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()} direction="bottom">
      <DrawerContent className="max-h-[85vh]">
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        {topBar}
        <div className="overflow-y-auto px-4 pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
