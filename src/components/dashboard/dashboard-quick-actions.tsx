'use client';

import {
  Package,
  Users,
  ShoppingCart,
  Settings,
  PlusCircle,
  LayoutGrid,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/hooks';
import { BentoGrid, BentoActionCard } from '@/components/ui/bento-grid';

// ==========================================
// DASHBOARD QUICK ACTIONS
// Using BentoGrid & BentoActionCard components
// 3x3 Layout with Lihat Toko + Settings row
// ==========================================

interface QuickAction {
  icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  gradient: string;
  iconColor: string;
  gridClass: string;
}

const quickActions: QuickAction[] = [
  {
    icon: PlusCircle,
    name: 'Tambah Produk',
    description: 'Tambah produk baru',
    href: '/dashboard/products/new',
    gradient: 'from-pink-500/20 via-pink-500/5',
    iconColor: 'text-pink-500',
    gridClass: 'col-span-1 row-span-2',
  },
  {
    icon: ShoppingCart,
    name: 'Buat Pesanan',
    description: 'Catat pesanan baru',
    href: '/dashboard/orders/new',
    gradient: 'from-green-500/20 via-green-500/5',
    iconColor: 'text-green-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Package,
    name: 'Produk',
    description: 'Lihat semua produk',
    href: '/dashboard/products',
    gradient: 'from-orange-500/20 via-orange-500/5',
    iconColor: 'text-orange-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Users,
    name: 'Pelanggan',
    description: 'Tambah pelanggan baru',
    href: '/dashboard/customers/new',
    gradient: 'from-blue-500/20 via-blue-500/5',
    iconColor: 'text-blue-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: LayoutGrid,
    name: 'Pesanan',
    description: 'Kelola semua pesanan',
    href: '/dashboard/orders',
    gradient: 'from-purple-500/20 via-purple-500/5',
    iconColor: 'text-purple-500',
    gridClass: 'col-span-1 row-span-1',
  },
];

// Bottom row items generator (needs tenant slug for store link)
const getBottomRowItems = (tenantSlug: string) => [
  {
    icon: Store,
    name: 'Buka Toko',
    description: 'Kunjungi toko online',
    href: `/store/${tenantSlug}`,
    gradient: 'from-cyan-500/20 via-cyan-500/5',
    iconColor: 'text-cyan-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Settings,
    name: 'Pengaturan',
    description: 'Konfigurasi toko',
    href: '/dashboard/settings',
    gradient: 'from-gray-500/20 via-gray-500/5',
    iconColor: 'text-gray-500',
    gridClass: 'col-span-2 row-span-1',
  },
];

export function DashboardQuickActions() {
  const { tenant } = useAuth();
  const bottomRowItems = getBottomRowItems(tenant?.slug || '');

  // Combine all actions
  const allActions = [...quickActions, ...bottomRowItems];

  return (
    <BentoGrid
      className={cn(
        "grid-cols-3 h-full",
        // Gap responsive
        "gap-2 sm:gap-2.5 md:gap-3 lg:gap-4",
        // Remove default auto-rows, use explicit rows
        "auto-rows-auto"
      )}
      style={{
        gridTemplateRows: 'repeat(3, 1fr)',
      }}
    >
      {allActions.map((action) => (
        <BentoActionCard
          key={action.name}
          name={action.name}
          description={action.description}
          href={action.href}
          Icon={action.icon}
          iconColor={action.iconColor}
          gradient={action.gradient}
          className={action.gridClass}
        />
      ))}
    </BentoGrid>
  );
}