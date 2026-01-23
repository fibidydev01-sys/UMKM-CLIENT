// ══════════════════════════════════════════════════════════════
// CATEGORY FILTER BAR - V17.0 (Hover Dropdown)
// Dropdown appears on HOVER, not click
// Each group shows sub-categories on hover
// No icons/emojis
// ══════════════════════════════════════════════════════════════

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_GROUPS, getCategoriesByGroup } from '@/config/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface CategoryFilterBarProps {
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
  isSticky?: boolean;
}

// Get all groups
const groups = Object.values(CATEGORY_GROUPS);

// ══════════════════════════════════════════════════════════════
// GROUP DROPDOWN COMPONENT (with hover)
// ══════════════════════════════════════════════════════════════

interface GroupDropdownProps {
  group: typeof groups[0];
  selectedCategory: string | null;
  onCategoryClick: (key: string) => void;
}

function GroupDropdown({ group, selectedCategory, onCategoryClick }: GroupDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const subCategories = getCategoriesByGroup(group.key);
  const isGroupActive = subCategories.some(cat => cat.key === selectedCategory);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 shrink-0',
            isGroupActive
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {group.label}
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[220px] max-h-[400px] overflow-y-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {subCategories.map((cat) => (
          <DropdownMenuItem
            key={cat.key}
            onClick={() => onCategoryClick(cat.key)}
            className={cn(
              'cursor-pointer',
              selectedCategory === cat.key && 'bg-accent font-medium'
            )}
          >
            {cat.labelShort}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export function CategoryFilterBar({
  selectedCategory = null,
  onCategorySelect,
  isSticky = false,
}: CategoryFilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Scroll arrows
  const checkScrollArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollArrows();
    container.addEventListener('scroll', checkScrollArrows, { passive: true });
    window.addEventListener('resize', checkScrollArrows);
    return () => {
      container.removeEventListener('scroll', checkScrollArrows);
      window.removeEventListener('resize', checkScrollArrows);
    };
  }, [checkScrollArrows]);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  // Handlers
  const handleCategoryClick = useCallback((categoryKey: string | null) => {
    onCategorySelect?.(categoryKey);
  }, [onCategorySelect]);

  return (
    <div
      className={cn(
        'bg-background border-b transition-all duration-300',
        isSticky && 'sticky top-16 z-40 shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-14">

          {/* Navigation with scroll arrows */}
          <div className="relative flex-1 flex items-center min-w-0">
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-20 h-8 w-8 flex items-center justify-center bg-gradient-to-r from-background via-background to-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-1"
            >
              {/* Discover Button */}
              <button
                onClick={() => handleCategoryClick(null)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 shrink-0',
                  !selectedCategory
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Discover
              </button>

              {/* Hover Dropdown for each Group */}
              {groups.map((group) => (
                <GroupDropdown
                  key={group.key}
                  group={group}
                  selectedCategory={selectedCategory}
                  onCategoryClick={handleCategoryClick}
                />
              ))}
            </div>

            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 z-20 h-8 w-8 flex items-center justify-center bg-gradient-to-l from-background via-background to-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
