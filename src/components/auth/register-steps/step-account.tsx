'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface StepAccountProps {
  email: string;
  password: string;
  whatsapp: string;
  onUpdate: (data: { email?: string; password?: string; whatsapp?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepAccount({
  email,
  password,
  whatsapp,
  onUpdate,
  onNext,
  onBack,
}: StepAccountProps) {
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState(password);
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsapp);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', whatsapp: '' });

  const handleEmailChange = (value: string) => {
    setLocalEmail(value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (value: string) => {
    setLocalPassword(value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleWhatsappChange = (value: string) => {
    // Remove non-digits
    let cleaned = value.replace(/\D/g, '');

    // Remove leading 0 or 62
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.startsWith('62')) {
      cleaned = cleaned.slice(2);
    }

    // Add 62 prefix
    const formatted = '62' + cleaned;
    setLocalWhatsapp(formatted);
    setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const validate = () => {
    const newErrors = { email: '', password: '', whatsapp: '' };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!localEmail || !emailRegex.test(localEmail)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }

    // Password validation
    if (!localPassword || localPassword.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      isValid = false;
    }

    // WhatsApp validation
    if (!localWhatsapp || localWhatsapp.length < 11) {
      newErrors.whatsapp = 'Nomor WhatsApp tidak valid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdate({
        email: localEmail,
        password: localPassword,
        whatsapp: localWhatsapp,
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Informasi Akun</h2>
        <p className="text-muted-foreground">
          Buat akun untuk mengelola toko Anda
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            value={localEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              value={localPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
              +62
            </span>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="81234567890"
              className="rounded-l-none"
              value={localWhatsapp.replace(/^62/, '')}
              onChange={(e) => handleWhatsappChange(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Nomor ini akan digunakan untuk menerima pesanan
          </p>
          {errors.whatsapp && (
            <p className="text-sm text-destructive">{errors.whatsapp}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Kembali
        </Button>
        <Button type="button" onClick={handleNext} className="flex-1">
          Lanjut
        </Button>
      </div>
    </div>
  );
}
