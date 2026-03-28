'use client';

import { WhatsAppOrderButton } from '../checkout/whatsapp-order-button';
import type { Product, PublicTenant } from '@/types';

interface ProductActionsProps {
  product: Product;
  tenant: PublicTenant;
}

export function ProductActions({ product, tenant }: ProductActionsProps) {
  return (
    <div className="space-y-4">
      <WhatsAppOrderButton
        product={product}
        tenant={tenant}
        className="w-full"
      />

      {/* Description */}
      {product.description && (
        <div className="space-y-1">
          <p className="text-sm font-semibold">Product description</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}