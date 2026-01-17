'use client';

import { Table } from '@tanstack/react-table';
import { X, Search, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

// ==========================================
// PRODUCTS TABLE TOOLBAR
// ==========================================

interface ProductsTableToolbarProps {
  table: Table<Product>;
  categories?: string[];
  onBulkDelete?: () => void;
  onRefresh?: () => void; // 🔥 NEW: Manual refresh button
  isBulkDeleting?: boolean;
  isRefreshing?: boolean; // 🔥 NEW: Loading state for refresh
}

export function ProductsTableToolbar({
  table,
  onBulkDelete,
  onRefresh,
  isBulkDeleting = false,
  isRefreshing = false,
}: ProductsTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>

        {/* Category & Status filters removed - use drawer for details */}

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

        {/* 🔥 NEW: Manual Refresh Button */}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedCount} dipilih
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
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
    </div>
  );
}