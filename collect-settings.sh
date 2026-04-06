#!/bin/bash
# ================================================================
# collect-settings.sh
# Feature: Settings
#   Sections : Hero · About · Contact · Payment · Shipping · Social
# Trace: app → components → hooks → stores → lib → types
# Usage: bash collect-settings.sh
# ================================================================

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
FILE="$OUT/SETTINGS-$TIMESTAMP.txt"

# ── Helpers ──────────────────────────────────────────────────────

cf() {
    local f=$1
    [ -f "$f" ] || { echo "  ⚠ NOT FOUND: $f"; return; }
    local rel="${f#./}"
    local lines=$(wc -l < "$f")
    printf "\n================================================\n" >> "$FILE"
    printf "FILE: %s\n"    "$rel"                                  >> "$FILE"
    printf "PATH: %s\n"    "$f"                                    >> "$FILE"
    printf "Lines: %s\n"   "$lines"                               >> "$FILE"
    printf "================================================\n\n" >> "$FILE"
    cat "$f"                                                       >> "$FILE"
    printf "\n\n"                                                  >> "$FILE"
    echo "  ✓ $rel ($lines lines)"
}

sec() {
    printf "\n################################################################\n" >> "$FILE"
    printf "##  %s\n"                                              "$1"           >> "$FILE"
    printf "################################################################\n\n"  >> "$FILE"
    echo "▶ $1"
}

# ── Header ───────────────────────────────────────────────────────

