'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateShort } from '@/lib/format';
import type { Product } from '@/types';

interface ColumnActions {
  onRowClick: (product: Product) => void;
  currency: string;
}

export function getProductColumns(actions: ColumnActions): ColumnDef<Product>[] {
  return [
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

    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Product
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

    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
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