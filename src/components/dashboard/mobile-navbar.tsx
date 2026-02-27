'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layout,
  Settings,
  Radio,
  Menu,
  Crown,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks';

// ==========================================
// MOBILE NAVBAR (Bottom Navigation)
// ==========================================

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/dashboard/landing-builder',
    icon: Layout,
    label: 'Builder',
  },
  {
    href: '/dashboard/settings/toko',
    icon: Settings,
    label: 'Settings',
  },
  {
    href: '/dashboard/settings/channels',
    icon: Radio,
    label: 'Channels',
  },
];

export function MobileNavbar() {
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
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t" />

      <div className="relative flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-[50px]',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 transition-transform',
                  active && 'scale-110'
                )}
              />
              {active && (
                <span className="absolute -bottom-0 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-[50px]',
                'text-muted-foreground hover:text-foreground'
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuItem asChild>
              <Link href="/dashboard/subscription">
                <Crown className="mr-3 h-5 w-5" />
                Subscription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
      </div>

      <div className="h-safe-area-inset-bottom bg-background/80" />
    </nav>
  );
}