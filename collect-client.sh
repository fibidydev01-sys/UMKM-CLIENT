#!/bin/bash

# ================================================================
# COLLECT.SH — SMART INTERACTIVE COLLECTION V3
# Struktur baru: components/public, components/shared, 
#               components/dashboard, hooks/auth|dashboard|shared,
#               lib/api|dashboard|public|shared, constants/
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/restruktur
# ================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

# ================================================================
collect_file() {
    local file=$1
    local output=$2
    if [ -f "$file" ]; then
        local rel="${file#./}"
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}  ✓ ${NC}$rel ${CYAN}(${lines}L)${NC}"
        echo "================================================" >> "$output"
        echo "FILE: $rel" >> "$output"
        echo "================================================" >> "$output"
        cat "$file" >> "$output"
        echo -e "\n\n" >> "$output"
    else
        echo -e "${YELLOW}  ⚠ NOT FOUND: $file${NC}"
    fi
}

collect_folder() {
    local folder=$1
    local output=$2
    if [ ! -d "$folder" ]; then
        echo -e "${YELLOW}  ⚠ FOLDER NOT FOUND: $folder${NC}"
        return
    fi
    local count=0
    while IFS= read -r -d '' file; do
        collect_file "$file" "$output"
        ((count++))
    done < <(find "$folder" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -print0 2>/dev/null | sort -z)
    echo -e "${CYAN}  → $count files dari $folder${NC}"
}

sec() {
    local label=$1
    local output=$2
    echo -e "\n${MAGENTA}▶ $label${NC}"
    echo "" >> "$output"
    echo "################################################################" >> "$output"
    echo "##  $label" >> "$output"
    echo "################################################################" >> "$output"
    echo "" >> "$output"
}

header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

# ================================================================
# COLLECTION FUNCTIONS — STRUKTUR BARU
# ================================================================

collect_auth() {
    local o=$1
    header "COLLECTING: AUTH"

    sec "AUTH — Pages" "$o"
    collect_folder "$SRC/app/(auth)" "$o"

    sec "AUTH — Components" "$o"
    collect_folder "$SRC/components/auth" "$o"

    sec "AUTH — Hooks" "$o"
    collect_folder "$SRC/hooks/auth" "$o"

    sec "AUTH — API" "$o"
    collect_file "$SRC/lib/api/auth.ts" "$o"

    sec "AUTH — Store" "$o"
    collect_file "$SRC/stores/auth-store.ts" "$o"

    sec "AUTH — Types" "$o"
    collect_file "$SRC/types/auth.ts" "$o"
}

collect_app() {
    local o=$1
    header "COLLECTING: APP PAGES"

    sec "APP — Root" "$o"
    collect_file "$SRC/app/layout.tsx" "$o"
    collect_file "$SRC/app/page.tsx" "$o"
    collect_file "$SRC/app/globals.css" "$o"
    collect_file "$SRC/app/opengraph-image.tsx" "$o"
    collect_file "$SRC/app/twitter-image.tsx" "$o"
    collect_file "$SRC/app/resolve-domain-route.ts" "$o"

    sec "APP — Auth Pages" "$o"
    collect_folder "$SRC/app/(auth)" "$o"

    sec "APP — Dashboard Pages" "$o"
    collect_folder "$SRC/app/(dashboard)" "$o"

    sec "APP — Store Pages (Public)" "$o"
    collect_folder "$SRC/app/store" "$o"

    sec "APP — API Routes" "$o"
    collect_folder "$SRC/app/api" "$o"

    sec "APP — Server Sitemap" "$o"
    collect_folder "$SRC/app/server-sitemap" "$o"
    collect_folder "$SRC/app/server-sitemap-index.xml" "$o"
}

