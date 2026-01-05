'use client';

import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from './add-to-cart-button';
import { WhatsAppOrderButton } from './whatsapp-order-button';
import { ProductShare } from './product-share';
import type { Product, PublicTenant } from '@/types';

// ==========================================
// PRODUCT ACTIONS COMPONENT
// Cart + WhatsApp + Share
// ==========================================

interface ProductActionsProps {
  product: Product;
  tenant: PublicTenant;
}

export function ProductActions({ product, tenant }: ProductActionsProps) {
  return (
    <div className="space-y-4">
      {/* Add to Cart */}
      <AddToCartButton product={product} />

      {/* WhatsApp Order */}
      <WhatsAppOrderButton
        product={product}
        tenant={tenant}
        className="w-full"
      />

      <Separator />

      {/* Share */}
      <ProductShare product={product} tenant={tenant} />
    </div>
  );
}