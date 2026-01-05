'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatPhone, formatPrice, formatDateShort, getInitials } from '@/lib/format';
import type { Customer } from '@/types';

// ==========================================
// CUSTOMERS TABLE COLUMNS
// ==========================================

interface ColumnActions {
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onWhatsApp: (customer: Customer) => void;
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
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Name
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
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{customer.name}</p>
              {customer.email && (
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              )}
            </div>
          </div>
        );
      },
    },

    // Phone
    {
      accessorKey: 'phone',
      header: 'Telepon',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string;
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{formatPhone(phone)}</span>
          </div>
        );
      },
    },

    // Address
    {
      accessorKey: 'address',
      header: 'Alamat',
      cell: ({ row }) => {
        const address = row.getValue('address') as string | null;
        return address ? (
          <span className="max-w-[200px] truncate block">{address}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },

    // Total Orders
    {
      accessorKey: 'totalOrders',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Pesanan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.getValue('totalOrders') as number;
        return <span>{total || 0}</span>;
      },
    },

    // Total Spent
    {
      accessorKey: 'totalSpent',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Belanja
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.getValue('totalSpent') as number;
        return <span className="font-medium">{formatPrice(total || 0)}</span>;
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
          Terdaftar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return <span className="text-muted-foreground">{formatDateShort(date)}</span>;
      },
    },

    // Actions
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <div className="flex items-center gap-1">
            {/* Quick WhatsApp */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => actions.onWhatsApp(customer)}
              title="Hubungi via WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
            </Button>

            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => actions.onView(customer)}>
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onEdit(customer)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => actions.onDelete(customer)}
                  className="text-destructive"
                >
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}