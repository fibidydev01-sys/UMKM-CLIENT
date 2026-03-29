#!/bin/bash

# ================================================================
# SUBSCRIPTION CLEANUP — FILE COLLECTOR
# Scope: Hapus deadcode subscription (cancel, redeem, xendit sisa)
#        Selaraskan FE types dengan backend schema yang sekarang
#
# OUTPUT:
#   1. File yang perlu DIEDIT  → dikumpulkan ke 1 txt
#   2. File yang perlu DIHAPUS → hanya di-list di output
#
# Run from: client directory (root folder project Next.js)
# ================================================================

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

FILE=""

cf() {
    local f=$1
    [ -f "$f" ] || { echo "  ⚠ NOT FOUND: $f"; return; }
    local lines=$(wc -l < "$f")
    printf "================================================\nFILE: %s\nLines: %s\n================================================\n\n" "${f#./}" "$lines" >> "$FILE"
    cat "$f" >> "$FILE"
    printf "\n\n" >> "$FILE"
    echo "  ✓ ${f#./} ($lines lines)"
}

sec() {
    printf "\n################################################################\n##  %s\n################################################################\n\n" "$1" >> "$FILE"
    echo ""
    echo "▶ $1"
}

init_file() {
    FILE="$OUT/$1-$(date '+%Y%m%d-%H%M%S').txt"
    printf "################################################################\n##  %s\n##  Generated: %s\n################################################################\n\n" "$1" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"
}

done_msg() {
    echo ""
    echo "✅ $(basename $FILE)"
    echo "   Files : $(grep -c '^FILE:' "$FILE" 2>/dev/null || echo 0)"
    echo "   Lines : $(wc -l < "$FILE")"
    echo "   Size  : $(du -h "$FILE" | cut -f1)"
    echo ""
}

list_deletions() {
    echo ""
    echo "================================================================"
    echo "  FILE YANG PERLU DIHAPUS (delete manual)"
    echo "================================================================"

    local files=(
        # Xendit sisa — tidak ada di backend sama sekali
        "$SRC/hooks/dashboard/use-xendit-payment.ts"
        "$SRC/types/xendit-invoice.d.ts"

        # Admin subscriptions page — semua fiturnya tidak ada di backend
        # (cancel subscription, cancel pending, redeem code)
        # Backend hanya punya: getPlanInfo, getPaymentHistory, requestUpgrade
        "$SRC/app/(admin)/admin/subscriptions/page.tsx"

        # Dead API files — tidak ada endpoint di backend
        "$SRC/lib/api/auto-reply.ts"
        "$SRC/lib/api/customers.ts"
        "$SRC/lib/api/orders.ts"
        "$SRC/lib/api/whatsapp.ts"
        "$SRC/lib/api/feed.ts"
    )

    printf "\n################################################################\n##  FILES TO DELETE\n################################################################\n\n" >> "$FILE"

    for f in "${files[@]}"; do
        if [ -f "$f" ]; then
            echo "  🗑  ${f#./}"
            printf "  DELETE: %s\n" "${f#./}" >> "$FILE"
        else
            echo "  ⚠ NOT FOUND (sudah dihapus?): ${f#./}"
            printf "  NOT FOUND: %s\n" "${f#./}" >> "$FILE"
        fi
    done

    echo ""
    printf "\n  Hapus manual atau jalankan:\n" >> "$FILE"

    for f in "${files[@]}"; do
        echo "    rm ${f}"
        printf "  rm %s\n" "${f}" >> "$FILE"
    done
    echo ""
}

