'use client';

// src/app/(dashboard)/dashboard/products/new/page.tsx
// Route: /dashboard/products/new

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard';
import { ProductForm } from '@/components/products';
import { productsApi } from '@/lib/api';

// ==========================================
// NEW LISTING PAGE
// ==========================================

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories in background — form renders immediately
  useEffect(() => {
    const fetchCategories = async () => {
      let fetched: string[] = [];

      try {
        fetched = await productsApi.getCategories();
      } catch {
        console.warn('Categories API failed, falling back to products list...');
      }

      // Fallback: extract from all products
      if (fetched.length === 0) {
        try {
          const all = await productsApi.getAll({ limit: 200 });
          const unique = new Set<string>();
          all.data.forEach((p) => { if (p.category) unique.add(p.category); });
          fetched = Array.from(unique).sort();
        } catch {
          console.error('Failed to extract categories from products');
        }
      }

      setCategories(fetched);
    };

    fetchCategories();
  }, []);

  return (
    <>
      <PageHeader
        title="New listing"
        description="Add a new product or service to your store"
      />
      {/* ✅ Form renders immediately — categories injected when ready */}
      <ProductForm categories={categories} />
    </>
  );
}