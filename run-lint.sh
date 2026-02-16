#!/bin/bash

# Script untuk menjalankan pnpm run lint dan menyimpan output ke file TXT
# Dibuat untuk: D:/UMKM-VERSIONING/APPS/workspace-landing-builder/client

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Menjalankan pnpm run lint...${NC}"
echo ""

# Nama file output dengan timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="lint-output_${TIMESTAMP}.txt"

# Jalankan pnpm run lint dan simpan ke file TXT
# Menggunakan 2>&1 untuk capture stdout dan stderr
{
    echo "================================================"
    echo "LINT OUTPUT REPORT"
    echo "================================================"
    echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Directory: $(pwd)"
    echo "================================================"
    echo ""
    
    pnpm run lint 2>&1
    
    echo ""
    echo "================================================"
    echo "Lint selesai dijalankan pada: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "================================================"
} | tee "$OUTPUT_FILE"

echo ""
echo -e "${GREEN}✅ Output berhasil disimpan ke: ${OUTPUT_FILE}${NC}"
echo ""