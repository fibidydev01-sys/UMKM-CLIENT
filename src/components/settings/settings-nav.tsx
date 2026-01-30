'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface SettingsMenuItem {
  key: string;
  label: string;
}

interface SettingsNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SETTINGS_MENU: SettingsMenuItem[] = [
  { key: 'store', label: 'Toko' },
  { key: 'seo', label: 'SEO' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'shipping', label: 'Pengiriman' },
];

// ============================================================================
// MOBILE TRIGGER COMPONENT (text-based, no icons)
// ============================================================================

export function SettingsMobileTrigger() {
  const { setOpenMobile, openMobile } = useSidebar();

  return (
    <div className="md:hidden mb-4">
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <span>Menu Pengaturan</span>
        <span>&#9776;</span>
      </Button>
    </div>
  );
}

// ============================================================================
// SIDEBAR NAVIGATION COMPONENT
// ============================================================================

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleTabClick = (key: string) => {
    // Special handling for 'store' tab - navigate to /settings/toko instead of state switching
    if (key === 'store') {
      router.push('/settings/toko');
      setOpenMobile(false);
      return;
    }

    onTabChange(key);
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r min-h-screen">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="h-8 w-8 p-0"
          >
            &larr;
          </Button>
          <div>
            <h2 className="font-semibold text-lg">Pengaturan</h2>
            <p className="text-sm text-muted-foreground">Kelola preferensi toko</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SETTINGS_MENU.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeTab === item.key}
                    onClick={() => handleTabClick(item.key)}
                    className={cn(
                      'w-full justify-start',
                      activeTab === item.key && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    )}
                  >
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
