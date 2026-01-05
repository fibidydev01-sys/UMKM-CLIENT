// ==========================================
// STORES INDEX - Export all stores
// ==========================================

// Auth Store
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

// Cart Store
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
  type CartItem,
} from './cart-store';

// Products Store
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

// UI Store
export {
  useUIStore,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectMobileMenuOpen,
  selectModal,
  selectModalOpen,
  selectModalType,
  selectModalData,
  selectGlobalLoading,
  selectLoadingMessage,
  useSidebarOpen,
  useSidebarCollapsed,
  useMobileMenuOpen,
  useModal,
  useModalOpen,
  useModalType,
  useModalData,
  useGlobalLoading,
  useLoadingMessage,
  MODAL_TYPES,
  type ModalType,
} from './ui-store';