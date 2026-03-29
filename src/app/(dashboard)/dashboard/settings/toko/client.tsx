'use client';

import { useState } from 'react';
import { Home, FileText, MapPin } from 'lucide-react';
import { cn } from '@/lib/shared/utils';
import { HeroSection } from '@/components/dashboard/settings/hero-section';
import { AboutSection } from '@/components/dashboard/settings/about-section';
import { ContactSection } from '@/components/dashboard/settings/contact-section';

type TabType = 'hero-section' | 'about' | 'contact';

const TABS = [
  { id: 'hero-section' as const, label: 'Bio', icon: Home },
  { id: 'about' as const, label: 'Featured', icon: FileText },
  { id: 'contact' as const, label: 'Contact', icon: MapPin },
];

export function TokoClient() {
  const [activeTab, setActiveTab] = useState<TabType>('hero-section');

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
      {activeTab === 'hero-section' && <HeroSection />}
      {activeTab === 'about' && <AboutSection />}
      {activeTab === 'contact' && <ContactSection />}
    </div>
  );
}