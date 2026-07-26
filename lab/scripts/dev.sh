#!/usr/bin/env bash
# Start Lab stack: random_go + python adapters + labd (+ optional web).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LAB="$ROOT/lab"
export GOPROXY="${GOPROXY:-https://proxy.golang.org,direct}"
export PYTHONPATH="$ROOT/src:$ROOT:${PYTHONPATH:-}"

mkdir -p "$LAB/server/bin" "$LAB/.run"
cd "$LAB/server" && go build -o bin/labd ./cmd/labd

# Kill previous lab processes if pid files exist
for f in "$LAB"/.run/*.pid; do
  [[ -f "$f" ]] || continue
  kill "$(cat "$f")" 2>/dev/null || true
  rm -f "$f"
done

start() {
  local name="$1"; shift
  echo "[dev] start $name: $*"
  nohup "$@" >"$LAB/.run/$name.log" 2>&1 &
  echo $! >"$LAB/.run/$name.pid"
}

# Bots
start random_go go run "$LAB/bots/random_go/main.go" -port 9200
start counting python3 -m lab.bots.python_adapter --agent counting --port 9101
start greedy   python3 -m lab.bots.python_adapter --agent greedy --port 9102
start random_py python3 -m lab.bots.python_adapter --agent random --port 9103
start mc python3 -m lab.bots.python_adapter --agent mc --n-sims 120 --port 9104

sleep 1
start labd "$LAB/server/bin/labd" -host 127.0.0.1 -port 8088 -bots "$LAB/server/bots.yaml"

echo
echo "labd     http://127.0.0.1:8088/api/health"
echo "web      cd lab/web && npm install && npm run dev   # http://127.0.0.1:5173"
echo "logs     $LAB/.run/*.log"
echo "stop     lab/scripts/stop.sh"
