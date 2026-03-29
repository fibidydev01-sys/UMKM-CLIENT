#!/bin/bash

# ================================================================
# NEXTSTEP TOUR — FILE COLLECTOR
# Collect semua file yang dibutuhkan untuk implementasi tour
# Run from: client directory (root project Next.js kamu)
# Usage: bash collect-tour-files.sh
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

TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
OUTPUT_FILE="$OUT/NEXTSTEP-TOUR-${TIMESTAMP}.txt"

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
# HEADER OUTPUT FILE
# ════════════════════════════════════════════════════════════════

cat > "$OUTPUT_FILE" << EOF
################################################################
##  NEXTSTEP TOUR — FILE COLLECTOR
##  Generated : $(date '+%Y-%m-%d %H:%M:%S')
##  Tujuan    : Collect semua file yang perlu dibaca/dimodifikasi
##              untuk implementasi guided tour onboarding
################################################################

EOF

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║         NEXTSTEP TOUR — FILE COLLECTOR                       ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${DIM}Mengumpulkan semua file untuk implementasi NextStep Tour...${NC}"
echo ""

# ════════════════════════════════════════════════════════════════
# 1. STORES — yang perlu dibaca & yang akan dibuat baru
# ════════════════════════════════════════════════════════════════

section "STORES (baca existing + tour-store baru)"

subsection "stores yang sudah ada (untuk referensi pattern)"
collect_file "$SRC_DIR/stores/auth-store.ts"
collect_file "$SRC_DIR/stores/index.ts"

subsection "tour-store (file baru / sudah ada)"
collect_file "$SRC_DIR/stores/tour-store.ts"

# ════════════════════════════════════════════════════════════════
# 2. HOOKS — yang perlu dimodifikasi
# ════════════════════════════════════════════════════════════════

section "HOOKS"

subsection "hooks/auth — use-auth.ts perlu tambah initTourState"
collect_file "$SRC_DIR/hooks/auth/use-auth.ts"
collect_file "$SRC_DIR/hooks/auth/index.ts"

subsection "hooks/dashboard — use-tour.ts baru + index"
collect_file "$SRC_DIR/hooks/dashboard/use-tour.ts"
collect_file "$SRC_DIR/hooks/dashboard/use-onboarding.ts"
collect_file "$SRC_DIR/hooks/dashboard/index.ts"

# ════════════════════════════════════════════════════════════════
# 3. LIB/DASHBOARD — tour-steps.ts baru
# ════════════════════════════════════════════════════════════════

section "LIB — dashboard"

subsection "lib/dashboard (referensi steps-config + tour-steps baru)"
collect_file "$SRC_DIR/lib/dashboard/steps-config.ts"
collect_file "$SRC_DIR/lib/dashboard/onboarding-types.ts"
collect_file "$SRC_DIR/lib/dashboard/tour-steps.ts"
collect_file "$SRC_DIR/lib/dashboard/index.ts"

# ════════════════════════════════════════════════════════════════
# 4. COMPONENTS — nextstep-wrapper + dashboard-layout
# ════════════════════════════════════════════════════════════════

section "COMPONENTS — dashboard layout & wrapper"

collect_file "$SRC_DIR/components/dashboard/nextstep-wrapper.tsx"
collect_file "$SRC_DIR/components/dashboard/dashboard-layout.tsx"
collect_file "$SRC_DIR/components/dashboard/dashboard-header.tsx"
collect_file "$SRC_DIR/components/dashboard/index.ts"

# ════════════════════════════════════════════════════════════════
# 5. SETTINGS — toko/client.tsx & channels/client.tsx
# ════════════════════════════════════════════════════════════════

section "APP — settings pages (toko + channels)"

subsection "settings/toko"
collect_file "$SRC_DIR/app/(dashboard)/dashboard/settings/toko/client.tsx"
collect_file "$SRC_DIR/app/(dashboard)/dashboard/settings/toko/page.tsx"

subsection "settings/channels"
collect_file "$SRC_DIR/app/(dashboard)/dashboard/settings/channels/client.tsx"
collect_file "$SRC_DIR/app/(dashboard)/dashboard/settings/channels/page.tsx"

# ════════════════════════════════════════════════════════════════
# 6. SETTINGS COMPONENTS — semua step yang perlu +id tour
# ════════════════════════════════════════════════════════════════

section "COMPONENTS — settings/hero-section"
collect_dir "$SRC_DIR/components/dashboard/settings/hero-section"

section "COMPONENTS — settings/about-section"
collect_dir "$SRC_DIR/components/dashboard/settings/about-section"

section "COMPONENTS — settings/testimonials-section"
collect_dir "$SRC_DIR/components/dashboard/settings/testimonials-section"

section "COMPONENTS — settings/contact-section"
collect_dir "$SRC_DIR/components/dashboard/settings/contact-section"

section "COMPONENTS — settings/cta-section"
collect_dir "$SRC_DIR/components/dashboard/settings/cta-section"

section "COMPONENTS — settings/seo-section"
collect_dir "$SRC_DIR/components/dashboard/settings/seo-section"

section "COMPONENTS — settings/pembayaran-section"
collect_dir "$SRC_DIR/components/dashboard/settings/pembayaran-section"

section "COMPONENTS — settings/pengiriman-section"
collect_dir "$SRC_DIR/components/dashboard/settings/pengiriman-section"

# ════════════════════════════════════════════════════════════════
# 7. PRODUCTS — step components yang perlu +id tour
# ════════════════════════════════════════════════════════════════

section "COMPONENTS — products/product-form-section"
collect_dir "$SRC_DIR/components/dashboard/products/product-form-section"

# ════════════════════════════════════════════════════════════════
# 8. SETTINGS LAYOUT — untuk referensi tab switching
# ════════════════════════════════════════════════════════════════

section "COMPONENTS — settings layout & nav (referensi tab switching)"
collect_file "$SRC_DIR/components/dashboard/settings/settings-layout.tsx"
collect_file "$SRC_DIR/components/dashboard/settings/settings-nav.tsx"
collect_file "$SRC_DIR/components/dashboard/settings/settings-sidebar.tsx"

# ════════════════════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════════════════════

file_count=$(grep -c "^FILE:" "$OUTPUT_FILE" 2>/dev/null || echo "0")
file_size=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ SELESAI!                                               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}📂 Output : ${BOLD}$OUTPUT_FILE${NC}"
echo -e "  ${CYAN}📊 Files  : ${BOLD}$file_count files dikumpulkan${NC}"
echo -e "  ${CYAN}📦 Size   : ${BOLD}$file_size${NC}"
echo ""
echo -e "  ${YELLOW}📋 Langkah selanjutnya:${NC}"
echo -e "  ${DIM}  1. Upload file $OUTPUT_FILE ke Claude${NC}"
echo -e "  ${DIM}  2. Claude akan baca semua file existing kamu${NC}"
echo -e "  ${DIM}  3. Claude generate semua file tour yang sudah disesuaikan${NC}"
echo ""