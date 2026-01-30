'use client';

import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/format';
import type { Customer } from '@/types';

// ============================================================================
// SKELETON
// ============================================================================

export function CustomerGridCardSkeleton() {
  return (
    <div className="group">
      <Skeleton className="aspect-square w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// CUSTOMER GRID CARD
// Minimal card with avatar, name appears on hover
// ============================================================================

interface CustomerGridCardProps {
  customer: Customer;
  onClick: (customer: Customer) => void;
}

export function CustomerGridCard({ customer, onClick }: CustomerGridCardProps) {
  return (
    <button
      onClick={() => onClick(customer)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted">
        {/* Avatar Center */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl font-semibold">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Hover overlay with name */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-medium text-sm line-clamp-2">
              {customer.name}
            </h3>
            {customer.phone && (
              <p className="text-white/70 text-xs mt-1">{customer.phone}</p>
            )}
          </div>
        </div>

        {/* Order count badge */}
        {customer.totalOrders > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {customer.totalOrders} pesanan
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
