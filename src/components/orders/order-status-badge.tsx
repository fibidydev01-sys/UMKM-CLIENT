import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import type { OrderStatus, PaymentStatus } from '@/types';

// ==========================================
// ✅ FIX: Use UPPERCASE enum values from backend
// ==========================================

const orderStatusConfig: Record<OrderStatus, { label: string; variant: string }> = {
  PENDING: { label: 'Menunggu', variant: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PROCESSING: { label: 'Diproses', variant: 'bg-blue-100 text-blue-800 border-blue-200' },
  COMPLETED: { label: 'Selesai', variant: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED: { label: 'Dibatalkan', variant: 'bg-red-100 text-red-800 border-red-200' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: string }> = {
  PENDING: { label: 'Belum Bayar', variant: 'bg-red-100 text-red-800 border-red-200' },
  PARTIAL: { label: 'Sebagian', variant: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PAID: { label: 'Lunas', variant: 'bg-green-100 text-green-800 border-green-200' },
  FAILED: { label: 'Gagal', variant: 'bg-gray-100 text-gray-800 border-gray-200' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = orderStatusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium', config.variant)}>
      {config.label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium', config.variant)}>
      {config.label}
    </Badge>
  );
}