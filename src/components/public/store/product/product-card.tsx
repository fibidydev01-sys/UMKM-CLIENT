'use client';

import { useMemo } from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/shared/format';
import { productUrl } from '@/lib/public/store-url';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  storeSlug: string;
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
  const { hasDiscount, discountPercent, isOutOfStock, isCustomPrice } = useMemo(() => {
    const isCustomPrice = product.price === 0;
    const hasDiscount =
      !isCustomPrice &&
      product.comparePrice &&
      product.comparePrice > product.price;
    return {
      isCustomPrice,
      hasDiscount,
      discountPercent: hasDiscount
        ? Math.round(
          ((product.comparePrice! - product.price) / product.comparePrice!) * 100
        )
        : 0,
      isOutOfStock: product.trackStock && (product.stock ?? 0) <= 0,
    };
  }, [product.comparePrice, product.price, product.trackStock, product.stock]);

  const imageUrl = product.images?.[0];
  const url = useMemo(() => productUrl(storeSlug, product.id), [storeSlug, product.id]);

  return (
    <div className="group overflow-hidden transition-shadow hover:shadow-md rounded-xl border border-border/50 bg-card h-full flex flex-col">
      <Link href={url} className="flex flex-col flex-1">

        {/* Image */}
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
                <Package className="h-10 w-10 text-muted-foreground/30" />
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
        </div>

        {/* Footer */}
        <div className="px-3 py-2.5 flex-1">
          {product.category && (
            <p className="text-xs text-muted-foreground truncate leading-none mb-1">
              {product.category}
            </p>
          )}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {!isCustomPrice && (
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
          )}
        </div>
      </Link>
    </div>
  );
}