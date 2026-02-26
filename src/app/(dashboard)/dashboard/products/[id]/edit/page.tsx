'use client';

// src/app/(dashboard)/dashboard/products/[id]/edit/page.tsx
// Route: /dashboard/products/[id]/edit

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/dashboard';
import { ProductForm } from '@/components/products';
import { Button } from '@/components/ui/button';
import { productsApi, getErrorMessage } from '@/lib/api';
import type { Product } from '@/types';

// ==========================================
// EDIT LISTING PAGE
// ==========================================

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setError(null);

      try {
        // Fetch product (blocking — we need this before rendering the form)
        const productData = await productsApi.getById(id);
        setProduct(productData);

        // Fetch categories in background (non-blocking)
        let fetched: string[] = [];
        try {
          fetched = await productsApi.getCategories();
        } catch {
          console.warn('Categories API failed, falling back...');
        }

        if (fetched.length === 0) {
          try {
            const all = await productsApi.getAll({ limit: 200 });
            const unique = new Set<string>();
            all.data.forEach((p) => { if (p.category) unique.add(p.category); });
            fetched = Array.from(unique).sort();
          } catch {
            console.error('Failed to extract categories');
          }
        }

        // Ensure the product's own category is always available
        if (productData.category && !fetched.includes(productData.category)) {
          fetched = [productData.category, ...fetched].sort();
        }

        setCategories(fetched);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(getErrorMessage(err));
      }
    };

    fetchData();
  }, [id]);

  // ── Error / Not found ──────────────────────────────────────
  if (error || (product === null && error !== null)) {
    return (
      <>
        <PageHeader
          title="Listing not found"
          description={error || 'This listing could not be found'}
        />
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </Button>
      </>
    );
  }

  // ── Product not yet loaded — render nothing (no skeleton) ──
  // Form will appear the moment product data is available
  if (!product) return null;

  return (
    <>
      <PageHeader
        title="Edit listing"
        description={`Editing: ${product.name}`}
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}