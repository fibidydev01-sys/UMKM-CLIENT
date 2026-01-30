'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { OrderGridCard, OrderGridCardSkeleton } from './order-grid-card';
import { OrderPreviewDrawer } from './order-preview-drawer';
import { OrderCancelDialog } from './order-cancel-dialog';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { OrderListItem } from '@/types';

// ============================================================================
// ORDERS GRID
// Grid view for orders with preview drawer
// ============================================================================

interface OrdersGridProps {
  orders: OrderListItem[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

export function OrdersGrid({ orders, isRefreshing, onRefresh }: OrdersGridProps) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<OrderListItem | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);

  const handleOrderClick = (order: OrderListItem) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedOrder(null);
    }
  };

  // ════════════════════════════════════════════════════════════
  // DRAWER ACTIONS
  // ════════════════════════════════════════════════════════════
  const onCancel = useCallback((order: OrderListItem) => {
    setCancelOrder(order);
  }, []);

  const handleCancel = useCallback(async () => {
    if (!cancelOrder) return;

    setIsCancelling(true);

    try {
      await ordersApi.updateStatus(cancelOrder.id, 'CANCELLED');
      toast.success('Pesanan berhasil dibatalkan');
      setCancelOrder(null);
      setDrawerOpen(false);
      await refreshData();
    } catch (err) {
      toast.error('Gagal membatalkan pesanan', getErrorMessage(err));
    } finally {
      setIsCancelling(false);
    }
  }, [cancelOrder, refreshData]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada pesanan</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
        isRefreshing && 'opacity-50 pointer-events-none'
      )}>
        {orders.map((order) => (
          <OrderGridCard
            key={order.id}
            order={order}
            onClick={handleOrderClick}
          />
        ))}
      </div>

      {/* Preview Drawer */}
      <OrderPreviewDrawer
        orderListItem={selectedOrder}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        onCancel={onCancel}
      />

      {/* Cancel Confirmation Dialog */}
      <OrderCancelDialog
        order={cancelOrder}
        isOpen={!!cancelOrder}
        isLoading={isCancelling}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancel}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function OrdersGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <OrderGridCardSkeleton key={i} />
      ))}
    </div>
  );
}
