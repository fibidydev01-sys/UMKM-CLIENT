'use client';

import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { useAuth, useLogout } from '@/hooks';
import { getInitials } from '@/lib/format';
import { DashboardBreadcrumb } from './dashboard-breadcrumb';

// ==========================================
// DASHBOARD HEADER COMPONENT
// ==========================================

export function DashboardHeader() {
  const { tenant } = useAuth();
  const { logout } = useLogout();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumb */}
      <DashboardBreadcrumb />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search (Desktop Only) */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari..."
            className="w-64 pl-8 h-9"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notifikasi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              Tidak ada notifikasi baru
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle - Desktop & Mobile */}
        <AnimatedThemeToggler
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:h-5 [&_svg]:w-5"
        />

        {/* User Menu (Mobile Only) - Avatar sudah di sidebar tapi tetap untuk quick access */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={tenant?.logo || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {tenant?.name ? getInitials(tenant.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{tenant?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {tenant?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Pengaturan</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}