'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Truck, Share2 } from 'lucide-react';
import { cn } from '@/lib/shared/utils';
import { useChannelsActiveTab } from '@/stores/tour-store';
import { useTour } from '@/hooks/dashboard/use-tour';
import { useNextStep } from 'nextstepjs';
import { PembayaranSection } from '@/components/dashboard/settings/pembayaran-section';
import { PengirimanSection } from '@/components/dashboard/settings/pengiriman-section';
import { SocialSection } from '@/components/dashboard/settings/social-section';

type TabType = 'pembayaran' | 'pengiriman' | 'social';

const TABS = [
  { id: 'pembayaran' as const, label: 'Payment', icon: CreditCard },
  { id: 'pengiriman' as const, label: 'Shipping', icon: Truck },
  { id: 'social' as const, label: 'Social', icon: Share2 },
];

export function ChannelsClient() {
  const [activeTab, setActiveTab] = useState<TabType>('pembayaran');

  const tourActiveTab = useChannelsActiveTab();
  const { shouldShowTour } = useTour('channels');
  const { startNextStep } = useNextStep();

  useEffect(() => {
    if (tourActiveTab && TABS.some((t) => t.id === tourActiveTab)) {
      setActiveTab(tourActiveTab as TabType);
    }
  }, [tourActiveTab]);

  useEffect(() => {
    if (!shouldShowTour) return;
    const timer = setTimeout(() => startNextStep('channels'), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-20 bg-background border-b -mx-4 md:-mx-6 lg:-mx-8 mb-6">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center justify-center gap-2 flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pembayaran' && <PembayaranSection />}
      {activeTab === 'pengiriman' && <PengirimanSection />}
      {activeTab === 'social' && <SocialSection />}
    </div>
  );
}