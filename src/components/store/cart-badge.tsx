'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartTotalItems, useCartHydrated } from '@/stores';

// ==========================================
// CART BADGE COMPONENT
// Shows cart icon with item count
// ==========================================

export function CartBadge() {
  const totalItems = useCartTotalItems();
  const isHydrated = useCartHydrated();

  return (
    <>
      <ShoppingCart className="h-5 w-5" />
      {isHydrated && totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
      <span className="sr-only">Keranjang</span>
    </>
  );
}