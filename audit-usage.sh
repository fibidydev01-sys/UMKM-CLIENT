#!/bin/bash

OUTPUT="audit-og-utils.txt"
SRC="src"

echo "========================================" > $OUTPUT
echo "  AUDIT — og-utils DEADCODE CHECK" >> $OUTPUT
echo "  $(date)" >> $OUTPUT
echo "========================================" >> $OUTPUT

echo "" >> $OUTPUT
echo "## [1] ISI FILE" >> $OUTPUT
echo "----------------------------------------" >> $OUTPUT
cat $SRC/lib/public/og-utils.ts >> $OUTPUT 2>/dev/null || echo "(file not found)" >> $OUTPUT

echo "" >> $OUTPUT
echo "## [2] SEMUA EXPORT" >> $OUTPUT
echo "----------------------------------------" >> $OUTPUT
grep -n "export" $SRC/lib/public/og-utils.ts >> $OUTPUT 2>/dev/null || echo "(no exports found)" >> $OUTPUT

echo "" >> $OUTPUT
echo "## [3] IMPORT og-utils (direct)" >> $OUTPUT
echo "----------------------------------------" >> $OUTPUT
result=$(grep -rn "og-utils" $SRC --include="*.ts" --include="*.tsx")
if [ -z "$result" ]; then
  echo "  (none)" >> $OUTPUT
else
  echo "$result" >> $OUTPUT
fi

echo "" >> $OUTPUT
echo "## [4] USAGE TIAP SYMBOL" >> $OUTPUT
echo "----------------------------------------" >> $OUTPUT
exports=$(grep -E "^export (async function|function|const|interface|type|class|enum)" $SRC/lib/public/og-utils.ts 2>/dev/null \
  | grep -oE "(function|const|interface|type|class|enum) [a-zA-Z_][a-zA-Z0-9_]*" \
  | awk '{print $2}' \
  | sort -u)

if [ -z "$exports" ]; then
  echo "  (no named exports found)" >> $OUTPUT
else
  for sym in $exports; do
    echo "" >> $OUTPUT
    echo "  [$sym]" >> $OUTPUT
    hits=$(grep -rn "\b$sym\b" $SRC --include="*.ts" --include="*.tsx" \
      | grep -v "og-utils")
    count=$(echo "$hits" | grep -c "." 2>/dev/null || echo 0)
    echo "  → $count hit (excluding og-utils itself)" >> $OUTPUT
    if [ "$count" -gt 0 ]; then
      echo "$hits" | sed 's/^/    /' >> $OUTPUT
    fi
  done
fi

echo "" >> $OUTPUT
echo "## [5] REFERENSI DI INDEX" >> $OUTPUT
echo "----------------------------------------" >> $OUTPUT
grep -n "og-utils" $SRC/lib/public/index.ts >> $OUTPUT 2>/dev/null || echo "  (not referenced in index)" >> $OUTPUT

echo "" >> $OUTPUT
echo "========================================" >> $OUTPUT
echo "  VERDICT" >> $OUTPUT
echo "========================================" >> $OUTPUT
direct=$(grep -r "og-utils" $SRC --include="*.ts" --include="*.tsx" | grep -v "og-utils.ts" | wc -l)
if [ "$direct" -eq 0 ]; then
  echo "  ⚠️  KANDIDAT HAPUS — tidak ada yang import file ini" >> $OUTPUT
else
  echo "  ✅ MASIH DIPAKAI — $direct referensi ditemukan" >> $OUTPUT
fi

echo "========================================" >> $OUTPUT
echo "  DONE. Cek: $OUTPUT" >> $OUTPUT
echo "========================================" >> $OUTPUT

echo "✅ Output tersimpan di: $OUTPUT"