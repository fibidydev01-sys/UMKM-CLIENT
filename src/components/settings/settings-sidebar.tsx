'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Layers,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Home,
  type LucideIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks';

// ==========================================
// NAVIGATION ITEMS
// ==========================================

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: { title: string; href: string }[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Pengaturan',
    items: [
      {
        title: 'Toko',
        href: '/settings/toko',
        icon: Store,
      },
      {
        title: 'Channels',
        href: '/settings/channels',
        icon: Layers,
      },
    ],
  },
];

// ==========================================
// SETTINGS SIDEBAR COMPONENT
// Clone of DashboardSidebar for Settings
// ==========================================

export function SettingsSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Navigation - Centered vertically */}
      <SidebarContent className="flex flex-col justify-center">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = isActive(item.href);

                // Item with children (collapsible)
                if (item.children) {
                  return (
                    <Collapsible
                      key={item.href}
                      asChild
                      defaultOpen={active}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={active}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                                  <Link href={child.href}>
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Simple item
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer with Hamburger Menu */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Hamburger Menu Button */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Menu className="h-5 w-5" />
                  <span>Menu</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Home className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscription">
                    <CreditCard className="mr-3 h-5 w-5" />
                    Langganan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <>
                      <Sun className="mr-3 h-5 w-5" />
                      Mode Terang
                    </>
                  ) : (
                    <>
                      <Moon className="mr-3 h-5 w-5" />
                      Mode Gelap
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-3 h-5 w-5" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
