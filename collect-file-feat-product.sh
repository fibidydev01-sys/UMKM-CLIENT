#!/bin/bash

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

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
# PRODUCTS
# ================================================================

feat_products_new() {
    init_file "PRODUCTS-NEW"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/products/new/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    done_msg
}

feat_products_edit() {
    init_file "PRODUCTS-EDIT"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/products/[id]/edit/page.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/product-form.tsx"
    cfolder_r "$SRC/components/dashboard/products/product-form-section"
    cfolder_r "$SRC/components/shared/upload"
    cfolder_r "$SRC/components/shared/cloudinary"
    done_msg
}

feat_products_grid() {
    init_file "PRODUCTS-GRID"
    sec "APP — Pages"
    cf "$SRC/app/(dashboard)/dashboard/page.tsx"
    cf "$SRC/app/(dashboard)/dashboard/client.tsx"
    sec "COMPONENTS"
    cf "$SRC/components/dashboard/products/products-grid.tsx"
    cf "$SRC/components/dashboard/products/product-grid-card.tsx"
    cf "$SRC/components/dashboard/products/product-delete-dialog.tsx"
    cf "$SRC/components/dashboard/products/product-preview-drawer.tsx"
    cf "$SRC/components/dashboard/products/index.ts"
    done_msg
}

# ================================================================
# MENU
# ================================================================

show_menu() {
    clear
    echo "================================================================"
    echo "  COLLECT-PRODUK"
    echo "================================================================"
    echo ""
    echo "   1) New Product"
    echo "   2) Edit Product"
    echo "   3) Products Grid (dashboard home)"
    echo ""
    echo "   0) Exit        all) Semua"
    echo "================================================================"
    echo ""
}

run_choice() {
    case $1 in
        1) feat_products_new ;;
        2) feat_products_edit ;;
        3) feat_products_grid ;;
        *) echo "  ⚠ Unknown: $1" ;;
    esac
}

while true; do
    show_menu
    read -rp "Pilih: " choices
    [ "$choices" = "0" ] && echo "Bye!" && exit 0
    [ -z "$choices" ] && continue

    if [ "$choices" = "all" ]; then
        for i in 1 2 3; do run_choice $i; done
    else
        for c in $choices; do run_choice "$c"; done
    fi

    echo ""
    read -rp "Enter untuk kembali ke menu..."
done