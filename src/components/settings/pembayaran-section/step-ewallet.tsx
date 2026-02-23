'use client';

import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { EWallet, PembayaranFormData } from '@/types';

interface StepEwalletProps {
  formData: PembayaranFormData;
  onAdd: () => void;
  onEdit: (ewallet: EWallet) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function StepEwallet({ formData, onAdd, onEdit, onDelete, onToggle }: StepEwalletProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button size="sm" onClick={onAdd}>+ Tambah E-Wallet</Button>

      {formData.paymentMethods.eWallets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground w-full max-w-sm border-2 border-dashed rounded-lg">
          <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada e-wallet</p>
          <p className="text-xs mt-1">Tambahkan e-wallet untuk menerima pembayaran digital</p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.paymentMethods.eWallets.map((ewallet) => (
            <div
              key={ewallet.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                ewallet.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                <Switch checked={ewallet.enabled} onCheckedChange={() => onToggle(ewallet.id)} />
                <div>
                  <p className="text-sm font-medium">{ewallet.provider}</p>
                  <p className="text-xs text-muted-foreground">
                    {ewallet.number}{ewallet.name && ` · ${ewallet.name}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(ewallet)}>Edit</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(ewallet.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}