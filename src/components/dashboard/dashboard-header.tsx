'use client';

import Link from 'next/link';
import { Store } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
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
import { OnboardingDropdown } from '@/components/onboarding';

export function DashboardHeader() {
  const { tenant } = useAuth();
  const { logout } = useLogout();

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 hidden md:flex" />
        <Separator orientation="vertical" className="h-4 hidden md:block" />
        <span className="font-semibold text-sm">Dashboard</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
          <Link href={`/store/${tenant?.slug || ''}`}>
            <Store className="h-5 w-5" />
            <span className="sr-only">Lihat Toko</span>
          </Link>
        </Button>

        <OnboardingDropdown />

        <AnimatedThemeToggler
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:h-5 [&_svg]:w-5"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Avatar className="h-8 w-8">
                <AvatarImage src={tenant?.logo || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {tenant?.name ? getInitials(tenant.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="truncate">{tenant?.name}</span>
                <span className="text-xs font-normal text-muted-foreground truncate">
                  {tenant?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Pengaturan</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/store/${tenant?.slug}`}>
                Lihat Toko
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}