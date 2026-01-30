import type { Metadata } from 'next';
import { OnboardingClient } from './client';

export const metadata: Metadata = {
  title: 'Setup Toko',
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
