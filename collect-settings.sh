#!/bin/bash

# ================================================================
# SETTINGS COLLECTOR — PER FITUR
# Fokus: page + form/steps + hooks + api + types
# (tanpa landing blocks & renderer)
# Run from: client directory
# ================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
WHITE='\033[1;37m'
NC='\033[0m'

PROJECT_ROOT="."
SRC_DIR="$PROJECT_ROOT/src"
OUT="collections"
mkdir -p "$OUT"

# ================================================================
# HELPERS
# ================================================================

collect_file() {
    local file=$1
    local output=$2
    if [ -f "$file" ]; then
        local rel="${file#$PROJECT_ROOT/}"
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}    ✓ ${NC}$rel ${CYAN}(${lines} lines)${NC}"
        echo "================================================" >> "$output"
        echo "FILE: $rel" >> "$output"
        echo "Lines: $lines" >> "$output"
        echo "================================================" >> "$output"
        echo "" >> "$output"
        cat "$file" >> "$output"
        echo -e "\n\n" >> "$output"
    else
        echo -e "${YELLOW}    ⚠ NOT FOUND: ${file#$PROJECT_ROOT/}${NC}"
    fi
}

collect_folder() {
    local folder=$1
    local output=$2
    if [ ! -d "$folder" ]; then
        echo -e "${YELLOW}    ⚠ FOLDER NOT FOUND: ${folder#$PROJECT_ROOT/}${NC}"
        return
    fi
    local collected=0
    while IFS= read -r -d '' file; do
        collect_file "$file" "$output"
        ((collected++))
    done < <(find "$folder" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -print0 2>/dev/null)
    echo -e "${CYAN}    → $collected files${NC}"
}

section_header() {
    local label=$1
    local output=$2
    echo "" >> "$output"
    echo "################################################################" >> "$output"
    echo "##  $label" >> "$output"
    echo "################################################################" >> "$output"
    echo "" >> "$output"
    echo -e "\n  ${MAGENTA}▶ $label${NC}"
}

# ================================================================
# SHARED DEPENDENCIES
# ================================================================

collect_shared() {
    local output=$1
    section_header "SHARED — API Client & Server" "$output"
    collect_file "$SRC_DIR/lib/api/client.ts" "$output"
    collect_file "$SRC_DIR/lib/api/server.ts" "$output"

    section_header "SHARED — Utils, Format, Validations" "$output"
    collect_file "$SRC_DIR/lib/utils.ts" "$output"
    collect_file "$SRC_DIR/lib/format.ts" "$output"
    collect_file "$SRC_DIR/lib/validations.ts" "$output"

    section_header "SHARED — Auth Store & Hook" "$output"
    collect_file "$SRC_DIR/stores/auth-store.ts" "$output"
    collect_file "$SRC_DIR/hooks/use-auth.ts" "$output"
}

# ================================================================
# FITUR: HERO SECTION
# ================================================================

feature_hero() {
    local output=$1
    echo -e "\n${BLUE}  ── HERO SECTION ────────────────────────────────────────${NC}"

    section_header "HERO — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/hero-section" "$output"

    section_header "HERO — Form Steps (identitas, cerita, tampilan)" "$output"
    collect_folder "$SRC_DIR/components/settings/hero-section" "$output"

    section_header "HERO — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "HERO — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "HERO — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
    collect_file "$SRC_DIR/types/landing.ts" "$output"
}

# ================================================================
# FITUR: ABOUT
# ================================================================

