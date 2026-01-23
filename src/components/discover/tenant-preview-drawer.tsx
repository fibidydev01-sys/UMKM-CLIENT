// ══════════════════════════════════════════════════════════════
// TENANT PREVIEW DRAWER - V11.0 REFACTORED
// Uses centralized lib/discover utilities
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  Store,
  MapPin,
  Package,
  MessageCircle,
  ExternalLink,
  Share2,
  X,
  Instagram,
  Facebook,
  Phone,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ShowcaseTenant } from '@/types/discover';
import { getCategoryInfo, getInitials, formatWhatsAppUrl } from '@/lib/discover';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface TenantPreviewDrawerProps {
  tenant: ShowcaseTenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantUrl: string;
  // Data from page (same pattern as DiscoverHero)
  allTenants: ShowcaseTenant[];
  // Callback to switch tenant (drawer stays open)
  onTenantSelect: (tenant: ShowcaseTenant) => void;
}

// ══════════════════════════════════════════════════════════════
// TIKTOK ICON
// ══════════════════════════════════════════════════════════════

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// EXPLORE TENANT CARD
// ══════════════════════════════════════════════════════════════

interface ExploreTenantCardProps {
  tenant: ShowcaseTenant;
  onClick: () => void;
}

function ExploreTenantCard({ tenant, onClick }: ExploreTenantCardProps) {
  const categoryInfo = getCategoryInfo(tenant.category);
  const primaryColor = tenant.theme?.primaryColor || categoryInfo.color;

  return (
    <button
      onClick={onClick}
      className="group text-left w-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-2">
        {tenant.heroBackgroundImage ? (
          <Image
            src={tenant.heroBackgroundImage}
            alt={tenant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)`,
            }}
          >
            <Store className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center overflow-hidden shrink-0 border"
          style={{ borderColor: `${primaryColor}30` }}
        >
          {tenant.logo ? (
            <Image
              src={tenant.logo}
              alt={tenant.name}
              width={24}
              height={24}
              className="object-cover"
            />
          ) : (
            <span
              className="text-[10px] font-bold"
              style={{ color: primaryColor }}
            >
              {getInitials(tenant.name)}
            </span>
          )}
        </div>

        {/* Name */}
        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {tenant.name}
        </span>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function TenantPreviewDrawer({
  tenant,
  open,
  onOpenChange,
  tenantUrl,
  allTenants = [],  // ← Default empty array to prevent undefined error
  onTenantSelect,
}: TenantPreviewDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerSentinelRef = useRef<HTMLDivElement>(null);

  // Filter out current tenant from explore list
  const exploreTenants = allTenants.filter(t => t.id !== tenant?.id);

  // ════════════════════════════════════════════════════════════
  // SCROLL TO TOP when tenant changes
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [tenant?.id, open]);

  // ════════════════════════════════════════════════════════════
  // STICKY HEADER DETECTION
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = headerSentinelRef.current;

    if (!scrollContainer || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderSticky(!entry.isIntersecting);
      },
      {
        root: scrollContainer,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open]);

  // Reset states when drawer closes
  // Note: This is intentionally setting state based on prop change
  // The state is only updated when drawer closes (open becomes false)
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open) {
      setIsHeaderSticky(false); // eslint-disable-line react-hooks/set-state-in-effect
      setCopied(false);
    }
    prevOpenRef.current = open;
  }, [open]);

  // ════════════════════════════════════════════════════════════
  // HANDLERS
  // ════════════════════════════════════════════════════════════

  const handleShare = useCallback(async () => {
    if (!tenant) return;

    const shareData = {
      title: tenant.name || 'UMKM di Fibidy',
      text: tenant.description || `Kunjungi ${tenant.name} di Fibidy`,
      url: tenantUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(tenantUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      console.log('Share cancelled or failed');
    }
  }, [tenant, tenantUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tenantUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  }, [tenantUrl]);

  // Handle tenant card click - switch tenant, drawer stays open
  const handleTenantClick = useCallback((clickedTenant: ShowcaseTenant) => {
    onTenantSelect(clickedTenant);
    // Scroll to top is handled by useEffect above
  }, [onTenantSelect]);

  if (!tenant) return null;

  const categoryInfo = getCategoryInfo(tenant.category);
  const CategoryIcon = categoryInfo.icon;
  const productCount = tenant._count?.products || 0;
  const primaryColor = tenant.theme?.primaryColor || categoryInfo.color;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} noBodyStyles>
      <Drawer.Portal>
        {/* Overlay */}
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[9999]" />

        {/* Content */}
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10000]',
            'bg-background rounded-t-[20px]',
            'max-h-[92vh] outline-none',
            'flex flex-col'
          )}
          aria-describedby="drawer-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {tenant.name ? `Preview ${tenant.name}` : 'Preview Toko UMKM'}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="drawer-description">
              {tenant.description || `Lihat detail toko ${tenant.name || 'UMKM'} di Fibidy`}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Sticky Header */}
          <div
            className={cn(
              'px-4 pb-4 border-b shrink-0 transition-shadow duration-200',
              'sticky top-0 bg-background z-10',
              isHeaderSticky && 'shadow-md'
            )}
          >
            <div className="flex items-center gap-3 min-w-0 pr-10">
              {/* Avatar */}
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 border"
                style={{ borderColor: `${primaryColor}30` }}
              >
                {tenant.logo ? (
                  <Image
                    src={tenant.logo}
                    alt={tenant.name || 'Logo'}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    {getInitials(tenant.name)}
                  </span>
                )}
              </div>

              {/* Name & Category */}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-base truncate">
                  {tenant.name || 'Unnamed Store'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span style={{ color: primaryColor }}>
                    {categoryInfo.labelShort}
                  </span>
                  {tenant.address && (
                    <>
                      <span>·</span>
                      <span className="truncate">{tenant.address.split(',')[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            {/* Sentinel for sticky detection */}
            <div ref={headerSentinelRef} className="h-0" />

            {/* Hero Background Image */}
            <div className="px-4 py-6">
              <div className="relative w-full max-w-2xl mx-auto aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                {tenant.heroBackgroundImage ? (
                  <Image
                    src={tenant.heroBackgroundImage}
                    alt={tenant.name || 'Store Hero'}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)`,
                    }}
                  >
                    <Store className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-8 max-w-2xl mx-auto">
              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span><strong className="text-foreground">{productCount}</strong> produk</span>
                </div>
                <Badge
                  variant="secondary"
                  className="gap-1"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}
                >
                  <CategoryIcon className="h-3 w-3" />
                  {categoryInfo.labelShort}
                </Badge>
              </div>

              {/* Description */}
              {tenant.description && (
                <div className="mb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {tenant.description}
                  </p>
                </div>
              )}

              {/* Address */}
              {tenant.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{tenant.address}</span>
                </div>
              )}

              {/* Social Links */}
              {(tenant.socialLinks?.instagram || tenant.socialLinks?.facebook || tenant.socialLinks?.tiktok || tenant.phone) && (
                <div className="flex items-center gap-2 mb-6">
                  {tenant.socialLinks?.instagram && (
                    <Link
                      href={tenant.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </Link>
                  )}
                  {tenant.socialLinks?.tiktok && (
                    <Link
                      href={tenant.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="h-4 w-4" />
                    </Link>
                  )}
                  {tenant.socialLinks?.facebook && (
                    <Link
                      href={tenant.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </Link>
                  )}
                  {tenant.phone && (
                    <Link
                      href={`tel:${tenant.phone}`}
                      className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      aria-label="Telepon"
                    >
                      <Phone className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors mb-6"
              >
                <span className="text-sm text-muted-foreground truncate">
                  {tenantUrl}
                </span>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500 shrink-0 ml-2" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </button>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Bagikan</span>
                </Button>

                {tenant.whatsapp && (
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-11 gap-2"
                  >
                    <Link
                      href={formatWhatsAppUrl(tenant.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  className="flex-1 h-11 gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Link
                    href={tenantUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Buka Toko</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════ */}
            {/* EXPLORE LAINNYA                                    */}
            {/* ══════════════════════════════════════════════════ */}
            {exploreTenants.length > 0 && (
              <div className="px-4 pb-8 max-w-2xl mx-auto border-t pt-8">
                <h3 className="text-lg font-semibold mb-4">Explore Lainnya</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {exploreTenants.map((exploreTenant) => (
                    <ExploreTenantCard
                      key={exploreTenant.id}
                      tenant={exploreTenant}
                      onClick={() => handleTenantClick(exploreTenant)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Floating Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-colors z-20"
            aria-label="Tutup preview"
          >
            <X className="h-4 w-4" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}