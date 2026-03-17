#!/bin/bash

# ================================================================
# FEAT-COLLECT.SH — PER FITUR (page + components + types)
# Struktur BARU: components/dashboard|public/store|shared
#               hooks/auth|dashboard|shared
#               lib/api|dashboard|public|shared
#               constants/shared
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/restruktur
# ================================================================

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

# Shallow — hanya file di root folder (maxdepth 1)
cfolder() {
    local dir=$1
    [ -d "$dir" ] || { echo "  ⚠ NOT FOUND: $dir"; return; }
    while IFS= read -r -d '' f; do
        cf "$f"
    done < <(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
}

# Recursive — semua subfolder ikut
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
    sec "HOOKS"
    cf "$SRC/hooks/auth/use-auth.ts"
    cf "$SRC/hooks/auth/index.ts"
    sec "LIB"
    cf "$SRC/lib/api/auth.ts"
    cf "$SRC/lib/shared/validations.ts"
    sec "STORE"
    cf "$SRC/stores/auth-store.ts"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
    cf "$SRC/constants/shared/site.ts"
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
    sec "HOOKS"
    cf "$SRC/hooks/auth/use-auth.ts"
    cf "$SRC/hooks/auth/use-register-wizard.ts"
    sec "LIB"
    cf "$SRC/lib/api/auth.ts"
    cf "$SRC/lib/shared/validations.ts"
    sec "CONSTANTS"
    cf "$SRC/constants/shared/categories.ts"
    cf "$SRC/constants/shared/site.ts"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
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
    sec "HOOKS"
    cf "$SRC/hooks/auth/use-auth.ts"
    sec "LIB"
    cf "$SRC/lib/api/auth.ts"
    sec "TYPES"
    cf "$SRC/types/auth.ts"
    cf "$SRC/constants/shared/site.ts"
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
    sec "COMPONENTS — Dashboard root"
    cfolder "$SRC/components/dashboard"
    sec "COMPONENTS — Onboarding"
    cfolder_r "$SRC/components/dashboard/onboarding"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-onboarding.ts"
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
    cfolder_r "$SRC/components/dashboard/onboarding"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-onboarding.ts"
    sec "LIB"
    cf "$SRC/lib/dashboard/calculate-progress.ts"
    cf "$SRC/lib/dashboard/onboarding-types.ts"
    cf "$SRC/lib/dashboard/steps-config.ts"
    cf "$SRC/lib/dashboard/index.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_dashboard_subscription() {
    init_file "DASHBOARD-SUBSCRIPTION"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/subscription/page.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-xendit-payment.ts"
    sec "LIB"
    cf "$SRC/lib/api/subscription.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/xendit-invoice.d.ts"
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
    cf "$SRC/components/dashboard/products/products-table.tsx"
    cf "$SRC/components/dashboard/products/products-table-columns.tsx"
    cf "$SRC/components/dashboard/products/products-table-toolbar.tsx"
    cf "$SRC/components/dashboard/products/products-grid.tsx"
    cf "$SRC/components/dashboard/products/product-grid-card.tsx"
    cf "$SRC/components/dashboard/products/product-delete-dialog.tsx"
    cf "$SRC/components/dashboard/products/product-preview-drawer.tsx"
    cf "$SRC/components/dashboard/products/index.ts"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-products.ts"
    sec "LIB"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/shared/format.ts"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_products_new() {
    init_file "PRODUCTS-NEW"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/products/new/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-products.ts"
    sec "LIB"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/shared/validations.ts"
    cf "$SRC/lib/shared/cloudinary.ts"
    sec "CONSTANTS"
    cf "$SRC/constants/shared/constants.ts"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_products_edit() {
    init_file "PRODUCTS-EDIT"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/products/[id]/edit/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-products.ts"
    sec "LIB"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/shared/validations.ts"
    cf "$SRC/lib/shared/cloudinary.ts"
    sec "CONSTANTS"
    cf "$SRC/constants/shared/constants.ts"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    done_msg
}

# ================================================================
# SETTINGS
# ================================================================

feat_settings_layout() {
    init_file "SETTINGS-LAYOUT"
    sec "LAYOUT COMPONENTS"
    cf "$SRC/components/dashboard/settings/settings-layout.tsx"
    cf "$SRC/components/dashboard/settings/settings-nav.tsx"
    cf "$SRC/components/dashboard/settings/settings-sidebar.tsx"
    cf "$SRC/components/dashboard/settings/settings-mobile-navbar.tsx"
    cf "$SRC/components/dashboard/settings/landing-content-settings.tsx"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    cf "$SRC/components/dashboard/settings/index.ts"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    cf "$SRC/hooks/shared/use-tenant.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_toko() {
    init_file "SETTINGS-TOKO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/settings/toko/client.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/settings/store-info-form.tsx"
    cf "$SRC/components/dashboard/settings/settings-layout.tsx"
    cf "$SRC/components/dashboard/settings/settings-nav.tsx"
    cf "$SRC/components/dashboard/settings/settings-sidebar.tsx"
    cf "$SRC/components/dashboard/settings/settings-mobile-navbar.tsx"
    cfolder_r "$SRC/components/shared/upload"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_hero() {
    init_file "SETTINGS-HERO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/hero-section/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/hero-section"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    cf "$SRC/hooks/dashboard/use-landing-config.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/shared/colors.ts"
    cfolder_r "$SRC/components/shared/upload"
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
    cfolder_r "$SRC/components/dashboard/settings/about-section"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    # Block preview
    cf "$SRC/components/public/store/about/about1.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/shared/colors.ts"
    cfolder_r "$SRC/components/shared/upload"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_contact() {
    init_file "SETTINGS-CONTACT"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/contact/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/contact-section"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    cf "$SRC/components/public/store/contact/contact1.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/shared/colors.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_cta() {
    init_file "SETTINGS-CTA"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/cta/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/cta-section"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    cf "$SRC/components/public/store/cta/cta1.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/shared/colors.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_testimonials() {
    init_file "SETTINGS-TESTIMONIALS"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/testimonials/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/testimonials-section"
    cf "$SRC/components/dashboard/settings/preview-modal.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    cf "$SRC/components/public/store/testimonials/testimonials1.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    cf "$SRC/hooks/dashboard/use-landing-config.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/public/landing-utils.ts"
    cfolder_r "$SRC/components/shared/upload"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_seo() {
    init_file "SETTINGS-SEO"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/seo/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/seo-section"
    cf "$SRC/components/dashboard/settings/seo-settings.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_domain() {
    init_file "SETTINGS-DOMAIN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/domain/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/domain"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-domain.ts"
    sec "LIB"
    cf "$SRC/lib/api/domain.ts"
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
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_settings_pembayaran() {
    init_file "SETTINGS-PEMBAYARAN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/pembayaran/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/pembayaran-section"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/asean-currency.ts"
    done_msg
}

feat_settings_pengiriman() {
    init_file "SETTINGS-PENGIRIMAN"
    sec "PAGE"
    cf "$SRC/app/(dashboard)/dashboard/settings/pengiriman/page.tsx"
    sec "COMPONENTS"
    cfolder_r "$SRC/components/dashboard/settings/pengiriman-section"
    cf "$SRC/components/dashboard/settings/shipping-settings.tsx"
    cf "$SRC/components/dashboard/settings/auto-save-status.tsx"
    sec "HOOKS"
    cf "$SRC/hooks/shared/use-tenant.ts"
    cf "$SRC/hooks/dashboard/use-auto-save.ts"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
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
    sec "COMPONENTS — Layout"
    cfolder_r "$SRC/components/public/store/layout"
    sec "COMPONENTS — Hero"
    cf "$SRC/components/public/store/hero/tenant-hero.tsx"
    cf "$SRC/components/public/store/hero/hero1.tsx"
    cf "$SRC/components/public/store/hero/index.ts"
    sec "COMPONENTS — About/Contact/CTA/Products/Testimonials (tenant renderers)"
    cf "$SRC/components/public/store/about/tenant-about.tsx"
    cf "$SRC/components/public/store/contact/tenant-contact.tsx"
    cf "$SRC/components/public/store/cta/tenant-cta.tsx"
    cf "$SRC/components/public/store/products/tenant-products.tsx"
    cf "$SRC/components/public/store/testimonials/tenant-testimonials.tsx"
    sec "COMPONENTS — Cart"
    cfolder_r "$SRC/components/public/store/cart"
    sec "LIB"
    cf "$SRC/lib/public/landing-context.tsx"
    cf "$SRC/lib/public/landing-utils.ts"
    cf "$SRC/lib/public/store-url.ts"
    cf "$SRC/lib/shared/colors.ts"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/api/products.ts"
    sec "SEO"
    cfolder_r "$SRC/components/shared/seo"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/landing.ts"
    cf "$SRC/types/product.ts"
    done_msg
}

feat_store_products() {
    init_file "STORE-PRODUCTS"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/products/page.tsx"
    sec "COMPONENTS — Product listing"
    cf "$SRC/components/public/store/product/product-grid.tsx"
    cf "$SRC/components/public/store/product/product-card.tsx"
    cf "$SRC/components/public/store/product/product-filters.tsx"
    cf "$SRC/components/public/store/product/product-pagination.tsx"
    cf "$SRC/components/public/store/product/category-list.tsx"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    cf "$SRC/components/public/store/layout/store-skeleton.tsx"
    cf "$SRC/components/public/store/product/index.ts"
    sec "LIB"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/public/store-url.ts"
    cf "$SRC/lib/shared/cloudinary.ts"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_product_detail() {
    init_file "STORE-PRODUCT-DETAIL"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/products/[id]/page.tsx"
    cf "$SRC/app/store/[slug]/products/[id]/not-found.tsx"
    cf "$SRC/app/store/[slug]/products/[id]/opengraph-image.tsx"
    sec "COMPONENTS — Product detail"
    cf "$SRC/components/public/store/product/product-gallery.tsx"
    cf "$SRC/components/public/store/product/product-info.tsx"
    cf "$SRC/components/public/store/product/product-actions.tsx"
    cf "$SRC/components/public/store/product/product-share.tsx"
    cf "$SRC/components/public/store/product/related-products.tsx"
    cf "$SRC/components/public/store/product/payment-shipping-info.tsx"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "COMPONENTS — Cart + Checkout"
    cfolder_r "$SRC/components/public/store/cart"
    cfolder_r "$SRC/components/public/store/checkout"
    sec "SEO"
    cfolder_r "$SRC/components/shared/seo"
    sec "LIB"
    cf "$SRC/lib/api/products.ts"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/shared/seo.ts"
    cf "$SRC/lib/shared/cloudinary.ts"
    cf "$SRC/lib/public/store-url.ts"
    sec "STORES"
    cf "$SRC/stores/cart-store.ts"
    sec "TYPES"
    cf "$SRC/types/product.ts"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_about() {
    init_file "STORE-ABOUT"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/about/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/about/tenant-about.tsx"
    cfolder "$SRC/components/public/store/about"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "SEO"
    cfolder_r "$SRC/components/shared/seo"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/landing.ts"
    done_msg
}

feat_store_contact() {
    init_file "STORE-CONTACT"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/contact/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/contact/tenant-contact.tsx"
    cfolder "$SRC/components/public/store/contact"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "SEO"
    cfolder_r "$SRC/components/shared/seo"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_store_testimonials() {
    init_file "STORE-TESTIMONIALS"
    sec "PAGE"
    cf "$SRC/app/store/[slug]/testimonials/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/public/store/testimonials/tenant-testimonials.tsx"
    cfolder "$SRC/components/public/store/testimonials"
    cf "$SRC/components/public/store/layout/store-breadcrumb.tsx"
    sec "SEO"
    cfolder_r "$SRC/components/shared/seo"
    sec "LIB"
    cf "$SRC/lib/api/tenants.ts"
    cf "$SRC/lib/public/landing-utils.ts"
    sec "TYPES"
    cf "$SRC/types/tenant.ts"
    cf "$SRC/types/landing.ts"
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
    cfolder_r "$SRC/components/landing-builder"
    sec "HOOKS"
    cf "$SRC/hooks/dashboard/use-landing-config.ts"
    cf "$SRC/hooks/shared/use-tenant.ts"
    sec "LIB"
    cfolder_r "$SRC/lib/public"
    sec "TYPES"
    cf "$SRC/types/landing.ts"
    cf "$SRC/types/tenant.ts"
    done_msg
}

feat_landing_blocks() {
    init_file "LANDING-BLOCKS"
    sec "TENANT RENDERERS"
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
    sec "LIB — Templates"
    cfolder_r "$SRC/lib/public/templates"
    cf "$SRC/lib/public/landing-context.tsx"
    cf "$SRC/lib/public/landing-constants.ts"
    cf "$SRC/lib/public/landing-defaults.ts"
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
    echo "  FEAT-COLLECT — PER FITUR (page + components + types)"
    echo "  Struktur BARU: components/dashboard|public|shared"
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
    echo "  29) Settings Layout (shared nav/sidebar)"
    echo ""
    echo "  ── STORE (PUBLIC) ──────────────────────────────────────────"
    echo "  21) Home (+ hero/about/cta/testimonials blocks)"
    echo "  22) Products List"
    echo "  23) Product Detail"
    echo "  24) About"
    echo "  25) Contact"
    echo "  26) Testimonials"
    echo ""
    echo "  ── LANDING ─────────────────────────────────────────────────"
    echo "  27) Builder"
    echo "  28) Blocks (semua variants)"
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
        29) feat_settings_layout ;;
         *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29; do
            run_choice $i
        done
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Enter untuk kembali ke menu..."
done