#!/bin/bash

# ================================================================
# CLIENT — SMART INTERACTIVE COLLECTION V2
# Choose what to collect: Auth, App, Components, Lib
# Auto-skip deleted modules (Customers, Orders, WhatsApp, etc.)
# Run from: client directory
# ================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

PROJECT_ROOT="."
SRC_DIR="$PROJECT_ROOT/src"
OUT="collections"
mkdir -p "$OUT"

# ================================================================
# SKIP PATTERNS - Files/Folders to ALWAYS skip
# ================================================================
SKIP_PATTERNS=(
    "customers"
    "orders"
    "whatsapp"
    "auto-reply"
    "bookmarks"
    "explore"
    "channels"
    "pembayaran"
    "pengiriman"
    "track"
    "discover"
    "checkout"
    "order-tracking"
)

# ================================================================
# HELPER FUNCTIONS
# ================================================================

should_skip() {
    local path=$1
    local lower_path=$(echo "$path" | tr '[:upper:]' '[:lower:]')
    
    for pattern in "${SKIP_PATTERNS[@]}"; do
        if [[ "$lower_path" == *"$pattern"* ]]; then
            return 0  # Skip this file
        fi
    done
    return 1  # Don't skip
}

collect_file() {
    local file=$1
    local output=$2
    
    # Check if should skip
    if should_skip "$file"; then
        echo -e "${RED}  ✗ SKIP: ${file#$PROJECT_ROOT/} (deleted module)${NC}"
        return
    fi
    
    if [ -f "$file" ]; then
        local rel="${file#$PROJECT_ROOT/}"
        local lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo -e "${GREEN}  ✓ ${NC}$rel ${CYAN}(${lines} lines)${NC}"
        echo "================================================" >> "$output"
        echo "FILE: $rel" >> "$output"
        echo "Lines: $lines" >> "$output"
        echo "================================================" >> "$output"
        echo "" >> "$output"
        cat "$file" >> "$output"
        echo -e "\n\n" >> "$output"
    else
        echo -e "${YELLOW}  ⚠ NOT FOUND: ${file#$PROJECT_ROOT/}${NC}"
    fi
}

collect_folder() {
    local folder=$1
    local output=$2
    
    if [ ! -d "$folder" ]; then
        echo -e "${YELLOW}  ⚠ FOLDER NOT FOUND: ${folder#$PROJECT_ROOT/}${NC}"
        return
    fi
    
    local collected=0
    local skipped=0
    
    # Find all TS/TSX files
    while IFS= read -r -d '' file; do
        # Check if should skip
        if should_skip "$file"; then
            ((skipped++))
            continue
        fi
        
        collect_file "$file" "$output"
        ((collected++))
    done < <(find "$folder" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -print0 2>/dev/null)
    
    if [ $skipped -gt 0 ]; then
        echo -e "${RED}  ✗ Skipped $skipped files (deleted modules)${NC}"
    fi
    echo -e "${CYAN}  → Collected: $collected files${NC}"
}

section_header() {
    local label=$1
    local output=$2
    echo "" >> "$output"
    echo "################################################################" >> "$output"
    echo "##  $label" >> "$output"
    echo "################################################################" >> "$output"
    echo "" >> "$output"
    echo -e "\n${MAGENTA}▶ $label${NC}"
}

# ================================================================
# COLLECTION FUNCTIONS
# ================================================================

collect_auth() {
    local output=$1
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  COLLECTING: AUTH (Complete Auth Flow)                     ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
    
    section_header "AUTH - Pages (Login, Register, Forgot Password)" "$output"
    collect_folder "$SRC_DIR/app/(auth)" "$output"
    
    section_header "AUTH - Components (Forms, Steps, Guards)" "$output"
    collect_folder "$SRC_DIR/components/auth" "$output"
    
    section_header "AUTH - API (Auth Service)" "$output"
    collect_file "$SRC_DIR/lib/api/auth.ts" "$output"
    
    section_header "AUTH - Hooks (useAuth, useRegisterWizard)" "$output"
    collect_file "$SRC_DIR/hooks/use-auth.ts" "$output"
    collect_file "$SRC_DIR/hooks/use-register-wizard.ts" "$output"
    
    section_header "AUTH - Store (Auth State Management)" "$output"
    collect_file "$SRC_DIR/stores/auth-store.ts" "$output"
    
    section_header "AUTH - Types (Auth Interfaces & Types)" "$output"
    collect_file "$SRC_DIR/types/auth.ts" "$output"
}

