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
// FORM COMPONENT - Receives initial data via props, manages own state
// Key prop on this component will reset it when ewallet changes
// ============================================================================

function EwalletForm({ ewallet, onSave, onCancel }: EwalletFormProps) {
  // Initialize state from props - this only runs once when component mounts
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
      toast.error('Mohon lengkapi nomor e-wallet');
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
        <Label htmlFor="ewallet-number">Nomor / ID</Label>
        <Input
          id="ewallet-number"
          placeholder="08123456789"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ewallet-name">Nama Akun (Opsional)</Label>
        <Input
          id="ewallet-name"
          placeholder="Nama pemilik akun"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <DialogTitle>{ewallet ? 'Edit E-Wallet' : 'Tambah E-Wallet'}</DialogTitle>
          <DialogDescription>
            Masukkan detail e-wallet untuk menerima pembayaran digital.
          </DialogDescription>
        </DialogHeader>
        {/* 
          KEY PATTERN: 
          - Use stable key based on ewallet.id or 'new' for add mode
          - When open changes to true with different ewallet, form remounts with fresh state
          - Conditional render ensures form only exists when dialog is open
        */}
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