#!/bin/bash

# ================================================================
# PRODUCT FILES COLLECTOR - COMPLETE VERSION v2.1
# Collects ALL files for product feature + full dependency tree
# Run from: client directory
#
# FIXES dari v2.0 (berdasarkan folder map aktual):
#   - src/lib/validations/index.ts → src/lib/validations.ts (flat file)
#   - src/providers/index.ts       → src/providers/index.tsx (.tsx!)
#   - src/components/dashboard/page-header.tsx → tidak ada,
#     diganti collect SEMUA dashboard components
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

# Generate output filename
TIMESTAMP=$(date '+%Y-%m-%d-%H-%M-%S')
OUTPUT_FILE="$OUT/PRODUCTS-COMPLETE-$TIMESTAMP.txt"

# ================================================================
# FILE LIST - ALL PRODUCT FILES + FULL DEPENDENCY TREE
# ================================================================
FILES=(
    # ==========================================
    # PHASE 0: CORE INFRASTRUCTURE (10 files)
    # ==========================================

    # API Client (base HTTP)
    "src/lib/api/client.ts"          # [0]
    "src/lib/api/index.ts"           # [1]

    # Utilities
    "src/lib/utils.ts"               # [2]
    "src/lib/format.ts"              # [3]

    # Validations — FLAT FILE (bukan folder/index!)
    "src/lib/validations.ts"         # [4] ← FIXED dari v2.0

    # Config
    "src/config/constants.ts"        # [5]
    "src/config/index.ts"            # [6]

    # Providers — ekstensi .tsx bukan .ts!
    "src/providers/index.tsx"        # [7] ← FIXED dari v2.0
    "src/providers/toast-provider.tsx" # [8]

    # Store barrel
    "src/stores/index.ts"            # [9]

    # ==========================================
    # PHASE 1: TYPES & API (4 files)
    # ==========================================

    "src/types/api.ts"               # [10]
    "src/types/product.ts"           # [11]
    "src/types/index.ts"             # [12]
    "src/lib/api/products.ts"        # [13]

    # ==========================================
    # PHASE 2: HOOKS & STORE (3 files)
    # ==========================================

    "src/hooks/use-products.ts"      # [14]
    "src/hooks/index.ts"             # [15]
    "src/stores/products-store.ts"   # [16]

    # ==========================================
    # PHASE 3: SHARED COMPONENTS (13 files)
    # ==========================================

    # Upload components
    "src/components/upload/index.ts"                    # [17]
    "src/components/upload/multi-image-upload.tsx"      # [18]
    "src/components/upload/image-upload.tsx"            # [19]

    # Dashboard components — PageHeader tidak ada sebagai file tersendiri,
    # collect semua agar AI punya konteks lengkap
    "src/components/dashboard/index.ts"                 # [20]
    "src/components/dashboard/dashboard-header.tsx"     # [21]
    "src/components/dashboard/dashboard-shell.tsx"      # [22]
    "src/components/dashboard/dashboard-layout.tsx"     # [23]
    "src/components/dashboard/dashboard-sidebar.tsx"    # [24]
    "src/components/dashboard/dashboard-nav.tsx"        # [25]
    "src/components/dashboard/dashboard-breadcrumb.tsx" # [26]
    "src/components/dashboard/mobile-navbar.tsx"        # [27]
    "src/components/dashboard/upgrade-modal.tsx"        # [28]
    "src/components/dashboard/dashboard-quick-actions.tsx" # [29]

    # ==========================================
    # PHASE 4: PRODUCT COMPONENTS (9 files)
    # ==========================================

    "src/components/products/index.ts"                  # [30]
    "src/components/products/product-form.tsx"          # [31]
    "src/components/products/products-table.tsx"        # [32]
    "src/components/products/products-table-columns.tsx" # [33]
    "src/components/products/products-table-toolbar.tsx" # [34]
    "src/components/products/products-grid.tsx"         # [35]
    "src/components/products/product-grid-card.tsx"     # [36]
    "src/components/products/product-delete-dialog.tsx" # [37]
    "src/components/products/product-preview-drawer.tsx" # [38]

    # ==========================================
    # PHASE 5: PAGES (3 files)
    # ==========================================

    "src/app/(dashboard)/dashboard/products/page.tsx"           # [39]
    "src/app/(dashboard)/dashboard/products/new/page.tsx"       # [40]
    "src/app/(dashboard)/dashboard/products/[id]/edit/page.tsx" # [41]
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
        echo "# ⚠️  FILE NOT FOUND: $file_path" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        return 1
    fi
}

# ================================================================
# MAIN
# ================================================================

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PRODUCTS FEATURE FILES COLLECTOR v2.1                    ║${NC}"
echo -e "${BLUE}║   Frontend ($TOTAL_FILES files) - Full Dependency Tree              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -d "$SRC_DIR" ]; then
    echo -e "${RED}ERROR: SRC_DIR not found: $SRC_DIR${NC}"
    echo -e "${YELLOW}Make sure you run this script from the client directory${NC}"
    exit 1
fi