main() {
    if [ ! -d "$SRC" ]; then
        echo "ERROR: src/ tidak ditemukan. Jalankan dari folder client (root Next.js)."
        exit 1
    fi

    init_file "SUBSCRIPTION-CLEANUP-EDIT"

    echo ""
    echo "================================================================"
    echo "  SUBSCRIPTION CLEANUP — FILE COLLECTOR"
    echo "  Collect file yang perlu DIEDIT"
    echo "================================================================"

    # ── 1. LIB/API ──────────────────────────────────────────────
    sec "LIB/API — subscription.ts"
    echo "  Hapus: redeemCode method + RedeemResponse type"
    echo "  Hapus: cancelPendingPayment method"
    echo "  Hapus: cancelSubscription method"
    echo "  Keep : getMyPlan, getPaymentHistory, requestUpgrade"
    cf "$SRC/lib/api/subscription.ts"

    sec "LIB/API — admin.ts"
    echo "  Hapus: overrideSubscription method (tidak ada di backend)"
    echo "  Keep : login, logout, me, getStats, getTenants, getTenantDetail,"
    echo "         suspendTenant, unsuspendTenant, getPendingPayments,"
    echo "         approveSubscription, getLogs"
    cf "$SRC/lib/api/admin.ts"

    # ── 2. TYPES ────────────────────────────────────────────────
    sec "TYPES — admin.ts"
    echo "  Hapus: status CANCELLED, EXPIRED dari SubscriptionStatus"
    echo "         (backend hanya punya ACTIVE | PAST_DUE)"
    echo "  Hapus: cancelledAt dari AdminTenantDetail.subscription"
    echo "  Hapus: xenditExternalId dari AdminPaymentHistory (kalau masih ada)"
    echo "  Hapus: isTrial, trialEndsAt kalau masih ada"
    echo "  Keep : semua yang match dengan backend schema"
    cf "$SRC/types/admin.ts"

    sec "TYPES — auth.ts"
    echo "  Cek: pastikan tidak ada referensi isTrial, trialEndsAt, xendit"
    cf "$SRC/types/auth.ts"

    # ── 3. HOOKS ────────────────────────────────────────────────
    sec "HOOKS — hooks/dashboard/index.ts"
    echo "  Hapus: export useXenditPayment kalau masih ada"
    echo "  Cek  : useSubscriptionPlan — pastikan tidak ada referensi trial"
    cf "$SRC/hooks/dashboard/index.ts"

    sec "HOOKS — hooks/dashboard/use-subscription-plan.ts"
    echo "  Cek: hapus isTrial, trialEndsAt kalau masih ada"
    cf "$SRC/hooks/dashboard/use-subscription-plan.ts"

    sec "HOOKS — hooks/admin/use-admin.ts"
    echo "  Cek: hapus overrideSubscription, isTrial kalau masih ada"
    cf "$SRC/hooks/admin/use-admin.ts"

    # ── 4. PAGES ────────────────────────────────────────────────
    sec "PAGE — dashboard/subscription/page.tsx"
    echo "  Keep : getMyPlan, getPaymentHistory, requestUpgrade, hasPendingPayment"
    echo "  Keep : handleContactSales"
    echo "  Cek  : derived state isCancelled, isExpired — hapus kalau masih ada"
    echo "         (status backend hanya ACTIVE | PAST_DUE)"
    echo "  Cek  : showCancel — hapus kalau masih ada (no cancel endpoint)"
    echo "  Cek  : RedeemDialog — hapus kalau masih ada (no redeem endpoint)"
    echo "  Cek  : cancelledAt — hapus kalau masih ada"
    cf "$SRC/app/(dashboard)/dashboard/subscription/page.tsx"

    sec "PAGE — admin/tenants/page.tsx"
    echo "  Cek: kolom Plan — hapus badge trial kalau masih ada"
    cf "$SRC/app/(admin)/admin/tenants/page.tsx"

    sec "PAGE — admin/tenants/[id]/page.tsx"
    echo "  Cek: OverrideSubscriptionDialog — hapus kalau masih ada"
    echo "  Cek: isTrial Switch dari form — hapus kalau masih ada"
    echo "  Cek: InfoRow Trial — hapus kalau masih ada"
    echo "  Keep: Approve button (hasPendingPayment)"
    echo "  Keep: Suspend / Unsuspend"
    echo "  Keep: Payment history display"
    cf "$SRC/app/(admin)/admin/tenants/[id]/page.tsx"

    sec "PAGE — admin/redeem-codes/page.tsx"
    echo "  ⚠ PERHATIAN: Page ini ada di folder map tapi tidak ada endpoint"
    echo "    di backend. Cek apakah page ini aktif atau sudah deadcode."
    echo "    Kalau tidak ada backend endpoint → HAPUS page ini juga."
    cf "$SRC/app/(admin)/admin/redeem-codes/page.tsx"

    # ── 5. STORES ───────────────────────────────────────────────
    sec "STORES — cart-store.ts"
    echo "  Cek: tidak ada referensi xendit / payment gateway"
    cf "$SRC/stores/cart-store.ts"

    # ── FILES TO DELETE ─────────────────────────────────────────
    list_deletions

    done_msg
}

main "$@"