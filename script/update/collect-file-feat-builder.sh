#!/bin/bash

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

# ================================================================
# HELPERS
# ================================================================

cf() {
    local f=$1
    [ -f "$f" ] || { echo "  ⚠ NOT FOUND: $f"; return; }
    local rel="${f#./}"
    local lines=$(wc -l < "$f")
    echo "================================================" >> "$FILE"
    echo "FILE: $rel"                                        >> "$FILE"
    echo "Lines: $lines"                                     >> "$FILE"
    echo "================================================" >> "$FILE"
    echo ""                                                  >> "$FILE"
    cat "$f"                                                 >> "$FILE"
    printf "\n\n"                                            >> "$FILE"
    echo "  ✓ $rel ($lines)"
}

sec() {
    printf "\n################################################################\n##  %s\n################################################################\n\n" "$1" >> "$FILE"
    echo "▶ $1"
}

init_file() {
    FILE="$OUT/$1-$(date '+%Y%m%d-%H%M%S').txt"
    printf "################################################################\n##  %s\n##  Generated: %s\n##\n##  📦 Landing Builder Flow\n##  Layer: app → components → hooks → stores → lib → types\n################################################################\n\n" "$1" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"
}

done_msg() {
    echo ""
    echo "✅ Done: $FILE"
    echo "   Files : $(grep -c '^FILE:' "$FILE")"
    echo "   Size  : $(du -h "$FILE" | cut -f1)"
}

# ================================================================
# LANDING BUILDER FLOW COLLECTOR
#
# Layer 1 — APP
#   landing-builder/layout.tsx  → layout + AuthGuard
#   landing-builder/page.tsx    → main builder page (hero only)
#   store/[slug]/layout.tsx     → public store layout
#   store/[slug]/page.tsx       → public store page
#
# Layer 2 — COMPONENTS/landing-builder
#   Semua komponen UI builder (block drawer, header, preview, dll)
#
# Layer 3 — COMPONENTS/public/store/hero
#   TenantHero + hero blocks (dipakai LivePreview)
#
# Layer 4 — HOOKS/dashboard
#   use-landing-config    → manage config state + save to API
#   use-subscription-plan → cek plan limit block variant
#
# Layer 5 — HOOKS/shared
#   use-tenant → ambil tenant data di builder page
#
# Layer 6 — STORES
#   auth-store     → tenant state (dipakai use-tenant)
#   products-store → product state (dipakai builder page)
#
# Layer 7 — LIB/public
#   landing-utils     → mergeLandingConfig, prepareConfigForSave
#   landing-defaults  → DEFAULT_LANDING_CONFIG
#   landing-constants → magic numbers, enums
#   landing-helpers   → extractHeroData (dipakai tenant-hero)
#   og-utils          → getApiUrl
#   store-url         → storeUrl, productUrl, useStoreUrls
#   index.ts          → barrel export
#
# Layer 8 — LIB/api
#   products.ts     → productsApi.getByStore
#   tenants.ts      → tenantsApi.update (save landing config)
#   subscription.ts → subscriptionApi.getMyPlan
#   client.ts       → base API client
#   index.ts        → barrel export
#
# Layer 9 — TYPES
#   landing.ts  → TenantLandingConfig, block types
#   tenant.ts   → Tenant, PublicTenant
#   product.ts  → Product, ProductQueryParams
#   api.ts      → PaginatedResponse, ApiError
#   index.ts    → barrel export
# ================================================================

collect_landing_builder() {
    init_file "LANDING-BUILDER"

    # ── LAYER 1: APP ─────────────────────────────────────────────
    sec "LAYER 1 — APP (Entry Point)"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/layout.tsx"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/page.tsx"
    cf "$SRC/app/store/[slug]/layout.tsx"
    cf "$SRC/app/store/[slug]/page.tsx"

    # ── LAYER 2: COMPONENTS/landing-builder ──────────────────────
    sec "LAYER 2 — COMPONENTS / landing-builder"
    cf "$SRC/components/landing-builder/index.ts"
    cf "$SRC/components/landing-builder/live-preview.tsx"
    cf "$SRC/components/landing-builder/block-drawer.tsx"
    cf "$SRC/components/landing-builder/block-options.ts"
    cf "$SRC/components/landing-builder/builder-header.tsx"
    cf "$SRC/components/landing-builder/builder-loading-steps.tsx"
    cf "$SRC/components/landing-builder/full-preview-drawer.tsx"
    cf "$SRC/components/landing-builder/landing-error-boundary.tsx"

    # ── LAYER 3: COMPONENTS/public/store/hero ────────────────────
    sec "LAYER 3 — COMPONENTS / public/store/hero (used in LivePreview)"
    cf "$SRC/components/public/store/hero/tenant-hero.tsx"
    cf "$SRC/components/public/store/hero/hero1.tsx"
    cf "$SRC/components/public/store/hero/index.ts"
    cf "$SRC/components/public/store/index.ts"

    # ── LAYER 4: HOOKS/dashboard ─────────────────────────────────
    sec "LAYER 4 — HOOKS / dashboard"
    cf "$SRC/hooks/dashboard/use-landing-config.ts"
    cf "$SRC/hooks/dashboard/use-subscription-plan.ts"
    cf "$SRC/hooks/dashboard/index.ts"

    # ── LAYER 5: HOOKS/shared ────────────────────────────────────
    sec "LAYER 5 — HOOKS / shared"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/shared/index.ts"

    # ── LAYER 6: STORES ──────────────────────────────────────────
    sec "LAYER 6 — STORES"
    cf "$SRC/stores/auth-store.ts"
    cf "$SRC/stores/products-store.ts"
    cf "$SRC/stores/index.ts"

    # ── LAYER 7: LIB/public ──────────────────────────────────────
    sec "LAYER 7 — LIB / public"
    cf "$SRC/lib/public/landing-utils.ts"
    cf "$SRC/lib/public/landing-defaults.ts"
    cf "$SRC/lib/public/landing-constants.ts"
    cf "$SRC/lib/public/landing-helpers.ts"
    cf "$SRC/lib/public/og-utils.ts"
    cf "$SRC/lib/public/store-url.ts"
    cf "$SRC/lib/public/index.ts"

    # ── LAYER 8: LIB/api ─────────────────────────────────────────
    sec "LAYER 8 — LIB / api"
    cf "$SRC/lib/api/client.ts"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/api/subscription.ts"
    cf "$SRC/lib/api/index.ts"

    # ── LAYER 9: TYPES ───────────────────────────────────────────
    sec "LAYER 9 — TYPES"
    cf "$SRC/types/landing.ts"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/product.ts"
    cf "$SRC/types/api.ts"
    cf "$SRC/types/index.ts"

    done_msg
}

# ================================================================
# RUN
# ================================================================

echo ""
echo "================================================================"
echo "  COLLECT — LANDING BUILDER FLOW"
echo "  Scope: app → components → hooks → stores → lib → types"
echo "  Output: collections/LANDING-BUILDER-{timestamp}.txt"
echo "================================================================"
echo ""

collect_landing_builder