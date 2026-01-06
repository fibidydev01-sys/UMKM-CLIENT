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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { getProductColumns } from './products-table-columns';
import { ProductsTableToolbar } from './products-table-toolbar';
import { ProductDeleteDialog } from './product-delete-dialog';
import { useDeleteProduct, useUpdateProduct } from '@/hooks';
import { toast } from '@/providers';
import { productsApi, getErrorMessage, isApiError } from '@/lib/api';
import type { Product } from '@/types';

// ==========================================
// PRODUCTS TABLE COMPONENT
// ==========================================

interface ProductsTableProps {
  products: Product[];
  categories: string[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
  onOptimisticDelete?: (ids: string[]) => void;
  onRollback?: (products: Product[]) => void;
}

export function ProductsTable({
  products,
  categories,
  isRefreshing = false,
  onRefresh,
  onOptimisticDelete,
  onRollback,
}: ProductsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Delete dialog state (single)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Bulk delete dialog state
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  // Hooks
  const { deleteProduct: performDelete, isLoading: isDeleting } = useDeleteProduct();
  const { updateProduct } = useUpdateProduct();

  // Helper to refresh data properly
  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);

  // Column actions
  const columnActions = {
    onEdit: (product: Product) => {
      router.push(`/dashboard/products/${product.id}/edit`);
    },
    onDelete: (product: Product) => {
      setDeleteProduct(product);
    },
    onToggleActive: async (product: Product) => {
      try {
        await updateProduct(product.id, { isActive: !product.isActive });
        await refreshData();
      } catch {
        // Error handled in hook
      }
    },
  };

  const columns = getProductColumns(columnActions);

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Handle single delete with optimistic update
  const handleDelete = useCallback(async () => {
    if (!deleteProduct) return;

    const productId = deleteProduct.id;
    const previousProducts = [...products];

    // Close dialog immediately
    setDeleteProduct(null);

    // Optimistic update - remove from UI immediately
    if (onOptimisticDelete) {
      onOptimisticDelete([productId]);
    }

    try {
      const success = await performDelete(productId);

      if (success) {
        // Force refresh to ensure data consistency
        await refreshData();
      } else {
        // Rollback if delete failed
        if (onRollback) {
          onRollback(previousProducts);
        }
      }
    } catch {
      // Rollback on error
      if (onRollback) {
        onRollback(previousProducts);
      }
    }
  }, [deleteProduct, products, performDelete, refreshData, onOptimisticDelete, onRollback]);

  // Open bulk delete dialog
  const openBulkDeleteDialog = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const ids = selectedRows
      .map((row) => row.original?.id)
      .filter((id): id is string => Boolean(id));

    if (ids.length === 0) return;

    setBulkDeleteIds(ids);
    setIsBulkDeleteOpen(true);
  }, [table]);

  // Handle bulk delete with optimistic update
  const handleBulkDelete = useCallback(async () => {
    if (bulkDeleteIds.length === 0) return;

    const previousProducts = [...products];

    setIsBulkDeleting(true);

    // Close dialog and reset selection immediately
    setIsBulkDeleteOpen(false);
    setRowSelection({});

    // Optimistic update
    if (onOptimisticDelete) {
      onOptimisticDelete(bulkDeleteIds);
    }

    try {
      const result = await productsApi.bulkDelete(bulkDeleteIds);
      toast.success(result.message || `${result.count} produk berhasil dihapus`);

      // Clear bulk delete IDs
      setBulkDeleteIds([]);

      // Force refresh
      await refreshData();
    } catch (err) {
      // Check if 401 - user will be redirected
      if (isApiError(err) && err.isUnauthorized()) {
        return;
      }

      // Rollback on error
      if (onRollback) {
        onRollback(previousProducts);
      }

      toast.error('Gagal menghapus produk', getErrorMessage(err));
    } finally {
      setIsBulkDeleting(false);
    }
  }, [bulkDeleteIds, products, refreshData, onOptimisticDelete, onRollback]);

  // Manual refresh handler
  const handleManualRefresh = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <ProductsTableToolbar
        table={table}
        categories={categories}
        onBulkDelete={openBulkDeleteDialog}
        onRefresh={handleManualRefresh}
        isBulkDeleting={isBulkDeleting}
        isRefreshing={isRefreshing}
      />

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
                  Tidak ada produk ditemukan.
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

      {/* Single Delete Dialog */}
      <ProductDeleteDialog
        product={deleteProduct}
        isOpen={!!deleteProduct}
        isLoading={isDeleting}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus {bulkDeleteIds.length} Produk</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus <strong>{bulkDeleteIds.length} produk</strong> yang dipilih?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}