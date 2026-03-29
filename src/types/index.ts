// ==========================================
// TYPES INDEX
// ==========================================

export * from './api';
export * from './auth';
export * from './tenant';
export * from './product';
export * from './category';
export * from './landing';
export * from './admin';

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type ID = string;