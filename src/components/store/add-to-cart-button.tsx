'use client';

import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore, useItemQty } from '@/stores';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'icon' | 'full';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function AddToCartButton({
  product,
  variant = 'default',
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const [showAdded, setShowAdded] = useState(false);

  // Get actions directly from store (stable references)
  const addItem = useCartStore((state) => state.addItem);
  const incrementQty = useCartStore((state) => state.incrementQty);
  const decrementQty = useCartStore((state) => state.decrementQty);

  // Get qty with memoized selector
  const qty = useItemQty(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      unit: product.unit || undefined,
      maxStock: product.trackStock ? (product.stock ?? undefined) : undefined,
    });

    // Show feedback
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  };

  const handleIncrement = () => {
    incrementQty(product.id);
  };

  const handleDecrement = () => {
    decrementQty(product.id);
  };

  // Check stock
  const isOutOfStock = product.trackStock && (product.stock ?? 0) <= 0;
  const isMaxStock = product.trackStock && (product.stock ?? 0) > 0 && qty >= (product.stock ?? 0);

  // Icon only variant
  if (variant === 'icon') {
    return (
      <Button
        size="icon"
        variant={qty > 0 ? 'default' : 'outline'}
        onClick={qty > 0 ? handleIncrement : handleAdd}
        disabled={isOutOfStock || isMaxStock}
        className={cn('relative', className)}
      >
        {showAdded ? (
          <Check className="h-4 w-4" />
        ) : qty > 0 ? (
          <>
            <Plus className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
              {qty}
            </span>
          </>
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Full variant with quantity controls
  if (variant === 'full' && qty > 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          size="icon"
          variant="outline"
          onClick={handleDecrement}
          className="h-9 w-9"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-medium">{qty}</span>
        <Button
          size="icon"
          variant="outline"
          onClick={handleIncrement}
          disabled={isMaxStock}
          className="h-9 w-9"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <Button
      size={size}
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={cn('gap-2', className)}
    >
      {showAdded ? (
        <>
          <Check className="h-4 w-4" />
          Ditambahkan Keranjang
        </>
      ) : isOutOfStock ? (
        'Stok Habis'
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {qty > 0 ? `Tambah (${qty})` : 'Tambah'}
        </>
      )}
    </Button>
  );
}