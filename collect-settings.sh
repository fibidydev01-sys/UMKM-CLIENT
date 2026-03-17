#!/bin/bash

# ================================================================
# SETTINGS PAGES COLLECTOR
# Collect semua file di app/(dashboard)/dashboard/settings/
# Run from: client directory
# ================================================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

PROJECT_ROOT="."
SRC_DIR="$PROJECT_ROOT/src"
SETTINGS_DIR="$SRC_DIR/app/(dashboard)/dashboard/settings"
OUT="collections"
mkdir -p "$OUT"

TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
OUTPUT_FILE="$OUT/SETTINGS-PAGES-${TIMESTAMP}.txt"

cat > "$OUTPUT_FILE" << EOF
################################################################
##  SETTINGS PAGES COLLECTION
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##
##  Source: app/(dashboard)/dashboard/settings/**
##  Files : page.tsx + client.tsx per fitur
################################################################

EOF

echo -e "\n${CYAN}  Mengumpulkan semua settings pages...${NC}\n"

collect_file() {
    local file=$1
    if [ -f "$file" ]; then
        local rel="${file#$PROJECT_ROOT/}"
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}    ✓ ${NC}$rel ${CYAN}(${lines} lines)${NC}"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "FILE: $rel" >> "$OUTPUT_FILE"
        echo "Lines: $lines" >> "$OUTPUT_FILE"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
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

# ── TokoClient ──────────────────────────────────────────────────
section "TOKO"
collect_file "$SETTINGS_DIR/toko/page.tsx"
collect_file "$SETTINGS_DIR/toko/client.tsx"

section "HERO SECTION"
collect_file "$SETTINGS_DIR/hero-section/page.tsx"

section "ABOUT"
collect_file "$SETTINGS_DIR/about/page.tsx"

section "TESTIMONIALS"
collect_file "$SETTINGS_DIR/testimonials/page.tsx"

section "CONTACT"
collect_file "$SETTINGS_DIR/contact/page.tsx"

section "CTA"
collect_file "$SETTINGS_DIR/cta/page.tsx"

# ── ChannelsClient ───────────────────────────────────────────────
section "CHANNELS"
collect_file "$SETTINGS_DIR/channels/page.tsx"
collect_file "$SETTINGS_DIR/channels/client.tsx"

section "SEO"
collect_file "$SETTINGS_DIR/seo/page.tsx"

section "PEMBAYARAN"
collect_file "$SETTINGS_DIR/pembayaran/page.tsx"

section "PENGIRIMAN"
collect_file "$SETTINGS_DIR/pengiriman/page.tsx"

section "DOMAIN"
collect_file "$SETTINGS_DIR/domain/page.tsx"

# ── Summary ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ SELESAI!                                               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}  📂 Output : $OUTPUT_FILE${NC}"

FILE_COUNT=$(grep -c "^FILE:" "$OUTPUT_FILE" 2>/dev/null || echo "0")
FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)

echo -e "${CYAN}  📊 Files  : $FILE_COUNT${NC}"
echo -e "${CYAN}  📦 Size   : $FILE_SIZE${NC}"
echo ""