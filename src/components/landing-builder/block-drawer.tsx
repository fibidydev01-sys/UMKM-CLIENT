'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shared/utils';
import { Check, Crown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { BlockOption } from './block-options';
import { BLOCK_OPTIONS_MAP, isProBlock } from './block-options';

export type SectionType = 'hero';

interface BlockDrawerProps {
  section: SectionType;
  currentBlock?: string;
  onBlockSelect: (block: string) => void;
  blockVariantLimit?: number;
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function BlockDrawer(props: BlockDrawerProps) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileDrawer {...props} /> : <DesktopSheet {...props} />;
}

// ============================================================================
// MOBILE — Drawer dari bawah, klik di luar = collapse
// ============================================================================

function MobileDrawer({
  section,
  currentBlock,
  onBlockSelect,
  blockVariantLimit = 3,
}: BlockDrawerProps) {
  const [open, setOpen] = useState(false);
  const blocks = BLOCK_OPTIONS_MAP[section] || [];

  return (
    <>
      {/* Handle — selalu visible saat collapsed */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="fixed bottom-16 left-4 right-4 z-40 flex flex-col items-center py-3 bg-background rounded-t-[20px] border-t shadow-2xl cursor-pointer select-none"
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          <p className="text-xs text-muted-foreground mt-1">Open</p>
        </div>
      )}

      {/* modal=true supaya klik di luar = collapse (onOpenChange dipanggil) */}
      <Drawer open={open} onOpenChange={setOpen} modal={true}>
        <DrawerContent className="z-[60]">
          <VisuallyHidden.Root>
            <DrawerTitle>Select {section} block</DrawerTitle>
          </VisuallyHidden.Root>
          <div
            onClick={() => setOpen(false)}
            className="flex flex-col items-center pt-3 pb-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            <p className="text-xs text-muted-foreground mt-1">Close</p>
          </div>
          <div className="overflow-y-auto pb-8">
            {blocks.map((block) => (
              <BlockListItem
                key={block.value}
                block={block}
                isSelected={currentBlock === block.value}
                onSelect={onBlockSelect}
                blockVariantLimit={blockVariantLimit}
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ============================================================================
// DESKTOP — Sheet dari kanan dengan collapse/uncollapse + arrow di tengah
// ============================================================================

function DesktopSheet({
  section,
  currentBlock,
  onBlockSelect,
  blockVariantLimit = 3,
}: BlockDrawerProps) {
  const [open, setOpen] = useState(true);
  // isClosing: delay render handle agar tidak flicker saat animasi close
  const [isClosing, setIsClosing] = useState(false);
  const blocks = BLOCK_OPTIONS_MAP[section] || [];

  const handleCollapse = useCallback(() => {
    setIsClosing(true);
    setOpen(false);
    // Tunggu animasi Sheet selesai (~300ms) baru munculkan collapse button
    setTimeout(() => setIsClosing(false), 350);
  }, []);

  const handleExpand = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      {/* Collapse button — hanya muncul saat closed DAN animasi sudah selesai */}
      {!open && !isClosing && (
        <div className="fixed right-0 top-14 bottom-0 w-12 bg-background border-l shadow-lg z-40 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpand}
            className="h-auto py-8"
            title="Open block selector"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <Sheet
        open={open}
        onOpenChange={(v) => {
          // onOpenChange hanya dipanggil saat user klik di luar (modal default)
          // tapi kita pakai modal=false jadi kita handle manual via onInteractOutside
          if (!v) handleCollapse();
        }}
        modal={false}
      >
        <SheetContent
          side="right"
          className="top-14 z-40 w-[280px] p-0 flex flex-col"
          // Klik di luar → collapse (bukan block)
          onInteractOutside={() => handleCollapse()}
        >
          {/* Header dengan tombol close */}
          <div className="px-4 py-3 border-b shrink-0">
            <Button
              variant="ghost"
              className="h-8 px-2 gap-1 -ml-2"
              onClick={handleCollapse}
              title="Close block selector"
            >
              <ChevronRight className="h-4 w-4" />
              <SheetTitle className="text-sm font-semibold">Close</SheetTitle>
            </Button>
          </div>

          <div className="overflow-y-auto pb-4">
            {blocks.map((block) => (
              <BlockListItem
                key={block.value}
                block={block}
                isSelected={currentBlock === block.value}
                onSelect={onBlockSelect}
                blockVariantLimit={blockVariantLimit}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ============================================================================
// BLOCK LIST ITEM
// ============================================================================

interface BlockListItemProps {
  block: BlockOption;
  isSelected: boolean;
  onSelect: (blockValue: string) => void;
  blockVariantLimit?: number;
}

const BlockListItem = memo(function BlockListItem({
  block,
  isSelected,
  onSelect,
  blockVariantLimit = 3,
}: BlockListItemProps) {
  const isPro = isProBlock(block.value, blockVariantLimit);

  const handleClick = useCallback(() => {
    onSelect(block.value);
  }, [block.value, onSelect]);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full h-14 px-4 flex items-center justify-between border-b transition-colors',
        isSelected
          ? 'bg-primary/10 border-primary/20'
          : 'hover:bg-muted/50 border-border'
      )}
    >
      <span className="text-sm font-medium text-left">{block.label}</span>

      <div className="flex items-center gap-2 ml-2 shrink-0">
        {isPro && (
          <span className="flex items-center gap-1 text-xs font-medium
                           text-amber-600 dark:text-amber-400
                           bg-amber-50 dark:bg-amber-950/40
                           border border-amber-200 dark:border-amber-800
                           rounded-full px-2 py-0.5">
            <Crown className="h-3 w-3" />
            Pro
          </span>
        )}
        {isSelected && (
          <Check className="h-4 w-4 text-primary" />
        )}
      </div>
    </button>
  );
});