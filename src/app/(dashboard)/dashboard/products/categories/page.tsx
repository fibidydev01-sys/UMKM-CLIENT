'use client';

// src/app/(dashboard)/dashboard/products/categories/page.tsx
// Route: /dashboard/products/categories
// Purpose: View and manage product categories (extracted from products)

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tag, Package, ArrowRight, Info } from 'lucide-react';
import { PageHeader } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { productsApi, getErrorMessage } from '@/lib/api';

// ==========================================
// CATEGORIES PAGE (Client Component)
// ==========================================

interface CategoryWithCount {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories with product count
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get all products to extract categories with count
      const response = await productsApi.getAll({ limit: 500 });
      const products = response.data;

      // Count products per category
      const categoryMap = new Map<string, number>();
      products.forEach((product) => {
        if (product.category) {
          const count = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, count + 1);
        }
      });

      // Convert to array and sort
      const categoriesWithCount: CategoryWithCount[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count); // Sort by count descending

      setCategories(categoriesWithCount);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Navigate to products filtered by category
  const viewProductsByCategory = (category: string) => {
    router.push(`/dashboard/products?category=${encodeURIComponent(category)}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Kategori Produk"
          description="Lihat kategori produk yang ada di toko Anda"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageHeader
          title="Kategori Produk"
          description="Lihat kategori produk yang ada di toko Anda"
        />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">Gagal memuat kategori</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchCategories}>
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // Total products count
  const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <>
      <PageHeader
        title="Kategori Produk"
        description="Lihat kategori produk yang ada di toko Anda"
      >
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Package className="h-4 w-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </PageHeader>

      {/* Info Alert */}
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Tentang Kategori</AlertTitle>
        <AlertDescription>
          Kategori dibuat otomatis saat Anda menambah produk dengan kategori baru.
          Untuk menambah kategori, buat produk baru dan ketik nama kategori yang diinginkan.
        </AlertDescription>
      </Alert>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kategori</CardDescription>
            <CardTitle className="text-3xl">{categories.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Produk</CardDescription>
            <CardTitle className="text-3xl">{totalProducts}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Klik kategori untuk melihat produk di dalamnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Belum ada kategori</p>
              <p className="text-sm mt-1">
                Kategori akan muncul saat Anda menambah produk dengan kategori
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/products/new">
                  Tambah Produk Pertama
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => viewProductsByCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.count} produk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {category.count}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Text */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Ingin mengubah nama kategori? Edit produk satu per satu atau hubungi support untuk bulk rename.
        </p>
      </div>
    </>
  );
}