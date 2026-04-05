'use client';

import { ProductForm } from '@/components/dashboard/product/form/product';
import type { Product } from '@/types/product';

interface EditProductClientProps {
  product: Product;
  categories: string[];
}

export function EditProductClient({ product, categories }: EditProductClientProps) {
  return <ProductForm product={product} categories={categories} />;
}