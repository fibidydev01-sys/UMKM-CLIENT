'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Package, DollarSign, Link as LinkIcon, Info, ShieldCheck } from 'lucide-react';
import type { TriggerType } from '@/types/chat';

// ==========================================
// MESSAGE EDITOR COMPONENT
// ==========================================

interface MessageEditorProps {
  value: string;
  onChange: (value: string) => void;
  triggerType: TriggerType;
  error?: string;
  placeholder?: string;
}

interface Variable {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
  availableFor: TriggerType[];
}

const VARIABLES: Variable[] = [
  {
    key: '{{name}}',
    label: 'Nama',
    icon: User,
    description: 'Nama customer',
    availableFor: ['WELCOME', 'KEYWORD', 'TIME_BASED', 'ORDER_STATUS', 'PAYMENT_STATUS'],
  },
  {
    key: '{{phone}}',
    label: 'HP',
    icon: Phone,
    description: 'Nomor HP customer',
    availableFor: ['WELCOME', 'KEYWORD', 'TIME_BASED', 'ORDER_STATUS', 'PAYMENT_STATUS'],
  },
  {
    key: '{{order_number}}',
    label: 'Nomor Order',
    icon: Package,
    description: 'Nomor order (ORD-xxx)',
    availableFor: ['ORDER_STATUS', 'PAYMENT_STATUS'],
  },
  {
    key: '{{total}}',
    label: 'Total Harga',
    icon: DollarSign,
    description: 'Total harga (formatted)',
    availableFor: ['ORDER_STATUS', 'PAYMENT_STATUS'],
  },
  {
    key: '{{tracking_link}}',
    label: 'Link Tracking',
    icon: LinkIcon,
    description: 'Link tracking order (secure)',
    availableFor: ['ORDER_STATUS', 'PAYMENT_STATUS'],
  },
];

export function MessageEditor({ value, onChange, triggerType, error, placeholder }: MessageEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Get available variables for current trigger type
  const availableVariables = VARIABLES.filter((v) => v.availableFor.includes(triggerType));

  // Insert variable at cursor position
  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';

    // Insert variable at cursor position
    const newText = text.substring(0, start) + variable + text.substring(end);
    onChange(newText);

    // Set cursor after inserted variable
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + variable.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setIsFocused(true);
    }, 0);
  };

  return (
    <div className="space-y-3">
      {/* Variable Buttons */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Variabel yang tersedia:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableVariables.map((variable) => {
            const Icon = variable.icon;
            return (
              <Button
                key={variable.key}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable.key)}
                className="gap-2"
                title={variable.description}
              >
                <Icon className="h-3.5 w-3.5" />
                {variable.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Tulis pesan Anda di sini...\n\nGunakan button di atas untuk insert variabel.'}
          rows={8}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      {/* Info Alert for ORDER_STATUS & PAYMENT_STATUS */}
      {(triggerType === 'ORDER_STATUS' || triggerType === 'PAYMENT_STATUS') && (
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Link Tracking Aman</AlertTitle>
          <AlertDescription className="text-sm">
            Link tracking menggunakan UUID untuk keamanan. Customer hanya bisa akses order mereka sendiri
            dan tidak dapat menebak order lain.
          </AlertDescription>
        </Alert>
      )}

      {/* Example Preview */}
      {value && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Preview:</p>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
            <p className="text-sm whitespace-pre-wrap break-words">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
