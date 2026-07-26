"""Lab Bot HTTP adapter for Python agents.

Usage (from repo root, with package installed):
    python -m lab.bots.python_adapter --agent counting --port 9101
    python -m lab.bots.python_adapter --agent mc --n-sims 200 --port 9102
"""

from __future__ import annotations

import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from domino.agents import CountingAgent, GreedyAgent, MCAgent, RandomAgent
from domino.agents.base import Agent
from domino.config import GameConfig
from domino.engine import DominoEngine
from domino.tiles import tile_id


def build_agent(name: str, n_sims: int, seed: int) -> Agent:
    name = name.lower()
    if name == "counting":
        return CountingAgent()
    if name == "greedy":
        return GreedyAgent()
    if name == "random":
        return RandomAgent(seed=seed)
    if name == "mc":
        return MCAgent(n_sims=n_sims, seed=seed)
    raise SystemExit(f"unknown agent: {name}")


def load_public_engine(payload: dict[str, Any], cfg: GameConfig) -> DominoEngine:
    """Rebuild a firewall-safe engine view for agent.act (only own hand filled)."""
    eng = DominoEngine(cfg)
    seat = int(payload["seat"])
    n = cfg.num_players
    eng.hands = [0] * n
    for a, b in payload.get("hand") or []:
        eng.hands[seat] |= 1 << tile_id(int(a), int(b))
    eng.played_mask = 0
    for a, b in payload.get("board") or []:
        eng.played_mask |= 1 << tile_id(int(a), int(b))
    left = payload.get("left")
    right = payload.get("right")
    if left is None or right is None:
        eng.left_end = eng.right_end = -1
    else:
        eng.left_end, eng.right_end = int(left), int(right)
    eng.current_player = seat
    eng.leader = 0
    eng.consecutive_passes = int(payload.get("consecutive_passes") or 0)
    eng.forced_action = -1
    eng.missing_pips = [0] * n
    for i, pips in enumerate(payload.get("missing") or []):
        mask = 0
        for pip in pips or []:
            mask |= 1 << int(pip)
        eng.missing_pips[i] = mask
    eng.history = []
    eng.is_over = False
    eng.winner = -1
    eng.blocked = False
    # If only one legal and it's a forced double open, mark forced
    legal = payload.get("legal") or []
    if len(legal) == 1 and legal[0].get("side") != "pass" and eng.left_end < 0:
        t = legal[0].get("tile")
        if t:
            eng.forced_action = tile_id(int(t[0]), int(t[1])) * 2
    return eng


def action_to_response(eng: DominoEngine, action: int) -> dict[str, Any]:
    if action == eng.config.pass_action:
        return {"tile": None, "side": "pass"}
    tid, side = divmod(action, 2)
    a, b = eng.pips[tid]
    return {"tile": [a, b], "side": "left" if side == 0 else "right"}


def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser(description="Lab Python bot adapter")
    ap.add_argument("--agent", default="counting", help="counting|greedy|random|mc")
    ap.add_argument("--port", type=int, default=9101)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--n-sims", type=int, default=200)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--name", default="", help="health name override")
    args = ap.parse_args(argv)

    agent = build_agent(args.agent, args.n_sims, args.seed)
    agent_name = args.name or args.agent
    cfg = GameConfig()

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt: str, *a) -> None:
            pass

        def _json(self, code: int, obj: dict) -> None:
            body = json.dumps(obj).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:  # noqa: N802
            if self.path.split("?", 1)[0] == "/health":
                self._json(200, {"ok": True, "name": agent_name})
            else:
                self._json(404, {"ok": False, "error": "not found"})

        def do_POST(self) -> None:  # noqa: N802
            if self.path.split("?", 1)[0] != "/act":
                self._json(404, {"ok": False, "error": "not found"})
                return
            n = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(n) if n else b"{}"
            try:
                payload = json.loads(raw.decode())
            except json.JSONDecodeError as e:
                self._json(400, {"ok": False, "error": str(e)})
                return
            try:
                eng = load_public_engine(payload, cfg)
                action = agent.act(eng)
                # Prefer mapping through declared legal list if agent returns something odd
                resp = action_to_response(eng, action)
                self._json(200, resp)
            except Exception as e:  # noqa: BLE001
                self._json(500, {"ok": False, "error": str(e)})

    httpd = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"[lab-adapter] {agent_name} on http://{args.host}:{args.port}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[lab-adapter] stopped")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
