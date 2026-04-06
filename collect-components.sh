#!/bin/bash

# ================================================================
# COLLECT ALL COMPONENTS
# Dynamic — auto-scan semua subfolder di src/components/
# Skip: components/ui/ (auto-generated)
# ================================================================

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

SRC="./src/components"
OUT="collections"
mkdir -p "$OUT"
OUTPUT_FILE="$OUT/COMPONENTS-$(date '+%Y%m%d-%H%M%S').txt"

# ================================================================
# VALIDATE SRC DIR
# ================================================================

if [ ! -d "$SRC" ]; then
  echo -e "  ${YELLOW}⚠ Directory tidak ditemukan: ${SRC}${NC}"
  echo -e "  Jalankan script ini dari root project (sejajar folder src/)"
  exit 1
fi

# ================================================================
# HEADER
# ================================================================

echo -e "${BOLD}${BLUE}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   COLLECT ALL COMPONENTS                    ║"
echo "  ║   Auto-scan semua subfolder                 ║"
echo "  ║   Skip: ui/                                 ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

{
  echo "################################################################"
  echo "##  COMPONENTS COLLECTION"
  echo "##  Generated : $(date '+%Y-%m-%d %H:%M:%S')"
  echo "##  Source    : src/components/ (skip: ui/)"
  echo "################################################################"
  echo ""
} > "$OUTPUT_FILE"

file_count=0
section_count=0

# ================================================================
# DYNAMIC SCAN — semua subfolder level-1 (skip ui/)
# ================================================================

# Collect semua top-level subfolder, sort alphabetically
mapfile -t SECTIONS < <(
  find "$SRC" -mindepth 1 -maxdepth 1 -type d \
  | sort \
  | while read -r dir; do
      name=$(basename "$dir")
      [[ "$name" == "ui" ]] && continue
      echo "$dir"
    done
)

if [ ${#SECTIONS[@]} -eq 0 ]; then
  echo -e "  ${YELLOW}⚠ Tidak ada subfolder ditemukan di ${SRC}${NC}"
  exit 1
fi

# ================================================================
# PROCESS EACH SECTION
# ================================================================

for section_dir in "${SECTIONS[@]}"; do
  section=$(basename "$section_dir")

  # Collect semua .tsx / .ts file, recursive, sorted
  mapfile -t FILES < <(
    find "$section_dir" -type f \( -name "*.tsx" -o -name "*.ts" \) | sort
  )

  if [ ${#FILES[@]} -eq 0 ]; then
    echo -e "  ${YELLOW}⚠ EMPTY${NC}  components/${section}/"
    continue
  fi

  echo -e "\n  ${BOLD}${BLUE}📁 ${section}/ (${#FILES[@]} files)${NC}"

  {
    echo "================================================================"
    echo "## SECTION: components/${section}/"
    echo "## Files   : ${#FILES[@]}"
    echo "================================================================"
    echo ""
  } >> "$OUTPUT_FILE"

  for file in "${FILES[@]}"; do
    rel="components/${file#$SRC/}"

    echo -e "  ${GREEN}✓${NC}  ${WHITE}${rel}${NC}"

    {
      echo "----------------------------------------------------------------"
      echo "FILE : ${rel}"
      echo "----------------------------------------------------------------"
      cat "$file"
      echo ""
    } >> "$OUTPUT_FILE"

    ((file_count++))
  done

  ((section_count++))
done

# ================================================================
# SUMMARY
# ================================================================

{
  echo ""
  echo "################################################################"
  echo "##  SUMMARY"
  echo "##  Sections  : ${section_count}"
  echo "##  Collected : ${file_count} files"
  echo "##  Skipped   : components/ui/"
  echo "################################################################"
} >> "$OUTPUT_FILE"

echo ""
echo -e "  ${BLUE}────────────────────────────────────────${NC}"
echo -e "  Sections  : ${WHITE}${section_count}${NC}"
echo -e "  Collected : ${WHITE}${file_count}${NC} files"
echo -e "  Skipped   : ${CYAN}components/ui/${NC}"
echo -e "\n  ${CYAN}📂 ${OUTPUT_FILE}${NC}\n"