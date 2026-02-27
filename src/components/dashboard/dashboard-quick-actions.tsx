'use client';

import {
  Package,
  Settings,
  PlusCircle,
  Store,
  Layout,
  Crown,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTenant } from '@/hooks';
import { BentoGrid, BentoActionCard } from '@/components/ui/bento-grid';

// ==========================================
// DASHBOARD QUICK ACTIONS
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
    name: 'Add product',
    description: 'Create a new product',
    href: '/dashboard/products/new',
    gradient: 'from-pink-500/20 via-pink-500/5',
    iconColor: 'text-pink-500',
    gridClass: 'col-span-1 row-span-2',
  },
  {
    icon: Package,
    name: 'Products',
    description: 'View all products',
    href: '/dashboard/products',
    gradient: 'from-orange-500/20 via-orange-500/5',
    iconColor: 'text-orange-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Layout,
    name: 'Landing Builder',
    description: 'Edit your landing page',
    href: '/dashboard/landing-builder',
    gradient: 'from-blue-500/20 via-blue-500/5',
    iconColor: 'text-blue-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Rocket,
    name: 'Store Setup',
    description: 'Setup guide',
    href: '/dashboard/onboarding',
    gradient: 'from-purple-500/20 via-purple-500/5',
    iconColor: 'text-purple-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Crown,
    name: 'Subscription',
    description: 'Manage your plan',
    href: '/dashboard/subscription',
    gradient: 'from-amber-500/20 via-amber-500/5',
    iconColor: 'text-amber-500',
    gridClass: 'col-span-1 row-span-1',
  },
];

const getBottomRowItems = (tenantSlug: string) => [
  {
    icon: Store,
    name: 'View store',
    description: 'Open your online store',
    href: `/store/${tenantSlug}`,
    gradient: 'from-cyan-500/20 via-cyan-500/5',
    iconColor: 'text-cyan-500',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    icon: Settings,
    name: 'Settings',
    description: 'Configure your store',
    href: '/dashboard/settings/toko',
    gradient: 'from-gray-500/20 via-gray-500/5',
    iconColor: 'text-gray-500',
    gridClass: 'col-span-2 row-span-1',
  },
];

export function DashboardQuickActions() {
  const { tenant } = useTenant();
  const bottomRowItems = getBottomRowItems(tenant?.slug || '');
  const allActions = [...quickActions, ...bottomRowItems];

  return (
    <BentoGrid
      className={cn(
        'grid-cols-3 h-full',
        'gap-2 sm:gap-2.5 md:gap-3 lg:gap-4',
        'auto-rows-auto'
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