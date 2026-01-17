// ══════════════════════════════════════════════════════════════
// PRODUCTS TABLE - V2.0 WITH DRAWER
// Minimal list view + drawer for details
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useMemo } from 'react';
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
import { ProductPreviewDrawer } from './product-preview-drawer';
import { productsApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { Product } from '@/types';

interface ProductsTableProps {
  products: Product[];
  categories: string[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

export function ProductsTable({
  products,
  categories,
  isRefreshing = false,
  onRefresh,
}: ProductsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Drawer state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);

  // ════════════════════════════════════════════════════════════
  // ROW CLICK HANDLER - Open drawer
  // ════════════════════════════════════════════════════════════
  const onRowClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  }, []);

  // ════════════════════════════════════════════════════════════
  // DRAWER ACTIONS
  // ════════════════════════════════════════════════════════════
  const onEdit = useCallback((product: Product) => {
    router.push(`/dashboard/products/${product.id}/edit`);
  }, [router]);

  const onDelete = useCallback((product: Product) => {
    setDeleteProduct(product);
  }, []);

  const onToggleActive = useCallback(async (product: Product) => {
    try {
      await productsApi.update(product.id, { isActive: !product.isActive });
      toast.success(product.isActive ? 'Produk dinonaktifkan' : 'Produk diaktifkan');
      await refreshData();
    } catch (err) {
      toast.error('Gagal mengubah status', getErrorMessage(err));
    }
  }, [refreshData]);

  // ════════════════════════════════════════════════════════════
  // COLUMN ACTIONS - Only onRowClick needed
  // ════════════════════════════════════════════════════════════
  const columnActions = useMemo(() => ({
    onRowClick,
  }), [onRowClick]);

  const columns = useMemo(
    () => getProductColumns(columnActions),
    [columnActions]
  );

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

  const handleDelete = useCallback(async () => {
    if (!deleteProduct) return;

    setIsDeleting(true);

    try {
      await productsApi.delete(deleteProduct.id);
      toast.success('Produk berhasil dihapus');
      setDeleteProduct(null);
      await refreshData();
    } catch (err) {
      toast.error('Gagal menghapus produk', getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, refreshData]);

  const openBulkDeleteDialog = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows
      .map((row) => row.original?.id)
      .filter((id): id is string => Boolean(id));

    if (ids.length === 0) return;

    setBulkDeleteIds(ids);
    setIsBulkDeleteOpen(true);
  }, [table]);

  const handleBulkDelete = useCallback(async () => {
    if (bulkDeleteIds.length === 0) return;

    setIsBulkDeleting(true);

    try {
      const result = await productsApi.bulkDelete(bulkDeleteIds);
      toast.success(result.message || `${result.count} produk berhasil dihapus`);
      setRowSelection({});
      setIsBulkDeleteOpen(false);
      setBulkDeleteIds([]);
      await refreshData();
    } catch (err) {
      toast.error('Gagal menghapus produk', getErrorMessage(err));
    } finally {
      setIsBulkDeleting(false);
    }
  }, [bulkDeleteIds, refreshData]);

  return (
    <div className="space-y-4">
      <ProductsTableToolbar
        table={table}
        categories={categories}
        onBulkDelete={openBulkDeleteDialog}
        onRefresh={refreshData}
        isBulkDeleting={isBulkDeleting}
        isRefreshing={isRefreshing}
      />

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

      {/* Product Preview Drawer */}
      <ProductPreviewDrawer
        product={selectedProduct}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />

      <ProductDeleteDialog
        product={deleteProduct}
        isOpen={!!deleteProduct}
        isLoading={isDeleting}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />

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
