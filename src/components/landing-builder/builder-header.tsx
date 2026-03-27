'use client';

import { Badge } from '@/components/ui/badge';
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu,
  MenubarSeparator, MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Save, RotateCcw, Menu, ExternalLink, Eye, Crown,
} from 'lucide-react';

interface BuilderHeaderProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  configHasProBlocks: boolean;
  tenantSlug: string;
  onPublish: () => void;
  onDiscard: () => void;
  onReset: () => void;
  onFullPreview: () => void;
}

export function BuilderHeader({
  hasUnsavedChanges,
  isSaving,
  configHasProBlocks,
  tenantSlug,
  onPublish,
  onDiscard,
  onReset,
  onFullPreview,
}: BuilderHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center gap-3 px-14">
      {/* Menubar Actions */}
      <Menubar className="border-0 bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="gap-2 cursor-pointer">
            <Menu className="h-4 w-4" />
            <span>Actions</span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onFullPreview} className="gap-2 cursor-pointer">
              <Eye className="h-4 w-4" />
              Full Preview
            </MenubarItem>
            <MenubarSeparator />
            {hasUnsavedChanges && (
              <>
                <MenubarItem onClick={onDiscard} disabled={isSaving} className="gap-2 cursor-pointer">
                  Discard Changes
                </MenubarItem>
                <MenubarSeparator />
              </>
            )}
            <MenubarItem onClick={onReset} disabled={isSaving} className="gap-2 cursor-pointer">
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={onPublish}
              disabled={isSaving || !hasUnsavedChanges}
              className="gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Publishing...' : 'Publish'}
              {configHasProBlocks && <Crown className="h-3 w-3 text-amber-500 ml-1" />}
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <a href={`/store/${tenantSlug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Landing Page
              </a>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Unsaved Badge */}
      {hasUnsavedChanges && (
        <Badge variant="outline" className="text-yellow-600 border-yellow-500">
          Unsaved
        </Badge>
      )}
    </div>
  );
}