// ==========================================
// HOOKS INDEX - Export all custom hooks
// ==========================================

// Auth Hooks
export {
  useAuth,
  useLogin,
  useRegister,
  useLogout,
  useCheckSlug,
  useChangePassword,
  useDeleteAccount,
} from './use-auth';

// Tenant Hooks
export {
  useTenant,
  usePublicTenant,
  useUpdateTenant,
  useDashboardStats,
} from './use-tenant';

// Products Hooks
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useStoreProducts,
} from './use-products';

// Customers Hooks
export {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useSearchCustomer,
} from './use-customers';

// Orders Hooks
export {
  useOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useCancelOrder,
  useTodayOrders,
} from './use-orders';

// Utility Hooks
export { useDebounce, useDebouncedCallback } from './use-debounce';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsLargeDesktop, breakpoints } from './use-media-query';
export { useMounted, useIsClient } from './use-mounted';

export { useLandingConfig } from './use-landing-config';

