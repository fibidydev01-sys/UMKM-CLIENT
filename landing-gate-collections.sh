#!/bin/bash

# ================================================================
# LANDING-GATE-COLLECT.SH — Collect referensi untuk feature gating
# landing builder blocks berdasarkan subscription plan
#
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/restruktur
# ================================================================

SRC="./src"
SERVER_SRC="../server/src"
OUT="collections"
mkdir -p "$OUT"

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

cfolder_r() {
    local dir=$1
    [ -d "$dir" ] || { echo "  ⚠ NOT FOUND: $dir"; return; }
    while IFS= read -r -d '' f; do
        cf "$f"
    done < <(find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
}

sec() {
    printf "\n################################################################\n##  %s\n################################################################\n\n" "$1" >> "$FILE"
    echo "▶ $1"
}

FILE="$OUT/LANDING-GATE-REF-$(date '+%Y%m%d-%H%M%S').txt"
printf "################################################################\n##  LANDING GATE REFERENCE\n##  Generated: %s\n##\n##  Tujuan: Referensi untuk implement / maintain feature gating\n##          landing builder blocks by subscription plan\n##\n##  Scope:\n##  - Block options & definitions (isProBlock, hasProBlocks)\n##  - Landing builder UI (block picker, drawer, sheet)\n##  - Subscription plan hook (useSubscriptionPlan)\n##  - Upgrade modal trigger\n##  - Template definitions\n##  - Plan limits (backend — single source of truth)\n################################################################\n\n" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"

echo ""
echo "================================================================"
echo "  LANDING-GATE-COLLECT — Feature gating landing builder"
echo "================================================================"
echo ""

# ================================================================
sec "1. LANDING BUILDER — Core UI files (gating ada di sini)"
cf "$SRC/components/landing-builder/block-options.ts"
cf "$SRC/components/landing-builder/block-drawer.tsx"
cf "$SRC/components/landing-builder/landing-builder-simplified.tsx"
cf "$SRC/components/landing-builder/section-sheet.tsx"
cf "$SRC/components/landing-builder/builder-sidebar.tsx"
cf "$SRC/components/landing-builder/landing-builder.tsx"
cf "$SRC/components/landing-builder/template-selector.tsx"
cf "$SRC/components/landing-builder/index.ts"

# ================================================================
sec "2. UPGRADE MODAL — Trigger saat Publish dengan Pro block"
cf "$SRC/components/dashboard/upgrade-modal.tsx"

# ================================================================
sec "3. SUBSCRIPTION — Cara cek plan + blockVariantLimit di client"
cf "$SRC/hooks/dashboard/use-subscription-plan.ts"
cf "$SRC/hooks/dashboard/use-xendit-payment.ts"
cf "$SRC/lib/api/subscription.ts"

# ================================================================
sec "4. TEMPLATE & PUBLIC DEFINITIONS"
cfolder_r "$SRC/lib/public/templates"
cf "$SRC/lib/public/landing-constants.ts"
cf "$SRC/lib/public/landing-helpers.ts"
cf "$SRC/lib/public/landing-utils.ts"

# ================================================================
sec "5. LANDING PAGE — App route (builder page + publish gate)"
cf "$SRC/app/(dashboard)/dashboard/landing-builder/page.tsx"
cf "$SRC/app/(dashboard)/dashboard/landing-builder/layout.tsx"

# ================================================================
sec "6. SUBSCRIPTION PAGE — Context upgrade flow"
cf "$SRC/app/(dashboard)/dashboard/subscription/page.tsx"

# ================================================================
sec "7. PLAN LIMITS — Backend single source of truth"
cf "$SERVER_SRC/subscription/plan-limits.ts"
cf "$SERVER_SRC/subscription/subscription.service.ts"

echo ""
echo "================================================================"
echo "✅ $FILE"
echo "📊 $(grep -c '^FILE:' "$FILE") files | $(du -h "$FILE" | cut -f1)"
echo "================================================================"