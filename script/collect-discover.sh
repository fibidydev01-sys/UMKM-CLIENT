#!/bin/bash

# ================================================================
# COLLECT-DISCOVER.SH — DISCOVER FLOW ONLY
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/client
# ================================================================

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
# MAIN
# ================================================================

init_file "DISCOVER"

sec "PAGES"
cf "$SRC/app/(public)/discover/page.tsx"
cf "$SRC/app/(public)/discover/client.tsx"

sec "COMPONENTS"
cfolder_r "$SRC/components/public/discover"

done_msg