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
    local count=0
    while IFS= read -r -d '' f; do
        cf "$f"
        ((count++))
    done < <(find "$dir" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | sort -z)
    echo "  → $count files dari $dir"
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
    echo ""
    echo "✅ $FILE"
    echo "   Files : $(grep -c '^FILE:' "$FILE")"
    echo "   Size  : $(du -h "$FILE" | cut -f1)"
}

# ================================================================
# FEATURES
# ================================================================

# ── 1. ADMIN ────────────────────────────────────────────────────
feat_admin() {
    init_file "TYPES-ADMIN"
    sec "TYPES — Admin"
    cf "$SRC/types/admin.ts"
    done_msg
}

# ── 2. API ──────────────────────────────────────────────────────
feat_api() {
    init_file "TYPES-API"
    sec "TYPES — API"
    cf "$SRC/types/api.ts"
    done_msg
}

# ── 3. AUTH ─────────────────────────────────────────────────────
feat_auth() {
    init_file "TYPES-AUTH"
    sec "TYPES — Auth"
    cf "$SRC/types/auth.ts"
    done_msg
}

# ── 4. CATEGORY ─────────────────────────────────────────────────
feat_category() {
    init_file "TYPES-CATEGORY"
    sec "TYPES — Category"
    cf "$SRC/types/category.ts"
    done_msg
}

# ── 5. CLOUDINARY ───────────────────────────────────────────────
feat_cloudinary() {
    init_file "TYPES-CLOUDINARY"
    sec "TYPES — Cloudinary"
    cf "$SRC/types/cloudinary.ts"
    done_msg
}

# ── 6. LANDING ──────────────────────────────────────────────────
feat_landing() {
    init_file "TYPES-LANDING"
    sec "TYPES — Landing"
    cf "$SRC/types/landing.ts"
    done_msg
}

# ── 7. PRODUCT ──────────────────────────────────────────────────
feat_product() {
    init_file "TYPES-PRODUCT"
    sec "TYPES — Product"
    cf "$SRC/types/product.ts"
    done_msg
}

# ── 8. TENANT ───────────────────────────────────────────────────
feat_tenant() {
    init_file "TYPES-TENANT"
    sec "TYPES — Tenant"
    cf "$SRC/types/tenant.ts"
    done_msg
}

# ── 9. INDEX ────────────────────────────────────────────────────
feat_index() {
    init_file "TYPES-INDEX"
    sec "TYPES — Index"
    cf "$SRC/types/index.ts"
    done_msg
}

# ── 10. SEMUA TYPES ─────────────────────────────────────────────
feat_all() {
    init_file "TYPES-ALL"

    sec "TYPES — Admin"
    cf "$SRC/types/admin.ts"

    sec "TYPES — API"
    cf "$SRC/types/api.ts"

    sec "TYPES — Auth"
    cf "$SRC/types/auth.ts"

    sec "TYPES — Category"
    cf "$SRC/types/category.ts"

    sec "TYPES — Cloudinary"
    cf "$SRC/types/cloudinary.ts"

    sec "TYPES — Landing"
    cf "$SRC/types/landing.ts"

    sec "TYPES — Product"
    cf "$SRC/types/product.ts"

    sec "TYPES — Tenant"
    cf "$SRC/types/tenant.ts"

    sec "TYPES — Index"
    cf "$SRC/types/index.ts"

    done_msg
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo "================================================================"
    echo "  CLIENT — TYPES COLLECTION"
    echo "  Scope: src/types/"
    echo "================================================================"
    echo ""
    echo "  Struktur:"
    echo "  src/types/"
    echo "  ├── admin.ts"
    echo "  ├── api.ts"
    echo "  ├── auth.ts"
    echo "  ├── category.ts"
    echo "  ├── cloudinary.ts"
    echo "  ├── landing.ts"
    echo "  ├── product.ts"
    echo "  ├── tenant.ts"
    echo "  └── index.ts"
    echo ""
    echo "  1) Admin"
    echo "  2) API"
    echo "  3) Auth"
    echo "  4) Category"
    echo "  5) Cloudinary"
    echo "  6) Landing"
    echo "  7) Product"
    echo "  8) Tenant"
    echo "  9) Index"
    echo ""
    echo "  all) Semua types sekaligus"
    echo "  0)   Exit"
    echo "================================================================"
    echo ""
}

run_choice() {
    case $1 in
        1) feat_admin ;;
        2) feat_api ;;
        3) feat_auth ;;
        4) feat_category ;;
        5) feat_cloudinary ;;
        6) feat_landing ;;
        7) feat_product ;;
        8) feat_tenant ;;
        9) feat_index ;;
        *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        feat_all
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Enter untuk kembali ke menu..."
done