collect_app() {
    local output=$1
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  COLLECTING: APP (Pages & Routes)                         ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
    
    section_header "APP - Root Files" "$output"
    collect_file "$SRC_DIR/app/layout.tsx" "$output"
    collect_file "$SRC_DIR/app/page.tsx" "$output"
    collect_file "$SRC_DIR/app/globals.css" "$output"
    collect_file "$SRC_DIR/app/opengraph-image.tsx" "$output"
    collect_file "$SRC_DIR/app/twitter-image.tsx" "$output"
    
    section_header "APP - Auth Pages" "$output"
    collect_folder "$SRC_DIR/app/(auth)" "$output"
    
    section_header "APP - Dashboard Pages" "$output"
    collect_folder "$SRC_DIR/app/(dashboard)/dashboard" "$output"
    
    section_header "APP - Server Routes (Sitemap)" "$output"
    collect_folder "$SRC_DIR/app/server-sitemap" "$output"
    collect_folder "$SRC_DIR/app/server-sitemap-index.xml" "$output"
    
    section_header "APP - Store (Public Pages)" "$output"
    collect_folder "$SRC_DIR/app/store" "$output"
}

collect_components() {
    local output=$1
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  COLLECTING: COMPONENTS                                    ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
    
    section_header "COMPONENTS - Auth" "$output"
    collect_folder "$SRC_DIR/components/auth" "$output"
    
    section_header "COMPONENTS - Cloudinary" "$output"
    collect_folder "$SRC_DIR/components/cloudinary" "$output"
    
    section_header "COMPONENTS - Dashboard" "$output"
    collect_folder "$SRC_DIR/components/dashboard" "$output"
    
    section_header "COMPONENTS - Domain" "$output"
    collect_folder "$SRC_DIR/components/domain" "$output"
    
    section_header "COMPONENTS - Landing (Blocks)" "$output"
    collect_folder "$SRC_DIR/components/landing" "$output"
    
    section_header "COMPONENTS - Landing Builder" "$output"
    collect_folder "$SRC_DIR/components/landing-builder" "$output"
    
    section_header "COMPONENTS - Onboarding" "$output"
    collect_folder "$SRC_DIR/components/onboarding" "$output"
    
    section_header "COMPONENTS - Products" "$output"
    collect_folder "$SRC_DIR/components/products" "$output"
    
    section_header "COMPONENTS - PWA" "$output"
    collect_folder "$SRC_DIR/components/pwa" "$output"
    
    section_header "COMPONENTS - SEO" "$output"
    collect_folder "$SRC_DIR/components/seo" "$output"
    
    section_header "COMPONENTS - Settings" "$output"
    collect_folder "$SRC_DIR/components/settings" "$output"
    
    section_header "COMPONENTS - Store" "$output"
    collect_folder "$SRC_DIR/components/store" "$output"
    
    section_header "COMPONENTS - Upload" "$output"
    collect_folder "$SRC_DIR/components/upload" "$output"
}

collect_lib() {
    local output=$1
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  COLLECTING: LIB (includes API, Hooks, Stores, Config)    ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
    
    section_header "CONFIG" "$output"
    collect_folder "$SRC_DIR/config" "$output"
    
    section_header "HOOKS" "$output"
    collect_folder "$SRC_DIR/hooks" "$output"
    
    section_header "LIB - API" "$output"
    collect_folder "$SRC_DIR/lib/api" "$output"
    
    section_header "LIB - Categories" "$output"
    collect_folder "$SRC_DIR/lib/categories" "$output"
    
    section_header "LIB - Landing" "$output"
    collect_folder "$SRC_DIR/lib/landing" "$output"
    
    section_header "LIB - Onboarding" "$output"
    collect_folder "$SRC_DIR/lib/onboarding" "$output"
    
    section_header "LIB - Theme" "$output"
    collect_folder "$SRC_DIR/lib/theme" "$output"
    
    section_header "LIB - Utils & Helpers" "$output"
    collect_file "$SRC_DIR/lib/cloudinary.ts" "$output"
    collect_file "$SRC_DIR/lib/format.ts" "$output"
    collect_file "$SRC_DIR/lib/index.ts" "$output"
    collect_file "$SRC_DIR/lib/invoice.ts" "$output"
    collect_file "$SRC_DIR/lib/og-utils.ts" "$output"
    collect_file "$SRC_DIR/lib/schema.ts" "$output"
    collect_file "$SRC_DIR/lib/seo.ts" "$output"
    collect_file "$SRC_DIR/lib/socket.ts" "$output"
    collect_file "$SRC_DIR/lib/store-url.ts" "$output"
    collect_file "$SRC_DIR/lib/utils.ts" "$output"
    collect_file "$SRC_DIR/lib/validations.ts" "$output"
    
    section_header "PROVIDERS" "$output"
    collect_folder "$SRC_DIR/providers" "$output"
    
    section_header "STORES (Zustand)" "$output"
    collect_folder "$SRC_DIR/stores" "$output"
    
    section_header "TYPES" "$output"
    collect_folder "$SRC_DIR/types" "$output"
    
    section_header "PROXY CONFIG" "$output"
    collect_file "$SRC_DIR/proxy.ts" "$output"
}

# ================================================================
# MENU & MAIN
# ================================================================

