import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tenant/resolve-domain?hostname=tokoku.com
 *
 * Internal endpoint called by middleware (proxy.ts)
 * This forwards the request to NestJS backend to resolve custom domain → tenant slug
 *
 * ⚠️ IMPORTANT: This is a PROXY endpoint, not a direct Prisma query!
 * Real logic happens in NestJS backend.
 */

export async function GET(request: NextRequest) {
  // Optional: verify internal request
  const isInternal = request.headers.get('x-internal-request') === 'true';

  if (!isInternal) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const hostname = searchParams.get('hostname');

  if (!hostname) {
    return NextResponse.json({ error: 'hostname required' }, { status: 400 });
  }

  try {
    // ==========================================
    // CALL NESTJS BACKEND API
    // ==========================================
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const endpoint = `${backendUrl}/tenants/domain/resolve?hostname=${encodeURIComponent(hostname)}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Optional: add internal auth header if needed
        // 'X-Internal-Secret': process.env.INTERNAL_API_SECRET || '',
      },
    });

    if (!response.ok) {
      // Domain not found or error
      if (response.status === 404) {
        return NextResponse.json({ slug: null }, { status: 404 });
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      slug: data.slug,
      tenantId: data.tenantId,
    });
  } catch (error) {
    console.error('[resolve-domain] Error calling backend:', error);
    return NextResponse.json(
      { error: 'Failed to resolve domain' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs'; // Required for fetch in middleware context