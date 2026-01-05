'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// ==========================================
// CATEGORY LIST COMPONENT
// Horizontal scrollable category chips
// ==========================================

interface CategoryListProps {
  categories: string[];
  storeSlug: string;
  currentCategory?: string;
}

export function CategoryList({
  categories,
  storeSlug,
  currentCategory,
}: CategoryListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset page on category change

    router.push(`/store/${storeSlug}/products?${params.toString()}`);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {/* All Category */}
        <Button
          variant={!currentCategory ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => handleCategoryClick(null)}
        >
          Semua
        </Button>

        {/* Category Chips */}
        {categories.map((category) => (
          <Button
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}