show_menu() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   CLIENT — SMART INTERACTIVE COLLECTION V2                ║${NC}"
    echo -e "${BLUE}║   Choose what to collect (Auto-skip deleted modules)      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${WHITE}Select folders to collect:${NC}"
    echo ""
    echo -e "${GREEN}  1)${NC} Auth (Complete Auth Flow) 🔐"
    echo -e "      ${CYAN}→ Pages: Login, Register, Forgot Password${NC}"
    echo -e "      ${CYAN}→ Components: Forms, Steps, Guards${NC}"
    echo -e "      ${CYAN}→ API: Auth Service${NC}"
    echo -e "      ${CYAN}→ Hooks: useAuth, useRegisterWizard${NC}"
    echo -e "      ${CYAN}→ Store: Auth State${NC}"
    echo -e "      ${CYAN}→ Types: Auth Interfaces${NC}"
    echo ""
    echo -e "${GREEN}  2)${NC} App (Pages & Routes) 📄"
    echo -e "      ${CYAN}→ Root, Auth, Dashboard, Store, Server Routes${NC}"
    echo ""
    echo -e "${GREEN}  3)${NC} Components 🧩"
    echo -e "      ${CYAN}→ Auth, Dashboard, Landing, Products, Store, Settings, etc.${NC}"
    echo ""
    echo -e "${GREEN}  4)${NC} Lib (Full Stack) 📚"
    echo -e "      ${CYAN}→ Config, Hooks, API, Stores, Types, Providers, Utils${NC}"
    echo ""
    echo -e "${MAGENTA}  5)${NC} Collect ALL (Smart - skip deleted modules) 🚀"
    echo ""
    echo -e "${YELLOW}  6)${NC} Show skip list"
    echo -e "${RED}  0)${NC} Exit"
    echo ""
    echo -e "${WHITE}Enter choices (e.g., 1 2 or 5 for all):${NC} "
}

show_skip_list() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   AUTO-SKIP PATTERNS (Deleted Modules)                    ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}The following patterns are ALWAYS skipped:${NC}"
    echo ""
    for pattern in "${SKIP_PATTERNS[@]}"; do
        echo -e "${RED}  ✗${NC} *${pattern}*"
    done
    echo ""
    echo -e "${YELLOW}These modules were removed in the cleanup process.${NC}"
    echo ""
    read -p "Press Enter to continue..."
}

main() {
    if [ ! -d "$SRC_DIR" ]; then
        echo -e "${RED}ERROR: SRC_DIR not found: $SRC_DIR${NC}"
        echo -e "${YELLOW}Make sure you run this script from the client directory${NC}"
        exit 1
    fi
    
    while true; do
        show_menu
        read -r choices
        
        if [ -z "$choices" ]; then
            continue
        fi
        
        # Handle exit
        if [[ "$choices" == "0" ]]; then
            echo ""
            echo -e "${CYAN}Goodbye!${NC}"
            exit 0
        fi
        
        # Handle show skip list
        if [[ "$choices" == "6" ]]; then
            show_skip_list
            continue
        fi
        
        # Generate output filename based on choices
        local timestamp=$(date '+%Y%m%d-%H%M%S')
        local output_file="$OUT/CLIENT-COLLECTION-$timestamp.txt"
        
        # File header
        cat > "$output_file" << EOF
################################################################
##  CLIENT — SMART COLLECTION V2
##  Generated: $(date '+%Y-%m-%d %H:%M:%S')
##  
##  ✅ Auto-skip deleted modules:
##     customers, orders, whatsapp, auto-reply, bookmarks,
##     explore, channels, pembayaran, pengiriman, track,
##     discover, checkout, order-tracking
##  
##  📂 Collection: Based on user selection
################################################################

EOF
        
        echo ""
        echo -e "${CYAN}Starting collection...${NC}"
        echo ""
        
        # Process choices
        if [[ "$choices" == "5" ]]; then
            # Collect all
            collect_auth "$output_file"
            collect_app "$output_file"
            collect_components "$output_file"
            collect_lib "$output_file"
        else
            # Collect based on selection
            for choice in $choices; do
                case $choice in
                    1) collect_auth "$output_file" ;;
                    2) collect_app "$output_file" ;;
                    3) collect_components "$output_file" ;;
                    4) collect_lib "$output_file" ;;
                    *) echo -e "${RED}Invalid choice: $choice${NC}" ;;
                esac
            done
        fi
        
        # Summary
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✅ COLLECTION COMPLETE!                                   ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${CYAN}📂 Output: $output_file${NC}"
        
        local file_count=$(grep -c "^FILE:" "$output_file" 2>/dev/null || echo "0")
        local file_size=$(du -h "$output_file" 2>/dev/null | cut -f1)
        
        echo -e "${CYAN}📊 Files collected: $file_count${NC}"
        echo -e "${CYAN}📦 Output size: $file_size${NC}"
        echo ""
        
        read -p "Press Enter to continue..."
    done
}

main "$@"