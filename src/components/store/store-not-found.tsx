import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoreNotFoundProps {
  slug?: string;
}

export function StoreNotFound({ slug }: StoreNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">
            <Store className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>

        <p className="text-muted-foreground mb-6">
          {slug ? (
            <>
              The store <span className="font-medium">&quot;{slug}&quot;</span> does not
              exist or is no longer active.
            </>
          ) : (
            'The store you are looking for does not exist or is no longer active.'
          )}
        </p>
      </div>
    </div>
  );
}