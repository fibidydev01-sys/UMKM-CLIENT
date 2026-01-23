'use client';

import { Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import type { PublicTenant } from '@/types';

interface ShippingInfoProps {
  tenant: PublicTenant;
}

export function ShippingInfo({ tenant }: ShippingInfoProps) {
  const { freeShippingThreshold, defaultShippingCost } = tenant;

  // If no shipping settings configured, don't show anything
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
            <h4 className="font-medium text-sm">Informasi Pengiriman</h4>
            {freeShippingThreshold && freeShippingThreshold > 0 ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Gratis ongkir</span> untuk
                pembelian min. {formatPrice(freeShippingThreshold)}
              </p>
            ) : null}
            {defaultShippingCost && defaultShippingCost > 0 ? (
              <p className="text-sm text-muted-foreground">
                Ongkos kirim flat: {formatPrice(defaultShippingCost)}
              </p>
            ) : null}
            {(!freeShippingThreshold || freeShippingThreshold === 0) &&
            (!defaultShippingCost || defaultShippingCost === 0) ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Gratis ongkir</span> untuk semua pesanan
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
