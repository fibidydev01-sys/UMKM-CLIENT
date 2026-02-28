'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard';
import { ProductForm } from '@/components/products';
import { productsApi } from '@/lib/api';

// ==========================================
// NEW LISTING PAGE
// ==========================================

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories di background — form langsung render
  useEffect(() => {
    const fetchCategories = async () => {
      let fetched: string[] = [];

      try {
        fetched = await productsApi.getCategories();
      } catch {
        console.warn('Gagal fetch categories API, fallback ke daftar produk...');
      }

      // Fallback: ekstrak dari semua produk
      if (fetched.length === 0) {
        try {
          const all = await productsApi.getAll({ limit: 200 });
          const unique = new Set<string>();
          all.data.forEach((p) => { if (p.category) unique.add(p.category); });
          fetched = Array.from(unique).sort();
        } catch {
          console.error('Gagal mengekstrak kategori dari produk');
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
      {/* Form langsung render — categories diinjeksikan saat tersedia */}
      <ProductForm categories={categories} />
    </>
  );
}