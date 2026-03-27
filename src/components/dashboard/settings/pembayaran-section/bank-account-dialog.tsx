'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/command';
import { cn } from '@/lib/shared/utils';
import type { BankAccount, BankName } from '@/types';

const BANK_LIST: { value: BankName; label: string }[] = [
  { value: 'BCA', label: 'BCA' },
  { value: 'Mandiri', label: 'Mandiri' },
  { value: 'BRI', label: 'BRI' },
  { value: 'BNI', label: 'BNI' },
  { value: 'BSI', label: 'BSI' },
  { value: 'BTN', label: 'BTN' },
  { value: 'CIMB Niaga', label: 'CIMB Niaga' },
  { value: 'Permata', label: 'Permata' },
  { value: 'Danamon', label: 'Danamon' },
  { value: 'Maybank ID', label: 'Maybank ID' },
  { value: 'Panin', label: 'Panin' },
  { value: 'Jenius', label: 'Jenius (BTPN)' },
  { value: 'SeaBank', label: 'SeaBank' },
  { value: 'Blu by BCA', label: 'Blu by BCA' },
  { value: 'Bank Jago', label: 'Bank Jago' },
  { value: 'Allo Bank', label: 'Allo Bank' },
  { value: 'OCBC Indonesia', label: 'OCBC Indonesia' },
];

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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search bank..." />
          <CommandList className="max-h-64">
            <CommandEmpty>No bank found.</CommandEmpty>
            <CommandGroup heading="Indonesia">
              {BANK_LIST.map((b) => (
                <CommandItem
                  key={b.value}
                  value={`${b.value} ${b.label}`}
                  onSelect={() => { onValueChange(b.value); setOpen(false); }}
                  className="gap-2"
                >
                  <Check className={cn('h-4 w-4 shrink-0', value === b.value ? 'opacity-100' : 'opacity-0')} />
                  <span>{b.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface BankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank: BankAccount | null;
  onSave: (bank: BankAccount) => void;
}

function BankForm({
  bank,
  onSave,
  onCancel,
}: {
  bank: BankAccount | null;
  onSave: (bank: BankAccount) => void;
  onCancel: () => void;
}) {
  const [selectedBank, setSelectedBank] = useState<BankName>(bank?.bank || 'BCA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: bank?.id || '',
      bank: selectedBank,
      accountNumber: bank?.accountNumber || '',
      accountName: bank?.accountName || '',
      enabled: bank?.enabled ?? true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Bank</Label>
        <BankCombobox value={selectedBank} onValueChange={setSelectedBank} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}

export function BankAccountDialog({ open, onOpenChange, bank, onSave }: BankAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bank ? 'Edit Bank Account' : 'Add Bank Account'}</DialogTitle>
          <DialogDescription>Select a bank to receive transfer payments.</DialogDescription>
        </DialogHeader>
        {open && (
          <BankForm key={bank?.id ?? 'new'} bank={bank} onSave={onSave} onCancel={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}