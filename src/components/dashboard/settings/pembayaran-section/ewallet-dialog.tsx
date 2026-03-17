'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { cn } from '@/lib/shared/utils';
import { toast } from 'sonner';
import type { EWallet, EWalletProvider } from '@/types';

// ============================================================================
// E-WALLET MASTER LIST — By Region
// ============================================================================

const EWALLET_LIST: {
  value: EWalletProvider;
  label: string;
  flag: string;
  group: string;
}[] = [
    // Indonesia
    { value: 'GoPay', label: 'GoPay', flag: '🇮🇩', group: 'Indonesia' },
    { value: 'OVO', label: 'OVO', flag: '🇮🇩', group: 'Indonesia' },
    { value: 'DANA', label: 'DANA', flag: '🇮🇩', group: 'Indonesia' },
    { value: 'ShopeePay', label: 'ShopeePay', flag: '🇮🇩', group: 'Indonesia' },
    { value: 'LinkAja', label: 'LinkAja', flag: '🇮🇩', group: 'Indonesia' },
    { value: 'QRIS', label: 'QRIS', flag: '🇮🇩', group: 'Indonesia' },
    // Malaysia
    { value: 'Touch n Go', label: "Touch 'n Go", flag: '🇲🇾', group: 'Malaysia' },
    { value: 'GrabPay MY', label: 'GrabPay (MY)', flag: '🇲🇾', group: 'Malaysia' },
    { value: 'Boost', label: 'Boost', flag: '🇲🇾', group: 'Malaysia' },
    { value: 'MAE', label: 'MAE (Maybank)', flag: '🇲🇾', group: 'Malaysia' },
    { value: 'ShopeePay MY', label: 'ShopeePay (MY)', flag: '🇲🇾', group: 'Malaysia' },
    // Singapore
    { value: 'PayNow', label: 'PayNow', flag: '🇸🇬', group: 'Singapore' },
    { value: 'GrabPay SG', label: 'GrabPay (SG)', flag: '🇸🇬', group: 'Singapore' },
    { value: 'DBS PayLah', label: 'DBS PayLah!', flag: '🇸🇬', group: 'Singapore' },
    { value: 'NETS', label: 'NETS', flag: '🇸🇬', group: 'Singapore' },
    // Thailand
    { value: 'TrueMoney', label: 'TrueMoney', flag: '🇹🇭', group: 'Thailand' },
    { value: 'PromptPay', label: 'PromptPay', flag: '🇹🇭', group: 'Thailand' },
    { value: 'Rabbit LINE Pay', label: 'Rabbit LINE Pay', flag: '🇹🇭', group: 'Thailand' },
    { value: 'ShopeePay TH', label: 'ShopeePay (TH)', flag: '🇹🇭', group: 'Thailand' },
    // Philippines
    { value: 'GCash', label: 'GCash', flag: '🇵🇭', group: 'Philippines' },
    { value: 'Maya', label: 'Maya', flag: '🇵🇭', group: 'Philippines' },
    { value: 'GrabPay PH', label: 'GrabPay (PH)', flag: '🇵🇭', group: 'Philippines' },
    { value: 'ShopeePay PH', label: 'ShopeePay (PH)', flag: '🇵🇭', group: 'Philippines' },
    // Vietnam
    { value: 'MoMo', label: 'MoMo', flag: '🇻🇳', group: 'Vietnam' },
    { value: 'ZaloPay', label: 'ZaloPay', flag: '🇻🇳', group: 'Vietnam' },
    { value: 'VNPay', label: 'VNPay', flag: '🇻🇳', group: 'Vietnam' },
    { value: 'ShopeePay VN', label: 'ShopeePay (VN)', flag: '🇻🇳', group: 'Vietnam' },
    // Regional / Global
    { value: 'GrabPay', label: 'GrabPay', flag: '🌏', group: 'Regional / Global' },
    { value: 'Apple Pay', label: 'Apple Pay', flag: '🌏', group: 'Regional / Global' },
    { value: 'Google Pay', label: 'Google Pay', flag: '🌏', group: 'Regional / Global' },
    { value: 'PayPal', label: 'PayPal', flag: '🌏', group: 'Regional / Global' },
    { value: 'Alipay', label: 'Alipay', flag: '🌏', group: 'Regional / Global' },
    { value: 'WeChat Pay', label: 'WeChat Pay', flag: '🌏', group: 'Regional / Global' },
    // Other
    { value: 'Other', label: 'Other', flag: '—', group: 'Other' },
  ];

