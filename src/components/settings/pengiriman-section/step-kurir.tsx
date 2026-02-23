'use client';

import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PengirimanFormData } from '@/types';

interface StepKurirProps {
  formData: PengirimanFormData;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
}

export function StepKurir({ formData, onToggle, onNoteChange }: StepKurirProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-sm space-y-3">
        {formData.shippingMethods.couriers.map((courier) => (
          <div
            key={courier.id}
            className={cn(
              'p-4 rounded-lg border',
              courier.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Switch checked={courier.enabled} onCheckedChange={() => onToggle(courier.id)} />
                <span className="text-sm font-medium">{courier.name}</span>
              </div>
              {courier.enabled && (
                <Badge variant="secondary" className="text-xs">Aktif</Badge>
              )}
            </div>
            {courier.enabled && (
              <div className="ml-10">
                <Input
                  placeholder="Catatan opsional: REG, YES, OKE tersedia"
                  value={courier.note || ''}
                  onChange={(e) => onNoteChange(courier.id, e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}