collect_components() {
    local o=$1
    header "COLLECTING: COMPONENTS"

    sec "COMPONENTS — Auth" "$o"
    collect_folder "$SRC/components/auth" "$o"

    sec "COMPONENTS — Dashboard (all)" "$o"
    collect_folder "$SRC/components/dashboard" "$o"

    sec "COMPONENTS — Landing Builder" "$o"
    collect_folder "$SRC/components/landing-builder" "$o"

    sec "COMPONENTS — Public / Store" "$o"
    collect_folder "$SRC/components/public" "$o"

    sec "COMPONENTS — Shared" "$o"
    collect_folder "$SRC/components/shared" "$o"
}

collect_components_dashboard() {
    local o=$1
    header "COLLECTING: COMPONENTS — DASHBOARD ONLY"

    sec "COMPONENTS — Dashboard / Domain" "$o"
    collect_folder "$SRC/components/dashboard/domain" "$o"

    sec "COMPONENTS — Dashboard / Onboarding" "$o"
    collect_folder "$SRC/components/dashboard/onboarding" "$o"

    sec "COMPONENTS — Dashboard / Products" "$o"
    collect_folder "$SRC/components/dashboard/products" "$o"

    sec "COMPONENTS — Dashboard / Settings" "$o"
    collect_folder "$SRC/components/dashboard/settings" "$o"

    sec "COMPONENTS — Dashboard / Root files" "$o"
    collect_file "$SRC/components/dashboard/dashboard-breadcrumb.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-header.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-layout.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-nav.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-quick-actions.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-shell.tsx" "$o"
    collect_file "$SRC/components/dashboard/dashboard-sidebar.tsx" "$o"
    collect_file "$SRC/components/dashboard/mobile-navbar.tsx" "$o"
    collect_file "$SRC/components/dashboard/upgrade-modal.tsx" "$o"
    collect_file "$SRC/components/dashboard/index.ts" "$o"
}

collect_components_public() {
    local o=$1
    header "COLLECTING: COMPONENTS — PUBLIC/STORE ONLY"

    sec "COMPONENTS — Public / Store / Layout" "$o"
    collect_folder "$SRC/components/public/store/layout" "$o"

    sec "COMPONENTS — Public / Store / Hero (25 variants)" "$o"
    collect_folder "$SRC/components/public/store/hero" "$o"

    sec "COMPONENTS — Public / Store / About" "$o"
    collect_folder "$SRC/components/public/store/about" "$o"

    sec "COMPONENTS — Public / Store / Contact" "$o"
    collect_folder "$SRC/components/public/store/contact" "$o"

    sec "COMPONENTS — Public / Store / CTA" "$o"
    collect_folder "$SRC/components/public/store/cta" "$o"

    sec "COMPONENTS — Public / Store / Products (block variants)" "$o"
    collect_folder "$SRC/components/public/store/products" "$o"

    sec "COMPONENTS — Public / Store / Testimonials" "$o"
    collect_folder "$SRC/components/public/store/testimonials" "$o"

    sec "COMPONENTS — Public / Store / Product (detail)" "$o"
    collect_folder "$SRC/components/public/store/product" "$o"

    sec "COMPONENTS — Public / Store / Cart" "$o"
    collect_folder "$SRC/components/public/store/cart" "$o"

    sec "COMPONENTS — Public / Store / Checkout" "$o"
    collect_folder "$SRC/components/public/store/checkout" "$o"

    sec "COMPONENTS — Public / Store / index.ts" "$o"
    collect_file "$SRC/components/public/store/index.ts" "$o"
    collect_file "$SRC/components/public/index.ts" "$o"
}

collect_landing_builder() {
    local o=$1
    header "COLLECTING: LANDING BUILDER"

    sec "LANDING BUILDER — Components" "$o"
    collect_folder "$SRC/components/landing-builder" "$o"

    sec "LANDING BUILDER — Lib (public)" "$o"
    collect_folder "$SRC/lib/public" "$o"
}

