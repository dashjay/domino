"""蒙特卡洛出牌建议的纯函数 ``analyze`` 与标准库 HTTP 服务。

请求体（POST JSON）示例::

    {
      "hand":  [[6,6],[3,4],[1,5],[0,4],[2,2],[0,1],[5,6]],
      "board": [[3,5]],
      "left": 3, "right": 5,
      "opponent_hand_counts": [7, 7, 7],
      "missing": [[], [], []],
      "num_players": 4, "hand_size": 7, "max_pip": 6,
      "simulations": 600, "rollout": "greedy", "seed": 0
    }

字段说明：

- ``hand``：必填，自己的手牌，每张牌写作 ``[a, b]``（也支持 "a|b" / "a,b" 字符串）。
- ``board``：桌面上按连接顺序排列的牌链；用于推断两端点数与已出牌集合。留空表示开局。
- ``left`` / ``right``：可选，显式指定桌面两端点数（优先于从 board 推断）。
- ``played``：可选，仅提供已出牌集合（无顺序）；此时需配合 ``left`` / ``right``。
- ``opponent_hand_counts``：按出牌顺序（下家在前）给出每位对手剩余手牌数；
  省略时把未见牌尽量均分给各对手。
- ``missing``：按出牌顺序，每位对手「已确定没有」的点数列表（来自其 pass 推断）。
- ``simulations`` / ``rollout`` / ``seed``：PIMC 抽样次数、模拟策略、随机种子。

响应体按胜率从高到低排序，见 ``analyze`` 返回结构。
"""

from __future__ import annotations

import json
import random
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from ..config import GameConfig
from ..mc.pimc import PIMCConfig, PublicState, rank_actions
from ..tiles import num_tiles, tile_id


class AnalyzeError(ValueError):
    """输入不合法（映射为 HTTP 400）。"""


# ---------------------------------------------------------------------------
# 输入解析
# ---------------------------------------------------------------------------

def _parse_tile(raw: Any, max_pip: int) -> tuple[int, int]:
    if isinstance(raw, str):
        for sep in ("|", ",", "-", " "):
            if sep in raw:
                parts = [p for p in raw.split(sep) if p != ""]
                break
        else:
            parts = list(raw)
        if len(parts) != 2:
            raise AnalyzeError(f"无法解析牌: {raw!r}")
        try:
            a, b = int(parts[0]), int(parts[1])
        except ValueError as e:
            raise AnalyzeError(f"无法解析牌: {raw!r}") from e
    elif isinstance(raw, (list, tuple)) and len(raw) == 2:
        try:
            a, b = int(raw[0]), int(raw[1])
        except (ValueError, TypeError) as e:
            raise AnalyzeError(f"无法解析牌: {raw!r}") from e
    else:
        raise AnalyzeError(f"牌须为 [a, b] 或 'a|b'，收到: {raw!r}")
    if not (0 <= a <= max_pip and 0 <= b <= max_pip):
        raise AnalyzeError(f"点数超出 0..{max_pip}: {raw!r}")
    return (a, b)


def _parse_tiles(raw: Any, max_pip: int, field: str) -> list[tuple[int, int]]:
    if raw is None:
        return []
    if not isinstance(raw, (list, tuple)):
        raise AnalyzeError(f"{field} 须为牌的列表")
    return [_parse_tile(t, max_pip) for t in raw]


def derive_ends(board: list[tuple[int, int]]) -> tuple[int, int]:
    """由桌面牌链（按连接顺序）推断两端裸露的点数。

    单张牌：两端即其两个点数。空桌面：返回 (-1, -1)。
    """
    n = len(board)
    if n == 0:
        return -1, -1
    if n == 1:
        return board[0]

    a0, b0 = board[0]
    inter = {a0, b0} & set(board[1])
    if not inter:
        raise AnalyzeError(f"桌面牌链不连续: {board[0]} 接不上 {board[1]}")
    conn = next(iter(inter))
    left = a0 if b0 == conn else b0  # 第一张裸露的点数
    cur = conn
    for i in range(1, n):
        a, b = board[i]
        if a == cur:
            cur = b
        elif b == cur:
            cur = a
        else:
            raise AnalyzeError(
                f"桌面牌链不连续：第 {i} 张 {board[i]} 接不上端点 {cur}"
            )
    return left, cur


def _even_split(total: int, parts: int) -> list[int]:
    if parts <= 0:
        return []
    base, rem = divmod(total, parts)
    return [base + (1 if i < rem else 0) for i in range(parts)]


