'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
  Store,
  Search,
  CreditCard,
  Truck,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';

// ==========================================
// SETTINGS LAYOUT COMPONENT
// Wraps all /settings routes with sidebar
// Pattern: Same as DashboardLayout with hover overlay
// ==========================================

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export interface SettingsMenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  route: string;
}

export const SETTINGS_MENU: SettingsMenuItem[] = [
  { key: 'store', label: 'Toko', icon: Store, route: '/settings/toko' },
  { key: 'seo', label: 'SEO', icon: Search, route: '/settings/seo' },
  { key: 'payment', label: 'Pembayaran', icon: CreditCard, route: '/settings/pembayaran' },
  { key: 'shipping', label: 'Pengiriman', icon: Truck, route: '/settings/pengiriman' },
];

// ==========================================
// MOBILE TRIGGER COMPONENT
// ==========================================

function SettingsMobileTrigger() {
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

// ==========================================
// SETTINGS SIDEBAR COMPONENT
// ==========================================

function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleTabClick = (route: string) => {
    router.push(route);
    setOpenMobile(false);
  };

  // Determine active tab based on pathname
  const isActive = (route: string) => pathname.startsWith(route);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                'data-[active=true]:bg-transparent data-[active=true]:font-normal'
              )}
            >
              <button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarMenu>
            {SETTINGS_MENU.map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  isActive={isActive(item.route)}
                  onClick={() => handleTabClick(item.route)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// ==========================================
// MAIN LAYOUT COMPONENT
// ==========================================

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Desktop Sidebar - Always visible for all /settings routes */}
      <SettingsSidebar />

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Mobile Trigger */}
            <SettingsMobileTrigger />

            {/* Content */}
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
