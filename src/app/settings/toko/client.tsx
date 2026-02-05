// ══════════════════════════════════════════════════════════════
// TOKO CLIENT - Sticky Tabs Wrapper for Wizard Pages
// ══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Home, FileText, MessageSquare, MapPin, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import wizard pages as components
import HeroSectionPage from '../hero-section/page';
import AboutPage from '../about/page';
import TestimonialsPage from '../testimonials/page';
import ContactPage from '../contact/page';
import CtaPage from '../cta/page';

// ══════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════

type TabType = 'hero-section' | 'about' | 'testimonials' | 'contact' | 'cta';

const TABS = [
  {
    id: 'hero-section' as const,
    label: 'Hero Section',
    icon: Home,
  },
  {
    id: 'about' as const,
    label: 'About',
    icon: FileText,
  },
  {
    id: 'testimonials' as const,
    label: 'Testimonials',
    icon: MessageSquare,
  },
  {
    id: 'contact' as const,
    label: 'Contact',
    icon: MapPin,
  },
  {
    id: 'cta' as const,
    label: 'Call to Action',
    icon: Megaphone,
  },
];

// ══════════════════════════════════════════════════════════════
// MAIN CLIENT COMPONENT - WRAPPER ONLY
// ══════════════════════════════════════════════════════════════

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section');

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
        {activeTab === 'hero-section' && <HeroSectionPage />}
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'testimonials' && <TestimonialsPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'cta' && <CtaPage />}
      </div>
    </div>
  );
}
