'use client';

import { useState, useMemo, useCallback } from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Link from 'next/link';
import { ShoppingCart, Plus, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useItemQty } from '@/stores';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { productUrl } from '@/lib/store-url';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  storeSlug,
  showAddToCart = true,
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const itemQty = useItemQty(product.id);

  const { hasDiscount, discountPercent, isOutOfStock } = useMemo(() => {
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    return {
      hasDiscount,
      discountPercent: hasDiscount
        ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
        : 0,
      isOutOfStock: product.trackStock && (product.stock ?? 0) <= 0,
    };
  }, [product.comparePrice, product.price, product.trackStock, product.stock]);

  const imageUrl = product.images?.[0];
  const url = useMemo(() => productUrl(storeSlug, product.id), [storeSlug, product.id]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      unit: product.unit || undefined,
      maxStock: product.trackStock ? product.stock ?? undefined : undefined,
    });

    setTimeout(() => setIsAdding(false), 500);
  }, [isOutOfStock, addItem, product]);

  return (
    <div className="group overflow-hidden transition-shadow hover:shadow-md rounded-xl border border-border/50 bg-card">
      <Link href={url}>
        {/* Image — Card overflow-hidden handles the rounding */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <OptimizedImage
            src={imageUrl}
            alt={product.name}
            fill
            crop="fill"
            gravity="auto"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
            fallback={
              <div className="flex h-full items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
              </div>
            }
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                -{discountPercent}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="text-xs px-1.5 py-0 bg-primary">Unggulan</Badge>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary" className="text-sm">Stok Habis</Badge>
            </div>
          )}

          {/* Quick Add — desktop hover */}
          {showAddToCart && !isOutOfStock && (
            <div className="hidden md:block absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                className={cn(
                  'h-8 w-8 rounded-full shadow-lg',
                  isAdding && 'bg-green-500 hover:bg-green-500'
                )}
                onClick={handleAddToCart}
              >
                {isAdding ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}
        </div>

        {/* Footer — slim, no CardContent wrapper */}
        <div className="px-3 py-2.5">
          {product.category && (
            <p className="text-xs text-muted-foreground truncate leading-none mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="font-semibold text-sm text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>
          {product.unit && (
            <p className="text-xs text-muted-foreground leading-none mt-1">
              per {product.unit}
            </p>
          )}
          {itemQty > 0 && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-primary">
              <ShoppingCart className="h-3 w-3" />
              <span>{itemQty} di keranjang</span>
            </div>
          )}
        </div>
      </Link>

      {/* Mobile Add to Cart */}
      {showAddToCart && !isOutOfStock && (
        <div className="px-3 pb-2.5 md:hidden">
          <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={handleAddToCart}>
            {isAdding ? (
              <><Check className="h-3.5 w-3.5 mr-1.5" />Ditambahkan</>
            ) : (
              <><Plus className="h-3.5 w-3.5 mr-1.5" />Tambah</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}