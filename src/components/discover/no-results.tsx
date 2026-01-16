// ══════════════════════════════════════════════════════════════
// NO RESULTS STATE
// Extracted from discover/client.tsx
// ══════════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

interface NoResultsProps {
  query: string;
  onClear: () => void;
}

export function NoResults({ query, onClear }: NoResultsProps) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Tidak ada UMKM dengan kata kunci <strong>&ldquo;{query}&rdquo;</strong>.
        <br />
        Coba kata kunci lain atau jelajahi kategori.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="outline" onClick={onClear}>
          Hapus Pencarian
        </Button>
        <Button asChild>
          <Link href="/discover">Jelajahi Semua UMKM</Link>
        </Button>
      </div>
    </div>
  );
}