printf "################################################################\n"     > "$FILE"
printf "##  SETTINGS — full trace\n"                                           >> "$FILE"
printf "##  Generated: %s\n"  "$(date '+%Y-%m-%d %H:%M:%S')"                  >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  IMPORT MAP\n"                                                       >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── APP ───────────────────────────────────────────\n"              >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  app/(dashboard)/dashboard/settings/\n"                             >> "$FILE"
printf "##    → page.tsx\n"                                                     >> "$FILE"
printf "##    → client.tsx\n"                                                   >> "$FILE"
printf "##        → components/dashboard/settings/hero.tsx\n"                  >> "$FILE"
printf "##        → components/dashboard/settings/about.tsx\n"                 >> "$FILE"
printf "##        → components/dashboard/settings/contact.tsx\n"               >> "$FILE"
printf "##        → components/dashboard/settings/payment.tsx\n"               >> "$FILE"
printf "##        → components/dashboard/settings/shipping.tsx\n"              >> "$FILE"
printf "##        → components/dashboard/settings/social.tsx\n"                >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── SECTION ORCHESTRATORS ──────────────────────────\n"             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  hero.tsx\n"                                                         >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → lib/constants/shared/theme-colors.ts\n"                        >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (HeroFormData)\n"                              >> "$FILE"
printf "##    → form/hero/step-identity.tsx\n"                                 >> "$FILE"
printf "##    → form/hero/step-story.tsx\n"                                    >> "$FILE"
printf "##    → form/hero/step-appearance.tsx\n"                               >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  about.tsx\n"                                                        >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → hooks/dashboard/use-subscription-plan.ts\n"                    >> "$FILE"
printf "##    → components/dashboard/shared/upgrade-modal.tsx\n"               >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (AboutFormData, FeatureItem)\n"                >> "$FILE"
printf "##    → form/about/step-highlights.tsx\n"                              >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  contact.tsx\n"                                                      >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (ContactFormData)\n"                           >> "$FILE"
printf "##    → form/contact/step-contact-info.tsx\n"                          >> "$FILE"
printf "##    → form/contact/step-location.tsx\n"                              >> "$FILE"
printf "##    → form/contact/step-section-heading.tsx\n"                       >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  payment.tsx\n"                                                      >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (PaymentMethods, PembayaranFormData)\n"        >> "$FILE"
printf "##    → form/payment/step-bank.tsx\n"                                  >> "$FILE"
printf "##    → form/payment/step-ewallet.tsx\n"                               >> "$FILE"
printf "##    → form/payment/step-cod.tsx\n"                                   >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  shipping.tsx\n"                                                     >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (CourierName, PengirimanFormData, ..)\n"       >> "$FILE"
printf "##    → form/shipping/step-carriers.tsx\n"                             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  social.tsx\n"                                                       >> "$FILE"
printf "##    → hooks/shared/use-tenant.ts\n"                                  >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##    → components/dashboard/shared/wizard-nav.tsx\n"                  >> "$FILE"
printf "##    → types/tenant.ts (SocialFormData, SocialLinks)\n"               >> "$FILE"
printf "##    → form/social/step-social-links.tsx\n"                           >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── FORM STEPS ──────────────────────────────────────\n"            >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  step-appearance.tsx\n"                                              >> "$FILE"
printf "##    → hooks/shared/use-cloudinary-upload.ts\n"                       >> "$FILE"
printf "##    → components/dashboard/shared/image-slot.tsx (EmptySlot)\n"     >> "$FILE"
printf "##    → lib/constants/shared/theme-colors.ts (THEME_COLORS)\n"        >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  step-highlights.tsx\n"                                              >> "$FILE"
printf "##    → hooks/shared/use-cloudinary-upload.ts\n"                       >> "$FILE"
printf "##    → components/dashboard/shared/image-slot.tsx\n"                  >> "$FILE"
printf "##        (FilledSlot, EmptySlot, LockedSlot)\n"                       >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  step-ewallet.tsx\n"                                                 >> "$FILE"
printf "##    → lib/constants/shared/constants.ts (PROVIDER_COLORS)\n"        >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ewallet-dialog.tsx\n"                                               >> "$FILE"
printf "##    → lib/constants/shared/constants.ts (PROVIDER_COLORS)\n"        >> "$FILE"
printf "##    → types/tenant.ts (EWallet, EWalletProvider)\n"                 >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── SHARED COMPONENTS ───────────────────────────────\n"            >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  wizard-nav.tsx\n"                                                   >> "$FILE"
printf "##    → components/dashboard/shared/step-wizard.tsx (StepDots)\n"     >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  image-slot.tsx\n"                                                   >> "$FILE"
printf "##    → @dnd-kit/sortable (useSortable)\n"                             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── HOOKS ──────────────────────────────────────────\n"             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  use-tenant.ts\n"                                                    >> "$FILE"
printf "##    → stores/auth-store.ts (useAuthStore, useIsAuthenticated)\n"    >> "$FILE"
printf "##    → lib/api/tenants.ts\n"                                          >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  use-cloudinary-upload.ts\n"                                         >> "$FILE"
printf "##    → lib/shared/cloudinary.ts (ensureCloudinaryScript)\n"          >> "$FILE"
printf "##    → types/cloudinary.ts (CloudinaryUploadResult)\n"               >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  use-subscription-plan.ts\n"                                         >> "$FILE"
printf "##    → lib/api/subscription.ts\n"                                     >> "$FILE"
printf "##    → lib/shared/query-keys.ts\n"                                    >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── LIB — API ───────────────────────────────────────\n"            >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  lib/api/client.ts\n"                                               >> "$FILE"
printf "##    → lib/constants/shared/constants.ts (API_URL)\n"                >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── STORES ─────────────────────────────────────────\n"             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##    → stores/auth-store.ts\n"                                        >> "$FILE"
printf "##        → types/tenant.ts (Tenant)\n"                               >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── TYPES ──────────────────────────────────────────\n"             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  types/tenant.ts\n"                                                  >> "$FILE"
printf "##    → types/landing.ts (TenantLandingConfig)\n"                      >> "$FILE"
printf "##  types/cloudinary.ts\n"                                              >> "$FILE"
printf "##    → CloudinaryUploadResult\n"                                      >> "$FILE"
printf "################################################################\n\n"   >> "$FILE"

# ================================================================
# 1. APP — Pages
# ================================================================

sec "APP — Pages"
cf "$SRC/app/(dashboard)/dashboard/settings/page.tsx"
cf "$SRC/app/(dashboard)/dashboard/settings/client.tsx"

# ================================================================
# 2. COMPONENTS — Section Orchestrators
# ================================================================

sec "COMPONENTS — Section Orchestrators"
cf "$SRC/components/dashboard/settings/hero.tsx"
cf "$SRC/components/dashboard/settings/about.tsx"
cf "$SRC/components/dashboard/settings/contact.tsx"
cf "$SRC/components/dashboard/settings/payment.tsx"
cf "$SRC/components/dashboard/settings/shipping.tsx"
cf "$SRC/components/dashboard/settings/social.tsx"

