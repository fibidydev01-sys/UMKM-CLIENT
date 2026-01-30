// ==========================================
// TYPES INDEX - Export all types
// ==========================================

// API Types
export * from './api';

// Auth Types
export * from './auth';

// Tenant Types
export * from './tenant';

// Product Types
export * from './product';

// Customer Types
export * from './customer';

// Order Types
export * from './order';

// Landing Types
export * from './landing';

// Discover Types
export * from './discover';

// Chat Types (WhatsApp)
export * from './chat';

// ==========================================
// COMMON UTILITY TYPES
// ==========================================

/**
 * Make all properties optional except specified keys
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

/**
 * Make specified properties required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * ID type (CUID string)
 */
export type ID = string;
