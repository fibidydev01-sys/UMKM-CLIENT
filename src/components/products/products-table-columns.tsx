// ══════════════════════════════════════════════════════════════
// PRODUCTS TABLE COLUMNS - V2.0 MINIMAL VIEW
// Shows only essential info: Name + SKU + Date
// Click to open drawer for full details
// ══════════════════════════════════════════════════════════════

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateShort } from '@/lib/format';
import type { Product } from '@/types';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface ColumnActions {
  onRowClick: (product: Product) => void;
}

// ══════════════════════════════════════════════════════════════
// MINIMAL COLUMNS (Name + SKU + Date only)
// ══════════════════════════════════════════════════════════════

export function getProductColumns(actions: ColumnActions): ColumnDef<Product>[] {
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
          onClick={(e) => e.stopPropagation()} // Prevent row click
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Name + SKU (Combined)
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Produk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div
            className="min-w-0 cursor-pointer hover:text-primary transition-colors"
            onClick={() => actions.onRowClick(product)}
          >
            <p className="font-medium truncate">{product.name}</p>
            {product.sku && (
              <p className="text-xs text-muted-foreground font-mono">
                SKU: {product.sku}
              </p>
            )}
          </div>
        );
      },
    },

    // Created Date
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
            className="text-muted-foreground cursor-pointer"
            onClick={() => actions.onRowClick(row.original)}
          >
            {formatDateShort(date)}
          </span>
        );
      },
    },
  ];
}
