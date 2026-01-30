'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ShippingMethods } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface ShippingSettingsData {
  freeShippingThreshold: number | null;
  defaultShippingCost: number;
  shippingMethods: ShippingMethods;
}

interface ShippingSettingsProps {
  settings: ShippingSettingsData | null;
  isLoading: boolean;
  isSaving: boolean;
  onSettingsChange: (settings: ShippingSettingsData) => void;
  onSave: () => Promise<void>;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ShippingSettings({
  settings,
  isLoading,
  isSaving,
  onSettingsChange,
  onSave,
}: ShippingSettingsProps) {
  const handleFreeShippingChange = (value: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        freeShippingThreshold: value ? parseFloat(value) : null,
      });
    }
  };

  const handleDefaultCostChange = (value: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        defaultShippingCost: parseFloat(value) || 0,
      });
    }
  };

  const handleToggleCourier = (id: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        shippingMethods: {
          ...settings.shippingMethods,
          couriers: settings.shippingMethods.couriers.map((c) =>
            c.id === id ? { ...c, enabled: !c.enabled } : c
          ),
        },
      });
    }
  };

  const handleCourierNoteChange = (id: string, note: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        shippingMethods: {
          ...settings.shippingMethods,
          couriers: settings.shippingMethods.couriers.map((c) =>
            c.id === id ? { ...c, note } : c
          ),
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Shipping Cost Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ongkos Kirim</CardTitle>
          <CardDescription>Konfigurasi biaya pengiriman dan batas gratis ongkir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading || !settings ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="free-shipping">Batas Gratis Ongkir (Rp)</Label>
                <Input
                  id="free-shipping"
                  type="number"
                  min="0"
                  placeholder="100000"
                  value={settings.freeShippingThreshold || ''}
                  onChange={(e) => handleFreeShippingChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Pesanan di atas nilai ini akan gratis ongkir. Kosongkan jika tidak ada.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-shipping">Ongkos Kirim Default (Rp)</Label>
                <Input
                  id="default-shipping"
                  type="number"
                  min="0"
                  placeholder="15000"
                  value={settings.defaultShippingCost || ''}
                  onChange={(e) => handleDefaultCostChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ongkos kirim untuk pesanan di bawah batas gratis ongkir.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Couriers Card */}
      <Card>
        <CardHeader>
          <CardTitle>Kurir Pengiriman</CardTitle>
          <CardDescription>
            Pilih kurir yang tersedia untuk pengiriman. Kurir yang aktif akan ditampilkan saat
            checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !settings ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {settings.shippingMethods.couriers.map((courier) => (
                <div
                  key={courier.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    courier.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={courier.enabled}
                        onCheckedChange={() => handleToggleCourier(courier.id)}
                      />
                      <span className="font-medium">{courier.name}</span>
                    </div>
                    {courier.enabled && (
                      <Badge variant="secondary" className="text-xs">
                        Aktif
                      </Badge>
                    )}
                  </div>
                  {courier.enabled && (
                    <div className="ml-12">
                      <Input
                        placeholder="Catatan (opsional): REG, YES, OKE tersedia"
                        value={courier.note || ''}
                        onChange={(e) => handleCourierNoteChange(courier.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Pengiriman'}
        </Button>
      </div>
    </div>
  );
}
