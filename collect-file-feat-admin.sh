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
    sec "APP — Pages"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/login/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/login-form.tsx"
    done_msg
}

feat_auth_register() {
    init_file "AUTH-REGISTER"
    sec "APP — Pages"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/register/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/register-form.tsx"
    cf "$SRC/components/auth/category-card.tsx"
    cfolder_r "$SRC/components/auth/register-steps"
    done_msg
}

feat_auth_forgot() {
    init_file "AUTH-FORGOT-PASSWORD"
    sec "APP — Pages"
    cf "$SRC/app/(auth)/layout.tsx"
    cf "$SRC/app/(auth)/forgot-password/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/auth/auth-layout.tsx"
    cf "$SRC/components/auth/auth-logo.tsx"
    cf "$SRC/components/auth/forgot-password-form.tsx"
    done_msg
}

# ================================================================
# DASHBOARD
# ================================================================

feat_dashboard_home() {
    init_file "DASHBOARD-HOME"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/layout.tsx"
    cf "$SRC/app/(dashboard)/dashboard/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/client.tsx"
    sec "COMPONENTS — Dashboard Layout"
    cfolder_r "$SRC/components/dashboard/layout"
    sec "COMPONENTS — Dashboard Shared"
    cfolder "$SRC/components/dashboard/shared"
    sec "COMPONENTS — Dashboard root (shallow)"
    cfolder "$SRC/components/dashboard"
    done_msg
}

feat_dashboard_onboarding() {
    init_file "DASHBOARD-ONBOARDING"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/onboarding/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/onboarding/client.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/onboarding"
    done_msg
}

feat_dashboard_subscription() {
    init_file "DASHBOARD-SUBSCRIPTION"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/subscription/page.tsx"
    done_msg
}

# ================================================================
# PRODUCTS — DASHBOARD
# ================================================================

feat_products_new() {
    init_file "PRODUCTS-DASHBOARD-NEW"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/products/new/page.tsx"
    sec "COMPONENTS — Form"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    sec "COMPONENTS — Shared Upload & Cloudinary"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    done_msg
}

feat_products_edit() {
    init_file "PRODUCTS-DASHBOARD-EDIT"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/products/[id]/edit/page.tsx"
    sec "COMPONENTS — Form"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    sec "COMPONENTS — Shared Upload & Cloudinary"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    done_msg
}

feat_products_grid() {
    init_file "PRODUCTS-DASHBOARD-GRID"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/client.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/products-grid.tsx"
    cf "$SRC/components/dashboard/products/product-grid-card.tsx"
    cf "$SRC/components/dashboard/products/product-delete-dialog.tsx"
    cf "$SRC/components/dashboard/products/product-preview-drawer.tsx"
    cf "$SRC/components/dashboard/products/index.ts"
    done_msg
}

# ================================================================
# SETTINGS
# ================================================================

feat_settings_layout() {
    init_file "SETTINGS-LAYOUT"
    sec "COMPONENTS — Layout Shell"
    cfolder_r "$SRC/components/dashboard/settings/layout"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    cf "$SRC/components/dashboard/settings/index.ts"
    done_msg
}

feat_settings_toko() {
    init_file "SETTINGS-TOKO"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/client.tsx"
    sec "COMPONENTS — Hero Section"
    cfolder_r "$SRC/components/dashboard/settings/hero-section"
    sec "COMPONENTS — About Section"
    cfolder_r "$SRC/components/dashboard/settings/about-section"
    sec "COMPONENTS — Contact Section"
    cfolder_r "$SRC/components/dashboard/settings/contact-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    sec "COMPONENTS — Shared Upload"
    cfolder_r "$SRC/components/shared/upload"
    done_msg
}

feat_settings_hero() {
    init_file "SETTINGS-HERO"
    sec "COMPONENTS — Hero Section"
    cfolder_r "$SRC/components/dashboard/settings/hero-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    sec "COMPONENTS — Shared Upload"
    cfolder_r "$SRC/components/shared/upload"
    done_msg
}

feat_settings_about() {
    init_file "SETTINGS-ABOUT"
    sec "COMPONENTS — About Section"
    cfolder_r "$SRC/components/dashboard/settings/about-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    sec "COMPONENTS — Block Preview"
    cfolder "$SRC/components/public/store/about"
    done_msg
}

feat_settings_contact() {
    init_file "SETTINGS-CONTACT"
    sec "COMPONENTS — Contact Section"
    cfolder_r "$SRC/components/dashboard/settings/contact-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    sec "COMPONENTS — Block Preview"
    cfolder "$SRC/components/public/store/contact"
    done_msg
}

feat_settings_channels() {
    init_file "SETTINGS-CHANNELS"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/settings/channels/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/settings/channels/client.tsx"
    sec "COMPONENTS — Pembayaran Section"
    cfolder_r "$SRC/components/dashboard/settings/pembayaran-section"
    sec "COMPONENTS — Pengiriman Section"
    cfolder_r "$SRC/components/dashboard/settings/pengiriman-section"
    sec "COMPONENTS — Social Links Section"
    cfolder_r "$SRC/components/dashboard/settings/social-links-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    done_msg
}

