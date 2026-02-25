'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SeoFormData, SocialLinks } from '@/types';

// ─── Platform config with English group names ─────────────────────────────
const SOCIAL_GROUPS: {
  group: string;
  fields: { key: keyof SocialLinks; label: string; placeholder: string }[];
}[] = [
    {
      group: 'Social Media',
      fields: [
        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
        { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/page' },
        { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
        { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
        { key: 'threads', label: 'Threads', placeholder: 'https://threads.net/@username' },
      ],
    },
    {
      group: 'Messaging',
      fields: [
        { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/628xxxxxxxxxx' },
        { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
      ],
    },
    {
      group: 'Creative & Professional',
      fields: [
        { key: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/username' },
        { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username' },
        { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
        { key: 'vimeo', label: 'Vimeo', placeholder: 'https://vimeo.com/username' },
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/name' },
      ],
    },
  ];

// Flat list for mobile
const ALL_FIELDS = SOCIAL_GROUPS.flatMap((g) => g.fields);

interface StepSocialLinksProps {
  formData: SeoFormData;
  onSocialLinkChange: (key: keyof SocialLinks, value: string) => void;
  isDesktop?: boolean;
}

export function StepSocialLinks({ formData, onSocialLinkChange, isDesktop = false }: StepSocialLinksProps) {

  const filledCount = ALL_FIELDS.filter(({ key }) => formData.socialLinks[key]).length;

  // ── DESKTOP: grouped grid ─────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-7">

        {/* Count pill */}
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Social Links
          </p>
          <span className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
            filledCount > 0
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}>
            {filledCount} / {ALL_FIELDS.length}
          </span>
        </div>

        {/* Groups */}
        {SOCIAL_GROUPS.map((group) => (
          <div key={group.group} className="space-y-3">

            {/* Group label */}
            <p className="text-[11px] font-medium tracking-widests uppercase text-muted-foreground/60 border-b pb-1.5">
              {group.group}
            </p>

            {/* 2-col grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {group.fields.map(({ key, label, placeholder }) => {
                const val = formData.socialLinks[key] || '';
                const filled = Boolean(val);
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Label
                        htmlFor={`d-${key}`}
                        className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground"
                      >
                        {label}
                      </Label>
                      {filled && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <Input
                      id={`d-${key}`}
                      placeholder={placeholder}
                      value={val}
                      onChange={(e) => onSocialLinkChange(key, e.target.value)}
                      className="h-9 text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground/40"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tip:</span>{' '}
            Social links appear in your store footer. Only add active accounts — fewer well-managed links are better than many inactive ones.
          </p>
        </div>
      </div>
    );
  }

  // ── MOBILE: portrait card ─────────────────────────────────────────────────
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-sm border shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col gap-4">

          {/* Count */}
          <div className="flex items-center justify-center gap-2">
            <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
              Social Links
            </p>
            <span className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
              filledCount > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {filledCount}/{ALL_FIELDS.length}
            </span>
          </div>

          <div className="w-full border-t" />

          {/* All fields flat */}
          {ALL_FIELDS.map(({ key, label, placeholder }, i) => {
            const val = formData.socialLinks[key] || '';
            const filled = Boolean(val);
            return (
              <div key={key}>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={`m-${key}`}
                      className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground"
                    >
                      {label}
                    </Label>
                    {filled && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <Input
                    id={`m-${key}`}
                    placeholder={placeholder}
                    value={val}
                    onChange={(e) => onSocialLinkChange(key, e.target.value)}
                    className="h-9 text-sm font-medium placeholder:font-normal placeholder:text-muted-foreground/40"
                  />
                </div>
                {i < ALL_FIELDS.length - 1 && <div className="w-full border-t mt-4" />}
              </div>
            );
          })}

        </CardContent>
      </Card>
    </div>
  );
}