# Create file header
cat > "$OUTPUT_FILE" << EOF
################################################################
##  PRODUCTS FEATURE - COMPLETE COLLECTION v2.1
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##
##  Phase 0 - Core Infrastructure (10 files):
##    - API: client.ts, index.ts
##    - Utils: utils.ts, format.ts
##    - Validations: validations.ts  ← flat file
##    - Config: constants.ts, index.ts
##    - Providers: index.tsx, toast-provider.tsx
##    - Store barrel: index.ts
##
##  Phase 1 - Types & API (4 files):
##    - Types: api.ts, product.ts, index.ts
##    - API: products.ts
##
##  Phase 2 - Hooks & Store (3 files):
##    - Hooks: use-products.ts, index.ts
##    - Store: products-store.ts
##
##  Phase 3 - Shared Components (13 files):
##    - Upload: index.ts, multi-image-upload.tsx, image-upload.tsx
##    - Dashboard: index.ts + all 9 dashboard components
##
##  Phase 4 - Product Components (9 files):
##    - index.ts, product-form.tsx
##    - products-table.tsx, products-table-columns.tsx
##    - products-table-toolbar.tsx, products-grid.tsx
##    - product-grid-card.tsx, product-delete-dialog.tsx
##    - product-preview-drawer.tsx
##
##  Phase 5 - Pages (3 files):
##    - products/page.tsx
##    - products/new/page.tsx
##    - products/[id]/edit/page.tsx
##
##  NOTE: src/components/ui/* intentionally excluded
##        (auto-generated shadcn components)
################################################################


EOF

echo -e "${CYAN}Collecting files...${NC}\n"

FOUND_COUNT=0
MISSING_COUNT=0

# ──────────────────────────────────────────
# Phase 0 - Core Infrastructure
# ──────────────────────────────────────────
echo -e "${YELLOW}═══ PHASE 0: CORE INFRASTRUCTURE (10 files) ═══${NC}"
echo "## PHASE 0: CORE INFRASTRUCTURE" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {0..9}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done
echo "" >> "$OUTPUT_FILE"

# ──────────────────────────────────────────
# Phase 1 - Types & API
# ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}═══ PHASE 1: TYPES & API (4 files) ═══${NC}"
echo "## PHASE 1: TYPES & API" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {10..13}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done
echo "" >> "$OUTPUT_FILE"

# ──────────────────────────────────────────
# Phase 2 - Hooks & Store
# ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}═══ PHASE 2: HOOKS & STORE (3 files) ═══${NC}"
echo "## PHASE 2: HOOKS & STORE" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {14..16}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done
echo "" >> "$OUTPUT_FILE"

# ──────────────────────────────────────────
# Phase 3 - Shared Components
# ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}═══ PHASE 3: SHARED COMPONENTS (13 files) ═══${NC}"
echo "## PHASE 3: SHARED COMPONENTS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {17..29}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done
echo "" >> "$OUTPUT_FILE"

# ──────────────────────────────────────────
# Phase 4 - Product Components
# ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}═══ PHASE 4: PRODUCT COMPONENTS (9 files) ═══${NC}"
echo "## PHASE 4: PRODUCT COMPONENTS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {30..38}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done
echo "" >> "$OUTPUT_FILE"

# ──────────────────────────────────────────
# Phase 5 - Pages
# ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}═══ PHASE 5: PAGES (3 files) ═══${NC}"
echo "## PHASE 5: PAGES" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
for i in {39..41}; do
    if collect_file "${FILES[$i]}"; then ((FOUND_COUNT++)); else ((MISSING_COUNT++)); fi
done

# ================================================================
# SUMMARY
# ================================================================
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ COLLECTION COMPLETE!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)
TOTAL_LINES=$(grep "^Lines:" "$OUTPUT_FILE" | awk '{sum+=$2} END {print sum}')

echo -e "${CYAN}📂 Output: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 Files found: ${GREEN}$FOUND_COUNT${CYAN} / ${YELLOW}$TOTAL_FILES${NC}"

if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "${RED}⚠️  Missing files: $MISSING_COUNT${NC}"
fi

echo -e "${CYAN}📦 Total size: $FILE_SIZE${NC}"
echo -e "${CYAN}📝 Total lines: $TOTAL_LINES${NC}"
echo ""

echo -e "${BLUE}Collected files by phase:${NC}"
echo ""
echo -e "${YELLOW}Phase 0 - Core Infrastructure:${NC}"
for i in {0..9};  do echo "  • ${FILES[$i]}"; done
echo ""
echo -e "${YELLOW}Phase 1 - Types & API:${NC}"
for i in {10..13}; do echo "  • ${FILES[$i]}"; done
echo ""
echo -e "${YELLOW}Phase 2 - Hooks & Store:${NC}"
for i in {14..16}; do echo "  • ${FILES[$i]}"; done
echo ""
echo -e "${YELLOW}Phase 3 - Shared Components:${NC}"
for i in {17..29}; do echo "  • ${FILES[$i]}"; done
echo ""
echo -e "${YELLOW}Phase 4 - Product Components:${NC}"
for i in {30..38}; do echo "  • ${FILES[$i]}"; done
echo ""
echo -e "${YELLOW}Phase 5 - Pages:${NC}"
for i in {39..41}; do echo "  • ${FILES[$i]}"; done
echo ""

if [ $FOUND_COUNT -eq $TOTAL_FILES ]; then
    echo -e "${GREEN}✅ SUCCESS: All $TOTAL_FILES files collected!${NC}"
else
    echo -e "${YELLOW}⚠️  $MISSING_COUNT file(s) not found — check paths above.${NC}"
    echo -e "${YELLOW}   Missing files are noted inside the output file.${NC}"
fi

echo ""
echo -e "${BLUE}NOTE: src/components/ui/* excluded (shadcn auto-generated)${NC}"
echo ""