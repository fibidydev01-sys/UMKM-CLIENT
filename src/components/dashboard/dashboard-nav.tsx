'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Store,
  Layout,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
    title: 'Menu Utama',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Landing Builder',
        href: '/dashboard/landing-builder',
        icon: Layout,
      },
      {
        title: 'Produk',
        href: '/dashboard/products',
        icon: Package,
        children: [
          { title: 'Semua Produk', href: '/dashboard/products' },
          { title: 'Tambah Produk', href: '/dashboard/products/new' },
          { title: 'Kategori', href: '/dashboard/products/categories' },
        ],
      },
      {
        title: 'Pelanggan',
        href: '/dashboard/customers',
        icon: Users,
      },
      {
        title: 'Pesanan',
        href: '/dashboard/orders',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      {
        title: 'Lihat Toko',
        href: '/store',
        icon: Store,
      },
      {
        title: 'Pengaturan',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

// ==========================================
// DASHBOARD NAV COMPONENT
// ==========================================

export function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {navigation.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
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
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={active}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === child.href}
                              >
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
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={active}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
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
    </>
  );
}