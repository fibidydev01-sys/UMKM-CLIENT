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
  useProductsStore,
  selectProducts,
  selectCategories,
  selectFilters,
  selectPagination,
  selectProductsLoading,
  selectProductsError,
  selectProductById,
  selectActiveProducts,
  useProducts,
  useProductCategories,
  useProductFilters,
  useProductPagination,
  useProductsLoading,
  useProductsError,
  useProductById,
  useActiveProducts,
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