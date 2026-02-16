#!/bin/bash

# ================================================================
# OG IMAGE FILES COLLECTOR + METADATA CHECKER
# Collects OG (Open Graph) image files AND their page.tsx files
# with metadata for debugging social media sharing issues
# Run from: client directory
# ================================================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m'

OUT="collections"
mkdir -p "$OUT"

TIMESTAMP=$(date '+%Y-%m-%d-%H-%M-%S')
OUTPUT_FILE="$OUT/OG-DEBUG-$TIMESTAMP.txt"

# OG Image Files
OG_FILES=(
    "src/app/opengraph-image.tsx"
    "src/app/twitter-image.tsx"
    "src/app/store/[slug]/opengraph-image.tsx"
    "src/app/store/[slug]/products/[id]/opengraph-image.tsx"
)

# Page files with metadata
PAGE_FILES=(
    "src/app/store/[slug]/page.tsx"
    "src/app/store/[slug]/products/[id]/page.tsx"
    "src/app/store/[slug]/layout.tsx"
)

# Utils and config files
UTIL_FILES=(
    "src/lib/og-utils.ts"
    "src/lib/seo.ts"
    "next.config.js"
    "next.config.mjs"
    ".env.local"
    ".env"
)

collect_file() {
    local file_path=$1
    local category=$2
    
    if [ -f "$file_path" ]; then
        local lines=$(wc -l < "$file_path")
        echo -e "${GREEN}✓${NC} $file_path ${CYAN}($lines lines)${NC}"
        
        echo "===============================================" >> "$OUTPUT_FILE"
        echo "FILE: $file_path" >> "$OUTPUT_FILE"
        echo "Category: $category" >> "$OUTPUT_FILE"
        echo "Lines: $lines" >> "$OUTPUT_FILE"
        echo "===============================================" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Special handling for .env files - mask sensitive data
        if [[ "$file_path" == *".env"* ]]; then
            echo "⚠️  SENSITIVE FILE - Masking values" >> "$OUTPUT_FILE"
            sed 's/=.*/=***MASKED***/g' "$file_path" >> "$OUTPUT_FILE"
        else
            cat "$file_path" >> "$OUTPUT_FILE"
        fi
        
        echo -e "\n\n" >> "$OUTPUT_FILE"
        return 0
    else
        echo -e "${RED}✗ NOT FOUND:${NC} $file_path"
        
        echo "===============================================" >> "$OUTPUT_FILE"
        echo "FILE: $file_path" >> "$OUTPUT_FILE"
        echo "Status: NOT FOUND" >> "$OUTPUT_FILE"
        echo "===============================================" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
        return 1
    fi
}

echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${CYAN}   OG IMAGE DEBUG COLLECTOR${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""

# Header
cat > "$OUTPUT_FILE" << 'HEADER'
################################################################
##  OG IMAGE DEBUG COLLECTION
##  
##  📸 Open Graph Images & Metadata for Social Media Sharing
##  
##  This collection includes:
##    1. OG Image Generators (opengraph-image.tsx)
##    2. Page Components with Metadata (page.tsx)
##    3. Layout Files (layout.tsx)
##    4. Utility Functions (og-utils.ts, seo.ts)
##    5. Configuration Files (next.config.js, .env)
##
##  Purpose: Debug 500 Internal Server Error on OG image routes
##
##  🔍 Debug Checklist:
##     ✓ OG image files use runtime = 'nodejs' (not 'edge')
##     ✓ Page files export generateMetadata() function
##     ✓ Metadata includes openGraph.images array
##     ✓ API_URL environment variable is set correctly
##     ✓ Error handling for null/undefined data
##     ✓ Safe access for optional properties (images?.[0])
##
################################################################

HEADER

FOUND_COUNT=0
MISSING_COUNT=0

# Collect OG Image files
echo -e "${YELLOW}═══ OG IMAGE GENERATORS (4 files) ═══${NC}\n"
echo -e "${MAGENTA}Root Level:${NC}"
for i in 0 1; do
    if collect_file "${OG_FILES[$i]}" "OG Image Generator"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

echo ""
echo -e "${MAGENTA}Store Level:${NC}"
if collect_file "${OG_FILES[2]}" "OG Image Generator"; then
    ((FOUND_COUNT++))
else
    ((MISSING_COUNT++))
fi

echo ""
echo -e "${MAGENTA}Product Level:${NC}"
if collect_file "${OG_FILES[3]}" "OG Image Generator"; then
    ((FOUND_COUNT++))
else
    ((MISSING_COUNT++))
fi

# Collect Page files with metadata
echo ""
echo -e "${YELLOW}═══ PAGE & LAYOUT FILES (3 files) ═══${NC}\n"
for page_file in "${PAGE_FILES[@]}"; do
    if collect_file "$page_file" "Page Component"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

# Collect Utility files
echo ""
echo -e "${YELLOW}═══ UTILITY & CONFIG FILES ═══${NC}\n"
for util_file in "${UTIL_FILES[@]}"; do
    if collect_file "$util_file" "Utility/Config"; then
        ((FOUND_COUNT++))
    else
        ((MISSING_COUNT++))
    fi
done

# Add debugging instructions
cat >> "$OUTPUT_FILE" << 'DEBUG_GUIDE'

################################################################
##  🔧 DEBUGGING GUIDE - 500 Internal Server Error
################################################################

## Common Causes & Solutions:

### 1. Runtime Configuration Error
   Problem: Using 'edge' runtime instead of 'nodejs'
   Solution: 
   ```typescript
   export const runtime = 'nodejs'; // NOT 'edge'
   ```

### 2. API Fetch Failure
   Problem: API endpoint returns 404/500 or network error
   Solution:
   - Check API_URL environment variable
   - Add proper error handling:
   ```typescript
   async function getProduct(id: string) {
     try {
       const res = await fetch(`${apiUrl}/products/public/${id}`);
       if (!res.ok) return null;
       return res.json();
     } catch (err) {
       console.error('[OG] Fetch error:', err);
       return null;
     }
   }
   ```

### 3. Null Data Access
   Problem: Accessing properties on null/undefined objects
   Solution:
   ```typescript
   if (!product) {
     return new ImageResponse(/* Fallback JSX */);
   }
   const productImage = product.images?.[0]; // Safe access
   ```

### 4. Missing generateMetadata() in page.tsx
   Problem: Page doesn't export metadata for OG tags
   Solution:
   ```typescript
   export async function generateMetadata({ params }) {
     return {
       openGraph: {
         images: ['/store/[slug]/products/[id]/opengraph-image'],
       },
     };
   }
   ```

### 5. Route Path Mismatch
   Problem: OG image file path doesn't match URL structure
   Current Structure:
   - File: src/app/store/[slug]/products/[id]/opengraph-image.tsx
   - URL: /store/[slug]/products/[id]/opengraph-image ✓
   
   If subdomain routing (burgerchina.fibidy.com/products/...):
   - Need: src/app/products/[id]/opengraph-image.tsx
   - OR: Middleware to rewrite subdomain to /store/[slug]

### 6. Image Processing Error
   Problem: External images fail to load or process
   Solution:
   - Add remotePatterns in next.config.js
   - Use proper image URLs (https://)
   - Handle missing images with fallback

## Testing Commands:

1. Test OG Image directly in browser:
   https://fibidy.com/store/burgerchina/products/[id]/opengraph-image

2. Check metadata with curl:
   curl -I https://fibidy.com/store/burgerchina/products/[id]

3. Validate with Meta Debugger:
   https://developers.facebook.com/tools/debug/

4. Check server logs for error details

################################################################
DEBUG_GUIDE

# Summary
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ COLLECTION COMPLETE!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""

FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
TOTAL_FILES=$((${#OG_FILES[@]} + ${#PAGE_FILES[@]} + ${#UTIL_FILES[@]}))

echo -e "${CYAN}📂 Output:${NC} $OUTPUT_FILE"
echo -e "${CYAN}📊 Files collected:${NC} ${GREEN}$FOUND_COUNT${NC}/${YELLOW}$TOTAL_FILES${NC}"

if [ $MISSING_COUNT -gt 0 ]; then
    echo -e "${RED}⚠️  Missing files:${NC} $MISSING_COUNT"
fi

echo -e "${CYAN}📦 Total size:${NC} $FILE_SIZE"
echo ""

# Analysis and recommendations
echo -e "${YELLOW}═══ ANALYSIS & RECOMMENDATIONS ═══${NC}"
echo ""

# Check if key OG files exist
if [ -f "src/app/store/[slug]/products/[id]/opengraph-image.tsx" ]; then
    echo -e "${GREEN}✓${NC} Product OG image file exists"
    
    # Check for runtime configuration
    if grep -q "runtime.*=.*'edge'" "src/app/store/[slug]/products/[id]/opengraph-image.tsx" 2>/dev/null; then
        echo -e "${RED}✗ WARNING:${NC} Using 'edge' runtime - should be 'nodejs'"
        echo -e "  ${CYAN}Fix:${NC} Change to: export const runtime = 'nodejs';"
    else
        echo -e "${GREEN}✓${NC} Runtime configuration looks good"
    fi
else
    echo -e "${RED}✗${NC} Product OG image file NOT FOUND"
    echo -e "  ${CYAN}Action:${NC} Create file at: src/app/store/[slug]/products/[id]/opengraph-image.tsx"
fi

# Check if page.tsx has metadata
if [ -f "src/app/store/[slug]/products/[id]/page.tsx" ]; then
    echo -e "${GREEN}✓${NC} Product page file exists"
    
    if grep -q "generateMetadata" "src/app/store/[slug]/products/[id]/page.tsx" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} generateMetadata() function found"
    else
        echo -e "${RED}✗ WARNING:${NC} generateMetadata() function NOT found"
        echo -e "  ${CYAN}Fix:${NC} Add metadata export to page.tsx"
    fi
else
    echo -e "${RED}✗${NC} Product page file NOT FOUND"
fi

# Check og-utils
if [ -f "src/lib/og-utils.ts" ]; then
    echo -e "${GREEN}✓${NC} OG utility file exists"
else
    echo -e "${YELLOW}⚠${NC}  OG utility file not found (optional)"
fi

# Check env files
if [ -f ".env.local" ] || [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Environment file exists"
    echo -e "  ${CYAN}Note:${NC} Check API_URL is set correctly"
else
    echo -e "${YELLOW}⚠${NC}  No .env file found"
fi

echo ""
echo -e "${CYAN}═══ NEXT STEPS ═══${NC}"
echo ""
echo "1. Review the collected files in: $OUTPUT_FILE"
echo "2. Check for errors mentioned in the DEBUGGING GUIDE"
echo "3. Test OG image URL directly in browser"
echo "4. Add console.log() statements for debugging"
echo "5. Check server logs for detailed error messages"
echo ""
echo -e "${GREEN}Good luck debugging! 🚀${NC}"
echo ""