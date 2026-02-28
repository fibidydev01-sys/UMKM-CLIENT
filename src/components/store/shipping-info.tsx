'use client';

// ==========================================
// SHIPPING INFO
// ==========================================

import { Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import type { PublicTenant } from '@/types';

interface ShippingInfoProps {
  tenant: PublicTenant;
}

export function ShippingInfo({ tenant }: ShippingInfoProps) {
  const { freeShippingThreshold, defaultShippingCost } = tenant;

  // Currency dari tenant
  const currency = tenant?.currency || 'IDR';
  const fmt = (value: number) => formatPrice(value, currency);

  // Jika tidak ada konfigurasi pengiriman, sembunyikan komponen
  if (!freeShippingThreshold && !defaultShippingCost) {
    return null;
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-medium text-sm">Shipping</h4>

            {freeShippingThreshold && freeShippingThreshold > 0 ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Free shipping</span>{' '}
                on orders over {fmt(freeShippingThreshold)}
              </p>
            ) : null}

            {defaultShippingCost && defaultShippingCost > 0 ? (
              <p className="text-sm text-muted-foreground">
                Flat shipping rate: {fmt(defaultShippingCost)}
              </p>
            ) : null}

            {(!freeShippingThreshold || freeShippingThreshold === 0) &&
              (!defaultShippingCost || defaultShippingCost === 0) ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Free shipping</span>{' '}
                on all orders
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}