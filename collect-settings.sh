#!/bin/bash

# ================================================================
# SETTINGS INTERACTIVE COLLECTOR
# Pilih fitur yang mau di-collect via menu interaktif
# Run from: client directory
# ================================================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

PROJECT_ROOT="."
SRC_DIR="$PROJECT_ROOT/src"
OUT="collections"
mkdir -p "$OUT"

# ════════════════════════════════════════════════════════════════
# FEATURE DEFINITIONS
# Setiap fitur = pages + components + dependencies terkait
# ════════════════════════════════════════════════════════════════

FEATURES=(
  "ALL          | Semua fitur sekaligus"
  "TOKO         | Hero + About + Testimonials + Contact + CTA"
  "HERO         | Hero Section"
  "ABOUT        | About Section"
  "TESTIMONIALS | Testimonials Section"
  "CONTACT      | Contact Section"
  "CTA          | Call to Action Section"
  "CHANNELS     | SEO + Pembayaran + Pengiriman + Domain"
  "SEO          | SEO & Social Links"
  "PEMBAYARAN   | Payment Methods"
  "PENGIRIMAN   | Shipping Settings"
  "DOMAIN       | Custom Domain Setup"
  "SHARED       | Hooks + Stores + Lib + Types + Constants"
)

# ════════════════════════════════════════════════════════════════
# HELPERS
# ════════════════════════════════════════════════════════════════

collect_file() {
    local file=$1
    if [ -f "$file" ]; then
        local rel="${file#$PROJECT_ROOT/}"
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "    ${GREEN}✓${NC} $rel ${DIM}(${lines} lines)${NC}"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "FILE: $rel" >> "$OUTPUT_FILE"
        echo "Lines: $lines" >> "$OUTPUT_FILE"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
    else
        echo -e "    ${YELLOW}✗${NC} ${DIM}skip (not found): ${file#$PROJECT_ROOT/}${NC}"
    fi
}

collect_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        while IFS= read -r -d '' file; do
            collect_file "$file"
        done < <(find "$dir" -type f \( -name "*.tsx" -o -name "*.ts" \) ! -name "*.d.ts" -print0 | sort -z)
    else
        echo -e "    ${YELLOW}✗${NC} ${DIM}dir not found: ${dir#$PROJECT_ROOT/}${NC}"
    fi
}

section() {
    local label=$1
    echo "" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "##  $label" >> "$OUTPUT_FILE"
    echo "################################################################" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo -e "\n  ${MAGENTA}▶ $label${NC}"
}

subsection() {
    local label=$1
    echo "" >> "$OUTPUT_FILE"
    echo "  ── $label ──" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo -e "  ${CYAN}  ── $label${NC}"
}

# ════════════════════════════════════════════════════════════════
# COLLECT FUNCTIONS PER FITUR
# ════════════════════════════════════════════════════════════════

SETTINGS_PAGES="$SRC_DIR/app/(dashboard)/dashboard/settings"
COMP_SETTINGS="$SRC_DIR/components/dashboard/settings"
COMP_DASH="$SRC_DIR/components/dashboard"

# ── SHARED DEPS (hooks, stores, lib, types, constants) ──────────
collect_shared_deps() {
    section "HOOKS"
    subsection "hooks/dashboard"
    collect_dir "$SRC_DIR/hooks/dashboard"
    subsection "hooks/shared"
    collect_dir "$SRC_DIR/hooks/shared"
    subsection "hooks/auth"
    collect_dir "$SRC_DIR/hooks/auth"
    collect_file "$SRC_DIR/hooks/index.ts"

    section "STORES"
    collect_dir "$SRC_DIR/stores"

    section "LIB — API"
    collect_dir "$SRC_DIR/lib/api"

    section "LIB — Dashboard"
    collect_dir "$SRC_DIR/lib/dashboard"

    section "LIB — Shared"
    collect_dir "$SRC_DIR/lib/shared"

    section "LIB — Public"
    collect_dir "$SRC_DIR/lib/public"

    section "TYPES"
    collect_dir "$SRC_DIR/types"

    section "CONSTANTS"
    collect_dir "$SRC_DIR/constants"

    section "PROVIDERS"
    collect_dir "$SRC_DIR/providers"

    section "COMPONENTS — shared"
    collect_dir "$SRC_DIR/components/shared"
}

