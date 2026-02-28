// ==========================================
// PRODUCT INFO
// ==========================================

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  currency: string; // Dari tenant.currency
}

export function ProductInfo({ product, currency }: ProductInfoProps) {
  const isCustomPrice = product.price === 0;
  const hasDiscount =
    !isCustomPrice &&
    product.comparePrice &&
    product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
      ((product.comparePrice! - product.price) / product.comparePrice!) * 100
    )
    : 0;
  const isOutOfStock = product.trackStock && (product.stock ?? 0) <= 0;

  return (
    <div className="space-y-4">
      {/* Category */}
      {product.category && (
        <p className="text-sm text-muted-foreground">{product.category}</p>
      )}

      {/* Product name */}
      <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isFeatured && (
          <Badge className="bg-primary">⭐ Featured</Badge>
        )}
        {isOutOfStock && (
          <Badge variant="destructive">Out of stock</Badge>
        )}
        {product.trackStock &&
          !isOutOfStock &&
          (product.stock ?? 0) <= (product.minStock ?? 5) &&
          (product.stock ?? 0) > 0 && (
            <Badge variant="secondary">Limited stock</Badge>
          )}
      </div>

      {/* Price */}
      {!isCustomPrice && (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price, currency)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice!, currency)}
                </span>
                <Badge variant="destructive">-{discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Unit */}
          {product.unit && (
            <p className="text-sm text-muted-foreground">
              Price per {product.unit}
            </p>
          )}
        </>
      )}

      <Separator />

      {/* Stock info */}
      {product.trackStock && product.stock !== null && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Stock:</span>
          <span className={isOutOfStock ? 'text-destructive' : 'font-medium'}>
            {product.stock} {product.unit || 'pcs'}
          </span>
        </div>
      )}

      {/* SKU */}
      {product.sku && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">SKU:</span>
          <span className="font-mono">{product.sku}</span>
        </div>
      )}
    </div>
  );
}