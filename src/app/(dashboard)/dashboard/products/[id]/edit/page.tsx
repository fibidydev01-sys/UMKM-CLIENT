'use client';

// src/app/(dashboard)/dashboard/products/[id]/edit/page.tsx
// Route: /dashboard/products/[id]/edit

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/dashboard';
import { ProductForm } from '@/components/products';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { productsApi, getErrorMessage } from '@/lib/api';
import type { Product } from '@/types';

// ==========================================
// EDIT PRODUCT PAGE (Client Component)
// ==========================================

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch product
        const productData = await productsApi.getById(id);
        setProduct(productData);

        // Fetch categories with fallback
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

        // Ensure current product's category is included
        if (productData.category && !fetchedCategories.includes(productData.category)) {
          fetchedCategories = [productData.category, ...fetchedCategories].sort();
        }

        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader title="Edit Produk" description="Memuat data..." />
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

  // Error / Not Found state
  if (error || !product) {
    return (
      <>
        <PageHeader
          title="Produk Tidak Ditemukan"
          description={error || 'Data produk tidak ditemukan'}
        />
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Produk
          </Link>
        </Button>
      </>
    );
  }

  // ✅ Render ProductForm with fetched data
  return (
    <>
      <PageHeader
        title="Edit Produk"
        description={`Mengedit: ${product.name}`}
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}