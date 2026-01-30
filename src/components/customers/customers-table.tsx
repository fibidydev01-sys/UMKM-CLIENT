'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCustomerColumns } from './customers-table-columns';
import { CustomerDeleteDialog } from './customer-delete-dialog';
import { CustomerPreviewDrawer } from './customer-preview-drawer';
import { customersApi, getErrorMessage } from '@/lib/api';
import { generateWhatsAppLink } from '@/lib/format';
import { toast } from '@/providers';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMERS TABLE COMPONENT - MINIMAL VIEW
// Optimized with drawer preview pattern
// ✅ Minimal columns for performance
// ✅ Drawer for full customer details
// ==========================================

interface CustomersTableProps {
  customers: Customer[];
  onRefresh?: () => Promise<void>;
}

export function CustomersTable({ customers, onRefresh }: CustomersTableProps) {
  const router = useRouter();

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  // Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Delete dialog state
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk delete state
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Row click handler - opens drawer
  const onRowClick = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  }, []);

  // Drawer action handlers
  const onEdit = useCallback(
    (customer: Customer) => {
      setDrawerOpen(false);
      router.push(`/dashboard/customers/${customer.id}/edit`);
    },
    [router]
  );

  const onDelete = useCallback((customer: Customer) => {
    setDrawerOpen(false);
    setDeleteCustomer(customer);
  }, []);

  const onWhatsApp = useCallback((customer: Customer) => {
    const link = generateWhatsAppLink(customer.phone, `Halo ${customer.name},`);
    window.open(link, '_blank');
  }, []);

  // Column actions
  const columnActions = {
    onRowClick,
  };

  const columns = getCustomerColumns(columnActions);

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Handle single delete
  const handleDelete = async () => {
    if (!deleteCustomer) return;

    setIsDeleting(true);

    try {
      await customersApi.delete(deleteCustomer.id);
      toast.success('Pelanggan berhasil dihapus');
      setDeleteCustomer(null);
      await refreshData();
    } catch (err) {
      toast.error('Gagal menghapus pelanggan', getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // ✅ FIXED: Bulk delete with single summary toast
  // ==========================================
  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) return;

    setIsBulkDeleting(true);

    // Track results
    let successCount = 0;
    const failedItems: string[] = [];

    // Delete one by one and collect results
    for (const row of selectedRows) {
      const customer = row.original;
      try {
        await customersApi.delete(customer.id);
        successCount++;
      } catch (err) {
        // Collect error with customer name for context
        const errorMsg = getErrorMessage(err);
        failedItems.push(`${customer.name}: ${errorMsg}`);
      }
    }

    // Clear selection
    setRowSelection({});
    setIsBulkDeleting(false);

    // ✅ Single toast based on results
    if (successCount === ids.length) {
      // All success
      toast.success(`${successCount} pelanggan berhasil dihapus`);
    } else if (successCount === 0) {
      // All failed
      toast.error(
        'Gagal menghapus pelanggan',
        failedItems.join('\n')
      );
    } else {
      // Partial success - show warning with details
      toast.warning(
        `${successCount} berhasil, ${failedItems.length} gagal`,
        failedItems.join('\n')
      );
    }

    // Refresh data
    await refreshData();
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, telepon, email..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} dipilih
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>Menghapus...</>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada pelanggan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{' '}
          {table.getFilteredRowModel().rows.length} baris dipilih.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Selanjutnya
          </Button>
        </div>
      </div>

      {/* Delete Dialog */}
      <CustomerDeleteDialog
        customer={deleteCustomer}
        isOpen={!!deleteCustomer}
        isLoading={isDeleting}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={handleDelete}
      />

      {/* Preview Drawer */}
      <CustomerPreviewDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onWhatsApp={onWhatsApp}
      />
    </div>
  );
}