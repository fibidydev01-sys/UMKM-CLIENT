'use client';

import { CheckCircle2 } from 'lucide-react';

interface FeedEndMessageProps {
  totalPosts: number;
}

export function FeedEndMessage({ totalPosts }: FeedEndMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">Kamu sudah lihat semua!</h3>
        <p className="text-sm text-muted-foreground">
          {totalPosts} postingan di feed sudah kamu lihat semua
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          Cek lagi nanti untuk postingan terbaru
        </p>
      </div>
    </div>
  );
}
