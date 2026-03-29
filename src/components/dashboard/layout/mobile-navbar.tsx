'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  PlusSquare,
} from 'lucide-react';
import { cn } from '@/lib/shared/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks';
import { useBuilderStore } from '@/stores/use-builder-store';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/products/new', icon: PlusSquare, label: 'Produk' },
  { href: '/dashboard/landing-builder', icon: Layout, label: 'Builder' },
];

export function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();
  const [isDark, setIsDark] = useState(false);

  const { hasUnsavedChanges, onNavigateAway } = useBuilderStore();
  const isInBuilder = pathname.startsWith('/dashboard/landing-builder');

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (isInBuilder && hasUnsavedChanges && onNavigateAway) {
      e.preventDefault();
      onNavigateAway(href);
    }
  };

  const handleDropdownNavClick = (href: string) => {
    if (isInBuilder && hasUnsavedChanges && onNavigateAway) {
      onNavigateAway(href);
    } else {
      router.push(href);
    }
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
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                'flex items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-[50px]',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
              {active && (
                <span className="absolute -bottom-0 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              'flex items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-[50px]',
              'text-muted-foreground hover:text-foreground'
            )}>
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg" side="top" align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => handleDropdownNavClick('/dashboard/settings/toko')}>
              <Settings className="mr-3 h-5 w-5" />
              Store Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownNavClick('/dashboard/settings/channels')}>
              <Radio className="mr-3 h-5 w-5" />
              Channels
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDropdownNavClick('/dashboard/subscription')}>
              <Crown className="mr-3 h-5 w-5" />
              Subscription
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {isDark ? (
                <><Sun className="mr-3 h-5 w-5" />Light mode</>
              ) : (
                <><Moon className="mr-3 h-5 w-5" />Dark mode</>
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