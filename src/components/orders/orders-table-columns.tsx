'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { MoreHorizontal, ArrowUpDown, Eye, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrderStatusBadge, PaymentStatusBadge } from './order-status-badge';
import { formatPrice, formatDateTime } from '@/lib/format';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE COLUMNS
// ==========================================

interface ColumnActions {
  onView: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
  onDelete: (order: OrderListItem) => void; // ✅ ADD: Delete action
}

export function getOrderColumns(actions: ColumnActions): ColumnDef<OrderListItem>[] {
  return [
    // Checkbox
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Order Number
    {
      accessorKey: 'orderNumber',
      header: 'No. Pesanan',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Link
            href={`/dashboard/orders/${order.id}`}
            className="font-mono font-medium text-primary hover:underline"
          >
            #{order.orderNumber}
          </Link>
        );
      },
    },

    // Customer
    {
      accessorKey: 'customer',
      header: 'Pelanggan',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>
            <p className="font-medium">{order.customer?.name || order.customerName || 'Guest'}</p>
            <p className="text-xs text-muted-foreground">
              {order.customer?.phone || order.customerPhone || '-'}
            </p>
          </div>
        );
      },
    },

    // Items Count
    {
      id: 'items',
      header: 'Item',
      cell: ({ row }) => {
        const order = row.original;
        // Use _count if available from API
        const count = (order as unknown as { _count?: { items: number } })._count?.items;
        return (
          <span className="text-muted-foreground">
            {count !== undefined ? count : '-'}
          </span>
        );
      },
    },

    // Total
    {
      accessorKey: 'total',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.getValue('total') as number;
        return <span className="font-semibold">{formatPrice(total)}</span>;
      },
    },

    // Order Status
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderListItem['status'];
        return <OrderStatusBadge status={status} />;
      },
      filterFn: (row, id, value) => {
        return value === 'all' || row.getValue(id) === value;
      },
    },

    // Payment Status
    {
      accessorKey: 'paymentStatus',
      header: 'Pembayaran',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as OrderListItem['paymentStatus'];
        return <PaymentStatusBadge status={status} />;
      },
      filterFn: (row, id, value) => {
        return value === 'all' || row.getValue(id) === value;
      },
    },

    // Created At
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <span className="text-sm text-muted-foreground">
            {formatDateTime(date)}
          </span>
        );
      },
    },

    // Actions
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        const canCancel = order.status !== 'CANCELLED' && order.status !== 'COMPLETED';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>

              {/* View Detail */}
              <DropdownMenuItem onClick={() => actions.onView(order)}>
                <Eye className="h-4 w-4 mr-2" />
                Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Cancel - hanya jika belum cancelled/completed */}
              {canCancel && (
                <DropdownMenuItem
                  onClick={() => actions.onCancel(order)}
                  className="text-orange-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Batalkan Pesanan
                </DropdownMenuItem>
              )}

              {/* ✅ Delete - selalu tampil */}
              <DropdownMenuItem
                onClick={() => actions.onDelete(order)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Pesanan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}