'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { OrderStatus, PaymentStatus } from '@/types';

// ==========================================
// STATUS OPTIONS
// ==========================================

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Belum Bayar' },
  { value: 'PARTIAL', label: 'Sebagian' },
  { value: 'PAID', label: 'Lunas' },
  { value: 'FAILED', label: 'Gagal' },
];

// ==========================================
// ORDER STATUS SELECT
// ==========================================

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
  disabled?: boolean;
  onSuccess?: () => void;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
  disabled,
  onSuccess,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  const handleChange = async (value: OrderStatus) => {
    if (value === status) return;

    setIsLoading(true);

    try {
      await ordersApi.updateStatus(orderId, { status: value });
      setStatus(value); // ✅ Update local state immediately
      toast.success('Status pesanan diperbarui');

      // Refresh page data
      router.refresh();
      onSuccess?.();
    } catch (err) {
      toast.error('Gagal memperbarui status', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Jika CANCELLED, tampilkan text saja (tidak bisa diubah)
  if (status === 'CANCELLED') {
    return (
      <span className="text-sm text-muted-foreground">Dibatalkan</span>
    );
  }

  // ✅ Jika COMPLETED, tampilkan text saja
  if (status === 'COMPLETED') {
    return (
      <span className="text-sm text-muted-foreground">Selesai</span>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={handleChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-[140px]">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {orderStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ==========================================
// PAYMENT STATUS SELECT
// ==========================================

interface PaymentStatusSelectProps {
  orderId: string;
  currentStatus: PaymentStatus;
  orderStatus?: OrderStatus; // ✅ ADD: untuk cek apakah order cancelled
  disabled?: boolean;
  onSuccess?: () => void;
}

export function PaymentStatusSelect({
  orderId,
  currentStatus,
  orderStatus,
  disabled,
  onSuccess,
}: PaymentStatusSelectProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(currentStatus);

  const handleChange = async (value: PaymentStatus) => {
    if (value === status) return;

    setIsLoading(true);

    try {
      await ordersApi.updatePayment(orderId, { paymentStatus: value });
      setStatus(value); // ✅ Update local state immediately
      toast.success('Status pembayaran diperbarui');

      // Refresh page data
      router.refresh();
      onSuccess?.();
    } catch (err) {
      toast.error('Gagal memperbarui pembayaran', getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Jika order CANCELLED, tampilkan text saja (tidak bisa ubah payment)
  if (orderStatus === 'CANCELLED') {
    const label = paymentStatusOptions.find(o => o.value === status)?.label || status;
    return (
      <span className="text-sm text-muted-foreground">{label}</span>
    );
  }

  return (
    <Select
      value={status}
      onValueChange={handleChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-[130px]">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {paymentStatusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}