// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROD_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'fibidy.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DEBUG = true;

const RESERVED_SUBDOMAINS = [
  'www', 'api', 'cdn', 'app', 'admin', 'dashboard',
  'static', 'assets', 'images', 'files', 'uploads',
  'login', 'register', 'logout', 'auth', 'oauth',
  'blog', 'help', 'support', 'docs', 'status',
  'pricing', 'about', 'contact', 'terms', 'privacy',
  'store', 'shop', 'toko', 'fibidy', 'test', 'demo',
  'null', 'undefined', 'root', 'system', 'mail', 'email',
];

const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

const REWRITABLE_PATHS = [
  '/opengraph-image',
  '/twitter-image',
  '/icon',
  '/apple-icon',
  '/sitemap.xml',
  '/robots.txt',
];

function isRewritablePath(pathname: string): boolean {
  return REWRITABLE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
}

function extractSubdomain(hostname: string): string | null {
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return null;
  }

  if (hostname.includes('.vercel.app')) {
    return null;
  }

  if (hostname.endsWith(`.${PROD_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${PROD_DOMAIN}`, '');

    if (RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      return null;
    }

    if (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain) || /^[a-z0-9]$/.test(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

function matchesPath(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.endsWith('*')) {
      return pathname.startsWith(pattern.slice(0, -1));
    }
    return pathname === pattern || pathname.startsWith(pattern + '/');
  });
}

function getTokenFromCookies(request: NextRequest): string | null {
  const token = request.cookies.get('fibidy_auth');
  return token?.value || null;
}

/**
 * Resolve custom domain to tenant slug via internal API
 * Called when hostname is not a known subdomain or main domain
 */
async function resolveCustomDomain(
  hostname: string,
  request: NextRequest,
): Promise<string | null> {
  try {
    // Call internal API to resolve custom domain
    const apiUrl = new URL('/api/tenant/resolve-domain', request.url);
    apiUrl.searchParams.set('hostname', hostname);

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'x-internal-request': 'true', // Mark as internal
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.slug || null;
  } catch (error) {
    if (DEBUG) console.error('[Proxy] Custom domain resolve failed:', error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
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

  const subdomain = extractSubdomain(hostname);
  const shouldRewrite = isRewritablePath(pathname);

  if (DEBUG) {
    console.log('[Proxy] Subdomain:', subdomain, '| Rewritable:', shouldRewrite);
  }

  // Skip static/internal KECUALI rewritable paths pada subdomain
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    (pathname.includes('.') && !shouldRewrite)
  ) {
    if (DEBUG) console.log('[Proxy] Skipping static/internal:', pathname);
    return NextResponse.next();
  }

  if (subdomain) {
    const url = request.nextUrl.clone();

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
  // CUSTOM DOMAIN HANDLING
  // ==========================================
  if (
    !subdomain &&
    !hostname.includes('localhost') &&
    !hostname.includes('127.0.0.1') &&
    !hostname.includes('.vercel.app') &&
    hostname !== PROD_DOMAIN &&
    hostname !== `www.${PROD_DOMAIN}`
  ) {
    if (DEBUG) console.log('[Proxy] Possible custom domain:', hostname);

    const tenantSlug = await resolveCustomDomain(hostname, request);

    if (tenantSlug) {
      const url = request.nextUrl.clone();

      if (pathname === '/') {
        url.pathname = `/store/${tenantSlug}`;
      } else {
        url.pathname = `/store/${tenantSlug}${pathname}`;
      }

      if (DEBUG) console.log('[Proxy] Custom domain rewrite:', url.pathname);

      const response = NextResponse.rewrite(url);
      response.headers.set('x-custom-domain', hostname);
      response.headers.set('x-tenant-slug', tenantSlug);
      return response;
    }

    if (DEBUG) console.log('[Proxy] Custom domain not found:', hostname);
  }

  const token = getTokenFromCookies(request);
  const isAuthenticated = !!token;

  if (DEBUG) {
    console.log('[Proxy] Auth check:', { token: token ? 'exists' : 'none', isAuthenticated });
  }

  if (pathname === '/') {
    if (isAuthenticated) {
      if (DEBUG) console.log('[Proxy] Root → Dashboard (authenticated)');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      if (DEBUG) console.log('[Proxy] Root → Login (not authenticated)');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (matchesPath(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      if (DEBUG) console.log('[Proxy] Protected route → Login redirect');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (matchesPath(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      if (DEBUG) console.log('[Proxy] Auth route → Dashboard redirect');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (DEBUG) console.log('[Proxy] No action, continuing...');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

export default proxy;