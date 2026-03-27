// ==========================================
// STORES INDEX
// ==========================================

export {
  useAuthStore,
  useIsAuthenticated,
  useAuthChecked,
  useAuthHydrated,
  useCurrentTenant,
  useAuthLoading,
  selectTenant,
  selectIsLoading,
  selectIsChecked,
} from './auth-store';

export {
  useCartStore,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartIsEmpty,
  selectCartIsHydrated,
  selectCartItem,
  selectItemQty,
  useCartItems,
  useCartTotalItems,
  useCartTotalPrice,
  useCartIsEmpty,
  useCartHydrated,
  useCartItem,
  useItemQty,
  useCartActions,
} from './cart-store';

export {
  useProductsStore,
  selectProducts,
  selectCategories,
  selectFilters,
  selectPagination,
  selectProductsLoading,
  selectProductsError,
  selectProductById,
  selectActiveProducts,
  selectFeaturedProducts,
  useProducts,
  useProductCategories,
  useProductFilters,
  useProductPagination,
  useProductsLoading,
  useProductsError,
  useProductById,
  useActiveProducts,
  useFeaturedProducts,
} from './products-store';

export {
  useAdminStore,
  useIsAdminAuthenticated,
  useAdminChecked,
  useAdminHydrated,
  useCurrentAdmin,
  useAdminLoading,
  selectAdmin,
  selectAdminIsLoading,
  selectAdminIsChecked,
} from './admin-store';

export * from './tour-store';