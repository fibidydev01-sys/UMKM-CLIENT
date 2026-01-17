import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ==========================================
// NEXT.JS 16 PROXY
// Handles: Auth routes + Subdomain routing
// Runtime: Node.js (NOT Edge)
// ==========================================

// ==========================================
// CONFIGURATION
// ==========================================

const PROD_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fibidy.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Enable debug logging
const DEBUG = true;

/**
 * Reserved subdomains (cannot be tenant slugs)
 */
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'cdn', 'app', 'admin', 'dashboard',
  'static', 'assets', 'images', 'files', 'uploads',
  'login', 'register', 'logout', 'auth', 'oauth',
  'blog', 'help', 'support', 'docs', 'status',
  'pricing', 'about', 'contact', 'terms', 'privacy',
  'store', 'shop', 'toko', 'fibidy', 'test', 'demo',
  'null', 'undefined', 'root', 'system', 'mail', 'email',
];

/**
 * Protected routes that require authentication
 * Currently unused but reserved for future auth implementation
 */
// const PROTECTED_ROUTES = [
//   '/dashboard',
//   '/dashboard/products',
//   '/dashboard/customers',
//   '/dashboard/orders',
//   '/dashboard/settings',
// ];

/**
 * Auth routes (redirect to dashboard if already logged in)
 * Currently unused but reserved for future auth implementation
 */
// const AUTH_ROUTES = [
//   '/login',
//   '/register',
//   '/forgot-password',
// ];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Extract subdomain from hostname
 * warungbusari.fibidy.com → "warungbusari"
 * fibidy.com → null
 * www.fibidy.com → null (reserved)
 * localhost:3000 → null
 */
function extractSubdomain(hostname: string): string | null {
  // Skip localhost (development)
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null;
  }

  // Skip Vercel preview deployments
  if (hostname.includes('.vercel.app')) {
    return null;
  }

  // Production: check for subdomain
  if (hostname.endsWith(`.${PROD_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${PROD_DOMAIN}`, '');

    // Skip reserved subdomains
    if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      return null;
    }

    // Validate format (alphanumeric and dash)
    if (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) || /^[a-z0-9]$/.test(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

/**
 * Check if path matches any pattern
 * Currently unused but reserved for future auth implementation
 */
// function matchesPath(pathname: string, patterns: string[]): boolean {
//   return patterns.some((pattern) => {
//     if (pattern.endsWith('*')) {
//       return pathname.startsWith(pattern.slice(0, -1));
//     }
//     return pathname === pattern || pathname.startsWith(pattern + '/');
//   });
// }

/**
 * Get token from cookies (for future auth use)
 * Currently unused but reserved for future auth implementation
 */
// function getTokenFromCookies(request: NextRequest): string | null {
//   const tokenCookie = request.cookies.get('fibidy_token');
//   if (tokenCookie?.value) {
//     try {
//       const parsed = JSON.parse(tokenCookie.value);
//       return parsed?.state?.token || null;
//     } catch {
//       return tokenCookie.value;
//     }
//   }
//   return null;
// }

// ==========================================
// PROXY FUNCTION (Next.js 16)
// ==========================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  if (DEBUG) {
    console.log('[Proxy] Request:', {
      hostname,
      pathname,
      prodDomain: PROD_DOMAIN,
      isProduction: IS_PRODUCTION,
    });
  }

  // ==========================================
  // 1. SKIP STATIC FILES & INTERNALS
  // ==========================================
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    if (DEBUG) console.log('[Proxy] Skipping static/internal:', pathname);
    return NextResponse.next();
  }

  // ==========================================
  // 2. SUBDOMAIN ROUTING
  // ==========================================
  const subdomain = extractSubdomain(hostname);

  if (DEBUG) {
    console.log('[Proxy] Subdomain extracted:', subdomain);
  }

  if (subdomain) {
    // Rewrite {slug}.fibidy.com → /store/{slug}/*
    // URL in browser stays as subdomain
    const url = request.nextUrl.clone();

    // Handle root path
    if (pathname === '/') {
      url.pathname = `/store/${subdomain}`;
    } else {
      url.pathname = `/store/${subdomain}${pathname}`;
    }

    if (DEBUG) {
      console.log('[Proxy] Rewriting to:', url.pathname);
    }

    return NextResponse.rewrite(url);
  }

  // ==========================================
  // 3. AUTH ROUTES (Optional - Let AuthGuard handle)
  // ==========================================
  // Uncomment if you want proxy-level auth checking

  // const token = getTokenFromCookies(request);
  // const isAuthenticated = !!token;

  // // Protect dashboard routes
  // if (matchesPath(pathname, PROTECTED_ROUTES)) {
  //   if (!isAuthenticated) {
  //     const loginUrl = new URL('/login', request.url);
  //     loginUrl.searchParams.set('from', pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  // // Redirect authenticated users away from auth pages
  // if (matchesPath(pathname, AUTH_ROUTES)) {
  //   if (isAuthenticated) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  // }

  // ==========================================
  // 4. DEFAULT: Continue
  // ==========================================
  if (DEBUG) console.log('[Proxy] No action, continuing...');
  return NextResponse.next();
}

// ==========================================
// PROXY CONFIG
// ==========================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

// ==========================================
// DEFAULT EXPORT (REQUIRED for Next.js 16!)
// ==========================================
export default proxy;