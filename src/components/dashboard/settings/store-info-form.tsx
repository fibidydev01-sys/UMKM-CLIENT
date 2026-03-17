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
            <span>Basic Information</span>
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
          <span>Basic Information</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="store-name">Store name</Label>
              <Input
                id="store-name"
                placeholder="Your store name"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-email">Store email</Label>
              <Input
                id="store-email"
                type="email"
                placeholder="email@store.com"
                value={tenantEmail || ''}
                disabled
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Phone number</Label>
              <Input
                id="store-phone"
                placeholder="+62 xxx xxxx xxxx"
                value={formData.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-slug">Store URL</Label>
              <Input
                id="store-slug"
                value={`fibidy.com/store/${tenantSlug || ''}`}
                disabled
              />
              <p className="text-xs text-muted-foreground">Store URL cannot be changed</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-description">Store description</Label>
            <Textarea
              id="store-description"
              placeholder="Tell customers about your store..."
              rows={4}
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address">Address</Label>
            <Textarea
              id="store-address"
              placeholder="Full store address"
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