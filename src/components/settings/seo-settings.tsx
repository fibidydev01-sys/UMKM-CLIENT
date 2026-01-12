'use client';

import { Loader2, Save, Search, Globe } from 'lucide-react';
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
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO (Search Engine Optimization)
          </CardTitle>
          <CardDescription>
            Optimalkan toko Anda agar mudah ditemukan di Google.
          </CardDescription>
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

              {/* Preview */}
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Preview di Google:</p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {settings.metaTitle || tenantName || 'Nama Toko'}
                  </p>
                  <p className="text-green-700 text-sm">
                    fibidy.com/store/{tenantSlug}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {settings.metaDescription || tenantDescription || 'Deskripsi toko akan muncul di sini...'}
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
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Media
          </CardTitle>
          <CardDescription>
            Link ke akun social media toko Anda. Akan ditampilkan di footer toko.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading || !settings ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  placeholder="https://instagram.com/username"
                  value={settings.socialLinks.instagram || ''}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  placeholder="https://facebook.com/page"
                  value={settings.socialLinks.facebook || ''}
                  onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-tiktok">TikTok</Label>
                <Input
                  id="social-tiktok"
                  placeholder="https://tiktok.com/@username"
                  value={settings.socialLinks.tiktok || ''}
                  onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-youtube">YouTube</Label>
                <Input
                  id="social-youtube"
                  placeholder="https://youtube.com/@channel"
                  value={settings.socialLinks.youtube || ''}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-twitter">Twitter / X</Label>
                <Input
                  id="social-twitter"
                  placeholder="https://twitter.com/username"
                  value={settings.socialLinks.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving || isLoading}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Simpan Pengaturan SEO
        </Button>
      </div>
    </div>
  );
}