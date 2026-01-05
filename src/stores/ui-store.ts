'use client';

import { create } from 'zustand';

// ==========================================
// UI STORE TYPES
// ==========================================

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: unknown;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Mobile menu
  mobileMenuOpen: boolean;

  // Modal
  modal: ModalState;

  // Global loading
  globalLoading: boolean;
  loadingMessage: string | null | undefined;

  // Toast queue (for sonner)
  // Note: Sonner handles its own state, this is for programmatic access
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile menu
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  closeMobileMenu: () => void;

  // Modal
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;

  // Global loading
  setGlobalLoading: (loading: boolean, message?: string | null) => void;

  // Reset
  reset: () => void;
}

type UIStore = UIState & UIActions;

// ==========================================
// DEFAULT STATE
// ==========================================

const defaultModalState: ModalState = {
  isOpen: false,
  type: null,
  data: null,
};

// ==========================================
// UI STORE
// ==========================================

export const useUIStore = create<UIStore>()((set) => ({
  // Initial State
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  modal: defaultModalState,
  globalLoading: false,
  loadingMessage: null,

  // Sidebar Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (sidebarOpen) => {
    set({ sidebarOpen });
  },

  toggleSidebarCollapsed: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (sidebarCollapsed) => {
    set({ sidebarCollapsed });
  },

  // Mobile Menu Actions
  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  setMobileMenuOpen: (mobileMenuOpen) => {
    set({ mobileMenuOpen });
  },

  closeMobileMenu: () => {
    set({ mobileMenuOpen: false });
  },

  // Modal Actions
  openModal: (type, data = null) => {
    set({
      modal: { isOpen: true, type, data },
    });
  },

  closeModal: () => {
    set({ modal: defaultModalState });
  },

  // Global Loading
  setGlobalLoading: (globalLoading, loadingMessage = undefined) => { // ← UBAH DARI null KE undefined
    set({ globalLoading, loadingMessage });
  },

  // Reset
  reset: () => {
    set({
      sidebarOpen: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      modal: defaultModalState,
      globalLoading: false,
      loadingMessage: null,
    });
  },
}));

// ==========================================
// SELECTORS
// ==========================================

export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed;
export const selectMobileMenuOpen = (state: UIStore) => state.mobileMenuOpen;
export const selectModal = (state: UIStore) => state.modal;
export const selectModalOpen = (state: UIStore) => state.modal.isOpen;
export const selectModalType = (state: UIStore) => state.modal.type;
export const selectModalData = (state: UIStore) => state.modal.data;
export const selectGlobalLoading = (state: UIStore) => state.globalLoading;
export const selectLoadingMessage = (state: UIStore) => state.loadingMessage;

// ==========================================
// HOOKS
// ==========================================

export const useSidebarOpen = () => useUIStore(selectSidebarOpen);
export const useSidebarCollapsed = () => useUIStore(selectSidebarCollapsed);
export const useMobileMenuOpen = () => useUIStore(selectMobileMenuOpen);
export const useModal = () => useUIStore(selectModal);
export const useModalOpen = () => useUIStore(selectModalOpen);
export const useModalType = () => useUIStore(selectModalType);
export const useModalData = <T = unknown>() => useUIStore(selectModalData) as T;
export const useGlobalLoading = () => useUIStore(selectGlobalLoading);
export const useLoadingMessage = () => useUIStore(selectLoadingMessage);

// ==========================================
// MODAL TYPES (for type safety)
// ==========================================

export const MODAL_TYPES = {
  // Product modals
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  PRODUCT_PREVIEW: 'PRODUCT_PREVIEW',

  // Customer modals
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  CUSTOMER_ORDERS: 'CUSTOMER_ORDERS',

  // Order modals
  ORDER_DETAIL: 'ORDER_DETAIL',
  CANCEL_ORDER: 'CANCEL_ORDER',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',

  // Settings modals
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',

  // General
  CONFIRM: 'CONFIRM',
  IMAGE_PREVIEW: 'IMAGE_PREVIEW',
} as const;

export type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES];