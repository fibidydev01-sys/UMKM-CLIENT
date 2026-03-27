'use client';

import { useCallback, useMemo } from 'react';

// ==========================================
// USE TOUR HOOK
// ==========================================

export type TourId =
  | 'onboarding'
  | 'toko'
  | 'channels'
  | 'products_new'
  | 'products_edit';

export const ALL_TOUR_IDS: TourId[] = [
  'onboarding',
  'toko',
  'channels',
  'products_new',
  'products_edit',
];

const STORAGE_KEY = 'fibidy_tours';

function getDefault(): Record<TourId, boolean> {
  return {
    onboarding: false,
    toko: false,
    channels: false,
    products_new: false,
    products_edit: false,
  };
}

function readState(): Record<TourId, boolean> {
  if (typeof window === 'undefined') return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    return { ...getDefault(), ...JSON.parse(raw) };
  } catch {
    return getDefault();
  }
}

function writeState(state: Record<TourId, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* silent */ }
}

// Dipanggil setelah register — semua tour = false (user baru)
export function initTourState(): void {
  writeState(getDefault());
}

// Dipanggil saat onboarding selesai/skip — lock semua tour
export function markAllToursDone(): void {
  const all = ALL_TOUR_IDS.reduce(
    (acc, id) => ({ ...acc, [id]: true }),
    {} as Record<TourId, boolean>
  );
  writeState(all);
}

// Dipanggil saat tour individual selesai/skip
export function markTourDone(tourId: TourId): void {
  const state = readState();
  state[tourId] = true;
  writeState(state);
}

// Hook untuk cek apakah tour perlu ditampilkan
export function useTour(tourId: TourId) {
  const shouldShowTour = useMemo(() => {
    const state = readState();
    return state[tourId] === false;
  }, [tourId]);

  const markDone = useCallback(() => {
    markTourDone(tourId);
  }, [tourId]);

  return { shouldShowTour, markDone };
}