def build_public_state(payload: dict) -> tuple[PublicState, GameConfig, PIMCConfig]:
    """把请求体解析为 (PublicState, GameConfig, PIMCConfig)。me 固定为座位 0。"""
    if not isinstance(payload, dict):
        raise AnalyzeError("请求体须为 JSON 对象")

    num_players = int(payload.get("num_players", 4))
    hand_size = int(payload.get("hand_size", 7))
    max_pip = int(payload.get("max_pip", 6))
    try:
        cfg = GameConfig(
            max_pip=max_pip, num_players=num_players, hand_size=hand_size
        )
    except ValueError as e:
        raise AnalyzeError(str(e)) from e

    deck_size = num_tiles(max_pip)

    hand_tiles = _parse_tiles(payload.get("hand"), max_pip, "hand")
    if not hand_tiles:
        raise AnalyzeError("hand 不能为空")

    board_tiles = _parse_tiles(payload.get("board"), max_pip, "board")
    played_tiles = _parse_tiles(payload.get("played"), max_pip, "played")

    # 已出牌集合：优先 board（有序牌链），否则 played
    played_source = board_tiles if board_tiles else played_tiles

    # 位图 + 唯一性 / 冲突校验
    my_hand = 0
    for a, b in hand_tiles:
        t = tile_id(a, b)
        if (my_hand >> t) & 1:
            raise AnalyzeError(f"手牌重复: [{a}|{b}]")
        my_hand |= 1 << t

    played = 0
    for a, b in played_source:
        t = tile_id(a, b)
        if (played >> t) & 1:
            raise AnalyzeError(f"桌面牌重复: [{a}|{b}]")
        if (my_hand >> t) & 1:
            raise AnalyzeError(f"同一张牌既在手牌又在桌面: [{a}|{b}]")
        played |= 1 << t

    # 两端点数：显式 left/right 优先，否则从有序 board 推断
    if "left" in payload or "right" in payload:
        if "left" not in payload or "right" not in payload:
            raise AnalyzeError("left 与 right 需同时提供")
        left_end, right_end = int(payload["left"]), int(payload["right"])
        if played and not (0 <= left_end <= max_pip and 0 <= right_end <= max_pip):
            raise AnalyzeError(f"left/right 超出 0..{max_pip}")
        if not played:
            left_end = right_end = -1
    elif board_tiles:
        left_end, right_end = derive_ends(board_tiles)
    elif played_tiles:
        raise AnalyzeError("只给 played 时必须同时提供 left 与 right")
    else:
        left_end = right_end = -1  # 开局

    unseen_count = deck_size - my_hand.bit_count() - played.bit_count()
    if unseen_count < 0:
        raise AnalyzeError("手牌 + 桌面牌数超过整副牌")

    n_opp = num_players - 1
    raw_counts = payload.get("opponent_hand_counts")
    if raw_counts is None:
        opp_counts = _even_split(unseen_count, n_opp)
    else:
        if not isinstance(raw_counts, (list, tuple)) or len(raw_counts) != n_opp:
            raise AnalyzeError(f"opponent_hand_counts 长度须为 {n_opp}")
        opp_counts = [int(c) for c in raw_counts]
        if any(c < 0 for c in opp_counts):
            raise AnalyzeError("opponent_hand_counts 不能为负")
        if sum(opp_counts) != unseen_count:
            raise AnalyzeError(
                f"opponent_hand_counts 之和 {sum(opp_counts)} "
                f"须等于未见牌数 {unseen_count}"
            )

    hand_sizes = [my_hand.bit_count()] + opp_counts

    raw_missing = payload.get("missing")
    missing_pips = [0] * num_players
    if raw_missing is not None:
        if not isinstance(raw_missing, (list, tuple)) or len(raw_missing) != n_opp:
            raise AnalyzeError(f"missing 长度须为 {n_opp}")
        for i, pips in enumerate(raw_missing):
            mask = 0
            for pip in pips or []:
                pip = int(pip)
                if not (0 <= pip <= max_pip):
                    raise AnalyzeError(f"missing 点数超出 0..{max_pip}: {pip}")
                mask |= 1 << pip
            missing_pips[i + 1] = mask

    state = PublicState(
        my_hand=my_hand,
        played=played,
        left_end=left_end,
        right_end=right_end,
        hand_sizes=hand_sizes,
        missing_pips=missing_pips,
        me=0,
        leader=0,
        consecutive_passes=int(payload.get("consecutive_passes", 0)),
    )

    n_sims = int(payload.get("simulations", payload.get("n_sims", 400)))
    if n_sims < 1:
        raise AnalyzeError("simulations 至少为 1")
    rollout = str(payload.get("rollout", "greedy"))
    if rollout not in ("random", "greedy", "counting"):
        raise AnalyzeError("rollout 只能是 random / greedy / counting")
    seed = payload.get("seed")
    seed = random.randrange(1 << 30) if seed is None else int(seed)
    pimc = PIMCConfig(n_sims=n_sims, rollout=rollout, seed=seed)
    return state, cfg, pimc


