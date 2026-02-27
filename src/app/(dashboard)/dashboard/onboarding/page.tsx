import type { Metadata } from 'next';
import { OnboardingClient } from './client';

export const metadata: Metadata = {
  title: 'Store Setup',
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}