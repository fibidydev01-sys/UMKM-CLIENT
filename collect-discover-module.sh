#!/bin/bash

# ============================================
# DISCOVER MODULE COLLECTOR (V2 - ISOLATED)
# Path: @/components/discover (NEW!)
# ============================================
#
# SCOPE:
# - Discover pages (main + category)
# - Discover components (NEW PATH: src/components/discover/)
# - Shared dependencies (UI, lib, config)
#
# Usage:
# chmod +x collect-discover-module.sh
# ./collect-discover-module.sh
#
# ============================================

OUTPUT_DIR="collections"
OUTPUT_FILE="$OUTPUT_DIR/discover-module-$(date +%Y%m%d-%H%M%S).txt"

mkdir -p "$OUTPUT_DIR"

echo "🔍 Discover Module Collector (V2 - Isolated)"
echo "=============================================="
echo ""
echo "📍 Working directory: $(pwd)"
echo "📄 Output file: $OUTPUT_FILE"
echo ""

FOUND_COUNT=0
NOT_FOUND_COUNT=0
TOTAL_LINES=0

cat > "$OUTPUT_FILE" << EOF
================================================================
DISCOVER MODULE - COMPLETE COLLECTION (V2 - ISOLATED)
Generated on: $(date)
Working Directory: $(pwd)
================================================================

SCOPE:
- Discover Pages (main + category routing)
- Discover Components (NEW: src/components/discover/)
- Shared Dependencies (UI, lib, config)

================================================================

EOF

collect_file() {
    local file=$1
    local relative_path=$2
    
    if [ -f "$file" ]; then
        local line_count=$(wc -l < "$file")
        TOTAL_LINES=$((TOTAL_LINES + line_count))
        FOUND_COUNT=$((FOUND_COUNT + 1))
        echo "✅ $relative_path (${line_count} lines)"
        cat >> "$OUTPUT_FILE" << EOF

================================================
FILE: $relative_path
Lines: $line_count
================================================

$(cat "$file")

EOF
    else
        NOT_FOUND_COUNT=$((NOT_FOUND_COUNT + 1))
        echo "❌ NOT FOUND: $relative_path"
    fi
}

# ============================================
# SECTION 1: DISCOVER PAGES
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📄 DISCOVER PAGES (5 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/app/discover/page.tsx" "src/app/discover/page.tsx"
collect_file "src/app/discover/client.tsx" "src/app/discover/client.tsx"
collect_file "src/app/discover/[category]/page.tsx" "src/app/discover/[category]/page.tsx"
collect_file "src/app/discover/[category]/client.tsx" "src/app/discover/[category]/client.tsx"
collect_file "src/app/discover/[category]/not-found.tsx" "src/app/discover/[category]/not-found.tsx"

# ============================================
# SECTION 2: DISCOVER COMPONENTS (NEW PATH!)
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🎨 DISCOVER COMPONENTS (10 files)"
echo "   📁 NEW PATH: src/components/discover/"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/components/discover/index.ts" "src/components/discover/index.ts"
collect_file "src/components/discover/discover-header.tsx" "src/components/discover/discover-header.tsx"
collect_file "src/components/discover/discover-hero.tsx" "src/components/discover/discover-hero.tsx"
collect_file "src/components/discover/discover-search.tsx" "src/components/discover/discover-search.tsx"
collect_file "src/components/discover/discover-footer.tsx" "src/components/discover/discover-footer.tsx"
collect_file "src/components/discover/category-filter-bar.tsx" "src/components/discover/category-filter-bar.tsx"
collect_file "src/components/discover/tenant-preview-drawer.tsx" "src/components/discover/tenant-preview-drawer.tsx"
collect_file "src/components/discover/minimal-footer.tsx" "src/components/discover/minimal-footer.tsx"
collect_file "src/components/discover/umkm-showcase-section.tsx" "src/components/discover/umkm-showcase-section.tsx"
collect_file "src/components/discover/umkm-discover-section.tsx" "src/components/discover/umkm-discover-section.tsx"

# ============================================
# SECTION 3: SHARED LIB
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "🔧 SHARED LIB (4 files)"
echo "═══════════════════════════════════════════"
echo ""

collect_file "src/lib/cn.ts" "src/lib/cn.ts"
collect_file "src/lib/format.ts" "src/lib/format.ts"
collect_file "src/lib/store-url.ts" "src/lib/store-url.ts"
collect_file "src/config/categories.ts" "src/config/categories.ts"

# ============================================
# SUMMARY
# ============================================

echo ""
echo "═══════════════════════════════════════════"
echo "📊 COLLECTION SUMMARY"
echo "═══════════════════════════════════════════"
echo ""

cat >> "$OUTPUT_FILE" << EOF

================================================================
COLLECTION SUMMARY
================================================================

📦 Discover Module (V2 - Isolated):
   📄 Pages: 5 files
   🎨 Components: 10 files (src/components/discover/)
   🔧 Lib/Config: 4 files
   ─────────────────
   📁 Total: 19 files
   
📝 Stats:
   ✅ Found: $FOUND_COUNT files
   ❌ Missing: $NOT_FOUND_COUNT files
   📝 Total lines: $TOTAL_LINES

📍 Output: $(pwd)/$OUTPUT_FILE

================================================================
END OF COLLECTION
================================================================
EOF

echo "✅ Discover module collected!"
echo "📄 Output: $OUTPUT_FILE"
echo "📊 Found: $FOUND_COUNT | Missing: $NOT_FOUND_COUNT | Lines: $TOTAL_LINES"
echo ""