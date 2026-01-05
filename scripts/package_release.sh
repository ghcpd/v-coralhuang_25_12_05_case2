#!/usr/bin/env bash
OUT=${1:-tour-travel-platform.zip}
zip -r "$OUT" . -x "node_modules/*" ".next/*" "*.zip"
echo "Archive created: $OUT"