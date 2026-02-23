'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import type { SeoFormData, SocialLinks } from '@/types';

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@username' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/628xxxxxxxxxx' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
  { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/username' },
  { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
  { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
  { key: 'vimeo', label: 'Vimeo', placeholder: 'https://vimeo.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/name' },
];

interface StepSosmedProps {
  formData: SeoFormData;
  onSocialLinkChange: (key: keyof SocialLinks, value: string) => void;
}

export function StepSosmed({ formData, onSocialLinkChange }: StepSosmedProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 flex flex-col gap-4">
          {SOCIAL_FIELDS.map(({ key, label, placeholder }, i) => (
            <div key={key}>
              <div className="space-y-1.5">
                <Label htmlFor={`social-${key}`} className="block text-xs text-muted-foreground">
                  {label}
                </Label>
                <Input
                  id={`social-${key}`}
                  placeholder={placeholder}
                  value={formData.socialLinks[key] || ''}
                  onChange={(e) => onSocialLinkChange(key, e.target.value)}
                />
              </div>
              {i < SOCIAL_FIELDS.length - 1 && <div className="w-full border-t mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}