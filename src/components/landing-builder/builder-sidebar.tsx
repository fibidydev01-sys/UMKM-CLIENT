/**
 * BuilderSidebar Component
 *
 * Fixed sidebar with 6 section buttons (Hero, About, Products, Testimonials, Contact, CTA)
 * Supports drag & drop to reorder sections
 */

'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Info,
  ShoppingBag,
  MessageSquare,
  Phone,
  Megaphone,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { SectionKey } from '@/types';

// Re-export as SectionType for backward compatibility
export type SectionType = SectionKey;

interface Section {
  id: SectionType;
  label: string;
  icon: typeof Sparkles;
  description: string;
}

const sectionsData: Section[] = [
  {
    id: 'hero',
    label: 'Hero',
    icon: Sparkles,
    description: 'Main banner',
  },
  {
    id: 'about',
    label: 'About',
    icon: Info,
    description: 'About the store',
  },
  {
    id: 'products',
    label: 'Products',
    icon: ShoppingBag,
    description: 'Product catalog',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    description: 'Customer reviews',
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Phone,
    description: 'Contact information',
  },
  {
    id: 'cta',
    label: 'CTA',
    icon: Megaphone,
    description: 'Call to action',
  },
];

interface BuilderSidebarProps {
  activeSection: SectionType;
  onSectionClick: (section: SectionType) => void;
  collapsed?: boolean;
  className?: string;
  sectionOrder: SectionType[];
  onSectionOrderChange: (newOrder: SectionType[]) => void;
  getSectionEnabled: (section: SectionType) => boolean;
  onToggleSection: (section: SectionType, enabled: boolean) => void;
}

interface SortableSectionItemProps {
  section: Section;
  isActive: boolean;
  collapsed: boolean;
  enabled: boolean;
  onSectionClick: (section: SectionType) => void;
  onToggleSection: (section: SectionType, enabled: boolean) => void;
}

function SortableSectionItem({
  section,
  isActive,
  collapsed,
  enabled,
  onSectionClick,
  onToggleSection,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const Icon = section.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          isActive ? 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80' : 'hover:bg-accent hover:text-accent-foreground',
          'w-full h-auto transition-all justify-center items-center gap-2 py-3 px-2',
          isActive && 'bg-primary/10 text-primary hover:bg-primary/15',
          // Always draggable (even when disabled)
          'cursor-grab active:cursor-grabbing',
          // Disabled state = visual only (grayscale + opacity)
          !enabled && 'opacity-50 grayscale'
        )}
        onClick={() => {
          if (!isDragging) {
            onSectionClick(section.id);
          }
        }}
        title={section.label}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSectionClick(section.id);
          }
        }}
      >
        {/* Drag Handle | Separator — inline on hover */}
        {!collapsed && (
          <>
            <div
              className={cn(
                'transition-opacity',
                'opacity-0 group-hover:opacity-100'
              )}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={cn(
              'h-4 w-px bg-border transition-opacity',
              'opacity-0 group-hover:opacity-100'
            )} />
          </>
        )}

        {/* Icon */}
        <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />

        {/* Separator | Toggle */}
        {!collapsed && (
          <>
            <div className="h-4 w-px bg-border" />
            <Switch
              checked={enabled}
              onCheckedChange={(checked) => onToggleSection(section.id, checked)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onPointerDown={(e) => {
                // Prevent drag when clicking toggle
                e.stopPropagation();
              }}
              className="scale-75"
            />
          </>
        )}
      </div>
    </div>
  );
}

export function BuilderSidebar({
  activeSection,
  onSectionClick,
  collapsed = false,
  className,
  sectionOrder,
  onSectionOrderChange,
  getSectionEnabled,
  onToggleSection,
}: BuilderSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Distance-based activation for responsive drag (no delay)
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionType);
      const newIndex = sectionOrder.indexOf(over.id as SectionType);

      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onSectionOrderChange(newOrder);
    }
  };

  const orderedSections = sectionOrder.map(
    (id) => sectionsData.find((s) => s.id === id)!
  );

  return (
    <div
      className={cn(
        'border-r bg-muted/30 p-3 space-y-2 transition-all duration-300',
        collapsed ? 'w-0 p-0 border-0 opacity-0 overflow-hidden' : 'w-36',
        className
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {orderedSections.map((section) => {
            const isActive = activeSection === section.id;
            const enabled = getSectionEnabled(section.id);

            return (
              <SortableSectionItem
                key={section.id}
                section={section}
                isActive={isActive}
                collapsed={collapsed}
                enabled={enabled}
                onSectionClick={onSectionClick}
                onToggleSection={onToggleSection}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}