# ── SETTINGS COMMON (layout, nav, auto-save, preview-modal) ─────
collect_settings_common() {
    section "SETTINGS — Common Components"
    collect_file "$COMP_SETTINGS/auto-save-status.tsx"
    collect_file "$COMP_SETTINGS/preview-modal.tsx"
    collect_file "$COMP_SETTINGS/settings-layout.tsx"
    collect_file "$COMP_SETTINGS/settings-sidebar.tsx"
    collect_file "$COMP_SETTINGS/settings-nav.tsx"
    collect_file "$COMP_SETTINGS/settings-mobile-navbar.tsx"
    collect_file "$COMP_SETTINGS/landing-content-settings.tsx"
    collect_file "$COMP_SETTINGS/store-info-form.tsx"
    collect_file "$COMP_SETTINGS/index.ts"

    section "DASHBOARD — Layout & Shell"
    collect_file "$COMP_DASH/dashboard-layout.tsx"
    collect_file "$COMP_DASH/dashboard-shell.tsx"
    collect_file "$COMP_DASH/dashboard-header.tsx"
    collect_file "$COMP_DASH/dashboard-breadcrumb.tsx"
    collect_file "$COMP_DASH/dashboard-sidebar.tsx"
    collect_file "$COMP_DASH/dashboard-nav.tsx"
    collect_file "$COMP_DASH/mobile-navbar.tsx"
    collect_file "$COMP_DASH/upgrade-modal.tsx"
    collect_file "$COMP_DASH/index.ts"
}

# ── TOKO ────────────────────────────────────────────────────────
do_toko() {
    section "PAGE — Toko (wrapper)"
    collect_file "$SETTINGS_PAGES/toko/page.tsx"
    collect_file "$SETTINGS_PAGES/toko/client.tsx"

    do_hero
    do_about
    do_testimonials
    do_contact
    do_cta
}

# ── HERO ────────────────────────────────────────────────────────
do_hero() {
    section "PAGE — Hero Section"
    collect_file "$SETTINGS_PAGES/hero-section/page.tsx"

    section "COMPONENTS — hero-section"
    collect_dir "$COMP_SETTINGS/hero-section"
}

# ── ABOUT ───────────────────────────────────────────────────────
do_about() {
    section "PAGE — About"
    collect_file "$SETTINGS_PAGES/about/page.tsx"

    section "COMPONENTS — about-section"
    collect_dir "$COMP_SETTINGS/about-section"
}

# ── TESTIMONIALS ────────────────────────────────────────────────
do_testimonials() {
    section "PAGE — Testimonials"
    collect_file "$SETTINGS_PAGES/testimonials/page.tsx"

    section "COMPONENTS — testimonials-section"
    collect_dir "$COMP_SETTINGS/testimonials-section"
}

# ── CONTACT ─────────────────────────────────────────────────────
do_contact() {
    section "PAGE — Contact"
    collect_file "$SETTINGS_PAGES/contact/page.tsx"

    section "COMPONENTS — contact-section"
    collect_dir "$COMP_SETTINGS/contact-section"
}

# ── CTA ─────────────────────────────────────────────────────────
do_cta() {
    section "PAGE — CTA"
    collect_file "$SETTINGS_PAGES/cta/page.tsx"

    section "COMPONENTS — cta-section"
    collect_dir "$COMP_SETTINGS/cta-section"
}

# ── CHANNELS ────────────────────────────────────────────────────
do_channels() {
    section "PAGE — Channels (wrapper)"
    collect_file "$SETTINGS_PAGES/channels/page.tsx"
    collect_file "$SETTINGS_PAGES/channels/client.tsx"

    do_seo
    do_pembayaran
    do_pengiriman
    do_domain
}

