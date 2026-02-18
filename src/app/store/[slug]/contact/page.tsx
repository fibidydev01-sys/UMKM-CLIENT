import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tenantsApi } from '@/lib/api';
import { TenantContact } from '@/components/landing';
import { BreadcrumbSchema, generateTenantBreadcrumbs } from '@/components/seo';
import type { PublicTenant } from '@/types';

// ==========================================
// CONTACT PAGE
// ==========================================

interface ContactPageProps {
  params: Promise<{ slug: string }>;
}

async function getTenant(slug: string): Promise<PublicTenant | null> {
  try {
    return await tenantsApi.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    return { title: 'Not Found' };
  }

  const description = `Hubungi ${tenant.name}. ${tenant.address ? `Alamat: ${tenant.address}.` : ''} ${tenant.whatsapp ? `WhatsApp: ${tenant.whatsapp}` : ''}`;

  return {
    title: `Kontak | ${tenant.name}`,
    description: description.slice(0, 160),
    openGraph: {
      title: `Hubungi ${tenant.name}`,
      description,
      images: tenant.heroBackgroundImage ? [tenant.heroBackgroundImage] : tenant.logo ? [tenant.logo] : [],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { slug } = await params;
  const tenant = await getTenant(slug);

  if (!tenant) {
    notFound();
  }

  const landingConfig = tenant.landingConfig;
  const contactConfig = landingConfig?.contact;

  const breadcrumbs = [
    ...generateTenantBreadcrumbs({ name: tenant.name, slug: tenant.slug }),
    { name: 'Kontak', url: `/store/${slug}/contact` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="container px-4 py-8">
        <TenantContact
          config={contactConfig}
          tenant={tenant}
        />
      </div>
    </>
  );
}