'use client';

import { useState } from 'react';
import { CategoryCard } from '../category-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoryList } from '@/config/categories';
import { Package, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==========================================
// TYPES
// ==========================================

interface StepCategoryProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

export function StepCategory({
  selectedCategory,
  onSelectCategory,
  onNext,
  onBack,
}: StepCategoryProps) {
  const categories = getCategoryList();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const handleCustomCategorySelect = () => {
    if (customCategory.trim()) {
      onSelectCategory(customCategory.trim());
      setShowCustomInput(false);
    }
  };

  const isPredefinedSelected = categories.some((c) => c.key === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Pilih Kategori Usaha</h2>
        <p className="text-muted-foreground">
          Pilih yang paling sesuai dengan bisnis Anda
        </p>
      </div>

      {/* Category Grid - Predefined */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            label={cat.label}
            color={cat.color}
            isSelected={selectedCategory === cat.key}
            onClick={() => {
              onSelectCategory(cat.key);
              setShowCustomInput(false);
              setCustomCategory('');
            }}
          />
        ))}
      </div>

      {/* "Lainnya" Section */}
      {!showCustomInput ? (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
            'border-dashed border-muted-foreground/30 hover:border-primary/50'
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-left flex-1">
            <p className="font-medium">Lainnya</p>
            <p className="text-sm text-muted-foreground">
              Jenis usaha tidak ada di daftar
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-muted-foreground" />
        </button>
      ) : (
        <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <p className="font-medium">Kategori Custom</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-category">Nama Kategori</Label>
            <Input
              id="custom-category"
              placeholder="Contoh: Distro Streetwear, Klinik Hewan, Service Komputer"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customCategory.trim()) {
                  handleCustomCategorySelect();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Kategori ini akan tersimpan dan bisa dicari oleh pengguna lain
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCustomInput(false);
                setCustomCategory('');
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCustomCategorySelect}
              disabled={!customCategory.trim()}
              className="flex-1"
            >
              Gunakan Kategori Ini
            </Button>
          </div>
        </div>
      )}

      {/* Selected Custom Category Display */}
      {selectedCategory && !isPredefinedSelected && (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Kategori terpilih:</p>
              <p className="text-sm text-muted-foreground">{selectedCategory}</p>
            </div>
          </div>
        </div>
      )}

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
          onClick={onNext}
          disabled={!selectedCategory}
          className="flex-1"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
