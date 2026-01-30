import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Store,
  MessageSquare,
  Bot,
  type LucideIcon,
} from 'lucide-react';

// ==========================================
// NAVIGATION CONFIGURATION
// ==========================================

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Dashboard sidebar navigation
 */
export const dashboardNav: NavGroup[] = [
  {
    title: 'Menu Utama',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Produk',
        href: '/dashboard/products',
        icon: Package,
      },
      {
        title: 'Pelanggan',
        href: '/dashboard/customers',
        icon: Users,
      },
      {
        title: 'Pesanan',
        href: '/dashboard/orders',
        icon: ShoppingCart,
      },
    ],
  },
  {
    title: 'WhatsApp Chat',
    items: [
      {
        title: 'Inbox',
        href: '/dashboard/inbox',
        icon: MessageSquare,
      },
      {
        title: 'Auto-Reply',
        href: '/dashboard/auto-reply',
        icon: Bot,
      },
    ],
  },
  {
    title: 'Lainnya',
    items: [
      {
        title: 'Lihat Toko',
        href: '/',
        icon: Store,
      },
      {
        title: 'Pengaturan',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

/**
 * Marketing page navigation
 */
export const marketingNav: NavItem[] = [
  {
    title: 'Beranda',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Fitur',
    href: '/#features',
    icon: Package,
  },
  {
    title: 'Cara Kerja',
    href: '/#how-it-works',
    icon: Settings,
  },
];

/**
 * Footer navigation
 */
export const footerNav = {
  product: [
    { title: 'Fitur', href: '/#features' },
    { title: 'Cara Kerja', href: '/#how-it-works' },
    { title: 'FAQ', href: '/#faq' },
  ],
  company: [
    { title: 'Tentang Kami', href: '/about' },
    { title: 'Kontak', href: '/contact' },
  ],
  legal: [
    { title: 'Kebijakan Privasi', href: '/privacy' },
    { title: 'Syarat & Ketentuan', href: '/terms' },
  ],
} as const;
