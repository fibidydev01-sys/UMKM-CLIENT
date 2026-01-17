'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateTime } from '@/lib/format';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE COLUMNS - MINIMAL VIEW
// Optimized for performance with drawer preview
// Columns: Checkbox | No. Pesanan | Pelanggan | Tanggal
// ==========================================

interface ColumnActions {
  onRowClick: (order: OrderListItem) => void;
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
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Order Number - Clickable untuk buka drawer
    {
      accessorKey: 'orderNumber',
      header: 'No. Pesanan',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div
            className="font-mono font-medium text-primary cursor-pointer hover:underline"
            onClick={() => actions.onRowClick(order)}
          >
            #{order.orderNumber}
          </div>
        );
      },
    },

    // Customer - Clickable untuk buka drawer
    {
      accessorKey: 'customer',
      header: 'Pelanggan',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => actions.onRowClick(order)}
          >
            <p className="font-medium">
              {order.customer?.name || order.customerName || 'Guest'}
            </p>
          </div>
        );
      },
    },

    // Created At - Clickable untuk buka drawer
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
          <span
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => actions.onRowClick(row.original)}
          >
            {formatDateTime(date)}
          </span>
        );
      },
    },
  ];
}