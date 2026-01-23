import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { proxy, config as proxyConfig } from './proxy';

// ==========================================
// NEXT.JS MIDDLEWARE
// Connects proxy.ts to Next.js middleware system
// ==========================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // ==========================================
  // ROOT PATH REDIRECT (/ -> /discover)
  // For main domain (fibidy.com, www.fibidy.com, localhost)
  // ==========================================
  if (pathname === '/') {
    const isMainDomain =
      hostname.includes('localhost') ||
      hostname.includes('127.0.0.1') ||
      hostname === 'fibidy.com' ||
      hostname === 'www.fibidy.com' ||
      hostname.includes('.vercel.app');

    // Check if NOT a tenant subdomain (tenant subdomains are handled by proxy)
    const isTenantSubdomain =
      hostname.endsWith('.fibidy.com') &&
      !hostname.startsWith('www.') &&
      hostname !== 'fibidy.com';

    if (isMainDomain || !isTenantSubdomain) {
      const url = request.nextUrl.clone();
      url.pathname = '/discover';
      return NextResponse.redirect(url);
    }
  }

  // ==========================================
  // DELEGATE TO PROXY
  // Handles subdomain routing, auth, etc.
  // ==========================================
  return proxy(request);
}

// ==========================================
// MIDDLEWARE CONFIG
// Use same matcher as proxy
// ==========================================
export const config = proxyConfig;