# ---------------------------------------------------------------------------
# 分析主函数
# ---------------------------------------------------------------------------

def analyze(payload: dict) -> dict:
    """执行 PIMC 模拟，返回按胜率从高到低排序的出牌建议。"""
    state, cfg, pimc = build_public_state(payload)
    ranking = rank_actions(state, cfg, pimc, random.Random(pimc.seed))

    def encode(st) -> dict:
        return {
            "tile": None if st.is_pass else list(st.tile),
            "side": st.side,
            "side_label": (
                "pass" if st.is_pass else ("left" if st.side == 0 else "right")
            ),
            "action": st.action,
            "pass": st.is_pass,
            "win_rate": round(st.win_rate, 4),
            "tie_rate": round(st.tie_rate, 4),
            "mean_score": round(st.mean_score, 3),
            "wins": st.wins,
            "ties": st.ties,
            "plays": st.plays,
        }

    ranked = [encode(s) for s in ranking]
    return {
        "ok": True,
        "config": {
            "num_players": cfg.num_players,
            "hand_size": cfg.hand_size,
            "max_pip": cfg.max_pip,
            "simulations": pimc.n_sims,
            "rollout": pimc.rollout,
            "seed": pimc.seed,
        },
        "board": {
            "left": state.left_end,
            "right": state.right_end,
            "played_count": state.played.bit_count(),
        },
        "hand_size_now": state.my_hand.bit_count(),
        "legal_moves": len(ranked),
        "ranking": ranked,
        "best": ranked[0] if ranked else None,
    }


# ---------------------------------------------------------------------------
# HTTP 层（标准库，无第三方依赖）
# ---------------------------------------------------------------------------

_INDEX_HTML = """<!doctype html><html lang=zh><meta charset=utf-8>
<title>Domino 蒙特卡洛出牌建议</title>
<style>
body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:820px;margin:2rem auto;padding:0 1rem;color:#1f2430}
h1{font-size:1.4rem}code,pre{background:#f5f6f8;border-radius:6px}
pre{padding:1rem;overflow:auto}code{padding:.1rem .3rem}
.hint{color:#666}
</style>
<h1>Domino 蒙特卡洛出牌建议</h1>
<p class=hint>POST JSON 到 <code>/analyze</code>，返回按胜率从高到低排序的出牌。
健康检查 <code>GET /health</code>。</p>
<pre>curl -s localhost:8000/analyze -H 'Content-Type: application/json' -d '{
  "hand":  [[6,6],[3,4],[1,5],[0,4],[2,2],[0,1],[5,6]],
  "board": [[3,5]],
  "simulations": 600,
  "rollout": "greedy"
}'</pre>
</html>"""


def build_handler():
    class AnalyzeHandler(BaseHTTPRequestHandler):
        server_version = "domimo-mc/0.1"

        def _send_json(self, code: int, obj: dict) -> None:
            body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:  # noqa: N802
            path = self.path.split("?", 1)[0]
            if path in ("/", "/index.html"):
                body = _INDEX_HTML.encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            elif path == "/health":
                self._send_json(200, {"ok": True, "status": "healthy"})
            else:
                self._send_json(404, {"ok": False, "error": "not found"})

        def do_POST(self) -> None:  # noqa: N802
            path = self.path.split("?", 1)[0]
            if path != "/analyze":
                self._send_json(404, {"ok": False, "error": "not found"})
                return
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            try:
                payload = json.loads(raw.decode("utf-8")) if raw else {}
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                self._send_json(400, {"ok": False, "error": f"JSON 解析失败: {e}"})
                return
            try:
                result = analyze(payload)
            except AnalyzeError as e:
                self._send_json(400, {"ok": False, "error": str(e)})
                return
            except Exception as e:  # noqa: BLE001
                self._send_json(500, {"ok": False, "error": f"内部错误: {e}"})
                return
            self._send_json(200, result)

        def log_message(self, fmt: str, *args) -> None:  # 静默默认访问日志
            pass

    return AnalyzeHandler


def run_server(host: str = "0.0.0.0", port: int = 8000) -> None:
    handler = build_handler()
    httpd = ThreadingHTTPServer((host, port), handler)
    print(f"[domimo-mc] 监听 http://{host}:{port}  (POST /analyze, GET /health)")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[domimo-mc] 已停止")
    finally:
        httpd.server_close()
