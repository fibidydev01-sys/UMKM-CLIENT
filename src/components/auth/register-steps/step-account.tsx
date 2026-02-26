'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface StepAccountProps {
  email: string;
  password: string;
  whatsapp: string;
  onUpdate: (data: { email?: string; password?: string; whatsapp?: string }) => void;
}

// ==========================================
// COMPONENT — no header, no nav (handled by parent)
// ==========================================

export function StepAccount({ email, password, whatsapp, onUpdate }: StepAccountProps) {
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState(password);
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsapp);
  const [showPassword, setShowPassword] = useState(false);

  const handleWhatsappChange = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
    if (cleaned.startsWith('62')) cleaned = cleaned.slice(2);
    const formatted = '62' + cleaned;
    setLocalWhatsapp(formatted);
    onUpdate({ whatsapp: formatted });
  };

  return (
    <div className="space-y-5 max-w-md">

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="acc-email" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          Email address
        </Label>
        <Input
          id="acc-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={localEmail}
          onChange={(e) => { setLocalEmail(e.target.value); onUpdate({ email: e.target.value }); }}
          className="h-11 text-sm placeholder:text-muted-foreground/50"
        />
        <p className="text-xs text-muted-foreground">Used to log in to your store dashboard</p>
      </div>

      <div className="border-t" />

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="acc-password" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="acc-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={localPassword}
            onChange={(e) => { setLocalPassword(e.target.value); onUpdate({ password: e.target.value }); }}
            className="h-11 text-sm placeholder:text-muted-foreground/50"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword
              ? <EyeOff className="h-4 w-4 text-muted-foreground" />
              : <Eye className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
      </div>

      <div className="border-t" />

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <Label htmlFor="acc-whatsapp" className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          WhatsApp number
        </Label>
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground h-11">
            +62
          </span>
          <Input
            id="acc-whatsapp"
            type="tel"
            placeholder="81234567890"
            className="rounded-l-none h-11 text-sm placeholder:text-muted-foreground/50"
            value={localWhatsapp.replace(/^62/, '')}
            onChange={(e) => handleWhatsappChange(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Used to receive order notifications via WhatsApp
        </p>
      </div>
    </div>
  );
}