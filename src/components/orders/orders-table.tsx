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
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { getOrderColumns } from './orders-table-columns';
import { OrdersTableToolbar } from './orders-table-toolbar';
import { OrderCancelDialog } from './order-cancel-dialog';
import { OrderPreviewDrawer } from './order-preview-drawer';
import { useCancelOrder } from '@/hooks';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE COMPONENT - MINIMAL VIEW
// Optimized with drawer preview pattern
// ✅ Minimal columns for performance
// ✅ Drawer for full order details
// ==========================================

interface OrdersTableProps {
  orders: OrderListItem[];
  onRefresh?: () => void;
}

export function OrdersTable({ orders, onRefresh }: OrdersTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Drawer state
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Cancel dialog state
  const [cancelOrder, setCancelOrder] = useState<OrderListItem | null>(null);
  const { cancelOrder: performCancel, isLoading: isCancelling } = useCancelOrder();

  // Delete dialog state
  const [deleteOrder, setDeleteOrder] = useState<OrderListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk delete state
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Helper: Refresh data
  const refreshData = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  // Row click handler - opens drawer
  const onRowClick = useCallback((order: OrderListItem) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  }, []);

  // Drawer action handlers
  const onCancelFromDrawer = useCallback((order: OrderListItem) => {
    setDrawerOpen(false);
    setCancelOrder(order);
  }, []);

  // Column actions
  const columnActions = {
    onRowClick,
  };

  const columns = getOrderColumns(columnActions);

  const table = useReactTable({
    data: orders,
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

  // Handle cancel
  const handleCancel = async () => {
    if (!cancelOrder) return;

    try {
      await performCancel(cancelOrder.id);
      setCancelOrder(null);
      refreshData();
    } catch {
      // Error handled in hook
    }
  };

  // Handle single delete
  const handleDelete = async () => {
    if (!deleteOrder) return;

    setIsDeleting(true);

    try {
      await ordersApi.delete(deleteOrder.id);
      toast.success('Pesanan berhasil dihapus');
      setDeleteOrder(null);
      refreshData();
    } catch (err) {
      toast.error('Gagal menghapus pesanan', getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // ✅ FIXED: Bulk delete with single summary toast
  // ==========================================
  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length === 0) return;

    setIsBulkDeleting(true);

    // Track results
    let successCount = 0;
    const failedItems: string[] = [];

    // Delete one by one and collect results
    for (const row of selectedRows) {
      const order = row.original;

      // ✅ Skip non-PENDING orders
      if (order.status !== 'PENDING') {
        failedItems.push(`#${order.orderNumber}: Status ${order.status} tidak dapat dihapus`);
        continue;
      }

      try {
        await ordersApi.delete(order.id);
        successCount++;
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        failedItems.push(`#${order.orderNumber}: ${errorMsg}`);
      }
    }

    // Clear selection
    setRowSelection({});
    setIsBulkDeleting(false);

    // ✅ Single toast based on results
    if (successCount === selectedRows.length) {
      // All success
      toast.success(`${successCount} pesanan berhasil dihapus`);
    } else if (successCount === 0) {
      // All failed
      toast.error(
        'Gagal menghapus pesanan',
        failedItems.join('\n')
      );
    } else {
      // Partial success
      toast.warning(
        `${successCount} berhasil, ${failedItems.length} gagal`,
        failedItems.join('\n')
      );
    }

    // Refresh data
    refreshData();
  };

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <OrdersTableToolbar table={table} />

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedCount} dipilih</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </>
            )}
          </Button>
        </div>
      )}

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
                  Tidak ada pesanan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} pesanan
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

      {/* Cancel Dialog */}
      <OrderCancelDialog
        order={cancelOrder}
        isOpen={!!cancelOrder}
        isLoading={isCancelling}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancel}
      />

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteOrder} onOpenChange={() => setDeleteOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus Pesanan</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus pesanan <strong>#{deleteOrder?.orderNumber}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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

      {/* Preview Drawer */}
      <OrderPreviewDrawer
        orderListItem={selectedOrder}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onCancel={onCancelFromDrawer}
      />
    </div>
  );
}