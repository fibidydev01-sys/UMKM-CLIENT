'use client';

import { Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge';
import { formatPrice, formatDateShort } from '@/lib/format';
import type { OrderListItem } from '@/types';

// ============================================================================
// SKELETON
// ============================================================================

export function OrderGridCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-square w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// ORDER GRID CARD
// Minimal card with order info, details appear on hover
// ============================================================================

interface OrderGridCardProps {
  order: OrderListItem;
  onClick: (order: OrderListItem) => void;
}

export function OrderGridCard({ order, onClick }: OrderGridCardProps) {
  const customerName = order.customer?.name || order.customerName || 'Guest';

  return (
    <button
      onClick={() => onClick(order)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
        {/* Center content - Order number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Package className="h-7 w-7 text-primary" />
          </div>
          <span className="font-bold text-sm text-center">#{order.orderNumber}</span>
          <span className="text-xs text-muted-foreground mt-1">{customerName}</span>
        </div>

        {/* Hover overlay with details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm">
              {formatPrice(order.total)}
            </h3>
            <p className="text-white/70 text-xs mt-1">
              {formatDateShort(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>
    </button>
  );
}
