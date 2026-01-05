'use client';

import { useState, useCallback, useEffect } from 'react';
import { useProductsStore } from '@/stores';
import { productsApi, getErrorMessage, isApiError } from '@/lib/api';
import { toast } from '@/providers';
import type { Product, CreateProductInput, UpdateProductInput, ProductQueryParams } from '@/types';

// ==========================================
// USE PRODUCTS HOOK
// Products list with filters & pagination
// ==========================================

export function useProducts(initialParams?: ProductQueryParams) {
  const {
    products,
    filters,
    pagination,
    isLoading,
    error,
    setProducts,
    setFilters,
    setPagination,
    setLoading,
    setError,
    setCategories,
  } = useProductsStore();

  // Initialize filters
  useEffect(() => {
    if (initialParams) {
      setFilters(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const response = await productsApi.getAll(filters);
      setProducts(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [filters, setLoading, setProducts, setPagination, setError]);

  // Fetch on filter change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch categories with fallback
  const fetchCategories = useCallback(async () => {
    try {
      const categories = await productsApi.getCategories();
      if (Array.isArray(categories) && categories.length > 0) {
        setCategories(categories);
        return;
      }
    } catch (err) {
      console.warn('Categories API failed, extracting from products...', err);
    }

    // Fallback: extract from loaded products
    const currentProducts = useProductsStore.getState().products;
    if (currentProducts.length > 0) {
      const extracted = [...new Set(
        currentProducts
          .map(p => p.category)
          .filter((c): c is string => Boolean(c))
      )].sort();

      if (extracted.length > 0) {
        setCategories(extracted);
      }
    }
  }, [setCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    products,
    filters,
    pagination,
    isLoading,
    error,
    setFilters,
    refetch: fetchProducts,
  };
}

// ==========================================
// USE PRODUCT HOOK
// Single product by ID
// ==========================================

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await productsApi.getById(id);
      setProduct(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

// ==========================================
// USE CREATE PRODUCT HOOK
// Create product mutation
// ==========================================

export function useCreateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const { addProduct } = useProductsStore();

  const createProduct = useCallback(async (data: CreateProductInput) => {
    setIsLoading(true);

    try {
      const product = await productsApi.create(data);
      addProduct(product);
      toast.success('Produk berhasil ditambahkan');
      return product;
    } catch (err) {
      toast.error('Gagal menambahkan produk', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addProduct]);

  return {
    createProduct,
    isLoading,
  };
}

// ==========================================
// USE UPDATE PRODUCT HOOK
// Update product mutation
// ==========================================

export function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const { updateProduct: updateInStore } = useProductsStore();

  const updateProduct = useCallback(async (id: string, data: UpdateProductInput) => {
    setIsLoading(true);

    try {
      const product = await productsApi.update(id, data);
      updateInStore(id, product);
      toast.success('Produk berhasil diperbarui');
      return product;
    } catch (err) {
      toast.error('Gagal memperbarui produk', getErrorMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [updateInStore]);

  return {
    updateProduct,
    isLoading,
  };
}

// ==========================================
// USE DELETE PRODUCT HOOK
// ✅ FIXED: Better error handling, don't swallow 401
// ==========================================

export function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const { removeProduct } = useProductsStore();

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      await productsApi.delete(id);
      removeProduct(id);
      toast.success('Produk berhasil dihapus');
      return true;
    } catch (err) {
      // ✅ Check if it's a 401 error - don't show toast, let redirect happen
      if (isApiError(err) && err.isUnauthorized()) {
        console.log('[useDeleteProduct] 401 error, auth redirect will handle');
        // Don't show error toast for 401 - user will be redirected
        return false;
      }

      // Show error for other errors
      toast.error('Gagal menghapus produk', getErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [removeProduct]);

  return {
    deleteProduct,
    isLoading,
  };
}

// ==========================================
// USE STORE PRODUCTS HOOK
// Products for public store (by slug)
// ==========================================

export function useStoreProducts(slug: string, params?: ProductQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.getByStore(slug, {
        ...params,
        isActive: true, // Only active products for store
      });
      setProducts(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [slug, params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}