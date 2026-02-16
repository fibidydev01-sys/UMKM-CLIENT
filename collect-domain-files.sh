#!/bin/bash

# ================================================================
# CUSTOM DOMAIN FILES COLLECTOR - COMPLETE VERSION
# Collects ALL 19 files for custom domain feature
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

# Generate output filename
TIMESTAMP=$(date '+%Y-%m-%d-%H-%M-%S')
OUTPUT_FILE="$OUT/CUSTOM-DOMAIN-COMPLETE-$TIMESTAMP.txt"

# ================================================================
# FILE LIST - ALL 19 CUSTOM DOMAIN FILES
# ================================================================
FILES=(
    # ==========================================
    # PHASE 1: FOUNDATION (7 files)
    # ==========================================
    
    # Types
    "src/types/tenant.ts"
    "src/types/domain.ts"
    "src/types/index.ts"
    
    # API
    "src/lib/api/domain.ts"
    "src/lib/api/index.ts"
    
    # Hooks
    "src/hooks/use-domain.ts"
    "src/hooks/index.ts"
    
    # ==========================================
    # PHASE 2: CONFIG & ROUTING (6 files)
    # ==========================================
    
    # Config
    "src/config/constants.ts"
    "src/config/navigation.ts"
    "src/config/seo.config.ts"
    
    # Utils
    "src/lib/store-url.ts"
    
    # Proxy & API Route
    "src/proxy.ts"
    "src/app/api/tenant/resolve-domain/route.ts"
    
    # ==========================================
    # PHASE 3: UI COMPONENTS (6 files)
    # ==========================================
    
    # Page
    "src/app/(dashboard)/dashboard/settings/domain/page.tsx"
    
    # Components
    "src/components/domain/custom-domain-setup.tsx"
    "src/components/domain/domain-input-form.tsx"
    "src/components/domain/dns-instructions.tsx"
    "src/components/domain/domain-status-card.tsx"
    "src/components/domain/index.ts"
)

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
echo -e "${BLUE}║   CUSTOM DOMAIN FILES COLLECTOR - COMPLETE                 ║${NC}"
echo -e "${BLUE}║   Frontend (19 files)                                      ║${NC}"
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
##  CUSTOM DOMAIN FEATURE - COMPLETE COLLECTION
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  
##  📦 Next.js Frontend (19 files)
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
##  Phase 3 - UI Components (6 files):
##    - Page: domain/page.tsx
##    - Components: custom-domain-setup.tsx, domain-input-form.tsx,
##                  dns-instructions.tsx, domain-status-card.tsx, index.ts
################################################################


EOF

echo -e "${CYAN}Collecting files...${NC}\n"

# Track statistics
FOUND_COUNT=0
MISSING_COUNT=0

# Collect Phase 1
echo -e "${YELLOW}═══ PHASE 1: FOUNDATION (7 files) ═══${NC}"
echo "## PHASE 1: FOUNDATION" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for i in {0..6}; do
    if collect_file "${FILES[$i]}"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

echo "" >> "$OUTPUT_FILE"

# Collect Phase 2
echo ""
echo -e "${YELLOW}═══ PHASE 2: CONFIG & ROUTING (6 files) ═══${NC}"
echo "## PHASE 2: CONFIG & ROUTING" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for i in {7..12}; do
    if collect_file "${FILES[$i]}"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

echo "" >> "$OUTPUT_FILE"

# Collect Phase 3
echo ""
echo -e "${YELLOW}═══ PHASE 3: UI COMPONENTS (6 files) ═══${NC}"
echo "## PHASE 3: UI COMPONENTS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for i in {13..18}; do
    if collect_file "${FILES[$i]}"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ COLLECTION COMPLETE!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# File info
FILE_SIZE=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1)
TOTAL_LINES=$(grep "^Lines:" "$OUTPUT_FILE" | awk '{sum+=$2} END {print sum}')

echo -e "${CYAN}📂 Output: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 Files found: ${GREEN}$FOUND_COUNT${CYAN} / ${YELLOW}19${NC}"

if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "${RED}⚠️  Missing files: $MISSING_COUNT${NC}"
fi

echo -e "${CYAN}📦 Total size: $FILE_SIZE${NC}"
echo -e "${CYAN}📝 Total lines: $TOTAL_LINES${NC}"
echo ""

# List of collected files by phase
echo -e "${BLUE}Collected files by phase:${NC}"
echo ""

echo -e "${YELLOW}Phase 1 - Foundation:${NC}"
for i in {0..6}; do
    echo "  • ${FILES[$i]}"
done

echo ""
echo -e "${YELLOW}Phase 2 - Config & Routing:${NC}"
for i in {7..12}; do
    echo "  • ${FILES[$i]}"
done

echo ""
echo -e "${YELLOW}Phase 3 - UI Components:${NC}"
for i in {13..18}; do
    echo "  • ${FILES[$i]}"
done

echo ""

# Check if all files found
if [ $FOUND_COUNT -eq 19 ]; then
    echo -e "${GREEN}✅ SUCCESS: All 19 files collected!${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. Review: cat $OUTPUT_FILE"
    echo "  2. Share with team or backup"
    echo "  3. Deploy to production"
else
    echo -e "${RED}⚠️  WARNING: Some files are missing!${NC}"
    echo -e "${YELLOW}Please create the missing files before deployment.${NC}"
fi

echo ""