# ================================================================
# 3. COMPONENTS — form/hero
# ================================================================

sec "COMPONENTS — form/hero"
cf "$SRC/components/dashboard/settings/form/hero/step-identity.tsx"
cf "$SRC/components/dashboard/settings/form/hero/step-story.tsx"
cf "$SRC/components/dashboard/settings/form/hero/step-appearance.tsx"

# ================================================================
# 4. COMPONENTS — form/about
# ================================================================

sec "COMPONENTS — form/about"
cf "$SRC/components/dashboard/settings/form/about/step-highlights.tsx"

# ================================================================
# 5. COMPONENTS — form/contact
# ================================================================

sec "COMPONENTS — form/contact"
cf "$SRC/components/dashboard/settings/form/contact/step-contact-info.tsx"
cf "$SRC/components/dashboard/settings/form/contact/step-location.tsx"
cf "$SRC/components/dashboard/settings/form/contact/step-section-heading.tsx"

# ================================================================
# 6. COMPONENTS — form/payment
# ================================================================

sec "COMPONENTS — form/payment"
cf "$SRC/components/dashboard/settings/form/payment/step-bank.tsx"
cf "$SRC/components/dashboard/settings/form/payment/step-ewallet.tsx"
cf "$SRC/components/dashboard/settings/form/payment/step-cod.tsx"
cf "$SRC/components/dashboard/settings/form/payment/bank-account-dialog.tsx"
cf "$SRC/components/dashboard/settings/form/payment/ewallet-dialog.tsx"

# ================================================================
# 7. COMPONENTS — form/shipping
# ================================================================

sec "COMPONENTS — form/shipping"
cf "$SRC/components/dashboard/settings/form/shipping/step-carriers.tsx"

# ================================================================
# 8. COMPONENTS — form/social
# ================================================================

sec "COMPONENTS — form/social"
cf "$SRC/components/dashboard/settings/form/social/step-social-links.tsx"

# ================================================================
# 9. COMPONENTS — Dashboard Shared
# ================================================================

sec "COMPONENTS — Dashboard Shared"
cf "$SRC/components/dashboard/shared/wizard-nav.tsx"
cf "$SRC/components/dashboard/shared/step-wizard.tsx"
cf "$SRC/components/dashboard/shared/image-slot.tsx"
cf "$SRC/components/dashboard/shared/upgrade-modal.tsx"

# ================================================================
# 10. HOOKS
# ================================================================

sec "HOOKS"
cf "$SRC/hooks/shared/use-tenant.ts"
cf "$SRC/hooks/shared/use-cloudinary-upload.ts"
cf "$SRC/hooks/dashboard/use-subscription-plan.ts"

# ================================================================
# 11. STORES
# ================================================================

sec "STORES"
cf "$SRC/stores/auth-store.ts"

# ================================================================
# 12. LIB — API
# ================================================================

sec "LIB — API"
cf "$SRC/lib/api/tenants.ts"
cf "$SRC/lib/api/client.ts"
cf "$SRC/lib/api/subscription.ts"

# ================================================================
# 13. LIB — Shared
# ================================================================

sec "LIB — Shared"
cf "$SRC/lib/shared/colors.ts"
cf "$SRC/lib/shared/utils.ts"
cf "$SRC/lib/shared/cloudinary.ts"
cf "$SRC/lib/shared/query-keys.ts"

# ================================================================
# 14. LIB — Constants
# ================================================================

sec "LIB — Constants"
cf "$SRC/lib/constants/shared/theme-colors.ts"
cf "$SRC/lib/constants/shared/constants.ts"

# ================================================================
# 15. TYPES
# ================================================================

sec "TYPES"
cf "$SRC/types/tenant.ts"
cf "$SRC/types/api.ts"
cf "$SRC/types/landing.ts"
cf "$SRC/types/cloudinary.ts"

# ================================================================
# Done
# ================================================================

FILE_COUNT=$(grep -c '^FILE:' "$FILE" 2>/dev/null || echo 0)
FILE_SIZE=$(du -h "$FILE" | cut -f1)

echo ""
echo "================================================================"
echo "  ✅  SETTINGS collected"
echo "  📄  File  : $FILE"
echo "  📦  Files : $FILE_COUNT"
echo "  💾  Size  : $FILE_SIZE"
echo "================================================================"