// ══════════════════════════════════════════════════════════════
// DISCOVER SEARCH - V11.0 NO ICONS
// Removed: ALL lucide react icons
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';
import { getCategoryList } from '@/constants';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface SearchSuggestion {
  type: 'category' | 'trending' | 'recent';
  label: string;
  value: string;
  slug?: string;
}

interface DiscoverSearchProps {
  placeholder?: string;
  size?: 'default' | 'lg' | 'hero';
  autoFocus?: boolean;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════

const RECENT_SEARCHES_KEY = 'fibidy_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function categoryKeyToSlug(key: string): string {
  return key.toLowerCase().replace(/_/g, '-');
}

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore
  }
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export function DiscoverSearch({
  placeholder = 'Cari UMKM, produk, atau jasa...',
  size = 'default',
  autoFocus = false,
  showSuggestions = true,
  onSearch,
  defaultValue = '',
  className,
}: DiscoverSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const categories = useMemo(() => getCategoryList(), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = useMemo((): SearchSuggestion[] => {
    const result: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase().trim();

    if (queryLower) {
      const matchingCategories = categories
        .filter(
          (cat) =>
            cat.label.toLowerCase().includes(queryLower) ||
            cat.labelShort.toLowerCase().includes(queryLower)
        )
        .slice(0, 4)
        .map((cat): SearchSuggestion => ({
          type: 'category',
          label: cat.label,
          value: cat.label,
          slug: categoryKeyToSlug(cat.key),
        }));

      result.push(...matchingCategories);

      if (!matchingCategories.some((c) => c.label.toLowerCase() === queryLower)) {
        result.push({
          type: 'trending',
          label: `Cari "${query}"`,
          value: query,
        });
      }
    } else {
      const popularCategories = categories.slice(0, 4).map((cat): SearchSuggestion => ({
        type: 'category',
        label: cat.label,
        value: cat.label,
        slug: categoryKeyToSlug(cat.key),
      }));

      result.push(...popularCategories);
    }

    return result;
  }, [query, categories, recentSearches]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;

      const matchingCategory = categories.find(
        (cat) =>
          cat.label.toLowerCase() === trimmed.toLowerCase() ||
          cat.labelShort.toLowerCase() === trimmed.toLowerCase()
      );

      setIsFocused(false);

      if (matchingCategory) {
        router.push(`/discover/${categoryKeyToSlug(matchingCategory.key)}`);
      } else {
        saveRecentSearch(trimmed);
        setRecentSearches(getRecentSearches());
        onSearch?.(trimmed);
        router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [categories, onSearch, router]
  );

  const handleCategoryClick = useCallback(
    (slug: string) => {
      setIsFocused(false);
      router.push(`/discover/${slug}`);
    },
    [router]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      if (suggestion.type === 'category' && suggestion.slug) {
        handleCategoryClick(suggestion.slug);
      } else {
        setQuery(suggestion.value);
        handleSearch(suggestion.value);
      }
    },
    [handleCategoryClick, handleSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch(query);
      }
    },
    [handleSearch, handleSuggestionClick, query, selectedIndex, suggestions]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions || !isFocused || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Escape':
          setIsFocused(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, isFocused, suggestions.length]
  );

  // ════════════════════════════════════════════════════════════
  // SIZE CLASSES
  // ════════════════════════════════════════════════════════════

  const sizeClasses = {
    default: 'h-10',
    lg: 'h-12',
    hero: 'h-14 text-base',
  };

  const showDropdown = showSuggestions && isFocused && suggestions.length > 0;
  const isActive = isHovered || isFocused;

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ isolation: 'isolate' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          {/* Soft Glow */}
          <div
            className={cn(
              'absolute -inset-0.5 rounded-full',
              'bg-primary/15 blur-sm',
              'transition-opacity duration-200',
              isActive ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* Input */}
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            className={cn(
              'relative px-5 pr-20 rounded-full',
              'transition-all duration-200',
              sizeClasses[size],
              !isActive && 'bg-muted/50 border-transparent',
              isActive && [
                'bg-background',
                'border-primary/25',
                'shadow-sm',
              ]
            )}
          />

          {/* Clear / Submit */}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-4 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              Hapus
            </button>
          ) : (
            <Button
              type="submit"
              size="sm"
              className={cn(
                'absolute right-2 rounded-full z-10',
                size === 'hero' ? 'h-10 px-4' : 'h-7 px-3 text-xs'
              )}
            >
              Cari
            </Button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-2',
            'bg-background rounded-2xl border shadow-xl',
            'overflow-hidden'
          )}
          style={{ zIndex: 99999 }}
        >
          <div className="py-2 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const isSelected = index === selectedIndex;

              if (
                index > 0 &&
                suggestion.type === 'category' &&
                suggestions[index - 1].type !== 'category'
              ) {
                return (
                  <div key={`header-${index}`}>
                    <div className="px-4 py-2 border-t mt-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Kategori
                      </span>
                    </div>
                    <SuggestionItem
                      suggestion={suggestion}
                      isSelected={isSelected}
                      onClick={() => handleSuggestionClick(suggestion)}
                    />
                  </div>
                );
              }

              return (
                <SuggestionItem
                  key={`${suggestion.type}-${suggestion.value}-${index}`}
                  suggestion={suggestion}
                  isSelected={isSelected}
                  onClick={() => handleSuggestionClick(suggestion)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENT — No icons
// ══════════════════════════════════════════════════════════════

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  isSelected: boolean;
  onClick: () => void;
}

function SuggestionItem({ suggestion, isSelected, onClick }: SuggestionItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between px-4 py-2.5 text-left',
        'transition-colors duration-150',
        isSelected
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted text-foreground'
      )}
    >
      <span className="text-sm font-medium truncate">{suggestion.label}</span>

      {suggestion.type === 'category' && (
        <Badge variant="secondary" className="shrink-0 text-xs ml-2">
          Kategori
        </Badge>
      )}
    </button>
  );
}

export default DiscoverSearch;