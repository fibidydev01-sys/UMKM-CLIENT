// ══════════════════════════════════════════════════════════════
// SEARCH RESULTS HEADER
// Extracted from discover/client.tsx
// ══════════════════════════════════════════════════════════════

'use client';

import { Button } from '@/components/ui/button';

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

interface SearchResultsHeaderProps {
  query: string;
  resultCount: number;
  onClear: () => void;
}

export function SearchResultsHeader({
  query,
  resultCount,
  onClear,
}: SearchResultsHeaderProps) {
  return (
    <div className="pt-20 pb-6 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Hasil pencarian: <span className="text-primary">&ldquo;{query}&rdquo;</span>
            </h1>
            <p className="text-muted-foreground">
              {resultCount > 0 ? `${resultCount} UMKM ditemukan` : 'Tidak ada hasil'}
            </p>
          </div>
          <Button variant="outline" onClick={onClear} className="shrink-0">
            Hapus Pencarian
          </Button>
        </div>
      </div>
    </div>
  );
}