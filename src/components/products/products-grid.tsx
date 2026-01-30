'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ProductGridCard, ProductGridCardSkeleton } from './product-grid-card';
import { ProductPreviewDrawer } from './product-preview-drawer';
import { ProductDeleteDialog } from './product-delete-dialog';
import { productsApi, getErrorMessage } from '@/lib/api';
import { toast } from '@/providers';
import type { Product } from '@/types';

// ============================================================================
// PRODUCTS GRID
// Grid view for products with preview drawer
// ============================================================================

interface ProductsGridProps {
  products: Product[];
  isRefreshing?: boolean;
  onRefresh?: () => Promise<void>;
}

export function ProductsGrid({ products, isRefreshing, onRefresh }: ProductsGridProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
    } else {
      router.refresh();
    }
  }, [onRefresh, router]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedProduct(null);
    }
  };

  // ════════════════════════════════════════════════════════════
  // DRAWER ACTIONS
  // ════════════════════════════════════════════════════════════
  const onEdit = useCallback((product: Product) => {
    router.push(`/dashboard/products/${product.id}/edit`);
  }, [router]);

  const onDelete = useCallback((product: Product) => {
    setDeleteProduct(product);
  }, []);

  const onToggleActive = useCallback(async (product: Product) => {
    try {
      await productsApi.update(product.id, { isActive: !product.isActive });
      toast.success(product.isActive ? 'Produk dinonaktifkan' : 'Produk diaktifkan');
      await refreshData();
    } catch (err) {
      toast.error('Gagal mengubah status', getErrorMessage(err));
    }
  }, [refreshData]);

  const handleDelete = useCallback(async () => {
    if (!deleteProduct) return;

    setIsDeleting(true);

    try {
      await productsApi.delete(deleteProduct.id);
      toast.success('Produk berhasil dihapus');
      setDeleteProduct(null);
      await refreshData();
    } catch (err) {
      toast.error('Gagal menghapus produk', getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }, [deleteProduct, refreshData]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada produk</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3',
        isRefreshing && 'opacity-50 pointer-events-none'
      )}>
        {products.map((product) => (
          <ProductGridCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      {/* Preview Drawer */}
      <ProductPreviewDrawer
        product={selectedProduct}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleActive={onToggleActive}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        product={deleteProduct}
        isOpen={!!deleteProduct}
        isLoading={isDeleting}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}

// ============================================================================
// SKELETON
// ============================================================================

export function ProductsGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductGridCardSkeleton key={i} />
      ))}
    </div>
  );
}
