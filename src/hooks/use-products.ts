'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useProductsStore } from '@/stores';
import { productsApi, getErrorMessage, isApiError } from '@/lib/api';
import { toast } from '@/providers';
import type { Product, CreateProductInput, UpdateProductInput, ProductQueryParams } from '@/types';

// ==========================================
// USE PRODUCTS HOOK - FIXED
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

  // ✅ FIX: Track if initial fetch done
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  // Initialize filters once
  useEffect(() => {
    if (initialParams && !hasFetched.current) {
      setFilters(initialParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once - intentionally empty

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!isMounted.current) return;

    setLoading(true);

    try {
      const response = await productsApi.getAll(filters);

      if (!isMounted.current) return;

      setProducts(response.data);
      setPagination(response.meta);
    } catch (err) {
      if (!isMounted.current) return;
      setError(getErrorMessage(err));
    }
  }, [filters, setLoading, setProducts, setPagination, setError]);

  // ✅ FIX: Fetch only once on mount, then on filter change
  useEffect(() => {
    isMounted.current = true;

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mount only - intentionally empty

  // ✅ FIX: Separate effect for filter changes (after initial fetch)
  useEffect(() => {
    if (hasFetched.current) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Only when filters change - fetchProducts is stable

  // Fetch categories - only once
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

  // ✅ FIX: Categories fetch once
  const categoriesFetched = useRef(false);
  useEffect(() => {
    if (!categoriesFetched.current) {
      categoriesFetched.current = true;
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once - intentionally empty

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
// USE PRODUCT HOOK - Single product
// ==========================================

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchProduct = async () => {
      if (!id || hasFetched.current) {
        setProduct(null);
        return;
      }

      hasFetched.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const data = await productsApi.getById(id);
        if (isMounted.current) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(getErrorMessage(err));
          setProduct(null);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted.current = false;
    };
  }, [id]);

  const refetch = useCallback(async () => {
    if (!id) return;
    hasFetched.current = false;

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

  return {
    product,
    isLoading,
    error,
    refetch,
  };
}

// ==========================================
// USE CREATE PRODUCT HOOK
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
      if (isApiError(err) && err.isUnauthorized()) {
        console.log('[useDeleteProduct] 401 error, auth redirect will handle');
        return false;
      }

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
// USE STORE PRODUCTS HOOK - Public store
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

  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchProducts = async () => {
      if (!slug || hasFetched.current) return;

      hasFetched.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsApi.getByStore(slug, {
          ...params,
          isActive: true,
        });

        if (isMounted.current) {
          setProducts(response.data);
          setPagination(response.meta);
        }
      } catch (err) {
        if (isMounted.current) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // Only slug change triggers refetch - params intentionally excluded

  const refetch = useCallback(async () => {
    if (!slug) return;

    hasFetched.current = false;
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.getByStore(slug, {
        ...params,
        isActive: true,
      });
      setProducts(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [slug, params]);

  return {
    products,
    pagination,
    isLoading,
    error,
    refetch,
  };
}