'use client';

import { CustomDomainSetup } from '@/components/domain';

export default function DomainSettingsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Custom Domain</h1>
        <p className="text-muted-foreground mt-2">
          Gunakan domain sendiri untuk toko online Anda
        </p>
      </div>

      <CustomDomainSetup />
    </div>
  );
}