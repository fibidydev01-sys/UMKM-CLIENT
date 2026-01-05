import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import type { LowStockItem } from '@/types';

// ==========================================
// ALERTS WIDGET
// ==========================================

interface AlertsWidgetProps {
  lowStockCount: number;
  pendingOrdersCount: number;
  lowStockItems?: LowStockItem[];
}

export function AlertsWidget({
  lowStockCount,
  pendingOrdersCount,
  lowStockItems = [],
}: AlertsWidgetProps) {
  const hasAlerts = lowStockCount > 0 || pendingOrdersCount > 0;

  return (
    <Card className={hasAlerts ? 'border-orange-200' : 'border-green-200'}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {hasAlerts ? (
            <>
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-orange-700">Perlu Perhatian</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">Semua Baik!</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!hasAlerts ? (
          <p className="text-sm text-green-600">
            Tidak ada item yang memerlukan perhatian saat ini. 👍
          </p>
        ) : (
          <>
            {/* Pending Orders Alert */}
            {pendingOrdersCount > 0 && (
              <AlertItem
                icon={<ShoppingCart className="h-4 w-4" />}
                title={`${pendingOrdersCount} pesanan pending`}
                description="Pesanan menunggu diproses"
                href="/dashboard/orders?status=PENDING"
                variant="warning"
              />
            )}

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
              <div className="space-y-2">
                <AlertItem
                  icon={<Package className="h-4 w-4" />}
                  title={`${lowStockCount} produk stok menipis`}
                  description="Perlu restok segera"
                  href="/dashboard/products?filter=low-stock"
                  variant="danger"
                />

                {/* Low Stock Items Preview */}
                {lowStockItems.length > 0 && (
                  <div className="ml-6 pl-4 border-l-2 border-red-200 space-y-1">
                    {lowStockItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground truncate max-w-[150px]">
                          {item.name}
                        </span>
                        <span className="text-red-600 font-medium">
                          Stok: {item.stock}
                        </span>
                      </div>
                    ))}
                    {lowStockItems.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{lowStockItems.length - 3} produk lainnya
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ==========================================
// ALERT ITEM
// ==========================================

interface AlertItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  variant: 'warning' | 'danger';
}

function AlertItem({ icon, title, description, href, variant }: AlertItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${variant === 'danger'
        ? 'bg-red-50 hover:bg-red-100'
        : 'bg-orange-50 hover:bg-orange-100'
        }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-full ${variant === 'danger'
            ? 'bg-red-100 text-red-600'
            : 'bg-orange-100 text-orange-600'
            }`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-sm font-medium ${variant === 'danger' ? 'text-red-700' : 'text-orange-700'
              }`}
          >
            {title}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ArrowRight
        className={`h-4 w-4 ${variant === 'danger' ? 'text-red-400' : 'text-orange-400'
          }`}
      />
    </Link>
  );
}