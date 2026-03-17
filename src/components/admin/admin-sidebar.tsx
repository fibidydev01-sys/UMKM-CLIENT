'use client';

// ==========================================
// ADMIN SIDEBAR
// File: src/components/admin/admin-sidebar.tsx
//
// Pattern IDENTIK dengan dashboard-sidebar.tsx:
// - Nav items di tengah vertikal (justify-center)
// - Footer: hamburger Menu → dropdown (theme toggle + sign out)
// - MutationObserver untuk sync theme
// ==========================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Ticket,
  ScrollText,
  Menu,
  Moon,
  Sun,
  LogOut,
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
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminLogout } from '@/hooks/admin';

// ==========================================
// NAV ITEMS
// ==========================================

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Redeem Codes',
    href: '/admin/redeem-codes',
    icon: Ticket,
  },
  {
    title: 'Tenants',
    href: '/admin/tenants',
    icon: Users,
  },
  {
    title: 'Audit Logs',
    href: '/admin/logs',
    icon: ScrollText,
  },
];

// ==========================================
// COMPONENT
// ==========================================

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminLogout();
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
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col justify-center">
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <>
                      <Sun className="mr-3 h-5 w-5" />
                      Light mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-3 h-5 w-5" />
                      Dark mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}