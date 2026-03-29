#!/bin/bash

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

# ================================================================
# HELPERS
# ================================================================

cf() {
    local f=$1
    [ -f "$f" ] || { echo "  ⚠ NOT FOUND: $f"; return; }
    local rel="${f#./}"
    local lines=$(wc -l < "$f")
    echo "================================================" >> "$FILE"
    echo "FILE: $rel"                                        >> "$FILE"
    echo "Lines: $lines"                                     >> "$FILE"
    echo "================================================" >> "$FILE"
    echo ""                                                  >> "$FILE"
    cat "$f"                                                 >> "$FILE"
    printf "\n\n"                                            >> "$FILE"
    echo "  ✓ $rel ($lines)"
}

cfolder() {
    local dir=$1
    [ -d "$dir" ] || { echo "  ⚠ NOT FOUND: $dir"; return; }
    while IFS= read -r -d '' f; do
        cf "$f"
    done < <(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
}

cfolder_r() {
    local dir=$1
    [ -d "$dir" ] || { echo "  ⚠ NOT FOUND: $dir"; return; }
    while IFS= read -r -d '' f; do
        cf "$f"
    done < <(find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
}

sec() {
    printf "\n################################################################\n##  %s\n################################################################\n\n" "$1" >> "$FILE"
    echo "▶ $1"
}

init_file() {
    FILE="$OUT/$1-$(date '+%Y%m%d-%H%M%S').txt"
    printf "################################################################\n##  %s\n##  Generated: %s\n################################################################\n\n" "$1" "$(date '+%Y-%m-%d %H:%M:%S')" > "$FILE"
}

done_msg() {
    echo "✅ $FILE | $(grep -c '^FILE:' "$FILE") files | $(du -h "$FILE" | cut -f1)"
}

# ================================================================
# 1. HOOKS
# ================================================================

feat_hooks() {
    init_file "HOOKS"
    sec "HOOKS — Admin"
    cfolder_r "$SRC/hooks/admin"
    sec "HOOKS — Auth"
    cfolder_r "$SRC/hooks/auth"
    sec "HOOKS — Dashboard"
    cfolder_r "$SRC/hooks/dashboard"
    sec "HOOKS — Shared"
    cfolder_r "$SRC/hooks/shared"
    sec "HOOKS — Index"
    cf "$SRC/hooks/index.ts"
    done_msg
}

# ================================================================
# 2. LIB
# ================================================================

feat_lib() {
    init_file "LIB"
    sec "LIB — API"
    cfolder_r "$SRC/lib/api"
    sec "LIB — Dashboard"
    cfolder_r "$SRC/lib/dashboard"
    sec "LIB — Public / Categories"
    cfolder_r "$SRC/lib/public/categories"
    sec "LIB — Public / Discover"
    cfolder_r "$SRC/lib/public/discover"
    sec "LIB — Public / Templates"
    cfolder_r "$SRC/lib/public/templates"
    sec "LIB — Public (root)"
    cfolder "$SRC/lib/public"
    sec "LIB — Shared"
    cfolder_r "$SRC/lib/shared"
    sec "LIB — Index"
    cf "$SRC/lib/index.ts"
    done_msg
}

# ================================================================
# 3. STORES
# ================================================================

feat_stores() {
    init_file "STORES"
    sec "STORES"
    cfolder "$SRC/stores"
    done_msg
}

# ================================================================
# 4. TYPES
# ================================================================

feat_types() {
    init_file "TYPES"
    sec "TYPES"
    cfolder "$SRC/types"
    done_msg
}

# ================================================================
# 5. PROVIDERS
# ================================================================

feat_providers() {
    init_file "PROVIDERS"
    sec "PROVIDERS"
    cfolder "$SRC/providers"
    done_msg
}

# ================================================================
# 6. CONSTANTS
# ================================================================

feat_constants() {
    init_file "CONSTANTS"
    sec "CONSTANTS — Dashboard"
    cfolder_r "$SRC/constants/dashboard"
    sec "CONSTANTS — Shared"
    cfolder_r "$SRC/constants/shared"
    sec "CONSTANTS — Index"
    cf "$SRC/constants/index.ts"
    done_msg
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo "================================================================"
    echo "  FEAT-COLLECT-CORE — HOOKS / LIB / STORES / TYPES / PROVIDERS"
    echo "  Scope: hooks/ lib/ stores/ types/ providers/ constants/"
    echo "================================================================"
    echo ""
    echo "   1) Hooks       (admin, auth, dashboard, shared)"
    echo "   2) Lib         (api, dashboard, public, shared)"
    echo "   3) Stores      (admin, auth, cart, chat, products, tour)"
    echo "   4) Types       (semua type definitions)"
    echo "   5) Providers   (hydration, theme, toast)"
    echo "   6) Constants   (dashboard, shared)"
    echo ""
    echo "   0) Exit        all) Semua"
    echo "================================================================"
    echo ""
}

run_choice() {
    case $1 in
        1) feat_hooks ;;
        2) feat_lib ;;
        3) feat_stores ;;
        4) feat_types ;;
        5) feat_providers ;;
        6) feat_constants ;;
        *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        for i in $(seq 1 6); do run_choice $i; done
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Enter untuk kembali ke menu..."
done