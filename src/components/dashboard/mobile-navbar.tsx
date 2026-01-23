'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// MOBILE NAVBAR (Bottom Navigation)
// Only visible on mobile devices
// ==========================================

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Home',
  },
  {
    href: '/dashboard/products',
    icon: Package,
    label: 'Produk',
  },
  {
    href: '/dashboard/orders',
    icon: ShoppingCart,
    label: 'Pesanan',
  },
  {
    href: '/dashboard/customers',
    icon: Users,
    label: 'Pelanggan',
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Setting',
  },
];

export function MobileNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
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
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
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
              <span className="text-[10px] font-medium">{item.label}</span>

              {/* Active indicator dot */}
              {active && (
                <span className="absolute -bottom-0 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-background/80" />
    </nav>
  );
}