'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Layers,
  CreditCard,
  Menu,
  Home,
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
// SETTINGS MOBILE NAVBAR (Bottom Navigation)
// Only visible on mobile devices
// ==========================================

const navItems = [
  {
    href: '/settings/toko',
    icon: Store,
    label: 'Toko',
  },
  {
    href: '/settings/channels',
    icon: Layers,
    label: 'Channels',
  },
];

export function SettingsMobileNavbar() {
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg border-t" />

      {/* Nav items */}
      <div className="relative flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-[60px]',
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

              {/* Active indicator dot */}
              {active && (
                <span className="absolute -bottom-0 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-[60px] text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg mb-2"
            side="top"
            align="end"
            sideOffset={8}
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
      </div>
    </nav>
  );
}