const EWALLET_GROUPS = [
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Regional / Global',
  'Other',
] as const;

// ─── Provider color accents (retained from original) ──────────────────────
export const PROVIDER_COLORS: Record<string, string> = {
  GoPay: 'text-emerald-600',
  OVO: 'text-purple-600',
  DANA: 'text-blue-600',
  ShopeePay: 'text-orange-600',
  'ShopeePay MY': 'text-orange-600',
  'ShopeePay TH': 'text-orange-600',
  'ShopeePay PH': 'text-orange-600',
  'ShopeePay VN': 'text-orange-600',
  LinkAja: 'text-red-600',
  GCash: 'text-blue-500',
  Maya: 'text-green-600',
  MoMo: 'text-pink-600',
  TrueMoney: 'text-yellow-600',
  'Touch n Go': 'text-blue-700',
  PayNow: 'text-red-500',
  'GrabPay': 'text-green-500',
  'GrabPay MY': 'text-green-500',
  'GrabPay SG': 'text-green-500',
  'GrabPay PH': 'text-green-500',
  'Apple Pay': 'text-foreground',
  'Google Pay': 'text-blue-500',
  PayPal: 'text-blue-700',
  Alipay: 'text-blue-600',
  'WeChat Pay': 'text-green-600',
  Other: 'text-muted-foreground',
};

// ============================================================================
// EWALLET COMBOBOX
// ============================================================================

function EWalletCombobox({
  value,
  onValueChange,
}: {
  value: EWalletProvider;
  onValueChange: (v: EWalletProvider) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = EWALLET_LIST.find((e) => e.value === value);
  const accentColor = selected ? (PROVIDER_COLORS[selected.value] ?? '') : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10 px-3"
        >
          {selected ? (
            <span className="flex items-center gap-2 min-w-0">
              <span>{selected.flag}</span>
              <span className={cn('font-semibold truncate', accentColor)}>
                {selected.label}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select e-wallet...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search e-wallet..." />
          <CommandList className="max-h-64">
            <CommandEmpty>No e-wallet found.</CommandEmpty>
            {EWALLET_GROUPS.map((group, gi) => {
              const items = EWALLET_LIST.filter((e) => e.group === group);
              if (items.length === 0) return null;
              return (
                <span key={group}>
                  <CommandGroup heading={group}>
                    {items.map((e) => (
                      <CommandItem
                        key={e.value}
                        value={`${e.value} ${e.label}`}
                        onSelect={() => {
                          onValueChange(e.value);
                          setOpen(false);
                        }}
                        className="gap-2"
                      >
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0',
                            value === e.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{e.flag}</span>
                        <span className={cn('font-medium', PROVIDER_COLORS[e.value] ?? '')}>
                          {e.label}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {gi < EWALLET_GROUPS.length - 1 && <CommandSeparator />}
                </span>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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
// FORM
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
    if (!formData.number.trim()) {
      toast.error('Please fill in the e-wallet number');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Provider */}
      <div className="space-y-2">
        <Label>Provider</Label>
        <EWalletCombobox
          value={formData.provider}
          onValueChange={(v) => setFormData({ ...formData, provider: v })}
        />
      </div>

      {/* Number / ID */}
      <div className="space-y-2">
        <Label htmlFor="ewallet-number">Number / ID</Label>
        <Input
          id="ewallet-number"
          placeholder="08123456789"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        />
      </div>

      {/* Account Name (optional) */}
      <div className="space-y-2">
        <Label htmlFor="ewallet-name">
          Account Name{' '}
          <span className="font-normal text-muted-foreground">(Optional)</span>
        </Label>
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
// DIALOG
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
          <DialogTitle>
            {ewallet ? 'Edit E-Wallet' : 'Add E-Wallet'}
          </DialogTitle>
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