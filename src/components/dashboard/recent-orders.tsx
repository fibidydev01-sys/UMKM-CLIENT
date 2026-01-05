import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { RecentOrder } from '@/types';

// ==========================================
// RECENT ORDERS WIDGET
// ==========================================

interface RecentOrdersProps {
  orders: RecentOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Pesanan Terbaru
          </CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-xs">
              Lihat Semua
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary font-medium">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {order.customer?.name || order.customerName || 'Guest'}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(order.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: 'Konfirmasi', className: 'bg-blue-100 text-blue-700' },
    PROCESSING: { label: 'Proses', className: 'bg-purple-100 text-purple-700' },
    SHIPPED: { label: 'Dikirim', className: 'bg-indigo-100 text-indigo-700' },
    DELIVERED: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
    COMPLETED: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Batal', className: 'bg-red-100 text-red-700' },
  };

  const { label, className } = config[status] || config.PENDING;

  return (
    <Badge variant="secondary" className={cn('text-xs', className)}>
      {label}
    </Badge>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}