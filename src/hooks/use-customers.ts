'use client';

import { useState, useCallback, useEffect } from 'react';
import { customersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { Customer, CreateCustomerInput, UpdateCustomerInput, CustomerQueryParams } from '@/types';

// ==========================================
// USE CUSTOMERS HOOK
// Customers list with search & pagination
// ==========================================

export function useCustomers(initialParams?: CustomerQueryParams) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<CustomerQueryParams>(initialParams || {});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await customersApi.getAll(filters);
      setCustomers(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const updateFilters = useCallback((newFilters: Partial<CustomerQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    customers,
    pagination,
    filters,
    isLoading,
    error,
    setFilters: updateFilters,
    refetch: fetchCustomers,
  };
}

// ==========================================
// USE CUSTOMER HOOK
// Single customer by ID
// ==========================================

export function useCustomer(id: string | null) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) {
      setCustomer(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await customersApi.getById(id);
      setCustomer(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomer,
  };
}

// ==========================================
// USE CREATE CUSTOMER HOOK
// ==========================================

export function useCreateCustomer() {
  const [isLoading, setIsLoading] = useState(false);

  const createCustomer = useCallback(async (data: CreateCustomerInput) => {
    setIsLoading(true);

    try {
      const customer = await customersApi.create(data);
      toast.success('Pelanggan berhasil ditambahkan');
      return customer;
    } catch (err) {
      toast.error('Gagal menambahkan pelanggan', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createCustomer,
    isLoading,
  };
}

// ==========================================
// USE UPDATE CUSTOMER HOOK
// ==========================================

export function useUpdateCustomer() {
  const [isLoading, setIsLoading] = useState(false);

  const updateCustomer = useCallback(async (id: string, data: UpdateCustomerInput) => {
    setIsLoading(true);

    try {
      const customer = await customersApi.update(id, data);
      toast.success('Pelanggan berhasil diperbarui');
      return customer;
    } catch (err) {
      toast.error('Gagal memperbarui pelanggan', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateCustomer,
    isLoading,
  };
}

// ==========================================
// USE DELETE CUSTOMER HOOK
// ==========================================

export function useDeleteCustomer() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteCustomer = useCallback(async (id: string) => {
    setIsLoading(true);

    try {
      await customersApi.delete(id);
      toast.success('Pelanggan berhasil dihapus');
      return true;
    } catch (err) {
      toast.error('Gagal menghapus pelanggan', getErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteCustomer,
    isLoading,
  };
}

// ==========================================
// USE SEARCH CUSTOMER HOOK
// Search by phone for order creation
// ==========================================

export function useSearchCustomer() {
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchByPhone = useCallback(async (phone: string) => {
    if (phone.length < 4) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const customers = await customersApi.searchByPhone(phone);
      setResults(customers);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isSearching,
    searchByPhone,
    clear,
  };
}