'use client';

import {
  Store,
  CreditCard,
  Truck,
  Search,
  Menu,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface SettingsMenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SETTINGS_MENU: SettingsMenuItem[] = [
  { key: 'store', label: 'Toko', icon: Store },
  { key: 'seo', label: 'SEO', icon: Search },
  { key: 'payment', label: 'Pembayaran', icon: CreditCard },
  { key: 'shipping', label: 'Pengiriman', icon: Truck },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function SettingsNav({
  activeTab,
  onTabChange,
  sheetOpen,
  onSheetOpenChange,
}: SettingsNavProps) {
  const currentItem = SETTINGS_MENU.find((m) => m.key === activeTab);
  const CurrentIcon = currentItem?.icon || Store;
  const currentLabel = currentItem?.label || 'Pengaturan';

  const handleTabClick = (key: string) => {
    onTabChange(key);
    onSheetOpenChange(false);
  };

  return (
    <>
      {/* Mobile: Sheet Navigation */}
      <div className="md:hidden mb-4">
        <Sheet open={sheetOpen} onOpenChange={onSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <CurrentIcon className="h-4 w-4" />
                {currentLabel}
              </span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Pengaturan</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-1">
              {SETTINGS_MENU.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Tabs */}
      <TabsList className="hidden md:grid w-full grid-cols-4 lg:w-auto">
        {SETTINGS_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger key={item.key} value={item.key} className="gap-2 relative">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </>
  );
}