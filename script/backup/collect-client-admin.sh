#!/bin/bash

# ================================================================
# ADMIN-COLLECT-CLIENT.SH — Collect referensi CLIENT untuk admin panel
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/restruktur
# ================================================================

SRC="./src"
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

FILE="$OUT/ADMIN-CLIENT-REF-$(date '+%Y%m%d-%H%M%S').txt"
printf "################################################################\n##  ADMIN CLIENT REFERENCE\n##  Generated: %s\n##\n##  Tujuan: Referensi sebelum develop admin panel (client side)\n##  Yang di-collect: proxy, auth pattern, layout pattern,\n##                   types, stores, api pattern, hooks pattern\n################################################################\n\n" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"

echo ""
echo "================================================================"
echo "  ADMIN-COLLECT-CLIENT — Referensi develop admin panel"
echo "================================================================"
echo ""

# ================================================================
sec "1. PROXY — Routing logic"
cf "$SRC/proxy.ts"

# ================================================================
sec "2. AUTH PATTERN — Referensi buat admin auth"
cf "$SRC/app/(auth)/layout.tsx"
cf "$SRC/app/(auth)/login/page.tsx"
cf "$SRC/components/auth/auth-layout.tsx"
cf "$SRC/components/auth/auth-logo.tsx"
cf "$SRC/components/auth/login-form.tsx"
cf "$SRC/hooks/auth/use-auth.ts"
cf "$SRC/hooks/auth/index.ts"
cf "$SRC/lib/api/auth.ts"
cf "$SRC/stores/auth-store.ts"
cf "$SRC/types/auth.ts"

# ================================================================
sec "3. DASHBOARD LAYOUT PATTERN — Referensi buat admin layout"
cf "$SRC/app/(dashboard)/layout.tsx"
cf "$SRC/components/dashboard/dashboard-layout.tsx"
cf "$SRC/components/dashboard/dashboard-sidebar.tsx"
cf "$SRC/components/dashboard/dashboard-header.tsx"
cf "$SRC/components/dashboard/dashboard-nav.tsx"
cf "$SRC/components/dashboard/mobile-navbar.tsx"
cf "$SRC/components/dashboard/index.ts"

# ================================================================
sec "4. API CLIENT PATTERN — Referensi buat lib/api/admin.ts"
cf "$SRC/lib/api/client.ts"
cf "$SRC/lib/api/index.ts"
cf "$SRC/lib/api/tenants.ts"
cf "$SRC/lib/api/subscription.ts"

# ================================================================
sec "5. HOOKS PATTERN — Referensi buat hooks/admin/"
cf "$SRC/hooks/index.ts"
cf "$SRC/hooks/shared/use-tenant.ts"
cf "$SRC/hooks/dashboard/use-subscription-plan.ts"

# ================================================================
sec "6. STORE PATTERN — Referensi buat stores/admin-store.ts"
cf "$SRC/stores/auth-store.ts"

# ================================================================
sec "7. TYPES — Yang akan dipakai admin"
cf "$SRC/types/auth.ts"
cf "$SRC/types/tenant.ts"

# ================================================================
sec "8. CONSTANTS — Config global"
cf "$SRC/constants/shared/site.ts"
cf "$SRC/constants/shared/constants.ts"

# ================================================================
sec "9. PROVIDERS — Referensi buat admin providers"
cfolder_r "$SRC/providers"

# ================================================================
sec "10. SHARED UTILS — Schema, SEO, validations"
cf "$SRC/lib/shared/schema.ts"
cf "$SRC/lib/shared/validations.ts"

# ================================================================
sec "11. ADMIN MODULE — Semua files admin yang sudah dibuat"

# App routes
cf "$SRC/app/(admin)/layout.tsx"
cf "$SRC/app/admin/login/page.tsx"
cf "$SRC/app/admin/login/client.tsx"
cf "$SRC/app/(admin)/admin/page.tsx"
cf "$SRC/app/(admin)/admin/tenants/page.tsx"
cf "$SRC/app/(admin)/admin/tenants/[id]/page.tsx"
cf "$SRC/app/(admin)/admin/subscriptions/page.tsx"
cf "$SRC/app/(admin)/admin/redeem-codes/page.tsx"
cf "$SRC/app/(admin)/admin/logs/page.tsx"

# Components
cfolder_r "$SRC/components/admin"

# Hooks
cfolder_r "$SRC/hooks/admin"

# API
cf "$SRC/lib/api/admin-client.ts"
cf "$SRC/lib/api/admin.ts"

# Store + Types
cf "$SRC/stores/admin-store.ts"
cf "$SRC/types/admin.ts"

echo ""
echo "================================================================"
echo "✅ $FILE"
echo "📊 $(grep -c '^FILE:' "$FILE") files | $(du -h "$FILE" | cut -f1)"
echo "================================================================"