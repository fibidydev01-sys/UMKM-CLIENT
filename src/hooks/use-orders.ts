'use client';

import { useState, useCallback, useEffect } from 'react';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type {
  Order,
  OrderListItem,
  CreateOrderInput,
  UpdatePaymentStatusInput,
  OrderQueryParams,
  OrderStatus,
} from '@/types';

// ==========================================
// USE ORDERS HOOK
// Orders list with filters & pagination
// ==========================================

export function useOrders(initialParams?: OrderQueryParams) {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<OrderQueryParams>(initialParams || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ordersApi.getAll(filters);
      setOrders(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateFilters = useCallback((newFilters: Partial<OrderQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    orders,
    pagination,
    filters,
    isLoading,
    error,
    setFilters: updateFilters,
    refetch: fetchOrders,
  };
}

// ==========================================
// USE ORDER HOOK
// Single order by ID
// ==========================================

export function useOrder(id: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) {
      setOrder(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ordersApi.getById(id);
      setOrder(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrder,
  };
}

// ==========================================
// USE CREATE ORDER HOOK
// ==========================================

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = useCallback(async (data: CreateOrderInput) => {
    setIsLoading(true);

    try {
      const order = await ordersApi.create(data);
      toast.success('Pesanan berhasil dibuat', `No. ${order.orderNumber}`);
      return order;
    } catch (err) {
      toast.error('Gagal membuat pesanan', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createOrder,
    isLoading,
  };
}

// ==========================================
// USE UPDATE ORDER STATUS HOOK
// ==========================================

export function useUpdateOrderStatus() {
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = useCallback(async (
    id: string,
    status: OrderStatus
  ) => {
    setIsLoading(true);

    try {
      const order = await ordersApi.updateStatus(id, { status });
      toast.success('Status pesanan diperbarui');
      return order; // ✅ Return order, not boolean
    } catch (err) {
      toast.error('Gagal memperbarui status', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateStatus, isLoading };
}
// ==========================================
// USE UPDATE PAYMENT STATUS HOOK
// ==========================================

export function useUpdatePaymentStatus() {
  const [isLoading, setIsLoading] = useState(false);

  const updatePayment = useCallback(async (
    id: string,
    data: UpdatePaymentStatusInput
  ) => {
    setIsLoading(true);

    try {
      const order = await ordersApi.updatePayment(id, data);
      toast.success('Status pembayaran diperbarui');
      return order; // ✅ Return order
    } catch (err) {
      toast.error('Gagal memperbarui pembayaran', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updatePayment, // ✅ Correct export name
    isLoading,
  };
}

// ==========================================
// USE CANCEL ORDER HOOK
// ==========================================

export function useCancelOrder() {
  const [isLoading, setIsLoading] = useState(false);

  const cancelOrder = useCallback(async (id: string, reason?: string) => {
    setIsLoading(true);

    try {
      const order = await ordersApi.cancel(id, reason);
      toast.success('Pesanan dibatalkan');
      return order;
    } catch (err) {
      toast.error('Gagal membatalkan pesanan', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cancelOrder,
    isLoading,
  };
}

// ==========================================
// USE TODAY ORDERS HOOK
// ==========================================

export function useTodayOrders() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await ordersApi.getToday();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    refetch: fetchOrders,
  };
}