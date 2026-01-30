'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CustomerGridCard, CustomerGridCardSkeleton } from './customer-grid-card';
import { CustomerPreviewDrawer } from './customer-preview-drawer';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import { customersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import { generateWhatsAppLink } from '@/lib/format';
import type { Customer } from '@/types';

// ============================================================================
// CUSTOMERS GRID
// Grid view for customers with preview drawer
// ============================================================================

interface CustomersGridProps {
  customers: Customer[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

export function CustomersGrid({ customers, isRefreshing, onRefresh }: CustomersGridProps) {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedCustomer(null);
    }
  };

  // ════════════════════════════════════════════════════════════
  // DRAWER ACTIONS
  // ════════════════════════════════════════════════════════════
  const onEdit = useCallback((customer: Customer) => {
    router.push(`/dashboard/customers/${customer.id}/edit`);
  }, [router]);

  const onDelete = useCallback((customer: Customer) => {
    setDeleteCustomer(customer);
  }, []);

  const onWhatsApp = useCallback((customer: Customer) => {
    const link = generateWhatsAppLink(customer.phone, `Halo ${customer.name},`);
    window.open(link, '_blank');
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteCustomer) return;

    setIsDeleting(true);

    try {
      await customersApi.delete(deleteCustomer.id);
      toast.success('Pelanggan berhasil dihapus');
      setDeleteCustomer(null);
      setDrawerOpen(false);
      await refreshData();
    } catch (err) {
      toast.error('Gagal menghapus pelanggan', getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteCustomer, refreshData]);

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada pelanggan</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
        isRefreshing && 'opacity-50 pointer-events-none'
      )}>
        {customers.map((customer) => (
          <CustomerGridCard
            key={customer.id}
            customer={customer}
            onClick={handleCustomerClick}
          />
        ))}
      </div>

      {/* Preview Drawer */}
      <CustomerPreviewDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        onEdit={onEdit}
        onDelete={onDelete}
        onWhatsApp={onWhatsApp}
      />

      {/* Delete Confirmation Dialog */}
      <CustomerDeleteDialog
        customer={deleteCustomer}
        isOpen={!!deleteCustomer}
        isLoading={isDeleting}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function CustomersGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerGridCardSkeleton key={i} />
      ))}
    </div>
  );
}