feat_settings_pembayaran() {
    init_file "SETTINGS-PEMBAYARAN"
    sec "COMPONENTS — Pembayaran Section"
    cfolder_r "$SRC/components/dashboard/settings/pembayaran-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    done_msg
}

feat_settings_pengiriman() {
    init_file "SETTINGS-PENGIRIMAN"
    sec "COMPONENTS — Pengiriman Section"
    cfolder_r "$SRC/components/dashboard/settings/pengiriman-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    done_msg
}

feat_settings_social() {
    init_file "SETTINGS-SOCIAL-LINKS"
    sec "COMPONENTS — Social Links Section"
    cfolder_r "$SRC/components/dashboard/settings/social-links-section"
    sec "COMPONENTS — Settings Shared"
    cfolder_r "$SRC/components/dashboard/settings/shared"
    done_msg
}

# ================================================================
# STORE (PUBLIC)
# ================================================================

feat_store_home() {
    init_file "STORE-HOME"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/layout.tsx"
    cf "$SRC/app/store/[slug]/page.tsx"
    sec "COMPONENTS — Store Layout"
    cfolder_r "$SRC/components/public/store/layout"
    sec "COMPONENTS — Hero"
    cf "$SRC/components/public/store/hero/tenant-hero.tsx"
    cf "$SRC/components/public/store/hero/hero1.tsx"
    cf "$SRC/components/public/store/hero/index.ts"
    sec "COMPONENTS — Section Renderers"
    cf "$SRC/components/public/store/about/tenant-about.tsx"
    cf "$SRC/components/public/store/contact/tenant-contact.tsx"
    cf "$SRC/components/public/store/cta/tenant-cta.tsx"
    cf "$SRC/components/public/store/products/tenant-products.tsx"
    cf "$SRC/components/public/store/testimonials/tenant-testimonials.tsx"
    sec "COMPONENTS — Cart"
    cfolder_r "$SRC/components/public/store/cart"
    done_msg
}

feat_store_products() {
    init_file "STORE-PRODUCTS-LIST"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/products/page.tsx"
    sec "COMPONENTS — Product Listing"
    cf "$SRC/components/public/store/product/product-grid.tsx"
    cf "$SRC/components/public/store/product/product-card.tsx"
    cf "$SRC/components/public/store/product/product-filters.tsx"
    cf "$SRC/components/public/store/product/product-pagination.tsx"
    cf "$SRC/components/public/store/product/category-list.tsx"
    cf "$SRC/components/public/store/product/featured-products.tsx"
    cf "$SRC/components/public/store/product/index.ts"
    sec "COMPONENTS — Layout"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    cf "$SRC/components/public/store/layout/store-skeleton.tsx"
    done_msg
}

feat_store_product_detail() {
    init_file "STORE-PRODUCT-DETAIL"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/products/[id]/page.tsx"
    cf "$SRC/app/store/[slug]/products/[id]/not-found.tsx"
    cf "$SRC/app/store/[slug]/products/[id]/opengraph-image.tsx"
    sec "COMPONENTS — Product Detail"
    cf "$SRC/components/public/store/product/product-gallery.tsx"
    cf "$SRC/components/public/store/product/product-info.tsx"
    cf "$SRC/components/public/store/product/product-actions.tsx"
    cf "$SRC/components/public/store/product/product-share.tsx"
    cf "$SRC/components/public/store/product/related-products.tsx"
    cf "$SRC/components/public/store/product/payment-shipping-info.tsx"
    sec "COMPONENTS — Layout"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "COMPONENTS — Cart"
    cfolder_r "$SRC/components/public/store/cart"
    sec "COMPONENTS — Checkout"
    cfolder_r "$SRC/components/public/store/checkout"
    sec "COMPONENTS — SEO"
    cfolder_r "$SRC/components/shared/seo"
    done_msg
}

feat_store_about() {
    init_file "STORE-ABOUT"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/about/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/about/tenant-about.tsx"
    cfolder "$SRC/components/public/store/about"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "COMPONENTS — SEO"
    cfolder_r "$SRC/components/shared/seo"
    done_msg
}

feat_store_contact() {
    init_file "STORE-CONTACT"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/contact/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/contact/tenant-contact.tsx"
    cfolder "$SRC/components/public/store/contact"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "COMPONENTS — SEO"
    cfolder_r "$SRC/components/shared/seo"
    done_msg
}

feat_store_testimonials() {
    init_file "STORE-TESTIMONIALS"
    sec "APP — Pages"
    cf "$SRC/app/store/[slug]/testimonials/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/testimonials/tenant-testimonials.tsx"
    cfolder "$SRC/components/public/store/testimonials"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "COMPONENTS — SEO"
    cfolder_r "$SRC/components/shared/seo"
    done_msg
}

# ================================================================
# LANDING BUILDER
# ================================================================

feat_landing_builder() {
    init_file "LANDING-BUILDER"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/layout.tsx"
    cf "$SRC/app/(dashboard)/dashboard/landing-builder/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/landing-builder"
    done_msg
}

