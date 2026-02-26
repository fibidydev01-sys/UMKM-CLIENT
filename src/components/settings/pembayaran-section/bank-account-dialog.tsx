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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { BankAccount, BankName } from '@/types';

// ============================================================================
// BANK MASTER LIST — By Region
// ============================================================================

const BANK_LIST: { value: BankName; label: string; group: string }[] = [
  // Indonesia
  { value: 'BCA', label: 'BCA', group: 'Indonesia' },
  { value: 'Mandiri', label: 'Mandiri', group: 'Indonesia' },
  { value: 'BRI', label: 'BRI', group: 'Indonesia' },
  { value: 'BNI', label: 'BNI', group: 'Indonesia' },
  { value: 'BSI', label: 'BSI', group: 'Indonesia' },
  { value: 'BTN', label: 'BTN', group: 'Indonesia' },
  { value: 'CIMB Niaga', label: 'CIMB Niaga', group: 'Indonesia' },
  { value: 'Permata', label: 'Permata', group: 'Indonesia' },
  { value: 'Danamon', label: 'Danamon', group: 'Indonesia' },
  { value: 'Maybank ID', label: 'Maybank ID', group: 'Indonesia' },
  { value: 'Panin', label: 'Panin', group: 'Indonesia' },
  { value: 'Jenius', label: 'Jenius (BTPN)', group: 'Indonesia' },
  { value: 'SeaBank', label: 'SeaBank', group: 'Indonesia' },
  { value: 'Blu by BCA', label: 'Blu by BCA', group: 'Indonesia' },
  { value: 'Bank Jago', label: 'Bank Jago', group: 'Indonesia' },
  { value: 'Allo Bank', label: 'Allo Bank', group: 'Indonesia' },
  // ✅ FIX: OCBC NISP rebrand → OCBC Indonesia (efektif Nov 2023)
  { value: 'OCBC Indonesia', label: 'OCBC Indonesia', group: 'Indonesia' },
  // Malaysia
  { value: 'Maybank', label: 'Maybank', group: 'Malaysia' },
  { value: 'CIMB Malaysia', label: 'CIMB', group: 'Malaysia' },
  { value: 'Public Bank', label: 'Public Bank', group: 'Malaysia' },
  { value: 'RHB Bank', label: 'RHB Bank', group: 'Malaysia' },
  { value: 'Hong Leong Bank', label: 'Hong Leong Bank', group: 'Malaysia' },
  { value: 'AmBank', label: 'AmBank', group: 'Malaysia' },
  { value: 'UOB Malaysia', label: 'UOB Malaysia', group: 'Malaysia' },
  { value: 'OCBC Malaysia', label: 'OCBC Malaysia', group: 'Malaysia' },
  { value: 'HSBC Malaysia', label: 'HSBC Malaysia', group: 'Malaysia' },
  { value: 'Affin Bank', label: 'Affin Bank', group: 'Malaysia' },
  // Singapore
  { value: 'DBS', label: 'DBS', group: 'Singapore' },
  { value: 'OCBC', label: 'OCBC', group: 'Singapore' },
  { value: 'UOB', label: 'UOB', group: 'Singapore' },
  { value: 'Standard Chartered SG', label: 'Standard Chartered', group: 'Singapore' },
  { value: 'HSBC SG', label: 'HSBC SG', group: 'Singapore' },
  { value: 'Citibank SG', label: 'Citibank SG', group: 'Singapore' },
  // Thailand
  { value: 'Bangkok Bank', label: 'Bangkok Bank', group: 'Thailand' },
  { value: 'Kasikornbank', label: 'KBank (Kasikorn)', group: 'Thailand' },
  { value: 'SCB Thailand', label: 'SCB', group: 'Thailand' },
  { value: 'Krung Thai Bank', label: 'Krungthai Bank', group: 'Thailand' },
  { value: 'Bank of Ayudhya', label: 'Bank of Ayudhya', group: 'Thailand' },
  { value: 'TMBThanachart', label: 'TTB (TMBThanachart)', group: 'Thailand' },
  // Philippines
  { value: 'BDO Unibank', label: 'BDO Unibank', group: 'Philippines' },
  { value: 'BPI', label: 'BPI', group: 'Philippines' },
  { value: 'Metrobank', label: 'Metrobank', group: 'Philippines' },
  { value: 'PNB', label: 'PNB', group: 'Philippines' },
  { value: 'UnionBank PH', label: 'UnionBank', group: 'Philippines' },
  { value: 'Security Bank', label: 'Security Bank', group: 'Philippines' },
  // Vietnam
  { value: 'Vietcombank', label: 'Vietcombank', group: 'Vietnam' },
  { value: 'VietinBank', label: 'VietinBank', group: 'Vietnam' },
  { value: 'BIDV', label: 'BIDV', group: 'Vietnam' },
  { value: 'Techcombank', label: 'Techcombank', group: 'Vietnam' },
  { value: 'MB Bank', label: 'MB Bank', group: 'Vietnam' },
  { value: 'ACB Vietnam', label: 'ACB', group: 'Vietnam' },
  // Regional / Global
  { value: 'HSBC', label: 'HSBC', group: 'Regional / Global' },
  { value: 'Citibank', label: 'Citibank', group: 'Regional / Global' },
  { value: 'Standard Chartered', label: 'Standard Chartered', group: 'Regional / Global' },
  // Other
  { value: 'Other', label: 'Other', group: 'Other' },
];

const BANK_GROUPS = [
  'Indonesia',
  'Malaysia',
  'Singapore',
  'Thailand',
  'Philippines',
  'Vietnam',
  'Regional / Global',
  'Other',
] as const;

// ============================================================================
// BANK COMBOBOX
// ============================================================================

function BankCombobox({
  value,
  onValueChange,
}: {
  value: BankName;
  onValueChange: (v: BankName) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = BANK_LIST.find((b) => b.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-10 px-3"
        >
          <span className={cn('truncate', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : 'Select bank...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search bank..." />
          <CommandList className="max-h-64">
            <CommandEmpty>No bank found.</CommandEmpty>
            {BANK_GROUPS.map((group, gi) => {
              const items = BANK_LIST.filter((b) => b.group === group);
              if (items.length === 0) return null;
              return (
                <span key={group}>
                  <CommandGroup heading={group}>
                    {items.map((b) => (
                      <CommandItem
                        key={b.value}
                        value={`${b.value} ${b.label}`}
                        onSelect={() => {
                          onValueChange(b.value);
                          setOpen(false);
                        }}
                        className="gap-2"
                      >
                        <Check
                          className={cn(
                            'h-4 w-4 shrink-0',
                            value === b.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{b.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {gi < BANK_GROUPS.length - 1 && <CommandSeparator />}
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
// FORM
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
    if (!formData.accountNumber.trim() || !formData.accountName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Bank */}
      <div className="space-y-2">
        <Label>Bank</Label>
        <BankCombobox
          value={formData.bank}
          onValueChange={(v) => setFormData({ ...formData, bank: v })}
        />
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <Label htmlFor="account-number">Account Number</Label>
        <Input
          id="account-number"
          placeholder="1234567890"
          value={formData.accountNumber}
          onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        />
      </div>

      {/* Account Name */}
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
// DIALOG
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
          <DialogTitle>
            {bank ? 'Edit Bank Account' : 'Add Bank Account'}
          </DialogTitle>
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