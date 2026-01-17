'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatPhone, formatDateShort, getInitials } from '@/lib/format';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMERS TABLE COLUMNS - MINIMAL VIEW
// Optimized for performance with drawer preview
// Columns: Checkbox | Pelanggan (Name + Phone) | Terdaftar
// ==========================================

interface ColumnActions {
  onRowClick: (customer: Customer) => void;
}

export function getCustomerColumns(actions: ColumnActions): ColumnDef<Customer>[] {
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

    // Pelanggan (Name + Phone) - Clickable untuk buka drawer
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Pelanggan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => actions.onRowClick(customer)}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPhone(customer.phone)}
              </p>
            </div>
          </div>
        );
      },
    },

    // Terdaftar
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Terdaftar
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