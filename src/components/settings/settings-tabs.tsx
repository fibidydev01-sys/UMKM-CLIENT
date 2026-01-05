'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Store, Phone, User, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StoreProfileForm } from './store-profile-form';
import { StoreContactForm } from './store-contact-form';
import { AccountSettingsForm } from './account-settings-form';
import { AppearanceSettings } from './appearance-settings';
import { DangerZone } from './danger-zone';
import type { Tenant } from '@/types';

// ==========================================
// SETTINGS TABS
// ==========================================

interface SettingsTabsProps {
  tenant: Tenant;
}

const tabs = [
  { value: 'store', label: 'Profil Toko', icon: Store },
  { value: 'contact', label: 'Kontak', icon: Phone },
  { value: 'account', label: 'Akun', icon: User },
  { value: 'appearance', label: 'Tampilan', icon: Palette },
];

export function SettingsTabs({ tenant }: SettingsTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'store';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="store" className="space-y-6">
        <StoreProfileForm tenant={tenant} />
      </TabsContent>

      <TabsContent value="contact" className="space-y-6">
        <StoreContactForm tenant={tenant} />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <AccountSettingsForm tenant={tenant} />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
        <DangerZone />
      </TabsContent>
    </Tabs>
  );
}