# ── SEO ─────────────────────────────────────────────────────────
do_seo() {
    section "PAGE — SEO"
    collect_file "$SETTINGS_PAGES/seo/page.tsx"

    section "COMPONENTS — seo-section"
    collect_dir "$COMP_SETTINGS/seo-section"

    section "COMPONENTS — seo-settings"
    collect_file "$COMP_SETTINGS/seo-settings.tsx"
}

# ── PEMBAYARAN ──────────────────────────────────────────────────
do_pembayaran() {
    section "PAGE — Pembayaran"
    collect_file "$SETTINGS_PAGES/pembayaran/page.tsx"

    section "COMPONENTS — pembayaran-section"
    collect_dir "$COMP_SETTINGS/pembayaran-section"
}

# ── PENGIRIMAN ──────────────────────────────────────────────────
do_pengiriman() {
    section "PAGE — Pengiriman"
    collect_file "$SETTINGS_PAGES/pengiriman/page.tsx"

    section "COMPONENTS — pengiriman-section"
    collect_dir "$COMP_SETTINGS/pengiriman-section"

    section "COMPONENTS — shipping-settings"
    collect_file "$COMP_SETTINGS/shipping-settings.tsx"
}

# ── DOMAIN ──────────────────────────────────────────────────────
do_domain() {
    section "PAGE — Domain"
    collect_file "$SETTINGS_PAGES/domain/page.tsx"

    section "COMPONENTS — dashboard/domain"
    collect_dir "$COMP_DASH/domain"
}

# ════════════════════════════════════════════════════════════════
# MENU DISPLAY
# ════════════════════════════════════════════════════════════════

show_menu() {
    clear
    echo ""
    echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║           SETTINGS COLLECTOR — PILIH FITUR                  ║${NC}"
    echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${DIM}Ketik nomor fitur. Pisah spasi untuk multi-pilih.${NC}"
    echo -e "  ${DIM}Contoh: ${NC}${BOLD}2 3 4${NC}${DIM} → collect Toko + Hero + About${NC}"
    echo ""
    echo -e "  ${BOLD} #   FITUR              DESKRIPSI${NC}"
    echo -e "  ${DIM}───  ─────────────────  ─────────────────────────────────────${NC}"

    local i=0
    for feature in "${FEATURES[@]}"; do
        local key=$(echo "$feature" | cut -d'|' -f1 | xargs)
        local desc=$(echo "$feature" | cut -d'|' -f2 | xargs)
        printf "  ${CYAN}%2d${NC}   ${BOLD}%-18s${NC} ${DIM}%s${NC}\n" "$i" "$key" "$desc"
        ((i++))
    done

    echo ""
    echo -e "  ${DIM}───────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${YELLOW} s${NC}   ${BOLD}+SHARED DEPS      ${NC} ${DIM}Tambahkan Hooks+Stores+Lib+Types${NC}"
    echo -e "  ${YELLOW} c${NC}   ${BOLD}+SETTINGS COMMON  ${NC} ${DIM}Tambahkan layout/nav/auto-save${NC}"
    echo -e "  ${RED} q${NC}   ${BOLD}QUIT${NC}"
    echo ""
    echo -ne "  ${BOLD}Pilihan: ${NC}"
}

# ════════════════════════════════════════════════════════════════
# SELECTION HANDLER
# ════════════════════════════════════════════════════════════════

