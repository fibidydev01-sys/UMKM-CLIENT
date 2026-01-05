'use client';

// src/app/(dashboard)/dashboard/products/new/page.tsx
// Route: /dashboard/products/new

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard';
import { ProductForm } from '@/components/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { productsApi } from '@/lib/api';

// ==========================================
// CREATE PRODUCT PAGE (Client Component)
// ==========================================

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);

      let fetchedCategories: string[] = [];

      try {
        fetchedCategories = await productsApi.getCategories();
      } catch {
        console.warn('Categories API failed, extracting from products...');
      }

      // Fallback if API returns empty
      if (fetchedCategories.length === 0) {
        try {
          const allProducts = await productsApi.getAll({ limit: 200 });
          const uniqueCategories = new Set<string>();
          allProducts.data.forEach((p) => {
            if (p.category) uniqueCategories.add(p.category);
          });
          fetchedCategories = Array.from(uniqueCategories).sort();
        } catch {
          console.error('Failed to extract categories');
        }
      }

      setCategories(fetchedCategories);
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Tambah Produk"
          description="Tambah produk baru ke toko Anda"
        />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // ✅ Render ProductForm (categories optional)
  return (
    <>
      <PageHeader
        title="Tambah Produk"
        description="Tambah produk baru ke toko Anda"
      />
      <ProductForm categories={categories} />
    </>
  );
}