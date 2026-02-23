'use client';

import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { BankAccount, PembayaranFormData } from '@/types';

interface StepBankProps {
  formData: PembayaranFormData;
  onAdd: () => void;
  onEdit: (bank: BankAccount) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function StepBank({ formData, onAdd, onEdit, onDelete, onToggle }: StepBankProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button size="sm" onClick={onAdd}>+ Tambah Bank</Button>

      {formData.paymentMethods.bankAccounts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground w-full max-w-sm border-2 border-dashed rounded-lg">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada rekening bank</p>
          <p className="text-xs mt-1">Tambahkan rekening untuk menerima pembayaran transfer</p>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          {formData.paymentMethods.bankAccounts.map((bank) => (
            <div
              key={bank.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                bank.enabled ? 'bg-background' : 'bg-muted/50 opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                <Switch checked={bank.enabled} onCheckedChange={() => onToggle(bank.id)} />
                <div>
                  <p className="text-sm font-medium">{bank.bank}</p>
                  <p className="text-xs text-muted-foreground">
                    {bank.accountNumber} · {bank.accountName}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(bank)}>Edit</Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(bank.id)}
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