run_selected() {
    local selections=("$@")
    local include_shared=false
    local include_common=false
    local feature_keys=()

    # Parse flags
    for sel in "${selections[@]}"; do
        case "$sel" in
            s|S) include_shared=true ;;
            c|C) include_common=true ;;
            [0-9]|[0-9][0-9])
                local idx=$sel
                if [ "$idx" -ge 0 ] && [ "$idx" -lt "${#FEATURES[@]}" ]; then
                    local key=$(echo "${FEATURES[$idx]}" | cut -d'|' -f1 | xargs)
                    feature_keys+=("$key")
                else
                    echo -e "${RED}  ✗ Nomor $sel tidak valid, skip.${NC}"
                fi
                ;;
        esac
    done

    # Resolve ALL
    if [[ " ${feature_keys[*]} " == *" ALL "* ]]; then
        feature_keys=("TOKO" "CHANNELS" "SHARED")
        include_shared=true
        include_common=true
    fi

    # Build output filename dari keys
    local label=$(echo "${feature_keys[*]}" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
    [ "$include_shared" = true ] && label="${label}+shared"
    [ "$include_common" = true ] && label="${label}+common"
    [ -z "$label" ] && label="custom"

    TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
    OUTPUT_FILE="$OUT/SETTINGS-${label^^}-${TIMESTAMP}.txt"

    # Header
    cat > "$OUTPUT_FILE" << EOF
################################################################
##  SETTINGS COLLECTOR — OUTPUT
##  Generated : $(date '+%Y-%m-%d %H:%M:%S')
##  Features  : ${feature_keys[*]}
##  +Shared   : $include_shared
##  +Common   : $include_common
################################################################

EOF

    echo ""
    echo -e "${CYAN}  Mengumpulkan file...${NC}"
    echo ""

    # Run common
    [ "$include_common" = true ] && collect_settings_common

    # Run per feature (deduplicate TOKO vs individual)
    local ran_toko=false
    local ran_channels=false

    for key in "${feature_keys[@]}"; do
        case "$key" in
            TOKO)
                ran_toko=true
                do_toko
                ;;
            HERO)
                [[ "$ran_toko" = false ]] && do_hero
                ;;
            ABOUT)
                [[ "$ran_toko" = false ]] && do_about
                ;;
            TESTIMONIALS)
                [[ "$ran_toko" = false ]] && do_testimonials
                ;;
            CONTACT)
                [[ "$ran_toko" = false ]] && do_contact
                ;;
            CTA)
                [[ "$ran_toko" = false ]] && do_cta
                ;;
            CHANNELS)
                ran_channels=true
                do_channels
                ;;
            SEO)
                [[ "$ran_channels" = false ]] && do_seo
                ;;
            PEMBAYARAN)
                [[ "$ran_channels" = false ]] && do_pembayaran
                ;;
            PENGIRIMAN)
                [[ "$ran_channels" = false ]] && do_pengiriman
                ;;
            DOMAIN)
                [[ "$ran_channels" = false ]] && do_domain
                ;;
            SHARED)
                include_shared=true
                ;;
        esac
    done

    # Run shared deps
    [ "$include_shared" = true ] && collect_shared_deps

    # Summary
    local file_count=$(grep -c "^FILE:" "$OUTPUT_FILE" 2>/dev/null || echo "0")
    local file_size=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ SELESAI!                                               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  ${CYAN}📂 Output : ${BOLD}$OUTPUT_FILE${NC}"
    echo -e "  ${CYAN}📊 Files  : ${BOLD}$file_count${NC}"
    echo -e "  ${CYAN}📦 Size   : ${BOLD}$file_size${NC}"
    echo ""
}

# ════════════════════════════════════════════════════════════════
# MAIN LOOP
# ════════════════════════════════════════════════════════════════

while true; do
    show_menu
    read -r input

    # Quit
    if [[ "$input" =~ ^[qQ]$ ]]; then
        echo ""
        echo -e "  ${DIM}Bye!${NC}"
        echo ""
        exit 0
    fi

    # Validate ada input
    if [ -z "$input" ]; then
        echo -e "\n  ${RED}Input kosong. Coba lagi.${NC}"
        sleep 1
        continue
    fi

    # Parse input jadi array
    read -ra SELECTIONS <<< "$input"

    # Run
    run_selected "${SELECTIONS[@]}"

    # Tanya lagi?
    echo -ne "  ${BOLD}Collect lagi? (y/n): ${NC}"
    read -r again
    [[ "$again" =~ ^[nN]$ ]] && break
done

echo ""