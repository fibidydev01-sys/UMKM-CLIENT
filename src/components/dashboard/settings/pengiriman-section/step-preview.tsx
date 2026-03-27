'use client';

import { PreviewModal } from '@/components/dashboard/settings';
import type { PengirimanFormData } from '@/types';

// ─── Props ─────────────────────────────────────────────────────────────────
interface PreviewPengirimanProps {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  formData: PengirimanFormData;
}

// ─── Component ─────────────────────────────────────────────────────────────
export function PreviewPengiriman({
  open,
  onClose,
  onSave,
  isSaving,
  formData,
}: PreviewPengirimanProps) {
  const activeCouriers = formData.shippingMethods.couriers.filter((c) => c.enabled);

  return (
    <PreviewModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
      title="Shipping Settings Preview"
    >
      <div className="space-y-5 mt-4">

        {/* ── Active Carriers ── */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground">
            Active Carriers ({activeCouriers.length})
          </p>
          <div className="rounded-lg border p-4 bg-muted/20">
            {activeCouriers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No carriers enabled</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {activeCouriers.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    {c.note && (
                      <p className="text-[11px] text-muted-foreground truncate">{c.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </PreviewModal>
  );
}