feature_about() {
    local output=$1
    echo -e "\n${BLUE}  ── ABOUT ───────────────────────────────────────────────${NC}"

    section_header "ABOUT — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/about" "$output"

    section_header "ABOUT — Form Steps (identitas, konten, fitur)" "$output"
    collect_folder "$SRC_DIR/components/settings/about-section" "$output"

    section_header "ABOUT — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "ABOUT — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "ABOUT — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: TESTIMONIALS
# ================================================================

feature_testimonials() {
    local output=$1
    echo -e "\n${BLUE}  ── TESTIMONIALS ────────────────────────────────────────${NC}"

    section_header "TESTIMONIALS — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/testimonials" "$output"

    section_header "TESTIMONIALS — Form Steps (header, testimoni)" "$output"
    collect_folder "$SRC_DIR/components/settings/testimonials-section" "$output"

    section_header "TESTIMONIALS — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "TESTIMONIALS — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "TESTIMONIALS — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: CONTACT
# ================================================================

feature_contact() {
    local output=$1
    echo -e "\n${BLUE}  ── CONTACT ─────────────────────────────────────────────${NC}"

    section_header "CONTACT — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/contact" "$output"

    section_header "CONTACT — Form Steps (header, maps, settings)" "$output"
    collect_folder "$SRC_DIR/components/settings/contact-section" "$output"

    section_header "CONTACT — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "CONTACT — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "CONTACT — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: CTA
# ================================================================

feature_cta() {
    local output=$1
    echo -e "\n${BLUE}  ── CTA ─────────────────────────────────────────────────${NC}"

    section_header "CTA — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/cta" "$output"

    section_header "CTA — Form Steps (konten, tombol)" "$output"
    collect_folder "$SRC_DIR/components/settings/cta-section" "$output"

    section_header "CTA — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "CTA — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "CTA — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: SEO
# ================================================================

feature_seo() {
    local output=$1
    echo -e "\n${BLUE}  ── SEO ──────────────────────────────────────────────────${NC}"

    section_header "SEO — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/seo" "$output"

    section_header "SEO — Form Steps (meta, sosmed)" "$output"
    collect_folder "$SRC_DIR/components/settings/seo-section" "$output"

    section_header "SEO — Settings Form" "$output"
    collect_file "$SRC_DIR/components/settings/seo-settings.tsx" "$output"

    section_header "SEO — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "SEO — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "SEO — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: PEMBAYARAN
# ================================================================

feature_pembayaran() {
    local output=$1
    echo -e "\n${BLUE}  ── PEMBAYARAN ───────────────────────────────────────────${NC}"

    section_header "PEMBAYARAN — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/pembayaran" "$output"

    section_header "PEMBAYARAN — Form Steps (bank, cod, currency, ewallet)" "$output"
    collect_folder "$SRC_DIR/components/settings/pembayaran-section" "$output"

    section_header "PEMBAYARAN — Dialogs (bank account, ewallet)" "$output"
    collect_file "$SRC_DIR/components/settings/bank-account-dialog.tsx" "$output"
    collect_file "$SRC_DIR/components/settings/ewallet-dialog.tsx" "$output"

    section_header "PEMBAYARAN — Payment Settings Form" "$output"
    collect_file "$SRC_DIR/components/settings/payment-settings.tsx" "$output"

    section_header "PEMBAYARAN — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"
    collect_file "$SRC_DIR/hooks/use-snap-payment.ts" "$output"

    section_header "PEMBAYARAN — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"
    collect_file "$SRC_DIR/lib/api/subscription.ts" "$output"

    section_header "PEMBAYARAN — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: PENGIRIMAN
# ================================================================

feature_pengiriman() {
    local output=$1
    echo -e "\n${BLUE}  ── PENGIRIMAN ───────────────────────────────────────────${NC}"

    section_header "PENGIRIMAN — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/pengiriman" "$output"

    section_header "PENGIRIMAN — Form Steps & Shared Utils" "$output"
    collect_folder "$SRC_DIR/components/settings/pengiriman-section" "$output"
    # ✅ format-currency.ts ada di dalam folder pengiriman-section
    # sudah ter-cover oleh collect_folder di atas

    section_header "PENGIRIMAN — Shipping Settings Form" "$output"
    collect_file "$SRC_DIR/components/settings/shipping-settings.tsx" "$output"

    section_header "PENGIRIMAN — Shared Format (multi-currency)" "$output"
    collect_file "$SRC_DIR/lib/format.ts" "$output"

    section_header "PENGIRIMAN — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "PENGIRIMAN — API" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"

    section_header "PENGIRIMAN — Types" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# FITUR: DOMAIN
# ================================================================

feature_domain() {
    local output=$1
    echo -e "\n${BLUE}  ── DOMAIN ───────────────────────────────────────────────${NC}"

    section_header "DOMAIN — Page" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard/settings/domain" "$output"

    section_header "DOMAIN — Component (custom-domain-setup)" "$output"
    collect_folder "$SRC_DIR/components/domain" "$output"

    section_header "DOMAIN — API Route (resolve-domain)" "$output"
    collect_file "$SRC_DIR/app/api/tenant/resolve-domain/route.ts" "$output"

    section_header "DOMAIN — Hooks" "$output"
    collect_file "$SRC_DIR/hooks/use-domain.ts" "$output"
    collect_file "$SRC_DIR/hooks/use-tenant.ts" "$output"

    section_header "DOMAIN — API" "$output"
    collect_file "$SRC_DIR/lib/api/domain.ts" "$output"
    collect_file "$SRC_DIR/lib/api/tenants.ts" "$output"
    collect_file "$SRC_DIR/lib/api/subscription.ts" "$output"

    section_header "DOMAIN — Types" "$output"
    collect_file "$SRC_DIR/types/domain.ts" "$output"
    collect_file "$SRC_DIR/types/tenant.ts" "$output"
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   SETTINGS COLLECTOR — PER FITUR                          ║${NC}"
    echo -e "${BLUE}║   page + form/steps + hooks + api + types                 ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${WHITE}  ┌─ TokoClient ───────────────────────────────────────────┐${NC}"
    echo -e "  ${GREEN}1)${NC} Hero Section   ${CYAN}→ page, steps, hooks, api, types${NC}"
    echo -e "  ${GREEN}2)${NC} About          ${CYAN}→ page, steps, hooks, api, types${NC}"
    echo -e "  ${GREEN}3)${NC} Testimonials   ${CYAN}→ page, steps, hooks, api, types${NC}"
    echo -e "  ${GREEN}4)${NC} Contact        ${CYAN}→ page, steps, hooks, api, types${NC}"
    echo -e "  ${GREEN}5)${NC} CTA            ${CYAN}→ page, steps, hooks, api, types${NC}"
    echo -e "${WHITE}  ├─ ChannelsClient ──────────────────────────────────────┤${NC}"
    echo -e "  ${GREEN}6)${NC} SEO            ${CYAN}→ page, steps, form, hooks, api, types${NC}"
    echo -e "  ${GREEN}7)${NC} Pembayaran     ${CYAN}→ page, steps, dialogs, form, hooks, api, types${NC}"
    echo -e "  ${GREEN}8)${NC} Pengiriman     ${CYAN}→ page, steps, format-currency, form, hooks, api, types${NC}"
    echo -e "  ${GREEN}9)${NC} Domain         ${CYAN}→ page, component, api route, hooks, api, types${NC}"
    echo -e "${WHITE}  └───────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "  ${YELLOW}s)${NC} + Shared       ${CYAN}→ api client/server, utils, auth (opsional tambahan)${NC}"
    echo -e "  ${MAGENTA}all)${NC} Semua fitur + shared 🚀"
    echo ""
    echo -e "${RED}  0)${NC} Exit"
    echo ""
    echo -e "${WHITE}  Contoh: ${CYAN}2${NC}${WHITE} = About saja  |  ${CYAN}6 s${NC}${WHITE} = SEO + Shared  |  ${CYAN}1 2 3${NC}${WHITE} = Hero + About + Testimonials${NC}"
    echo -e "${WHITE}  Masukkan pilihan: ${NC}"
}

# ================================================================
# MAIN
# ================================================================

main() {
    if [ ! -d "$SRC_DIR" ]; then
        echo -e "${RED}ERROR: SRC_DIR tidak ditemukan: $SRC_DIR${NC}"
        echo -e "${YELLOW}Jalankan script ini dari folder client/${NC}"
        exit 1
    fi

    while true; do
        show_menu
        read -r choices

        [ -z "$choices" ] && continue
        [[ "$choices" == "0" ]] && echo -e "\n${CYAN}Bye!${NC}" && exit 0

        TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
        LABEL=$(echo "$choices" | tr ' ' '-' | tr '[:lower:]' '[:upper:]')
        [[ "$choices" == "all" ]] && LABEL="ALL"
        OUTPUT_FILE="$OUT/SETTINGS-${LABEL}-${TIMESTAMP}.txt"

        cat > "$OUTPUT_FILE" << EOF
################################################################
##  SETTINGS COLLECTION — PER FITUR
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  Pilihan   : $choices
##
##  Tiap fitur: page + form/steps + hooks + api + types
################################################################

EOF

        echo -e "\n${CYAN}  Mengumpulkan: ${WHITE}$choices${NC}\n"

        if [[ "$choices" == "all" ]]; then
            feature_hero "$OUTPUT_FILE"
            feature_about "$OUTPUT_FILE"
            feature_testimonials "$OUTPUT_FILE"
            feature_contact "$OUTPUT_FILE"
            feature_cta "$OUTPUT_FILE"
            feature_seo "$OUTPUT_FILE"
            feature_pembayaran "$OUTPUT_FILE"
            feature_pengiriman "$OUTPUT_FILE"
            feature_domain "$OUTPUT_FILE"
            collect_shared "$OUTPUT_FILE"
        else
            for choice in $choices; do
                case $choice in
                    1)   feature_hero "$OUTPUT_FILE" ;;
                    2)   feature_about "$OUTPUT_FILE" ;;
                    3)   feature_testimonials "$OUTPUT_FILE" ;;
                    4)   feature_contact "$OUTPUT_FILE" ;;
                    5)   feature_cta "$OUTPUT_FILE" ;;
                    6)   feature_seo "$OUTPUT_FILE" ;;
                    7)   feature_pembayaran "$OUTPUT_FILE" ;;
                    8)   feature_pengiriman "$OUTPUT_FILE" ;;
                    9)   feature_domain "$OUTPUT_FILE" ;;
                    s|S) collect_shared "$OUTPUT_FILE" ;;
                    *)   echo -e "${RED}  Pilihan tidak valid: $choice${NC}" ;;
                esac
            done
        fi

        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╝${NC}"
        echo -e "${GREEN}║  ✅ SELESAI!                                               ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}  📂 Output : $OUTPUT_FILE${NC}"

        FILE_COUNT=$(grep -c "^FILE:" "$OUTPUT_FILE" 2>/dev/null || echo "0")
        FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)

        echo -e "${CYAN}  📊 Files  : $FILE_COUNT${NC}"
        echo -e "${CYAN}  📦 Size   : $FILE_SIZE${NC}"
        echo ""
        read -p "  Tekan Enter untuk kembali ke menu..."
    done
}

main "$@"