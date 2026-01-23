'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCheckSlug, useDebounce } from '@/hooks';
import { Loader2, Check, X, Info } from 'lucide-react';

// ==========================================
// TYPES
// ==========================================

interface StepStoreInfoProps {
  name: string;
  slug: string;
  description: string;
  onUpdate: (data: { name?: string; slug?: string; description?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepStoreInfo({
  name,
  slug,
  description,
  onUpdate,
  onNext,
  onBack,
}: StepStoreInfoProps) {
  const [localName, setLocalName] = useState(name);
  const [localSlug, setLocalSlug] = useState(slug);
  const [localDescription, setLocalDescription] = useState(description);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const [errors, setErrors] = useState({ name: '', slug: '', description: '' });

  const { checkSlug, isChecking, isAvailable, reset: resetSlug } = useCheckSlug();
  const debouncedSlug = useDebounce(localSlug, 500);

  // Check slug availability
  useEffect(() => {
    if (debouncedSlug && debouncedSlug.length >= 3) {
      checkSlug(debouncedSlug);
    } else {
      resetSlug();
    }
  }, [debouncedSlug, checkSlug, resetSlug]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setLocalName(value);
    setErrors((prev) => ({ ...prev, name: '' }));

    // Only auto-generate if user hasn't manually edited slug
    if (!hasManuallyEditedSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 30);

      setLocalSlug(generatedSlug);
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setLocalSlug(cleanedSlug);
    setHasManuallyEditedSlug(true);
    setErrors((prev) => ({ ...prev, slug: '' }));
  };

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    setErrors((prev) => ({ ...prev, description: '' }));
  };

  const validate = () => {
    const newErrors = { name: '', slug: '', description: '' };
    let isValid = true;

    if (!localName || localName.trim().length < 3) {
      newErrors.name = 'Nama toko minimal 3 karakter';
      isValid = false;
    }

    if (!localSlug || localSlug.length < 3) {
      newErrors.slug = 'Alamat toko minimal 3 karakter';
      isValid = false;
    }

    if (isAvailable === false) {
      newErrors.slug = 'Alamat toko sudah digunakan';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdate({
        name: localName,
        slug: localSlug,
        description: localDescription,
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Informasi Toko</h2>
        <p className="text-muted-foreground">
          Buat identitas toko online Anda
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Store Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Toko *</Label>
          <Input
            id="name"
            placeholder="Warung Bu Sari"
            value={localName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Alamat Toko *</Label>
          <div className="relative">
            <Input
              id="slug"
              placeholder="warung-bu-sari"
              value={localSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
            />
            {/* Availability Indicator */}
            {localSlug.length >= 3 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : isAvailable === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : isAvailable === false ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {localSlug || 'nama-toko'}.fibidy.com
          </p>
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi (opsional)</Label>
          <Textarea
            id="description"
            placeholder="Ceritakan tentang toko Anda..."
            rows={3}
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {localDescription.length}/500
          </p>
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
        <Button
          type="button"
          onClick={handleNext}
          disabled={isAvailable === false || isChecking}
          className="flex-1"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
