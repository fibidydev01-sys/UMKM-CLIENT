'use client';

import { useCallback } from 'react';
import { NextStepProvider, NextStep } from 'nextstepjs';
import { useTourStore } from '@/stores/tour-store';
import { markAllToursDone, markTourDone, TourId } from '@/hooks/dashboard/use-tour';
import { TOUR_STEPS, TOKO_TAB_MAP, CHANNELS_TAB_MAP } from '@/lib/dashboard/tour-steps';

// ==========================================
// NEXTSTEP WRAPPER
// Dipasang di DashboardLayout (client component)
// Handles: tab sync, mark tour done/skip
// ==========================================

interface NextStepWrapperProps {
  children: React.ReactNode;
}

export function NextStepWrapper({ children }: NextStepWrapperProps) {
  const { setTokoActiveTab, setChannelsActiveTab } = useTourStore();

  // Sync tab saat step berubah
  const handleStepChange = useCallback(
    (step: number, tourName: string | null) => {
      if (tourName === 'toko') {
        const tab = TOKO_TAB_MAP[step];
        if (tab) setTokoActiveTab(tab);
      }
      if (tourName === 'channels') {
        const tab = CHANNELS_TAB_MAP[step];
        if (tab) setChannelsActiveTab(tab);
      }
    },
    [setTokoActiveTab, setChannelsActiveTab]
  );

  // Tour selesai
  const handleComplete = useCallback((tourName: string | null) => {
    if (!tourName) return;
    if (tourName === 'onboarding') {
      markAllToursDone(); // lock semua tour lain
    } else {
      markTourDone(tourName as TourId);
    }
  }, []);

  // Tour di-skip
  const handleSkip = useCallback((_step: number, tourName: string | null) => {
    if (!tourName) return;
    if (tourName === 'onboarding') {
      markAllToursDone(); // lock semua tour lain
    } else {
      markTourDone(tourName as TourId);
    }
  }, []);

  return (
    <NextStepProvider>
      <NextStep
        steps={TOUR_STEPS}
        onStepChange={handleStepChange}
        onComplete={handleComplete}
        onSkip={handleSkip}
      >
        {children}
      </NextStep>
    </NextStepProvider>
  );
}