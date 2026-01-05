'use client';

import { Table } from '@tanstack/react-table';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE TOOLBAR
// ==========================================

interface OrdersTableToolbarProps {
  table: Table<OrderListItem>;
}

const orderStatusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'processing', label: 'Diproses' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'delivered', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const paymentStatusOptions = [
  { value: 'all', label: 'Semua Pembayaran' },
  { value: 'unpaid', label: 'Belum Bayar' },
  { value: 'partial', label: 'Sebagian' },
  { value: 'paid', label: 'Lunas' },
  { value: 'refunded', label: 'Refund' },
];

export function OrdersTableToolbar({ table }: OrdersTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pesanan..."
          value={(table.getColumn('orderNumber')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('orderNumber')?.setFilterValue(event.target.value)
          }
          className="pl-8"
        />
      </div>

      {/* Order Status Filter */}
      <Select
        value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
        onValueChange={(value) =>
          table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {orderStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Status Filter */}
      <Select
        value={(table.getColumn('paymentStatus')?.getFilterValue() as string) ?? 'all'}
        onValueChange={(value) =>
          table.getColumn('paymentStatus')?.setFilterValue(value === 'all' ? '' : value)
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Pembayaran" />
        </SelectTrigger>
        <SelectContent>
          {paymentStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Filters */}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="px-2 lg:px-3"
        >
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}