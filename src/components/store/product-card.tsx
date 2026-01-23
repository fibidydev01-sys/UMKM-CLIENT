'use client';

import { useState, useMemo, useCallback } from 'react';
// ❌ REMOVE: import Image from 'next/image';
// ❌ REMOVE: import { CldImage } from 'next-cloudinary';
import { OptimizedImage } from '@/components/ui/optimized-image'; // ✅ ADD
import Link from 'next/link';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useItemQty } from '@/stores';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { productUrl } from '@/lib/store-url';
// ❌ REMOVE: import { getThumbnailUrl } from '@/lib/cloudinary';
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

  // ✅ SIMPLIFIED: Just use the first image URL directly
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
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={url}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* ✅ OPTIMIZED: Auto-detects Cloudinary vs External */}
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
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
              </div>
            }
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="text-xs bg-primary">Unggulan</Badge>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary" className="text-sm">
                Stok Habis
              </Badge>
            </div>
          )}

          {/* Quick Add Button */}
          {showAddToCart && !isOutOfStock && (
            <div className="hidden md:block absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-full shadow-lg',
                  isAdding && 'bg-green-500 hover:bg-green-500'
                )}
                onClick={handleAddToCart}
              >
                {isAdding ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Content - unchanged */}
        <CardContent className="p-3">
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1 truncate">
              {product.category}
            </p>
          )}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>
          {product.unit && (
            <p className="text-xs text-muted-foreground mt-1">per {product.unit}</p>
          )}
          {itemQty > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
              <ShoppingCart className="h-3 w-3" />
              <span>{itemQty} di keranjang</span>
            </div>
          )}
        </CardContent>
      </Link>

      {/* Mobile Add to Cart - unchanged */}
      {showAddToCart && !isOutOfStock && (
        <div className="px-3 pb-3 md:hidden">
          <Button size="sm" variant="outline" className="w-full" onClick={handleAddToCart}>
            {isAdding ? (
              <><Check className="h-4 w-4 mr-2" />Ditambahkan</>
            ) : (
              <><Plus className="h-4 w-4 mr-2" />Tambah</>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}