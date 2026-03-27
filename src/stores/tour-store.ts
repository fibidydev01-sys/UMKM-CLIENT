'use client';

import { create } from 'zustand';

// ==========================================
// TOUR STORE
// Sync activeTab antara NextStepWrapper
// dan TokoClient / ChannelsClient
// ==========================================

interface TourStoreState {
  tokoActiveTab: string | null;
  channelsActiveTab: string | null;
}

interface TourStoreActions {
  setTokoActiveTab: (tab: string) => void;
  setChannelsActiveTab: (tab: string) => void;
  reset: () => void;
}

type TourStore = TourStoreState & TourStoreActions;

export const useTourStore = create<TourStore>()((set) => ({
  tokoActiveTab: null,
  channelsActiveTab: null,
  setTokoActiveTab: (tab) => set({ tokoActiveTab: tab }),
  setChannelsActiveTab: (tab) => set({ channelsActiveTab: tab }),
  reset: () => set({ tokoActiveTab: null, channelsActiveTab: null }),
}));

export const useTokoActiveTab = () => useTourStore((s) => s.tokoActiveTab);
export const useChannelsActiveTab = () => useTourStore((s) => s.channelsActiveTab);