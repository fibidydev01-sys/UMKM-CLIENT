// ══════════════════════════════════════════════════════════════
// PROFIL PAGE — V13.1 Raycast Standard
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import { LandingHeader, LandingFooter } from '@/components/marketing';
import { ProfilHero } from '@/components/marketing/profile/profile-hero';
import { ProfilStory } from '@/components/marketing/profile/profile-story';
import { ProfilVisiMisi } from '@/components/marketing/profile/profile-vision-mission';
import { ProfilFounder } from '@/components/marketing/profile/profile-founder';
import { ProfilLegalitas } from '@/components/marketing/profile/profile-legality';
import { ProfilCta } from '@/components/marketing/profile/profile-cta';

export const metadata: Metadata = {
  title: 'Tentang Fibidy — Platform Situs Online UMKM Indonesia',
  description:
    'Kenalan sama Fibidy. Platform situs online untuk UMKM Indonesia — siapa kami, visi kami, founder, dan legalitas usaha resmi kami.',
  openGraph: {
    title: 'Tentang Fibidy',
    description: 'Kenalan sama Fibidy. Platform situs online untuk UMKM Indonesia.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Fibidy',
  },
};

export default function ProfilPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <ProfilHero />
        <ProfilStory />
        <ProfilVisiMisi />
        <ProfilFounder />
        <ProfilLegalitas />
        <ProfilCta />
      </main>
      <LandingFooter />
    </div>
  );
}