collect_lib() {
    local o=$1
    header "COLLECTING: LIB + HOOKS + STORES + TYPES + CONSTANTS"

    sec "CONSTANTS" "$o"
    collect_folder "$SRC/constants" "$o"

    sec "HOOKS — Auth" "$o"
    collect_folder "$SRC/hooks/auth" "$o"

    sec "HOOKS — Dashboard" "$o"
    collect_folder "$SRC/hooks/dashboard" "$o"

    sec "HOOKS — Shared" "$o"
    collect_folder "$SRC/hooks/shared" "$o"

    sec "HOOKS — Root index" "$o"
    collect_file "$SRC/hooks/index.ts" "$o"

    sec "LIB — API" "$o"
    collect_folder "$SRC/lib/api" "$o"

    sec "LIB — Dashboard" "$o"
    collect_folder "$SRC/lib/dashboard" "$o"

    sec "LIB — Public" "$o"
    collect_folder "$SRC/lib/public" "$o"

    sec "LIB — Shared" "$o"
    collect_folder "$SRC/lib/shared" "$o"

    sec "LIB — Root index" "$o"
    collect_file "$SRC/lib/index.ts" "$o"

    sec "PROVIDERS" "$o"
    collect_folder "$SRC/providers" "$o"

    sec "STORES (Zustand)" "$o"
    collect_folder "$SRC/stores" "$o"

    sec "TYPES" "$o"
    collect_folder "$SRC/types" "$o"

    sec "PROXY" "$o"
    collect_file "$SRC/proxy.ts" "$o"
}

collect_settings() {
    local o=$1
    header "COLLECTING: SETTINGS (Dashboard Settings Pages + Components)"

    sec "SETTINGS — Pages" "$o"
    collect_folder "$SRC/app/(dashboard)/dashboard/settings" "$o"

    sec "SETTINGS — Components" "$o"
    collect_folder "$SRC/components/dashboard/settings" "$o"

    sec "SETTINGS — Hooks (auto-save, landing-config, domain)" "$o"
    collect_file "$SRC/hooks/dashboard/use-auto-save.ts" "$o"
    collect_file "$SRC/hooks/dashboard/use-landing-config.ts" "$o"
    collect_file "$SRC/hooks/dashboard/use-domain.ts" "$o"

    sec "SETTINGS — Lib (public landing)" "$o"
    collect_folder "$SRC/lib/public" "$o"
}

collect_products() {
    local o=$1
    header "COLLECTING: PRODUCTS"

    sec "PRODUCTS — Pages" "$o"
    collect_folder "$SRC/app/(dashboard)/dashboard/products" "$o"

    sec "PRODUCTS — Components" "$o"
    collect_folder "$SRC/components/dashboard/products" "$o"

    sec "PRODUCTS — Hooks" "$o"
    collect_file "$SRC/hooks/dashboard/use-products.ts" "$o"

    sec "PRODUCTS — API" "$o"
    collect_file "$SRC/lib/api/products.ts" "$o"

    sec "PRODUCTS — Types" "$o"
    collect_file "$SRC/types/product.ts" "$o"

    sec "PRODUCTS — Validations" "$o"
    collect_file "$SRC/lib/shared/validations.ts" "$o"
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   COLLECT.SH — SMART COLLECTION V3 (Struktur Baru)        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${WHITE}Pilih yang mau di-collect:${NC}"
    echo ""
    echo -e "${GREEN}  1)${NC} Auth 🔐"
    echo -e "      ${CYAN}Pages, Components, Hooks/auth, API, Store, Types${NC}"
    echo ""
    echo -e "${GREEN}  2)${NC} App Pages 📄"
    echo -e "      ${CYAN}Root, Auth, Dashboard, Store, API Routes, Sitemap${NC}"
    echo ""
    echo -e "${GREEN}  3)${NC} Components — Semua 🧩"
    echo -e "      ${CYAN}auth, dashboard, landing-builder, public/store, shared${NC}"
    echo ""
    echo -e "${GREEN}  4)${NC} Components — Dashboard saja 🖥️"
    echo -e "      ${CYAN}domain, onboarding, products, settings, sidebar, dll${NC}"
    echo ""
    echo -e "${GREEN}  5)${NC} Components — Public/Store saja 🏪"
    echo -e "      ${CYAN}hero (25), about, contact, cta, products, testimonials, cart, checkout${NC}"
    echo ""
    echo -e "${GREEN}  6)${NC} Landing Builder 🎨"
    echo -e "      ${CYAN}components/landing-builder + lib/public${NC}"
    echo ""
    echo -e "${GREEN}  7)${NC} Settings (Dashboard) ⚙️"
    echo -e "      ${CYAN}Pages + Components settings + Hooks + Lib/public${NC}"
    echo ""
    echo -e "${GREEN}  8)${NC} Products 📦"
    echo -e "      ${CYAN}Pages + Components + Hooks + API + Types + Validations${NC}"
    echo ""
    echo -e "${GREEN}  9)${NC} Lib + Hooks + Stores + Types + Constants 📚"
    echo -e "      ${CYAN}Semua lib/, hooks/, stores/, types/, constants/, providers/${NC}"
    echo ""
    echo -e "${MAGENTA}  A)${NC} COLLECT ALL 🚀"
    echo -e "      ${CYAN}Semua section di atas${NC}"
    echo ""
    echo -e "${RED}  0)${NC} Exit"
    echo ""
    echo -e "${WHITE}Masukkan pilihan (contoh: 1 3 9 atau A untuk semua): ${NC}"
}

