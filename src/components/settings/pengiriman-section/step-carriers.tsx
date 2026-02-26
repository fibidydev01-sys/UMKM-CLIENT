'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Courier, PengirimanFormData } from '@/types';

// ─── Region Grouping Data ──────────────────────────────────────────────────
/**
 * ✅ UPDATED Feb 2026 — Verified ASEAN courier groupings
 * 
 * Based on market research Q4 2025 / Q1 2026
 * Reflects actual operational presence per country
 * 
 * Changes:
 * - Indonesia: Removed AnterAja, ID Express, SAP Express
 * - Malaysia: Removed Flash Express (closed 31 Jan 2026)
 * - Thailand: Removed Nim Express, added Flash Express (active & profitable)
 * - Singapore: Added Lalamove (on-demand leader)
 * - Philippines: Added JRS Express (65+ years, 450+ branches)
 * - Vietnam: No Ninja Van (suspended Sep 2024)
 * - Brunei: Added Pos Brunei (national postal monopoly)
 */
interface RegionGroup {
  key: string;
  label: string;
  flag: string;
  courierIds: string[]; // matches courier.id = name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// IDs are derived from: name.toLowerCase().replace(/[^a-z0-9]/g, '')
const REGION_GROUPS: RegionGroup[] = [
  {
    key: 'id',
    label: 'Indonesia',
    flag: '🇮🇩',
    courierIds: [
      'jne',              // Market leader, 8000+ points
      'jtexpress',        // Revenue +37%, 3M parcels/day
      'sicepat',          // 500+ cities, profitable
      'spxexpress',       // Shopee in-house
      'ninjaexpress',     // 2M+ merchants
      'paxel',            // Same-day specialist
      'lionparcel',       // Cold chain
      'posindonesia',     // BUMN, widest coverage
      'tiki',             // Since 1970
    ],
  },
  {
    key: 'my',
    label: 'Malaysia',
    flag: '🇲🇾',
    courierIds: [
      'poslaju',          // Only rural Sabah/Sarawak
      'gdex',             // B2B, East Malaysia
      'citylinkexpress',  // Since 1979, East specialist
    ],
  },
  {
    key: 'th',
    label: 'Thailand',
    flag: '🇹🇭',
    courierIds: [
      'thailandpost',     // Market leader by volume
      'flashexpress',     // #2, profitable 2025
      'kerryexpress',     // ⚠️ Restructuring (rebranded to KEX)
    ],
  },
  {
    key: 'sg',
    label: 'Singapore',
    flag: '🇸🇬',
    courierIds: [
      'singpost',         // National post
      'lalamove',         // On-demand same-day
    ],
  },
  {
    key: 'ph',
    label: 'Philippines',
    flag: '🇵🇭',
    courierIds: [
      'lbcexpress',       // 36% market share, 6400+ outlets
      '2goexpress',       // FedEx retail partner
      'jrsexpress',       // 65+ years, 450+ branches
    ],
  },
  {
    key: 'vn',
    label: 'Vietnam',
    flag: '🇻🇳',
    courierIds: [
      'ghn',              // AI suite 2025
      'ghtk',             // E-commerce specialist
      'viettelpost',      // Largest daily delivery
    ],
  },
  {
    key: 'bn',
    label: 'Brunei',
    flag: '🇧🇳',
    courierIds: [
      'posbrunei',        // National postal monopoly
    ],
  },
  {
    key: 'asean',
    label: 'ASEAN Cross-region',
    flag: '🌏',
    courierIds: [
      'ninjavan',         // Active: MY, SG, PH, TH, ID (not VN!)
      'dhlexpress',       // All ASEAN
    ],
  },
];

// ─── Props ─────────────────────────────────────────────────────────────────
interface StepCarriersProps {
  formData: PengirimanFormData;
  onToggle: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
  isDesktop?: boolean;
}

// ─── Single Carrier Row ────────────────────────────────────────────────────
function CarrierRow({
  courier,
  onToggle,
  onNoteChange,
  compact = false,
}: {
  courier: Courier;
  onToggle: () => void;
  onNoteChange: (note: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-200',
        courier.enabled
          ? 'bg-background border-border'
          : 'bg-muted/20 border-border/50 opacity-60',
        compact ? 'px-3 py-2.5' : 'px-4 py-3'
      )}
    >
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Switch
            checked={courier.enabled}
            onCheckedChange={onToggle}
            className="shrink-0"
          />
          <span
            className={cn(
              'font-medium tracking-tight truncate',
              compact ? 'text-sm' : 'text-[13px]',
              courier.enabled ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {courier.name}
          </span>
        </div>
        {courier.enabled && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            Active
          </span>
        )}
      </div>

      {/* Note field — only when enabled */}
      {courier.enabled && (
        <div className={cn('mt-2', compact ? 'ml-9' : 'ml-10')}>
          <Input
            placeholder="Optional note (REG, YES, OKE...)"
            value={courier.note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            className="h-8 text-xs placeholder:text-muted-foreground/40 border-dashed"
          />
        </div>
      )}
    </div>
  );
}

// ─── Region Section ────────────────────────────────────────────────────────
function RegionSection({
  group,
  couriers,
  onToggle,
  onNoteChange,
  compact = false,
  defaultOpen = false,
}: {
  group: RegionGroup;
  couriers: Courier[];
  onToggle: (id: string) => void;
  onNoteChange: (id: string, note: string) => void;
  compact?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (couriers.length === 0) return null;

  const activeCount = couriers.filter((c) => c.enabled).length;
  const hasActive = activeCount > 0;

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Header — clickable to toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 transition-colors',
          'hover:bg-muted/40 focus-visible:outline-none',
          isOpen ? 'bg-muted/30' : 'bg-muted/10'
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base leading-none">{group.flag}</span>
          <span className="text-sm font-semibold tracking-tight">{group.label}</span>
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums shrink-0',
              hasActive
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {activeCount}/{couriers.length}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Courier grid — shown when open */}
      {isOpen && (
        <div
          className={cn(
            'p-3 border-t border-border/40',
            compact ? 'space-y-2' : 'grid grid-cols-2 gap-2.5'
          )}
        >
          {couriers.map((courier) => (
            <CarrierRow
              key={courier.id}
              courier={courier}
              onToggle={() => onToggle(courier.id)}
              onNoteChange={(note) => onNoteChange(courier.id, note)}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function StepCarriers({
  formData,
  onToggle,
  onNoteChange,
  isDesktop = false,
}: StepCarriersProps) {
  const couriers = formData.shippingMethods.couriers;
  const activeCount = couriers.filter((c) => c.enabled).length;

  // Map couriers into their region groups
  const getCouriersForGroup = (group: RegionGroup): Courier[] =>
    group.courierIds
      .map((id) => couriers.find((c) => c.id === id))
      .filter((c): c is Courier => c !== undefined);

  // ── DESKTOP ─────────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
            Shipping Carriers
          </p>
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
              activeCount > 0
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {activeCount} active / {couriers.length}
          </span>
        </div>

        {/* Region Groups */}
        <div className="space-y-2.5">
          {REGION_GROUPS.map((group) => {
            const groupCouriers = getCouriersForGroup(group);
            const hasActive = groupCouriers.some((c) => c.enabled);
            return (
              <RegionSection
                key={group.key}
                group={group}
                couriers={groupCouriers}
                onToggle={onToggle}
                onNoteChange={onNoteChange}
                compact={false}
                // Indonesia open by default; others open if they have active couriers
                defaultOpen={group.key === 'id' || hasActive}
              />
            );
          })}
        </div>

        {/* Tip */}
        <div className="border-l-2 border-muted-foreground/20 pl-4 py-0.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Tip:</span>{' '}
            Only enable carriers you actually use — active carriers are shown to customers at
            checkout. Add optional notes to describe available services (REG, YES, OKE, etc.).
          </p>
        </div>
      </div>
    );
  }

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-3">

      {/* Counter */}
      <div className="flex items-center gap-2 self-center">
        <p className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          Carriers
        </p>
        <span
          className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full tabular-nums',
            activeCount > 0
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {activeCount}/{couriers.length} active
        </span>
      </div>

      {/* Region Groups */}
      <div className="w-full max-w-sm space-y-2">
        {REGION_GROUPS.map((group) => {
          const groupCouriers = getCouriersForGroup(group);
          const hasActive = groupCouriers.some((c) => c.enabled);
          return (
            <RegionSection
              key={group.key}
              group={group}
              couriers={groupCouriers}
              onToggle={onToggle}
              onNoteChange={onNoteChange}
              compact
              defaultOpen={group.key === 'id' || hasActive}
            />
          );
        })}
      </div>
    </div>
  );
}