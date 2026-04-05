import { notFound } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import { getServerHeaders } from '@/lib/api/server-headers';
import { EditProductClient } from './client';

// ==========================================
// EDIT PRODUCT PAGE — Server Component
// Fetch product + categories server-side
// Cookie di-forward via getServerHeaders()
// notFound() kalau product tidak ada
// ==========================================

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProductAndCategories(id: string) {
  const headers = await getServerHeaders();
  const [product, categories] = await Promise.all([
    productsApi.getById(id, headers).catch(() => null),
    productsApi.getCategories(headers).catch((): string[] => []),
  ]);
  return { product, categories };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const { product, categories } = await getProductAndCategories(id);

  if (!product) notFound();

  const mergedCategories: string[] =
    product.category && !categories.includes(product.category)
      ? [product.category, ...categories].sort()
      : categories;

  return <EditProductClient product={product} categories={mergedCategories} />;
}