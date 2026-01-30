/**
 * ============================================================================
 * FILE: app/settings/pengiriman/page.tsx
 * ============================================================================
 * Route: /settings/pengiriman
 * Description: Shipping methods and costs settings
 * ============================================================================
 */
'use client';

import { useState, useEffect } from 'react';
import { ShippingSettings } from '@/components/settings';
import { toast } from 'sonner';
import { useTenant } from '@/hooks';
import { tenantsApi } from '@/lib/api';
import type { ShippingMethods, CourierName } from '@/types';

const COURIER_OPTIONS: CourierName[] = [
  'JNE',
  'J&T Express',
  'SiCepat',
  'AnterAja',
  'Ninja Express',
  'ID Express',
  'SAP Express',
  'Lion Parcel',
  'Pos Indonesia',
  'TIKI',
  'Other',
];

const DEFAULT_SHIPPING_METHODS: ShippingMethods = {
  couriers: COURIER_OPTIONS.slice(0, 5).map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    enabled: index < 2,
    note: '',
  })),
};

export default function PengirimanPage() {
  const { tenant, refresh } = useTenant();
  const [isSaving, setIsSaving] = useState(false);

  const [shippingSettings, setShippingSettings] = useState<{
    freeShippingThreshold: number | null;
    defaultShippingCost: number;
    shippingMethods: ShippingMethods;
  } | null>(null);

  // Initialize form data from tenant
  useEffect(() => {
    if (tenant && shippingSettings === null) {
      setShippingSettings({
        freeShippingThreshold: tenant.freeShippingThreshold ?? null,
        defaultShippingCost: tenant.defaultShippingCost || 0,
        shippingMethods: tenant.shippingMethods || DEFAULT_SHIPPING_METHODS,
      });
    }
  }, [tenant, shippingSettings]);

  const handleSave = async () => {
    if (!tenant || !shippingSettings) return;
    setIsSaving(true);
    try {
      await tenantsApi.update({
        freeShippingThreshold: shippingSettings.freeShippingThreshold,
        defaultShippingCost: shippingSettings.defaultShippingCost,
        shippingMethods: shippingSettings.shippingMethods,
      });
      await refresh();
      toast.success('Pengaturan pengiriman berhasil disimpan');
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      toast.error('Gagal menyimpan pengaturan pengiriman');
    } finally {
      setIsSaving(false);
    }
  };

  const tenantLoading = tenant === null;

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ongkos Kirim</h1>
        <p className="text-muted-foreground mt-2">
          Konfigurasi biaya pengiriman dan batas gratis ongkir.
        </p>
      </div>

      {/* Content */}
      <ShippingSettings
        settings={shippingSettings}
        isLoading={tenantLoading}
        isSaving={isSaving}
        onSettingsChange={setShippingSettings}
        onSave={handleSave}
      />
    </>
  );
}