main() {
    if [ ! -d "$SRC" ]; then
        echo -e "${RED}ERROR: src/ tidak ditemukan. Jalankan dari folder restruktur!${NC}"
        exit 1
    fi

    while true; do
        show_menu
        read -r choices

        [[ -z "$choices" ]] && continue
        [[ "$choices" == "0" ]] && echo -e "${CYAN}Bye!${NC}" && exit 0

        local ts=$(date '+%Y%m%d-%H%M%S')
        local out="$OUT/COLLECT-$ts.txt"

        cat > "$out" << EOF
################################################################
##  COLLECT V3 — Struktur Baru (restruktur)
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##
##  Struktur:
##    components/auth | dashboard | public/store | shared | landing-builder
##    hooks/auth | dashboard | shared
##    lib/api | dashboard | public | shared
##    constants/shared | dashboard
##    stores/ | types/ | providers/
################################################################

EOF
        echo ""
        echo -e "${CYAN}Mulai collect...${NC}"
        echo ""

        local choices_upper=$(echo "$choices" | tr '[:lower:]' '[:upper:]')

        if [[ "$choices_upper" == *"A"* ]]; then
            collect_auth "$out"
            collect_app "$out"
            collect_components "$out"
            collect_landing_builder "$out"
            collect_settings "$out"
            collect_products "$out"
            collect_lib "$out"
        else
            for c in $choices; do
                case $(echo "$c" | tr '[:lower:]' '[:upper:]') in
                    1) collect_auth "$out" ;;
                    2) collect_app "$out" ;;
                    3) collect_components "$out" ;;
                    4) collect_components_dashboard "$out" ;;
                    5) collect_components_public "$out" ;;
                    6) collect_landing_builder "$out" ;;
                    7) collect_settings "$out" ;;
                    8) collect_products "$out" ;;
                    9) collect_lib "$out" ;;
                    *) echo -e "${RED}Pilihan tidak valid: $c${NC}" ;;
                esac
            done
        fi

        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ DONE!                                                  ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        local cnt=$(grep -c "^FILE:" "$out" 2>/dev/null || echo "0")
        local sz=$(du -h "$out" 2>/dev/null | cut -f1)
        echo -e "${CYAN}📂 Output : $out${NC}"
        echo -e "${CYAN}📊 Files  : $cnt${NC}"
        echo -e "${CYAN}📦 Size   : $sz${NC}"
        echo ""
        read -p "Enter untuk lanjut..."
    done
}

main "$@"