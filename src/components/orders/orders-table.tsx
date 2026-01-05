'use client';

import { useState } from 'react';
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
import { useCancelOrder } from '@/hooks';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE COMPONENT
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

  // Cancel dialog state
  const [cancelOrder, setCancelOrder] = useState<OrderListItem | null>(null);
  const { cancelOrder: performCancel, isLoading: isCancelling } = useCancelOrder();

  // Delete dialog state
  const [deleteOrder, setDeleteOrder] = useState<OrderListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk delete dialog state
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  // Helper: Refresh data
  const refreshData = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  // Column actions
  const columnActions = {
    onView: (order: OrderListItem) => {
      router.push(`/dashboard/orders/${order.id}`);
    },
    onCancel: (order: OrderListItem) => {
      setCancelOrder(order);
    },
    onDelete: (order: OrderListItem) => {
      setDeleteOrder(order);
    },
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

    const success = await performCancel(cancelOrder.id);
    if (success) {
      setCancelOrder(null);
      refreshData();
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

  // Open bulk delete dialog
  const openBulkDeleteDialog = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map((row) => row.original.id);

    if (ids.length === 0) return;

    setBulkDeleteIds(ids);
    setIsBulkDeleteOpen(true);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return;

    setIsBulkDeleting(true);

    try {
      // Delete one by one (or implement bulk delete endpoint)
      let successCount = 0;
      for (const id of bulkDeleteIds) {
        try {
          await ordersApi.delete(id);
          successCount++;
        } catch {
          // Continue with others
        }
      }

      toast.success(`${successCount} pesanan berhasil dihapus`);
      setRowSelection({});
      setIsBulkDeleteOpen(false);
      setBulkDeleteIds([]);
      refreshData();
    } catch (err) {
      toast.error('Gagal menghapus pesanan', getErrorMessage(err));
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Check if any selected
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
            onClick={openBulkDeleteDialog}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Hapus {bulkDeleteIds.length} Pesanan</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus <strong>{bulkDeleteIds.length} pesanan</strong> yang dipilih?
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