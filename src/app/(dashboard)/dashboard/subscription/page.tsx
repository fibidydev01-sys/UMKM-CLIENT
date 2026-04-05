import { subscriptionApi } from '@/lib/api/subscription';
import { getServerHeaders } from '@/lib/api/server-headers';
import { SubscriptionClient } from './client';

// ==========================================
// SUBSCRIPTION PAGE — Server Component
// Fetch plan + payment history server-side
// Cookie di-forward via getServerHeaders()
// Pass sebagai initialData ke TanStack Query
// ==========================================

async function getSubscriptionData() {
  const headers = await getServerHeaders();
  const [planInfo, payments] = await Promise.all([
    subscriptionApi.getMyPlan(headers).catch(() => null),
    subscriptionApi.getPaymentHistory(headers).catch((): [] => []),
  ]);
  return { planInfo, payments };
}

export default async function SubscriptionPage() {
  const { planInfo, payments } = await getSubscriptionData();

  return (
    <SubscriptionClient
      initialPlan={planInfo}
      initialPayments={payments}
    />
  );
}