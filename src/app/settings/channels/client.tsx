// ══════════════════════════════════════════════════════════════
// CHANNELS CLIENT - Sticky Tabs Wrapper for Wizard Pages
// ══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Search, CreditCard, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import wizard pages as components
import SeoPage from '../seo/page';
import PembayaranPage from '../pembayaran/page';
import PengirimanPage from '../pengiriman/page';

// ══════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════

type TabType = 'pencarian' | 'pembayaran' | 'pengiriman';

const TABS = [
  {
    id: 'pencarian' as const,
    label: 'Pencarian',
    icon: Search,
  },
  {
    id: 'pembayaran' as const,
    label: 'Pembayaran',
    icon: CreditCard,
  },
  {
    id: 'pengiriman' as const,
    label: 'Pengiriman',
    icon: Truck,
  },
];

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT - WRAPPER ONLY
// ══════════════════════════════════════════════════════════════

export function ChannelsClient() {
  const [activeTab, setActiveTab] = useState<TabType>('pencarian');

  return (
    <div>
      {/* ════════════════════════════════════════════════════════ */}
      {/* STICKY TABS                                             */}
      {/* ════════════════════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB CONTENT - Import wizard pages as components         */}
      {/* ════════════════════════════════════════════════════════ */}
      <div>
        {activeTab === 'pencarian' && <SeoPage />}
        {activeTab === 'pembayaran' && <PembayaranPage />}
        {activeTab === 'pengiriman' && <PengirimanPage />}
      </div>
    </div>
  );
}
