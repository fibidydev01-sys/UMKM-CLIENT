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
import type { EWallet, EWalletProvider } from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const EWALLET_OPTIONS: EWalletProvider[] = [
  'GoPay',
  'OVO',
  'DANA',
  'ShopeePay',
  'LinkAja',
  'Other',
];

// ============================================================================
// TYPES
// ============================================================================

interface EwalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ewallet: EWallet | null;
  onSave: (ewallet: EWallet) => void;
}

interface EwalletFormProps {
  ewallet: EWallet | null;
  onSave: (ewallet: EWallet) => void;
  onCancel: () => void;
}

// ============================================================================
// FORM COMPONENT
// ============================================================================

function EwalletForm({ ewallet, onSave, onCancel }: EwalletFormProps) {
  const [formData, setFormData] = useState<EWallet>({
    id: ewallet?.id || '',
    provider: ewallet?.provider || 'GoPay',
    number: ewallet?.number || '',
    name: ewallet?.name || '',
    enabled: ewallet?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number) {
      toast.error('Please fill in the e-wallet number');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Provider</Label>
        <Select
          value={formData.provider}
          onValueChange={(value) =>
            setFormData({ ...formData, provider: value as EWalletProvider })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EWALLET_OPTIONS.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ewallet-number">Number / ID</Label>
        <Input
          id="ewallet-number"
          placeholder="08123456789"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ewallet-name">Account Name <span className="font-normal text-muted-foreground">(Optional)</span></Label>
        <Input
          id="ewallet-name"
          placeholder="Account holder name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

export function EwalletDialog({
  open,
  onOpenChange,
  ewallet,
  onSave,
}: EwalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ewallet ? 'Edit E-Wallet' : 'Add E-Wallet'}</DialogTitle>
          <DialogDescription>
            Enter your e-wallet details to accept digital payments.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <EwalletForm
            key={ewallet?.id ?? 'new'}
            ewallet={ewallet}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}