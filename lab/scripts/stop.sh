#!/usr/bin/env bash
set -euo pipefail
LAB="$(cd "$(dirname "$0")/.." && pwd)"
for f in "$LAB"/.run/*.pid; do
  [[ -f "$f" ]] || continue
  pid="$(cat "$f")"
  echo "stop $(basename "$f" .pid) pid=$pid"
  kill "$pid" 2>/dev/null || true
  rm -f "$f"
done
