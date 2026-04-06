#!/bin/bash
# ================================================================
# collect-layouts.sh
# Feature: Layouts (Root + Dashboard only)
#   Skip  : store, admin, auth
# Trace: app layouts → layout components → globals.css
# Usage: bash collect-layouts.sh
# ================================================================

SRC="./src"
OUT="collections"
mkdir -p "$OUT"

TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
FILE="$OUT/LAYOUTS-$TIMESTAMP.txt"

# ── Helpers ──────────────────────────────────────────────────────

cf() {
    local f=$1
    [ -f "$f" ] || { echo "  ⚠ NOT FOUND: $f"; return; }
    local rel="${f#./}"
    local lines=$(wc -l < "$f")
    printf "\n================================================\n" >> "$FILE"
    printf "FILE: %s\n"    "$rel"                                  >> "$FILE"
    printf "PATH: %s\n"    "$f"                                    >> "$FILE"
    printf "Lines: %s\n"   "$lines"                               >> "$FILE"
    printf "================================================\n\n" >> "$FILE"
    cat "$f"                                                       >> "$FILE"
    printf "\n\n"                                                  >> "$FILE"
    echo "  ✓ $rel ($lines lines)"
}

sec() {
    printf "\n################################################################\n" >> "$FILE"
    printf "##  %s\n"                                              "$1"           >> "$FILE"
    printf "################################################################\n\n"  >> "$FILE"
    echo "▶ $1"
}

# ── Header ───────────────────────────────────────────────────────

printf "################################################################\n"     > "$FILE"
printf "##  LAYOUTS — full trace\n"                                            >> "$FILE"
printf "##  Generated: %s\n"  "$(date '+%Y-%m-%d %H:%M:%S')"                  >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  SCOPE\n"                                                            >> "$FILE"
printf "##  ✓ Root layout\n"                                                   >> "$FILE"
printf "##  ✓ Dashboard layout (route + components)\n"                         >> "$FILE"
printf "##  ✗ Store   — skipped\n"                                             >> "$FILE"
printf "##  ✗ Admin   — skipped\n"                                             >> "$FILE"
printf "##  ✗ Auth    — skipped\n"                                             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  IMPORT MAP\n"                                                       >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── ROOT ──────────────────────────────────────────\n"              >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  app/layout.tsx\n"                                                   >> "$FILE"
printf "##    → app/globals.css\n"                                             >> "$FILE"
printf "##    → lib/providers/root-provider.tsx\n"                             >> "$FILE"
printf "##    → lib/providers/theme-provider.tsx\n"                            >> "$FILE"
printf "##    → lib/providers/toast-provider.tsx\n"                            >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  ── DASHBOARD ──────────────────────────────────────\n"             >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  app/(dashboard)/layout.tsx\n"                                      >> "$FILE"
printf "##    → components/layout/dashboard/dashboard-layout.tsx\n"            >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "##  dashboard-layout.tsx\n"                                             >> "$FILE"
printf "##    → components/layout/dashboard/dashboard-shell.tsx\n"             >> "$FILE"
printf "##    → components/layout/dashboard/dashboard-sidebar.tsx\n"           >> "$FILE"
printf "##    → components/layout/dashboard/mobile-navbar.tsx\n"               >> "$FILE"
printf "##\n"                                                                   >> "$FILE"
printf "################################################################\n\n"   >> "$FILE"

# ================================================================
# 1. ROOT
# ================================================================

sec "ROOT — app/layout.tsx + globals.css"
cf "$SRC/app/layout.tsx"
cf "$SRC/app/globals.css"

# ================================================================
# 2. PROVIDERS
# ================================================================

sec "PROVIDERS"
cf "$SRC/lib/providers/root-provider.tsx"
cf "$SRC/lib/providers/theme-provider.tsx"
cf "$SRC/lib/providers/toast-provider.tsx"

# ================================================================
# 3. DASHBOARD — Route Layout
# ================================================================

sec "DASHBOARD — Route Layout"
cf "$SRC/app/(dashboard)/layout.tsx"

# ================================================================
# 4. DASHBOARD — Layout Components
# ================================================================

sec "DASHBOARD — Layout Components"
cf "$SRC/components/layout/dashboard/dashboard-layout.tsx"
cf "$SRC/components/layout/dashboard/dashboard-shell.tsx"
cf "$SRC/components/layout/dashboard/dashboard-sidebar.tsx"
cf "$SRC/components/layout/dashboard/mobile-navbar.tsx"

# ================================================================
# Done
# ================================================================

FILE_COUNT=$(grep -c '^FILE:' "$FILE" 2>/dev/null || echo 0)
FILE_SIZE=$(du -h "$FILE" | cut -f1)

echo ""
echo "================================================================"
echo "  ✅  LAYOUTS collected"
echo "  📄  File  : $FILE"
echo "  📦  Files : $FILE_COUNT"
echo "  💾  Size  : $FILE_SIZE"
echo "================================================================"