feat_landing_blocks() {
    init_file "LANDING-BLOCKS"
    sec "COMPONENTS — Tenant Renderers"
    cf "$SRC/components/public/store/hero/tenant-hero.tsx"
    cf "$SRC/components/public/store/about/tenant-about.tsx"
    cf "$SRC/components/public/store/contact/tenant-contact.tsx"
    cf "$SRC/components/public/store/cta/tenant-cta.tsx"
    cf "$SRC/components/public/store/products/tenant-products.tsx"
    cf "$SRC/components/public/store/testimonials/tenant-testimonials.tsx"
    sec "BLOCKS — Hero (25 variants)"
    cfolder "$SRC/components/public/store/hero"
    sec "BLOCKS — About (5 variants)"
    cfolder "$SRC/components/public/store/about"
    sec "BLOCKS — Contact (5 variants)"
    cfolder "$SRC/components/public/store/contact"
    sec "BLOCKS — CTA (5 variants)"
    cfolder "$SRC/components/public/store/cta"
    sec "BLOCKS — Products (5 variants)"
    cfolder "$SRC/components/public/store/products"
    sec "BLOCKS — Testimonials (5 variants)"
    cfolder "$SRC/components/public/store/testimonials"
    done_msg
}

# ================================================================
# ADMIN
# ================================================================

feat_admin() {
    init_file "ADMIN"
    sec "APP — Pages"
    cf "$SRC/app/admin/login/page.tsx"
    cf "$SRC/app/admin/login/client.tsx"
    cf "$SRC/app/(admin)/layout.tsx"
    cf "$SRC/app/(admin)/admin/page.tsx"
    cf "$SRC/app/(admin)/admin/logs/page.tsx"
    cf "$SRC/app/(admin)/admin/redeem-codes/page.tsx"
    cf "$SRC/app/(admin)/admin/subscriptions/page.tsx"
    cf "$SRC/app/(admin)/admin/tenants/page.tsx"
    cf "$SRC/app/(admin)/admin/tenants/[id]/page.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/admin"
    done_msg
}

# ================================================================
# DISCOVER (PUBLIC)
# ================================================================

feat_discover() {
    init_file "DISCOVER"
    sec "APP — Pages"
    cf "$SRC/app/(public)/discover/page.tsx"
    cf "$SRC/app/(public)/discover/client.tsx"
    cf "$SRC/app/(public)/discover/[category]/page.tsx"
    cf "$SRC/app/(public)/discover/[category]/client.tsx"
    sec "COMPONENTS"
    cfolder "$SRC/components/public/discover"
    done_msg
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo "================================================================"
    echo "  FEAT-COLLECT — APP + COMPONENTS ONLY"
    echo "  Scope: app/ + components/ | No hooks/lib/types/stores"
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
    echo "  ── PRODUCTS (DASHBOARD) ────────────────────────────────────"
    echo "   7) New"
    echo "   8) Edit"
    echo "   9) Grid"
    echo ""
    echo "  ── SETTINGS ────────────────────────────────────────────────"
    echo "  10) Layout (sidebar/shell)"
    echo "  11) Toko (tabs: hero, about, contact)"
    echo "  12) Hero Section"
    echo "  13) About"
    echo "  14) Contact"
    echo "  15) Channels (tabs: pembayaran, pengiriman, social links)"
    echo "  16) Pembayaran"
    echo "  17) Pengiriman"
    echo "  28) Social Links"
    echo ""
    echo "  ── STORE (PUBLIC) ──────────────────────────────────────────"
    echo "  18) Home"
    echo "  19) Products List"
    echo "  20) Product Detail"
    echo "  21) About"
    echo "  22) Contact"
    echo "  23) Testimonials"
    echo ""
    echo "  ── LANDING ─────────────────────────────────────────────────"
    echo "  24) Builder"
    echo "  25) Blocks (semua variants)"
    echo ""
    echo "  ── ADMIN ───────────────────────────────────────────────────"
    echo "  26) Admin"
    echo ""
    echo "  ── PUBLIC ──────────────────────────────────────────────────"
    echo "  27) Discover"
    echo ""
    echo "   0) Exit        all) Semua feat"
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
         7) feat_products_new ;;
         8) feat_products_edit ;;
         9) feat_products_grid ;;
        10) feat_settings_layout ;;
        11) feat_settings_toko ;;
        12) feat_settings_hero ;;
        13) feat_settings_about ;;
        14) feat_settings_contact ;;
        15) feat_settings_channels ;;
        16) feat_settings_pembayaran ;;
        17) feat_settings_pengiriman ;;
        18) feat_store_home ;;
        19) feat_store_products ;;
        20) feat_store_product_detail ;;
        21) feat_store_about ;;
        22) feat_store_contact ;;
        23) feat_store_testimonials ;;
        24) feat_landing_builder ;;
        25) feat_landing_blocks ;;
        26) feat_admin ;;
        27) feat_discover ;;
        28) feat_settings_social ;;
         *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        for i in $(seq 1 27) 28; do run_choice $i; done
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Enter untuk kembali ke menu..."
done