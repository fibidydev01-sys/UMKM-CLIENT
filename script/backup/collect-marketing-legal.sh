#!/bin/bash

# ================================================================
# MARKETING-COLLECT.SH — Collect referensi MARKETING (Interactive)
# Run from: /d/PRODUK-LPPM-FINAL/UMKM-MULTI-TENANT/restruktur
# ================================================================

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

# ================================================================
# MENU
# ================================================================
echo ""
echo "================================================================"
echo "  MARKETING-COLLECT — Pilih section yang mau di-collect"
echo "================================================================"
echo ""
echo "  1) about"
echo "  2) features"
echo "  3) how-it-works"
echo "  4) pricing"
echo "  5) profile"
echo "  6) shared"
echo "  7) ALL (semua sekaligus)"
echo ""
echo "  Bisa pilih multiple, pisah spasi. Contoh: 1 3 5"
echo ""
read -rp "Pilihan: " input

# ================================================================
# PARSE PILIHAN
# ================================================================
collect_about=false
collect_features=false
collect_how_it_works=false
collect_pricing=false
collect_profile=false
collect_shared=false

for choice in $input; do
    case $choice in
        1) collect_about=true ;;
        2) collect_features=true ;;
        3) collect_how_it_works=true ;;
        4) collect_pricing=true ;;
        5) collect_profile=true ;;
        6) collect_shared=true ;;
        7)
            collect_about=true
            collect_features=true
            collect_how_it_works=true
            collect_pricing=true
            collect_profile=true
            collect_shared=true
            ;;
        *) echo "  ⚠ Pilihan '$choice' tidak dikenali, dilewati." ;;
    esac
done

# ================================================================
# BUILD LABEL UNTUK NAMA FILE
# ================================================================
label=""
$collect_about        && label="${label}-about"
$collect_features     && label="${label}-features"
$collect_how_it_works && label="${label}-how-it-works"
$collect_pricing      && label="${label}-pricing"
$collect_profile      && label="${label}-profile"
$collect_shared       && label="${label}-shared"

if [ -z "$label" ]; then
    echo ""
    echo "  ⚠ Tidak ada pilihan valid. Script berhenti."
    exit 1
fi

FILE="$OUT/MARKETING${label}-$(date '+%Y%m%d-%H%M%S').txt"

printf "################################################################\n##  MARKETING REFERENCE\n##  Generated: %s\n##  Sections: %s\n################################################################\n\n" "$(date '+%Y-%m-%d %H:%M:%S')" "$label" > "$FILE"

echo ""
echo "================================================================"
echo "  Collecting: $label"
echo "================================================================"
echo ""

# ================================================================
# LAYOUT & INDEX — selalu di-collect
# ================================================================
sec "LAYOUT — Header & Footer"
cf "$SRC/app/(marketing)/layout.tsx"
cf "$SRC/components/marketing/layout/landing-header.tsx"
cf "$SRC/components/marketing/layout/landing-footer.tsx"
cf "$SRC/components/marketing/index.ts"

# ================================================================
# SECTIONS
# ================================================================
if $collect_about; then
    sec "about — App route & components"
    cf "$SRC/app/(marketing)/about/page.tsx"
    cfolder_r "$SRC/components/marketing/about"
fi

if $collect_features; then
    sec "features — App route & components"
    cf "$SRC/app/(marketing)/features/page.tsx"
    cfolder_r "$SRC/components/marketing/features"
fi

if $collect_how_it_works; then
    sec "how-it-works — App route & components"
    cf "$SRC/app/(marketing)/how-it-works/page.tsx"
    cfolder_r "$SRC/components/marketing/how-it-works"
fi

if $collect_pricing; then
    sec "pricing — App route & components"
    cf "$SRC/app/(marketing)/pricing/page.tsx"
    cfolder_r "$SRC/components/marketing/pricing"
fi

if $collect_profile; then
    sec "profile — App route & components"
    cf "$SRC/app/(marketing)/profile/page.tsx"
    cfolder_r "$SRC/components/marketing/profile"
fi

if $collect_shared; then
    sec "shared — Components"
    cfolder_r "$SRC/components/marketing/shared"
fi

# ================================================================
echo ""
echo "================================================================"
echo "✅ $FILE"
echo "📊 $(grep -c '^FILE:' "$FILE") files | $(du -h "$FILE" | cut -f1)"
echo "================================================================"