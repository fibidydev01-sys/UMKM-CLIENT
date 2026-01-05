'use client';

import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPriceShort } from '@/lib/format';
import { useDashboardStats } from '@/hooks';
import { cn } from '@/lib/cn';

// ==========================================
// DASHBOARD STATS COMPONENT
// ==========================================

export function DashboardStats() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Produk',
      value: stats.products.total,
      subtext: `${stats.products.active} aktif`,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Pelanggan',
      value: stats.customers.total,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pesanan Bulan Ini',
      value: stats.orders.thisMonth,
      subtext: `${stats.orders.today} hari ini`,
      icon: ShoppingCart,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: formatPriceShort(stats.revenue.thisMonth),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={cn('rounded-lg p-2', stat.bgColor)}>
              <stat.icon className={cn('h-4 w-4', stat.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtext && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtext}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Low Stock Alert */}
      {stats.alerts.lowStock > 0 && (
        <Card className="md:col-span-2 lg:col-span-4 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-orange-500/20 p-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-300">
                {stats.alerts.lowStock} produk dengan stok rendah
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Segera perbarui stok untuk menghindari kehabisan
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}