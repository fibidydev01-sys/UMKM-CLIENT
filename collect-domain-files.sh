#!/bin/bash

# ================================================================
# CUSTOM DOMAIN FILES COLLECTOR - CLEAN VERSION
# Collects 17 files (dns-instructions-card & dns-setup-modal dihapus)
# Run from: client directory
# ================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ROOT="."
SRC_DIR="$PROJECT_ROOT/src"
OUT="collections"
mkdir -p "$OUT"

TIMESTAMP=$(date '+%Y-%m-%d-%H-%M-%S')
OUTPUT_FILE="$OUT/CUSTOM-DOMAIN-CLEAN-$TIMESTAMP.txt"

# ================================================================
# FILE LIST - 17 FILES (CLEAN - no polling, no wizard)
# ================================================================
FILES=(
    # ==========================================
    # PHASE 1: FOUNDATION (7 files)
    # ==========================================
    "src/types/tenant.ts"
    "src/types/domain.ts"
    "src/types/index.ts"
    "src/lib/api/domain.ts"
    "src/lib/api/index.ts"
    "src/hooks/use-domain.ts"
    "src/hooks/index.ts"

    # ==========================================
    # PHASE 2: CONFIG & ROUTING (6 files)
    # ==========================================
    "src/config/constants.ts"
    "src/config/navigation.ts"
    "src/config/seo.config.ts"
    "src/lib/store-url.ts"
    "src/proxy.ts"
    "src/app/api/tenant/resolve-domain/route.ts"

    # ==========================================
    # PHASE 3: UI COMPONENTS (4 files — CLEAN)
    # ❌ DIHAPUS: dns-instructions-card.tsx
    # ❌ DIHAPUS: dns-setup-modal.tsx
    # ==========================================
    "src/app/(dashboard)/dashboard/settings/domain/page.tsx"
    "src/components/domain/custom-domain-setup.tsx"
    "src/components/domain/domain-input-form.tsx"
    "src/components/domain/dns-instructions.tsx"
    "src/components/domain/domain-status-card.tsx"
    "src/components/domain/index.ts"
)

TOTAL_FILES=${#FILES[@]}

# ================================================================
# HELPER FUNCTIONS
# ================================================================

collect_file() {
    local file_path=$1
    local full_path="$PROJECT_ROOT/$file_path"

    if [ -f "$full_path" ]; then
        local lines=$(wc -l < "$full_path" 2>/dev/null || echo "0")
        echo -e "${GREEN}  ✓${NC} $file_path ${CYAN}($lines lines)${NC}"

        echo "================================================" >> "$OUTPUT_FILE"
        echo "FILE: $file_path" >> "$OUTPUT_FILE"
        echo "Lines: $lines" >> "$OUTPUT_FILE"
        echo "================================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        cat "$full_path" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
        return 0
    else
        echo -e "${RED}  ✗${NC} NOT FOUND: $file_path"
        return 1
    fi
}

# ================================================================
# MAIN
# ================================================================

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CUSTOM DOMAIN FILES COLLECTOR - CLEAN VERSION            ║${NC}"
echo -e "${BLUE}║   Frontend ($TOTAL_FILES files) — No polling, no wizard            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ! -d "$SRC_DIR" ]; then
    echo -e "${RED}ERROR: SRC_DIR not found: $SRC_DIR${NC}"
    echo -e "${YELLOW}Jalankan script ini dari folder client/${NC}"
    exit 1
fi

# Header
cat > "$OUTPUT_FILE" << EOF
################################################################
##  CUSTOM DOMAIN FEATURE - CLEAN COLLECTION
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##
##  📦 Next.js Frontend ($TOTAL_FILES files)
##  ✅ No auto-polling
##  ✅ No wizard step berlapis
##  ✅ Manual "Cek Status" button
##  ✅ DNS records dari Vercel langsung
##
##  Phase 1 - Foundation (7 files):
##    - Types: tenant.ts, domain.ts, index.ts
##    - API: domain.ts, index.ts
##    - Hooks: use-domain.ts, index.ts
##
##  Phase 2 - Config & Routing (6 files):
##    - Config: constants.ts, navigation.ts, seo.config.ts
##    - Utils: store-url.ts
##    - Proxy: proxy.ts
##    - API Route: resolve-domain/route.ts
##
##  Phase 3 - UI Components (4 files — CLEAN):
##    - Page: domain/page.tsx
##    - Components: custom-domain-setup.tsx, domain-input-form.tsx,
##                  dns-instructions.tsx, domain-status-card.tsx, index.ts
##
##  ❌ DIHAPUS (file lama):
##    - dns-instructions-card.tsx
##    - dns-setup-modal.tsx
################################################################


EOF

echo -e "${CYAN}Collecting files...${NC}\n"

FOUND_COUNT=0
MISSING_COUNT=0

# Phase 1
echo -e "${YELLOW}═══ PHASE 1: FOUNDATION (7 files) ═══${NC}"
echo "## PHASE 1: FOUNDATION" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {0..6}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done

echo "" >> "$OUTPUT_FILE"

# Phase 2
echo ""
echo -e "${YELLOW}═══ PHASE 2: CONFIG & ROUTING (6 files) ═══${NC}"
echo "## PHASE 2: CONFIG & ROUTING" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {7..12}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done

echo "" >> "$OUTPUT_FILE"

# Phase 3
echo ""
echo -e "${YELLOW}═══ PHASE 3: UI COMPONENTS (4 files — CLEAN) ═══${NC}"
echo "## PHASE 3: UI COMPONENTS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {13..18}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ COLLECTION COMPLETE!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)
TOTAL_LINES=$(grep "^Lines:" "$OUTPUT_FILE" | awk '{sum+=$2} END {print sum}')

echo -e "${CYAN}📂 Output : $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 Found  : ${GREEN}$FOUND_COUNT${CYAN} / ${YELLOW}$TOTAL_FILES${NC}"
[ $MISSING_COUNT -gt 0 ] && echo -e "${RED}⚠️  Missing: $MISSING_COUNT${NC}"
echo -e "${CYAN}📦 Size   : $FILE_SIZE${NC}"
echo -e "${CYAN}📝 Lines  : $TOTAL_LINES${NC}"
echo ""

echo -e "${BLUE}Files by phase:${NC}"
echo ""
echo -e "${YELLOW}Phase 1 - Foundation:${NC}"
for i in {0..6}; do echo "  • ${FILES[$i]}"; done

echo ""
echo -e "${YELLOW}Phase 2 - Config & Routing:${NC}"
for i in {7..12}; do echo "  • ${FILES[$i]}"; done

echo ""
echo -e "${YELLOW}Phase 3 - UI Components (CLEAN):${NC}"
for i in {13..18}; do echo "  • ${FILES[$i]}"; done

echo ""
echo -e "${RED}Dihapus (file lama):${NC}"
echo "  ✗ src/components/domain/dns-instructions-card.tsx"
echo "  ✗ src/components/domain/dns-setup-modal.tsx"
echo ""

if [ $FOUND_COUNT -eq $TOTAL_FILES ]; then
    echo -e "${GREEN}✅ SUCCESS: Semua $TOTAL_FILES files terkumpul!${NC}"
else
    echo -e "${RED}⚠️  WARNING: $MISSING_COUNT file tidak ditemukan!${NC}"
fi
echo ""