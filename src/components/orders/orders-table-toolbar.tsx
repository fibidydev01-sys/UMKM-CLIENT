'use client';

import { Table } from '@tanstack/react-table';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { OrderListItem } from '@/types';

// ==========================================
// ORDERS TABLE TOOLBAR - MINIMAL VIEW
// Simplified toolbar for minimal table view
// Status filters removed - use drawer for filtering by status
// ==========================================

interface OrdersTableToolbarProps {
  table: Table<OrderListItem>;
}

export function OrdersTableToolbar({ table }: OrdersTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari no. pesanan..."
          value={(table.getColumn('orderNumber')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('orderNumber')?.setFilterValue(event.target.value)
          }
          className="pl-8"
        />
      </div>

      {/* Status filters removed - use drawer for details */}

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