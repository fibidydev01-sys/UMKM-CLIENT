'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import type { SocialLinks } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface SeoSettingsData {
  metaTitle: string;
  metaDescription: string;
  socialLinks: SocialLinks;
}

interface SeoSettingsProps {
  settings: SeoSettingsData | null;
  tenantName?: string;
  tenantSlug?: string;
  tenantDescription?: string;
  isLoading: boolean;
  isSaving: boolean;
  onSettingsChange: (settings: SeoSettingsData) => void;
  onSave: () => Promise<void>;
}

// ============================================================================
// SOCIAL MEDIA CONFIG
// ============================================================================

const SOCIAL_FIELDS: {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
}[] = [
    // ── Mainstream ──────────────────────────────────
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
    { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@username' },
    // ── Messaging ───────────────────────────────────
    { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/628xxxxxxxxxx' },
    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
    // ── Visual / Portfolio ──────────────────────────
    { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/username' },
    { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
    { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
    { key: 'vimeo', label: 'Vimeo', placeholder: 'https://vimeo.com/username' },
    // ── Professional ────────────────────────────────
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/name' },
  ];

// ============================================================================
// COMPONENT
// ============================================================================

export function SeoSettings({
  settings,
  tenantName,
  tenantSlug,
  tenantDescription,
  isLoading,
  isSaving,
  onSettingsChange,
  onSave,
}: SeoSettingsProps) {
  const handleMetaTitleChange = (value: string) => {
    if (settings) {
      onSettingsChange({ ...settings, metaTitle: value });
    }
  };

  const handleMetaDescriptionChange = (value: string) => {
    if (settings) {
      onSettingsChange({ ...settings, metaDescription: value });
    }
  };

  const handleSocialLinkChange = (key: keyof SocialLinks, value: string) => {
    if (settings) {
      onSettingsChange({
        ...settings,
        socialLinks: { ...settings.socialLinks, [key]: value },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO Meta Card */}
      <Card>
        <CardHeader>
          <CardTitle>SEO (Search Engine Optimization)</CardTitle>
          <CardDescription>Optimalkan toko Anda agar mudah ditemukan di Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || !settings ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta-title">
                  Meta Title
                  <span className="text-xs text-muted-foreground ml-2">
                    ({settings.metaTitle.length}/60)
                  </span>
                </Label>
                <Input
                  id="meta-title"
                  placeholder={tenantName || 'Judul toko Anda'}
                  maxLength={60}
                  value={settings.metaTitle}
                  onChange={(e) => handleMetaTitleChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Judul yang muncul di hasil pencarian Google. Maksimal 60 karakter.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">
                  Meta Description
                  <span className="text-xs text-muted-foreground ml-2">
                    ({settings.metaDescription.length}/160)
                  </span>
                </Label>
                <Textarea
                  id="meta-description"
                  placeholder="Deskripsi singkat toko Anda..."
                  maxLength={160}
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => handleMetaDescriptionChange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Deskripsi yang muncul di hasil pencarian Google. Maksimal 160 karakter.
                </p>
              </div>

              {/* Google Preview */}
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Preview di Google:</p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {settings.metaTitle || tenantName || 'Nama Toko'}
                  </p>
                  <p className="text-green-700 text-sm">{tenantSlug}.fibidy.com</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {settings.metaDescription ||
                      tenantDescription ||
                      'Deskripsi toko akan muncul di sini...'}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Social Links Card */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Link ke akun social media toko Anda. Akan ditampilkan di footer toko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading || !settings ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`social-${key}`}>{label}</Label>
                  <Input
                    id={`social-${key}`}
                    placeholder={placeholder}
                    value={settings.socialLinks[key] || ''}
                    onChange={(e) => handleSocialLinkChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan SEO'}
        </Button>
      </div>
    </div>
  );
}