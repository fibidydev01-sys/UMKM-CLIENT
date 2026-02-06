// ══════════════════════════════════════════════════════════════
// TENANT PROFILE DRAWER - FULL VERSION
// 10 sections, 30+ fields, zero hardcode
// All data from PublicTenant via getBySlug
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Drawer } from 'vaul';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import {
  Store,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  Instagram,
  Facebook,
  Youtube,
  CreditCard,
  Truck,
  Quote,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { tenantsApi } from '@/lib/api';
import { getCategoryInfo, formatWhatsAppUrl } from '@/lib/discover';
import type { PublicTenant, Testimonial } from '@/types';

// ══════════════════════════════════════════════════════════════
// TIKTOK ICON (not in lucide)
// ══════════════════════════════════════════════════════════════

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface TenantProfileDrawerProps {
  slug: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ══════════════════════════════════════════════════════════════
// CACHE
// ══════════════════════════════════════════════════════════════

const tenantCache = new Map<string, PublicTenant>();

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function TenantProfileDrawer({
  slug,
  open,
  onOpenChange,
}: TenantProfileDrawerProps) {
  const [tenant, setTenant] = useState<PublicTenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // UI state
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Fetch tenant data ───────────────────────────────────────
  useEffect(() => {
    if (!open || !slug) return;

    const cached = tenantCache.get(slug);
    if (cached) {
      setTenant(cached);
      setLoading(false);
      setError(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await tenantsApi.getBySlug(slug);
        tenantCache.set(slug, data);
        setTenant(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, slug]);

  // ── Reset on close ──────────────────────────────────────────
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      setAboutExpanded(false);
      setFeatureIndex(0);
      setTestimonialIndex(0);
    }
    prevOpen.current = open;
  }, [open]);

  // ── Scroll to top on slug change ────────────────────────────
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [slug, open]);

  // ── Derived data ────────────────────────────────────────────
  const categoryInfo = tenant ? getCategoryInfo(tenant.category) : null;
  const primaryColor = tenant?.theme?.primaryColor || categoryInfo?.color || '#6b7280';
  const features = tenant?.aboutFeatures ?? [];
  const testimonials: Testimonial[] = (tenant?.testimonials as Testimonial[] | undefined) ?? [];
  const productCount = tenant?._count?.products ?? 0;

  // Section visibility flags
  const hasHeroBanner = !!tenant?.heroBackgroundImage;
  const hasHeroText = !!(tenant?.heroTitle || tenant?.heroSubtitle);
  const hasAboutContent = !!(tenant?.aboutContent || tenant?.aboutImage);
  const hasFeatures = features.length > 0;
  const hasTestimonials = testimonials.length > 0;
  const hasContact = !!(tenant?.whatsapp || tenant?.phone || tenant?.address);
  const hasSocialLinks = !!(tenant?.socialLinks?.instagram || tenant?.socialLinks?.facebook || tenant?.socialLinks?.tiktok || tenant?.socialLinks?.youtube);
  const hasMap = !!(tenant?.contactShowMap && tenant?.contactMapUrl);

  // Payment & shipping
  const enabledBanks = tenant?.paymentMethods?.bankAccounts?.filter(b => b.enabled) ?? [];
  const enabledWallets = tenant?.paymentMethods?.eWallets?.filter(w => w.enabled) ?? [];
  const hasCod = tenant?.paymentMethods?.cod?.enabled ?? false;
  const hasPayment = enabledBanks.length > 0 || enabledWallets.length > 0 || hasCod;
  const enabledCouriers = tenant?.shippingMethods?.couriers?.filter(c => c.enabled) ?? [];
  const hasShipping = enabledCouriers.length > 0;

  // CTA
  const ctaText = tenant?.ctaButtonText || 'Kunjungi Website';
  const ctaLink = tenant?.ctaButtonLink || (tenant ? `/${tenant.slug}` : '/');
  const hasCta = !!(tenant?.ctaTitle || tenant?.ctaSubtitle);

  // About text truncation
  const aboutText = tenant?.aboutContent ?? '';
  const isLongAbout = aboutText.length > 200;
  const displayAbout = aboutExpanded || !isLongAbout ? aboutText : aboutText.slice(0, 200) + '...';

  // Carousel navigation
  const nextFeature = useCallback(() => {
    setFeatureIndex((i) => (i + 1) % features.length);
  }, [features.length]);
  const prevFeature = useCallback(() => {
    setFeatureIndex((i) => (i - 1 + features.length) % features.length);
  }, [features.length]);
  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);
  const prevTestimonial = useCallback(() => {
    setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[10001]" />

        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[10002]',
            'bg-background rounded-t-[20px]',
            'h-[85vh] outline-none',
            'flex flex-col',
          )}
          aria-describedby="tenant-profile-description"
        >
          {/* Accessibility */}
          <Drawer.Title asChild>
            <VisuallyHidden.Root>
              {tenant ? `Profil ${tenant.name}` : 'Profil Toko'}
            </VisuallyHidden.Root>
          </Drawer.Title>
          <Drawer.Description asChild>
            <VisuallyHidden.Root id="tenant-profile-description">
              {tenant?.description || 'Preview profil toko'}
            </VisuallyHidden.Root>
          </Drawer.Description>

          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* ══════════ LOADING ══════════ */}
          {loading && (
            <div className="flex-1 px-6 py-4 max-w-2xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-48 w-full rounded-xl mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}

          {/* ══════════ ERROR ══════════ */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Gagal memuat profil toko</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    if (slug) {
                      tenantCache.delete(slug);
                      setError(false);
                      setLoading(true);
                      tenantsApi.getBySlug(slug).then((data) => {
                        tenantCache.set(slug, data);
                        setTenant(data);
                        setLoading(false);
                      }).catch(() => {
                        setError(true);
                        setLoading(false);
                      });
                    }
                  }}
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}

          {/* ══════════ CONTENT ══════════ */}
          {tenant && !loading && !error && (
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto w-full px-6 pb-8">

                {/* ────────────────────────────────────────────────
                     SECTION 1: HEADER
                     Fields: logo, name, category, address, _count.products
                    ──────────────────────────────────────────────── */}
                <div className="flex items-center gap-4 py-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border-2"
                    style={{ borderColor: `${primaryColor}30` }}
                  >
                    {tenant.logo ? (
                      <Image src={tenant.logo} alt={tenant.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <Store className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-lg truncate">{tenant.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                      {categoryInfo && (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-xs"
                          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                          {categoryInfo.labelShort}
                        </Badge>
                      )}
                      {tenant.address && (
                        <span className="truncate text-xs">{tenant.address.split(',')[0]}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Package className="h-3 w-3" />
                      <span><strong className="text-foreground">{productCount}</strong> produk</span>
                    </div>
                  </div>
                </div>

                {tenant.description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {tenant.description}
                  </p>
                )}

                <Separator className="mb-6" />

                {/* ────────────────────────────────────────────────
                     SECTION 2: HERO BANNER
                     Fields: heroBackgroundImage, heroTitle, heroSubtitle
                    ──────────────────────────────────────────────── */}
                {(hasHeroBanner || hasHeroText) && (
                  <div className="mb-6">
                    {hasHeroBanner && (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-3">
                        <Image
                          src={tenant.heroBackgroundImage!}
                          alt={tenant.heroTitle || tenant.name}
                          fill
                          className="object-cover"
                          priority
                        />
                        {/* Overlay text on banner */}
                        {hasHeroText && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4">
                            {tenant.heroTitle && (
                              <h3 className="text-white font-bold text-lg leading-tight">{tenant.heroTitle}</h3>
                            )}
                            {tenant.heroSubtitle && (
                              <p className="text-white/80 text-sm mt-0.5">{tenant.heroSubtitle}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hero text without banner image */}
                    {!hasHeroBanner && hasHeroText && (
                      <div
                        className="rounded-xl p-4 mb-3"
                        style={{ backgroundColor: `${primaryColor}08` }}
                      >
                        {tenant.heroTitle && (
                          <h3 className="font-bold text-base" style={{ color: primaryColor }}>{tenant.heroTitle}</h3>
                        )}
                        {tenant.heroSubtitle && (
                          <p className="text-sm text-muted-foreground mt-0.5">{tenant.heroSubtitle}</p>
                        )}
                      </div>
                    )}

                    <Separator className="mt-3" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 3: TENTANG KAMI
                     Fields: aboutTitle, aboutSubtitle, aboutImage, aboutContent
                    ──────────────────────────────────────────────── */}
                {hasAboutContent && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {tenant.aboutTitle || 'Tentang Kami'}
                    </h3>
                    {tenant.aboutSubtitle && (
                      <p className="text-xs text-muted-foreground mb-3">{tenant.aboutSubtitle}</p>
                    )}

                    {tenant.aboutImage && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                        <Image
                          src={tenant.aboutImage}
                          alt={tenant.aboutTitle || `Tentang ${tenant.name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {aboutText && (
                      <div>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {displayAbout}
                        </p>
                        {isLongAbout && (
                          <button
                            className="text-xs font-medium text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                            onClick={() => setAboutExpanded(!aboutExpanded)}
                          >
                            {aboutExpanded ? (
                              <>Sembunyikan <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>Baca Selengkapnya <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 4: KEUNGGULAN
                     Fields: aboutFeatures[].icon, .title, .description
                    ──────────────────────────────────────────────── */}
                {hasFeatures && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Keunggulan Kami
                    </h3>

                    <div className="relative">
                      <div
                        className="rounded-xl border p-4 text-center"
                        style={{ borderColor: `${primaryColor}20` }}
                      >
                        <div
                          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                          style={{ backgroundColor: `${primaryColor}15` }}
                        >
                          {features[featureIndex]?.icon ? (
                            <span className="text-xl">{features[featureIndex].icon}</span>
                          ) : (
                            <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
                          )}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{features[featureIndex]?.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {features[featureIndex]?.description}
                        </p>
                      </div>

                      {features.length > 1 && (
                        <>
                          <button
                            onClick={prevFeature}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextFeature}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {features.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-3">
                          {features.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFeatureIndex(i)}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full transition-all',
                                i === featureIndex ? 'w-4' : 'bg-muted-foreground/30',
                              )}
                              style={i === featureIndex ? { backgroundColor: primaryColor } : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 5: TESTIMONIAL
                     Fields: testimonialsTitle, testimonialsSubtitle,
                             testimonials[].name, .role, .avatar, .content, .rating
                    ──────────────────────────────────────────────── */}
                {hasTestimonials && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {tenant.testimonialsTitle || 'Testimonial'}
                    </h3>
                    {tenant.testimonialsSubtitle && (
                      <p className="text-xs text-muted-foreground mb-3">{tenant.testimonialsSubtitle}</p>
                    )}

                    <div className="relative">
                      <div className="rounded-xl border p-4">
                        {/* Rating stars */}
                        {testimonials[testimonialIndex]?.rating && (
                          <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3.5 w-3.5',
                                  i < (testimonials[testimonialIndex].rating ?? 0)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground/20',
                                )}
                              />
                            ))}
                          </div>
                        )}

                        {/* Quote */}
                        <div className="flex gap-2 mb-3">
                          <Quote className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
                          <p className="text-sm italic leading-relaxed">
                            {testimonials[testimonialIndex]?.content}
                          </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-2">
                          {testimonials[testimonialIndex]?.avatar ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={testimonials[testimonialIndex].avatar!}
                                alt={testimonials[testimonialIndex].name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                              {testimonials[testimonialIndex]?.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold">{testimonials[testimonialIndex]?.name}</p>
                            {testimonials[testimonialIndex]?.role && (
                              <p className="text-[10px] text-muted-foreground">{testimonials[testimonialIndex].role}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Navigation */}
                      {testimonials.length > 1 && (
                        <>
                          <button
                            onClick={prevTestimonial}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={nextTestimonial}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-7 h-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-1.5 mt-3">
                          {testimonials.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setTestimonialIndex(i)}
                              className={cn(
                                'w-1.5 h-1.5 rounded-full transition-all',
                                i === testimonialIndex ? 'w-4' : 'bg-muted-foreground/30',
                              )}
                              style={i === testimonialIndex ? { backgroundColor: primaryColor } : undefined}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 6: KONTAK
                     Fields: contactTitle, contactSubtitle,
                             whatsapp, phone, address, contactMapUrl
                    ──────────────────────────────────────────────── */}
                {hasContact && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      {tenant.contactTitle || 'Kontak'}
                    </h3>
                    {tenant.contactSubtitle && (
                      <p className="text-xs text-muted-foreground mb-3">{tenant.contactSubtitle}</p>
                    )}

                    <div className="space-y-3">
                      {/* WhatsApp */}
                      {tenant.whatsapp && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">WhatsApp</p>
                              <p className="text-sm font-medium">{tenant.whatsapp}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={formatWhatsAppUrl(tenant.whatsapp)} target="_blank" rel="noopener noreferrer">
                              Chat
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Phone */}
                      {tenant.phone && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <Phone className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Telepon</p>
                              <p className="text-sm font-medium">{tenant.phone}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`tel:${tenant.phone}`}>
                              Hubungi
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Address */}
                      {tenant.address && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                          <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">Alamat</p>
                            <p className="text-sm font-medium">{tenant.address}</p>
                            {tenant.contactMapUrl && (
                              <Link
                                href={tenant.contactMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-0.5"
                              >
                                Lihat di Maps <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 7: SOCIAL LINKS
                     Fields: socialLinks.instagram, .facebook, .tiktok, .youtube
                    ──────────────────────────────────────────────── */}
                {hasSocialLinks && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Ikuti Kami
                    </h3>

                    <div className="flex items-center gap-2 flex-wrap">
                      {tenant.socialLinks?.instagram && (
                        <Link
                          href={tenant.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
                        >
                          <Instagram className="h-4 w-4 text-pink-500" />
                          <span>Instagram</span>
                        </Link>
                      )}
                      {tenant.socialLinks?.facebook && (
                        <Link
                          href={tenant.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
                        >
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <span>Facebook</span>
                        </Link>
                      )}
                      {tenant.socialLinks?.tiktok && (
                        <Link
                          href={tenant.socialLinks.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
                        >
                          <TikTokIcon className="h-4 w-4" />
                          <span>TikTok</span>
                        </Link>
                      )}
                      {tenant.socialLinks?.youtube && (
                        <Link
                          href={tenant.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm"
                        >
                          <Youtube className="h-4 w-4 text-red-500" />
                          <span>YouTube</span>
                        </Link>
                      )}
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 8: LOKASI / MAP
                     Fields: contactMapUrl, contactShowMap
                    ──────────────────────────────────────────────── */}
                {hasMap && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Lokasi Kami
                    </h3>

                    <div className="rounded-xl overflow-hidden border bg-muted">
                      <iframe
                        src={tenant.contactMapUrl!}
                        className="w-full h-[250px] border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Lokasi ${tenant.name}`}
                      />
                    </div>

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 9: PEMBAYARAN & PENGIRIMAN
                     Fields: paymentMethods.bankAccounts, .eWallets, .cod,
                             shippingMethods.couriers
                    ──────────────────────────────────────────────── */}
                {(hasPayment || hasShipping) && (
                  <div className="mb-6">
                    {hasPayment && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Pembayaran
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {enabledBanks.map((b) => (
                            <Badge key={b.id} variant="secondary" className="text-xs">
                              {b.bank}
                            </Badge>
                          ))}
                          {enabledWallets.map((w) => (
                            <Badge key={w.id} variant="secondary" className="text-xs">
                              {w.provider}
                            </Badge>
                          ))}
                          {hasCod && (
                            <Badge variant="secondary" className="text-xs">COD</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {hasShipping && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Pengiriman
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {enabledCouriers.map((c) => (
                            <Badge key={c.id} variant="secondary" className="text-xs">
                              {c.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="mt-6" />
                  </div>
                )}

                {/* ────────────────────────────────────────────────
                     SECTION 10: CTA FOOTER
                     Fields: ctaTitle, ctaSubtitle, ctaButtonText,
                             ctaButtonLink, ctaButtonStyle
                    ──────────────────────────────────────────────── */}
                {hasCta && (
                  <div
                    className="rounded-xl p-4 mb-4 text-center"
                    style={{ backgroundColor: `${primaryColor}08` }}
                  >
                    {tenant.ctaTitle && (
                      <h3 className="font-bold text-sm mb-1">{tenant.ctaTitle}</h3>
                    )}
                    {tenant.ctaSubtitle && (
                      <p className="text-xs text-muted-foreground mb-0">{tenant.ctaSubtitle}</p>
                    )}
                  </div>
                )}

                <Button
                  asChild
                  className="w-full h-11 gap-2"
                  variant={tenant.ctaButtonStyle === 'outline' ? 'outline' : tenant.ctaButtonStyle === 'secondary' ? 'secondary' : 'default'}
                  style={
                    !tenant.ctaButtonStyle || tenant.ctaButtonStyle === 'primary'
                      ? { backgroundColor: primaryColor }
                      : undefined
                  }
                >
                  <Link href={ctaLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    {ctaText}
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
