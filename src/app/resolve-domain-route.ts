import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/tenant/resolve-domain?hostname=tokoku.com
 *
 * Internal endpoint: resolve custom domain → tenant slug.
 * Called by middleware (proxy.ts) to handle custom domain routing.
 * Should NOT be called by frontend directly.
 *
 * ⚠️ IMPORTANT: This file needs to access Prisma.
 * You need to import your Prisma client instance.
 * 
 * Example:
 * import { prisma } from '@/lib/prisma';
 * 
 * If you don't have @/lib/prisma yet, create it with:
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * 
 * const globalForPrisma = globalThis as unknown as {
 *   prisma: PrismaClient | undefined;
 * };
 * 
 * export const prisma = globalForPrisma.prisma ?? new PrismaClient();
 * 
 * if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
 * ```
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
    // ⚠️ REPLACE THIS WITH YOUR ACTUAL PRISMA QUERY
    // Example:
    // const tenant = await prisma.tenant.findFirst({
    //   where: {
    //     customDomain: hostname,
    //     customDomainVerified: true,
    //     status: 'ACTIVE',
    //   },
    //   select: {
    //     slug: true,
    //     id: true,
    //   },
    // });

    // TEMPORARY PLACEHOLDER - REPLACE WITH REAL QUERY
    const tenant = null; // TODO: Replace with Prisma query

    if (!tenant) {
      return NextResponse.json({ slug: null }, { status: 404 });
    }

    return NextResponse.json({
      slug: (tenant as { slug: string }).slug,
      tenantId: (tenant as { id: string }).id
    });
  } catch (error) {
    console.error('[resolve-domain] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}