// ══════════════════════════════════════════════════════════════
// DISCOVER SEARCH - V10.9.1 SUBTLE
// Hover: ONLY soft glow border, NO animation/scale
// ══════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  X,
  TrendingUp,
  Clock,
  ArrowRight,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { getCategoryList } from '@/config/categories';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface SearchSuggestion {
  type: 'category' | 'trending' | 'recent';
  label: string;
  value: string;
  icon?: LucideIcon;
  color?: string;
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

const TRENDING_SEARCHES: SearchSuggestion[] = [
  { type: 'trending', label: 'Warung Makan', value: 'warung makan' },
  { type: 'trending', label: 'Laundry Kiloan', value: 'laundry kiloan' },
  { type: 'trending', label: 'Bengkel Motor', value: 'bengkel motor' },
  { type: 'trending', label: 'Salon Kecantikan', value: 'salon kecantikan' },
  { type: 'trending', label: 'Catering', value: 'catering' },
];

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
          icon: cat.icon,
          color: cat.color,
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
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 3).map((s) => ({
        type: 'recent',
        label: s,
        value: s,
      }));

      if (recentSuggestions.length > 0) {
        result.push(...recentSuggestions);
      }

      result.push(...TRENDING_SEARCHES.slice(0, 5 - recentSuggestions.length));

      const popularCategories = categories.slice(0, 4).map((cat): SearchSuggestion => ({
        type: 'category',
        label: cat.label,
        value: cat.label,
        icon: cat.icon,
        color: cat.color,
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

      saveRecentSearch(trimmed);
      setRecentSearches(getRecentSearches());
      setIsFocused(false);

      onSearch?.(trimmed);
      router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
    },
    [onSearch, router]
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

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // ════════════════════════════════════════════════════════════
  // SIZE CLASSES
  // ════════════════════════════════════════════════════════════

  const sizeClasses = {
    default: 'h-10',
    lg: 'h-12',
    hero: 'h-14 text-base',
  };

  const iconSizes = {
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
    hero: 'h-5 w-5',
  };

  const showDropdown = showSuggestions && isFocused && suggestions.length > 0;

  // Active state = hovered OR focused
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
        {/* ══════════════════════════════════════════════════════ */}
        {/* SEARCH INPUT WRAPPER - NO animation, just glow        */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="relative flex items-center">
          {/* ════════════════════════════════════════════════════ */}
          {/* SOFT GLOW - Very subtle, behind input               */}
          {/* ════════════════════════════════════════════════════ */}
          <div
            className={cn(
              'absolute -inset-0.5 rounded-full',
              'bg-primary/15 blur-sm',
              'transition-opacity duration-200',
              isActive ? 'opacity-100' : 'opacity-0'
            )}
          />

          {/* ════════════════════════════════════════════════════ */}
          {/* SEARCH ICON - just color change, no scale           */}
          {/* ════════════════════════════════════════════════════ */}
          <Search
            className={cn(
              'absolute left-4 pointer-events-none z-10',
              'transition-colors duration-200',
              iconSizes[size],
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />

          {/* ════════════════════════════════════════════════════ */}
          {/* INPUT FIELD - subtle border glow only               */}
          {/* ════════════════════════════════════════════════════ */}
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
              'relative pl-12 pr-12 rounded-full',
              'transition-all duration-200',
              sizeClasses[size],
              // Default state
              !isActive && 'bg-muted/50 border-transparent',
              // Hover/Focus state - SUBTLE glow only
              isActive && [
                'bg-background',
                'border-primary/25',
                'shadow-sm',
              ]
            )}
          />

          {/* ════════════════════════════════════════════════════ */}
          {/* CLEAR / SUBMIT BUTTON                               */}
          {/* ════════════════════════════════════════════════════ */}
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
            >
              <X className={cn('text-muted-foreground', iconSizes[size])} />
            </button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className={cn(
                'absolute right-2 rounded-full z-10',
                size === 'hero' ? 'h-10 w-10' : 'h-8 w-8'
              )}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* ══════════════════════════════════════════════════════ */}
      {/* DROPDOWN                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      {showDropdown && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-2',
            'bg-background rounded-2xl border shadow-xl',
            'overflow-hidden'
          )}
          style={{ zIndex: 99999 }}
        >
          {!query && recentSearches.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Pencarian Terakhir
              </span>
              <button
                onClick={handleClearRecent}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hapus Semua
              </button>
            </div>
          )}

          {!query && recentSearches.length === 0 && (
            <div className="px-4 py-2 border-b bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                Trending
              </span>
            </div>
          )}

          <div className="py-2 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon || (suggestion.type === 'recent' ? Clock : TrendingUp);
              const isSelected = index === selectedIndex;

              if (
                index > 0 &&
                suggestion.type === 'category' &&
                suggestions[index - 1].type !== 'category'
              ) {
                return (
                  <div key={`header-${index}`}>
                    <div className="px-4 py-2 border-t mt-1">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <Store className="h-3 w-3" />
                        Kategori
                      </span>
                    </div>
                    <SuggestionItem
                      suggestion={suggestion}
                      Icon={Icon}
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
                  Icon={Icon}
                  isSelected={isSelected}
                  onClick={() => handleSuggestionClick(suggestion)}
                />
              );
            })}
          </div>

          <div className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Tekan Enter untuk mencari
            </span>
            <Link
              href="/discover"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua UMKM
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENT - Also subtle, no animation
// ══════════════════════════════════════════════════════════════

interface SuggestionItemProps {
  suggestion: SearchSuggestion;
  Icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
}

function SuggestionItem({ suggestion, Icon, isSelected, onClick }: SuggestionItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left',
        'transition-colors duration-150',
        isSelected
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-muted text-foreground'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          suggestion.type === 'category' ? 'bg-opacity-20' : 'bg-muted'
        )}
        style={{
          backgroundColor: suggestion.color ? `${suggestion.color}20` : undefined,
        }}
      >
        <Icon
          className="h-4 w-4"
          style={{ color: suggestion.color || 'currentColor' }}
        />
      </div>

      <span className="flex-1 truncate text-sm font-medium">{suggestion.label}</span>

      {suggestion.type === 'category' && (
        <Badge variant="secondary" className="shrink-0 text-xs">
          Kategori
        </Badge>
      )}

      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

export default DiscoverSearch;