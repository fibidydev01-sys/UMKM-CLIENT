'use client';

import { Store } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ============================================================================
// TYPES
// ============================================================================

interface StoreFormData {
  name: string;
  description: string;
  phone: string;
  address: string;
}

interface StoreInfoFormProps {
  formData: StoreFormData | null;
  tenantEmail?: string;
  tenantSlug?: string;
  isLoading: boolean;
  onFormChange: (key: keyof StoreFormData, value: string) => void;
}

// ============================================================================
// COMPONENT - Now renders as AccordionItem (no Card wrapper)
// ============================================================================

export function StoreInfoForm({
  formData,
  tenantEmail,
  tenantSlug,
  isLoading,
  onFormChange,
}: StoreInfoFormProps) {
  if (isLoading || !formData) {
    return (
      <AccordionItem value="store-info">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <span>Informasi Dasar</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem value="store-info">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span>Informasi Dasar</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nama Toko</Label>
              <Input
                id="store-name"
                placeholder="Nama toko Anda"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Email Toko</Label>
              <Input
                id="store-email"
                type="email"
                placeholder="email@toko.com"
                value={tenantEmail || ''}
                disabled
              />
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Nomor Telepon</Label>
              <Input
                id="store-phone"
                placeholder="+62 xxx xxxx xxxx"
                value={formData.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-slug">URL Toko</Label>
              <Input
                id="store-slug"
                value={`fibidy.com/store/${tenantSlug || ''}`}
                disabled
              />
              <p className="text-xs text-muted-foreground">URL toko tidak dapat diubah</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-description">Deskripsi Toko</Label>
            <Textarea
              id="store-description"
              placeholder="Ceritakan tentang toko Anda..."
              rows={4}
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address">Alamat</Label>
            <Textarea
              id="store-address"
              placeholder="Alamat lengkap toko"
              rows={3}
              value={formData.address}
              onChange={(e) => onFormChange('address', e.target.value)}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
