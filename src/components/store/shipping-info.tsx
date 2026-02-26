'use client';

// ══════════════════════════════════════════════════════════════
// SHIPPING INFO - v2.3 (MULTI-CURRENCY FIX)
// ✅ FIX: formatPrice pakai tenant.currency, tidak hardcode IDR
// ✅ FIX: currency diambil dari tenant prop
// ══════════════════════════════════════════════════════════════

import { Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import type { PublicTenant } from '@/types';

interface ShippingInfoProps {
  tenant: PublicTenant;
}

export function ShippingInfo({ tenant }: ShippingInfoProps) {
  const { freeShippingThreshold, defaultShippingCost } = tenant;

  // ✅ FIX: currency dari tenant, fallback IDR
  const currency = tenant?.currency || 'IDR';

  // ✅ FIX: helper lokal
  const fmt = (value: number) => formatPrice(value, currency);

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

            {/* ✅ FIX: pakai fmt() */}
            {freeShippingThreshold && freeShippingThreshold > 0 ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Gratis ongkir</span>{' '}
                untuk pembelian min. {fmt(freeShippingThreshold)}
              </p>
            ) : null}

            {/* ✅ FIX: pakai fmt() */}
            {defaultShippingCost && defaultShippingCost > 0 ? (
              <p className="text-sm text-muted-foreground">
                Ongkos kirim flat: {fmt(defaultShippingCost)}
              </p>
            ) : null}

            {(!freeShippingThreshold || freeShippingThreshold === 0) &&
              (!defaultShippingCost || defaultShippingCost === 0) ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Gratis ongkir</span>{' '}
                untuk semua pesanan
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}