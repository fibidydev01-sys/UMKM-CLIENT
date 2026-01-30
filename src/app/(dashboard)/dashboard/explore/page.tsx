import type { Metadata } from 'next';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore',
};

export default function ExplorePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Compass className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Explore</h1>
      <p className="text-muted-foreground">Coming Soon</p>
    </div>
  );
}
