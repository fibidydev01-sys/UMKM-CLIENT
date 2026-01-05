import Link from 'next/link';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PageHeader,
  StatsCard,
  RevenueWidget,
  RecentOrders,
  AlertsWidget,
} from '@/components/dashboard';
import { serverApi } from '@/lib/api/server';
import { formatPrice } from '@/lib/format';
import type { Metadata } from 'next';
import type { DashboardStats } from '@/types';

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: 'Dashboard',
};

// ==========================================
// DASHBOARD PAGE
// ==========================================

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Selamat datang di panel admin toko Anda"
      />

      {/* ==========================================
          PRIORITY 1: ALERTS
          ========================================== */}
      <div className="mb-6">
        <AlertsWidget
          lowStockCount={stats?.alerts.lowStock || 0}
          pendingOrdersCount={stats?.alerts.pendingOrders || 0}
          lowStockItems={stats?.lowStockItems}
        />
      </div>

      {/* ==========================================
          PRIORITY 2: STATS CARDS (with Trends)
          ========================================== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total Produk"
          value={stats?.products.total || 0}
          subtitle={`${stats?.products.active || 0} aktif`}
          icon={<Package className="h-4 w-4" />}
          href="/dashboard/products"
        />
        <StatsCard
          title="Pelanggan"
          value={stats?.customers.total || 0}
          subtitle={`+${stats?.customers.thisMonth || 0} bulan ini`}
          icon={<Users className="h-4 w-4" />}
          href="/dashboard/customers"
          trend={stats?.customers.trend}
        />
        <StatsCard
          title="Pesanan Bulan Ini"
          value={stats?.orders.thisMonth || 0}
          subtitle={`${stats?.orders.today || 0} hari ini`}
          icon={<ShoppingCart className="h-4 w-4" />}
          href="/dashboard/orders"
          trend={stats?.orders.trend}
        />
        <StatsCard
          title="Pendapatan Bulan Ini"
          value={formatPrice(stats?.revenue.thisMonth || 0)}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={stats?.revenue.trend}
        />
      </div>

      {/* ==========================================
          PRIORITY 3: REVENUE + RECENT ORDERS
          ========================================== */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <RevenueWidget
          thisWeek={stats?.revenue.thisWeek || 0}
          thisMonth={stats?.revenue.thisMonth || 0}
          lastMonth={stats?.revenue.lastMonth || 0}
          trend={stats?.revenue.trend || 0}
        />
        <RecentOrders orders={stats?.recentOrders || []} />
      </div>

      {/* ==========================================
          QUICK ACTIONS
          ========================================== */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Tambah Produk"
          description="Tambahkan produk baru ke toko Anda"
          icon={<Package className="h-6 w-6" />}
          href="/dashboard/products/new"
        />
        <QuickActionCard
          title="Buat Pesanan"
          description="Buat pesanan baru untuk pelanggan"
          icon={<ShoppingCart className="h-6 w-6" />}
          href="/dashboard/orders/new"
        />
        <QuickActionCard
          title="Tambah Pelanggan"
          description="Tambahkan pelanggan baru ke database"
          icon={<Users className="h-6 w-6" />}
          href="/dashboard/customers/new"
        />
      </div>
    </>
  );
}

// ==========================================
// DATA FETCHING
// ==========================================

async function getStats(): Promise<DashboardStats | null> {
  try {
    return await serverApi.getStats();
  } catch {
    return null;
  }
}

// ==========================================
// QUICK ACTION CARD
// ==========================================

function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}