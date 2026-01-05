import Link from 'next/link';
import { Plus, Users, ShoppingCart, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ==========================================
// DASHBOARD QUICK ACTIONS
// ==========================================

const actions = [
  {
    title: 'Tambah Produk',
    description: 'Tambah produk baru ke toko',
    href: '/dashboard/products/new',
    icon: Plus,
    variant: 'default' as const,
  },
  {
    title: 'Lihat Pesanan',
    description: 'Kelola pesanan masuk',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    variant: 'outline' as const,
  },
  {
    title: 'Tambah Pelanggan',
    description: 'Catat pelanggan baru',
    href: '/dashboard/customers/new',
    icon: Users,
    variant: 'outline' as const,
  },
  {
    title: 'Pengaturan Toko',
    description: 'Atur profil dan toko',
    href: '/dashboard/settings',
    icon: Settings,
    variant: 'outline' as const,
  },
];

export function DashboardQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant={action.variant}
              className="h-auto flex-col items-start gap-1 p-4"
            >
              <Link href={action.href}>
                <div className="flex items-center gap-2 w-full">
                  <action.icon className="h-4 w-4" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-xs font-normal text-muted-foreground w-full text-left">
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}