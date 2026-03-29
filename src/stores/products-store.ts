'use client';

import { create } from 'zustand';
import type { Product, ProductQueryParams } from '@/types';

interface ProductsState {
  products: Product[];
  categories: string[];
  filters: ProductQueryParams;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ProductsActions {
  setProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setFilters: (filters: Partial<ProductQueryParams>) => void;
  resetFilters: () => void;
  setSearch: (search: string) => void;
  setCategory: (category: string | undefined) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<ProductsState['pagination']>) => void;
  reset: () => void;
}

type ProductsStore = ProductsState & ProductsActions;

const defaultFilters: ProductQueryParams = {
  search: '',
  category: undefined,
  isActive: undefined,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

const defaultPagination = {
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
};

export const useProductsStore = create<ProductsStore>()((set) => ({
  products: [],
  categories: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,
  pagination: defaultPagination,

  setProducts: (products) => set({ products, error: null }),
  setCategories: (categories) => set({ categories }),

  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => p.id === id ? { ...p, ...updates } : p),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search, page: 1 },
    })),

  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category, page: 1 },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  reset: () =>
    set({
      products: [],
      categories: [],
      filters: defaultFilters,
      isLoading: false,
      error: null,
      pagination: defaultPagination,
    }),
}));

// ==========================================
// SELECTORS
// ==========================================

export const selectProducts = (state: ProductsStore) => state.products;
export const selectCategories = (state: ProductsStore) => state.categories;
export const selectFilters = (state: ProductsStore) => state.filters;
export const selectPagination = (state: ProductsStore) => state.pagination;
export const selectProductsLoading = (state: ProductsStore) => state.isLoading;
export const selectProductsError = (state: ProductsStore) => state.error;

export const selectProductById = (id: string) => (state: ProductsStore) =>
  state.products.find((p) => p.id === id);

export const selectActiveProducts = (state: ProductsStore) =>
  state.products.filter((p) => p.isActive);

// ==========================================
// HOOKS
// ==========================================

export const useProducts = () => useProductsStore(selectProducts);
export const useProductCategories = () => useProductsStore(selectCategories);
export const useProductFilters = () => useProductsStore(selectFilters);
export const useProductPagination = () => useProductsStore(selectPagination);
export const useProductsLoading = () => useProductsStore(selectProductsLoading);
export const useProductsError = () => useProductsStore(selectProductsError);
export const useProductById = (id: string) => useProductsStore(selectProductById(id));
export const useActiveProducts = () => useProductsStore(selectActiveProducts);