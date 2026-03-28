// ==========================================
// PRODUCT INFO
// ==========================================

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/shared/format';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
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

  return (
    <div className="space-y-4">
      {/* Category */}
      {product.category && (
        <p className="text-sm text-muted-foreground">{product.category}</p>
      )}

      {/* Product name */}
      <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>

      {/* Price */}
      {!isCustomPrice && (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
              <Badge variant="destructive">-{discountPercent}%</Badge>
            </>
          )}
        </div>
      )}

      <Separator />
    </div>
  );
}