#!/bin/bash

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

cfolder() {
    local dir=$1
    [ -d "$dir" ] || { echo "  ⚠ NOT FOUND: $dir"; return; }
    while IFS= read -r -d '' f; do
        cf "$f"
    done < <(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
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

init_file() {
    FILE="$OUT/$1-$(date '+%Y%m%d-%H%M%S').txt"
    printf "################################################################\n##  %s\n##  Generated: %s\n################################################################\n\n" "$1" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"
}

done_msg() {
    echo "✅ $FILE | $(grep -c '^FILE:' "$FILE") files | $(du -h "$FILE" | cut -f1)"
}

# ================================================================
# AUTH
# ================================================================

feat_auth_login() {
    init_file "AUTH-LOGIN"
    sec "PAGE"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/login/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/login-form.tsx"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
    cf "$SRC/config/site.ts"
    done_msg
}

feat_auth_register() {
    init_file "AUTH-REGISTER"
    sec "PAGE"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/register/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/register-form.tsx"
    cf "$SRC/components/auth/category-card.tsx"
    cfolder_r "$SRC/components/auth/register-steps"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
    cf "$SRC/config/site.ts"
    done_msg
}

feat_auth_forgot() {
    init_file "AUTH-FORGOT-PASSWORD"
    sec "PAGE"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/forgot-password/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/forgot-password-form.tsx"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
    cf "$SRC/config/site.ts"
    done_msg
}

# ================================================================
# DASHBOARD
# ================================================================

feat_dashboard_home() {
    init_file "DASHBOARD-HOME"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/layout.tsx"
    cf "$SRC/app/(dashboard)/dashboard/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/client.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/dashboard"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_dashboard_onboarding() {
    init_file "DASHBOARD-ONBOARDING"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/onboarding/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/onboarding/client.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/onboarding"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_dashboard_subscription() {
    init_file "DASHBOARD-SUBSCRIPTION"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/subscription/page.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

# ================================================================
# PRODUCTS
# ================================================================

feat_products_list() {
    init_file "PRODUCTS-LIST"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/products/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/products/products-table.tsx"
    cf "$SRC/components/products/products-table-columns.tsx"
    cf "$SRC/components/products/products-table-toolbar.tsx"
    cf "$SRC/components/products/products-grid.tsx"
    cf "$SRC/components/products/product-grid-card.tsx"
    cf "$SRC/components/products/product-delete-dialog.tsx"
    cf "$SRC/components/products/product-preview-drawer.tsx"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_products_new() {
    init_file "PRODUCTS-NEW"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/products/new/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/products/product-form.tsx"
    cfolder "$SRC/components/upload"
    cfolder "$SRC/components/cloudinary"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_products_edit() {
    init_file "PRODUCTS-EDIT"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/products/[id]/edit/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/products/product-form.tsx"
    cfolder "$SRC/components/upload"
    cfolder "$SRC/components/cloudinary"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

# ================================================================
# SETTINGS
# ================================================================

feat_settings_toko() {
    init_file "SETTINGS-TOKO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/client.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/settings/store-info-form.tsx"
    cfolder "$SRC/components/upload"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_hero() {
    init_file "SETTINGS-HERO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/hero-section/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/hero-section"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/landing.ts"
    done_msg
}

feat_settings_about() {
    init_file "SETTINGS-ABOUT"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/about/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/about-section"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_contact() {
    init_file "SETTINGS-CONTACT"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/contact/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/contact-section"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_cta() {
    init_file "SETTINGS-CTA"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/cta/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/cta-section"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_testimonials() {
    init_file "SETTINGS-TESTIMONIALS"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/testimonials/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/testimonials-section"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_seo() {
    init_file "SETTINGS-SEO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/seo/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/seo-section"
    cf "$SRC/components/settings/seo-settings.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_domain() {
    init_file "SETTINGS-DOMAIN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/domain/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/domain"
    sec "TYPES"
    cf "$SRC/types/domain.ts"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_channels() {
    init_file "SETTINGS-CHANNELS"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/channels/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/settings/channels/client.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_pembayaran() {
    init_file "SETTINGS-PEMBAYARAN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/pembayaran/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/pembayaran-section"
    cf "$SRC/components/settings/bank-account-dialog.tsx"
    cf "$SRC/components/settings/ewallet-dialog.tsx"
    cf "$SRC/components/settings/payment-settings.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_pengiriman() {
    init_file "SETTINGS-PENGIRIMAN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/pengiriman/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/settings/pengiriman-section"
    cf "$SRC/components/settings/shipping-settings.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

# ================================================================
# STORE (PUBLIC)
# ================================================================

feat_store_home() {
    init_file "STORE-HOME"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/layout.tsx"
    cf "$SRC/app/store/[slug]/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/store/store-header.tsx"
    cf "$SRC/components/store/store-nav.tsx"
    cf "$SRC/components/store/store-footer.tsx"
    cf "$SRC/components/store/store-skeleton.tsx"
    cf "$SRC/components/store/store-not-found.tsx"
    cf "$SRC/components/store/featured-products.tsx"
    cf "$SRC/components/store/category-list.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_store_products() {
    init_file "STORE-PRODUCTS"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/products/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/store/product-grid.tsx"
    cf "$SRC/components/store/product-card.tsx"
    cf "$SRC/components/store/product-filters.tsx"
    cf "$SRC/components/store/product-pagination.tsx"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_store_product_detail() {
    init_file "STORE-PRODUCT-DETAIL"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/products/[id]/page.tsx"
    cf "$SRC/app/store/[slug]/products/[id]/not-found.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/store/product-gallery.tsx"
    cf "$SRC/components/store/product-info.tsx"
    cf "$SRC/components/store/product-actions.tsx"
    cf "$SRC/components/store/product-share.tsx"
    cf "$SRC/components/store/related-products.tsx"
    cf "$SRC/components/store/shipping-info.tsx"
    cf "$SRC/components/store/whatsapp-order-button.tsx"
    cf "$SRC/components/store/whatsapp-checkout-dialog.tsx"
    cf "$SRC/components/store/add-to-cart-button.tsx"
    cf "$SRC/components/store/cart-sheet.tsx"
    cf "$SRC/components/store/cart-badge.tsx"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_about() {
    init_file "STORE-ABOUT"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/about/page.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_contact() {
    init_file "STORE-CONTACT"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/contact/page.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_testimonials() {
    init_file "STORE-TESTIMONIALS"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/testimonials/page.tsx"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

# ================================================================
# LANDING BUILDER
# ================================================================

feat_landing_builder() {
    init_file "LANDING-BUILDER"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/layout.tsx"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/page.tsx"
    sec "BUILDER COMPONENTS"
    cfolder "$SRC/components/landing-builder"
    sec "TYPES"
    cf "$SRC/types/landing.ts"
    done_msg
}

feat_landing_blocks() {
    init_file "LANDING-BLOCKS"
    sec "TENANT RENDERERS"
    cfolder "$SRC/components/landing"
    sec "BLOCKS — Hero"
    cfolder "$SRC/components/landing/blocks/hero"
    sec "BLOCKS — About"
    cfolder "$SRC/components/landing/blocks/about"
    sec "BLOCKS — Contact"
    cfolder "$SRC/components/landing/blocks/contact"
    sec "BLOCKS — CTA"
    cfolder "$SRC/components/landing/blocks/cta"
    sec "BLOCKS — Products"
    cfolder "$SRC/components/landing/blocks/products"
    sec "BLOCKS — Testimonials"
    cfolder "$SRC/components/landing/blocks/testimonials"
    sec "TYPES"
    cf "$SRC/types/landing.ts"
    done_msg
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo "================================================================"
    echo "  COLLECT UI — PER FITUR (page + components + types)"
    echo "================================================================"
    echo ""
    echo "  ── AUTH ────────────────────────────────────────────────────"
    echo "   1) Login"
    echo "   2) Register"
    echo "   3) Forgot Password"
    echo ""
    echo "  ── DASHBOARD ───────────────────────────────────────────────"
    echo "   4) Home"
    echo "   5) Onboarding"
    echo "   6) Subscription"
    echo ""
    echo "  ── PRODUCTS ────────────────────────────────────────────────"
    echo "   7) List"
    echo "   8) New"
    echo "   9) Edit"
    echo ""
    echo "  ── SETTINGS ────────────────────────────────────────────────"
    echo "  10) Toko"
    echo "  11) Hero Section"
    echo "  12) About"
    echo "  13) Contact"
    echo "  14) CTA"
    echo "  15) Testimonials"
    echo "  16) SEO"
    echo "  17) Domain"
    echo "  18) Channels"
    echo "  19) Pembayaran"
    echo "  20) Pengiriman"
    echo ""
    echo "  ── STORE (PUBLIC) ──────────────────────────────────────────"
    echo "  21) Home"
    echo "  22) Products"
    echo "  23) Product Detail"
    echo "  24) About"
    echo "  25) Contact"
    echo "  26) Testimonials"
    echo ""
    echo "  ── LANDING ─────────────────────────────────────────────────"
    echo "  27) Builder"
    echo "  28) Blocks"
    echo ""
    echo "   0) Exit        all) Semua"
    echo "================================================================"
    echo "  Bisa pilih lebih dari satu, contoh: 1 2 3 atau 10 11 12"
    echo "================================================================"
    echo ""
}

run_choice() {
    case $1 in
         1) feat_auth_login ;;
         2) feat_auth_register ;;
         3) feat_auth_forgot ;;
         4) feat_dashboard_home ;;
         5) feat_dashboard_onboarding ;;
         6) feat_dashboard_subscription ;;
         7) feat_products_list ;;
         8) feat_products_new ;;
         9) feat_products_edit ;;
        10) feat_settings_toko ;;
        11) feat_settings_hero ;;
        12) feat_settings_about ;;
        13) feat_settings_contact ;;
        14) feat_settings_cta ;;
        15) feat_settings_testimonials ;;
        16) feat_settings_seo ;;
        17) feat_settings_domain ;;
        18) feat_settings_channels ;;
        19) feat_settings_pembayaran ;;
        20) feat_settings_pengiriman ;;
        21) feat_store_home ;;
        22) feat_store_products ;;
        23) feat_store_product_detail ;;
        24) feat_store_about ;;
        25) feat_store_contact ;;
        26) feat_store_testimonials ;;
        27) feat_landing_builder ;;
        28) feat_landing_blocks ;;
         *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        for i in $(seq 1 28); do run_choice $i; done
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Tekan Enter untuk kembali ke menu..."
done