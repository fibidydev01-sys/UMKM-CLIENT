'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { BankAccount, BankName } from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const BANK_OPTIONS: BankName[] = [
  'BCA',
  'Mandiri',
  'BNI',
  'BRI',
  'BSI',
  'CIMB',
  'Permata',
  'Danamon',
  'Other',
];

// ============================================================================
// TYPES
// ============================================================================

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank: BankAccount | null;
  onSave: (bank: BankAccount) => void;
}

interface BankFormProps {
  bank: BankAccount | null;
  onSave: (bank: BankAccount) => void;
  onCancel: () => void;
}

// ============================================================================
// FORM COMPONENT - Receives initial data via props, manages own state
// Key prop on this component will reset it when bank changes
// ============================================================================

function BankForm({ bank, onSave, onCancel }: BankFormProps) {
  // Initialize state from props - this only runs once when component mounts
  const [formData, setFormData] = useState<BankAccount>({
    id: bank?.id || '',
    bank: bank?.bank || 'BCA',
    accountNumber: bank?.accountNumber || '',
    accountName: bank?.accountName || '',
    enabled: bank?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountNumber || !formData.accountName) {
      toast.error('Mohon lengkapi semua field');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Bank</Label>
        <Select
          value={formData.bank}
          onValueChange={(value) => setFormData({ ...formData, bank: value as BankName })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BANK_OPTIONS.map((bankName) => (
              <SelectItem key={bankName} value={bankName}>
                {bankName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-number">Nomor Rekening</Label>
        <Input
          id="account-number"
          placeholder="1234567890"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-name">Nama Pemilik Rekening</Label>
        <Input
          id="account-name"
          placeholder="Nama sesuai rekening"
          value={formData.accountName}
          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">Simpan</Button>
      </DialogFooter>
    </form>
  );
}

// ============================================================================
// MAIN DIALOG COMPONENT
// ============================================================================

export function BankAccountDialog({
  open,
  onOpenChange,
  bank,
  onSave,
}: BankAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bank ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}</DialogTitle>
          <DialogDescription>
            Masukkan detail rekening bank untuk menerima pembayaran transfer.
          </DialogDescription>
        </DialogHeader>
        {/* 
          KEY PATTERN: 
          - Use stable key based on bank.id or 'new' for add mode
          - When open changes to true with different bank, form remounts with fresh state
          - Conditional render ensures form only exists when dialog is open
        */}
        {open && (
          <BankForm
            key={bank?.id ?? 'new'}
            bank={bank}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}