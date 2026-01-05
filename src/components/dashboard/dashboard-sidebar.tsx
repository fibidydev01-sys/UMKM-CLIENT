'use client';

import Link from 'next/link';
import { Store, ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DashboardNav } from './dashboard-nav';
import { useAuth, useLogout } from '@/hooks';
import { getInitials } from '@/lib/format';
import { siteConfig } from '@/config/site';

// ==========================================
// DASHBOARD SIDEBAR COMPONENT
// Using shadcn/ui Sidebar
// ==========================================

export function DashboardSidebar() {
  const { tenant } = useAuth();
  const { logout } = useLogout();

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">{siteConfig.name}</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>

      {/* Footer - User Menu */}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={tenant?.logo || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {tenant?.name ? getInitials(tenant.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium truncate max-w-[140px]">
                  {tenant?.name || 'Toko'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {tenant?.email || 'email@example.com'}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{tenant?.name}</p>
                <p className="text-xs text-muted-foreground">{tenant?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/store/${tenant?.slug}`}>
                  <Store className="mr-2 h-4 w-4" />
                  Lihat Toko
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      {/* Rail for collapsed state */}
      <SidebarRail />
    </Sidebar>
  );
}