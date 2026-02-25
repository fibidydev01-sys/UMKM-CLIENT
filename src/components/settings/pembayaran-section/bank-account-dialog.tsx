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
// FORM COMPONENT
// ============================================================================

function BankForm({ bank, onSave, onCancel }: BankFormProps) {
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
      toast.error('Please fill in all required fields');
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
        <Label htmlFor="account-number">Account Number</Label>
        <Input
          id="account-number"
          placeholder="1234567890"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-name">Account Name</Label>
        <Input
          id="account-name"
          placeholder="Name as on account"
          value={formData.accountName}
          onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
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
          <DialogTitle>{bank ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
          <DialogDescription>
            Enter your bank account details to accept transfer payments.
          </DialogDescription>
        </DialogHeader>
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