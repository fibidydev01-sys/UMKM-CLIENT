/**
 * Landing Builder Layout
 *
 * Minimal layout for full-screen builder experience
 * Protected with AuthGuard - requires authentication
 */

import { AuthGuard } from '@/components/auth';

export default function LandingBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth redirectTo="/login">
      <div className="h-screen w-screen overflow-hidden">
        {children}
      </div>
    </AuthGuard>
  );
}
