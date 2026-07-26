"""对局数据 SQLite 存储：games / game_seats / moves / decisions 四表。

客户端（tampermonkey.js）在对局各事件发生时实时 POST /ingest，
本模块负责校验并写库。所有写入按主键幂等（INSERT OR REPLACE /
ON CONFLICT UPDATE），重发、乱序不会产生脏数据。

事件类型：

- ``game_start``：10a0 发牌 —— 建 games 行
- ``move``：13a0 出牌/过牌广播 —— 写 moves 行
- ``decision``：AI 决策（响应到达 / 12a0 实际执行各 upsert 一次）—— 写 decisions 行
- ``game_end``：20a0 结算或中途换局归档 —— 更新 games、写 game_seats
"""

from __future__ import annotations

import json
import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


class IngestError(ValueError):
    """/ingest 输入不合法（映射为 HTTP 400）。"""


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


_SCHEMA = """
CREATE TABLE IF NOT EXISTS games (
    game_uid     TEXT PRIMARY KEY,
    started_at   TEXT,
    ended_at     TEXT,
    duration_ms  INTEGER,
    status       TEXT NOT NULL DEFAULT 'playing',
    dealer_seat  INTEGER,
    my_seat      INTEGER,
    dealt_hand   TEXT,
    my_delta     INTEGER,
    my_remaining INTEGER,
    my_pips      INTEGER,
    win          INTEGER,
    updated_at   TEXT
);

CREATE TABLE IF NOT EXISTS game_seats (
    game_uid        TEXT NOT NULL,
    seat            INTEGER NOT NULL,
    money           INTEGER,
    remaining_count INTEGER,
    pips            INTEGER,
    final_hand      TEXT,
    PRIMARY KEY (game_uid, seat)
);

CREATE TABLE IF NOT EXISTS moves (
    game_uid   TEXT NOT NULL,
    move_index INTEGER NOT NULL,
    t_ms       INTEGER,
    seat       INTEGER,
    action     TEXT,
    tile_a     INTEGER,
    tile_b     INTEGER,
    side       INTEGER,
    left_end   INTEGER,
    right_end  INTEGER,
    counts     TEXT,
    PRIMARY KEY (game_uid, move_index)
);

CREATE TABLE IF NOT EXISTS decisions (
    game_uid     TEXT NOT NULL,
    decision_seq INTEGER NOT NULL,
    request_id   INTEGER,
    t_ms         INTEGER,
    latency_ms   REAL,
    request      TEXT,
    best_tile_a  INTEGER,
    best_tile_b  INTEGER,
    best_side    INTEGER,
    win_rate     REAL,
    ev           REAL,
    blocked_rate REAL,
    ranking      TEXT,
    error        TEXT,
    exec_action  TEXT,
    exec_tile_a  INTEGER,
    exec_tile_b  INTEGER,
    exec_side    INTEGER,
    followed_ai  INTEGER,
    note         TEXT,
    PRIMARY KEY (game_uid, decision_seq)
);

CREATE INDEX IF NOT EXISTS idx_moves_game ON moves (game_uid);
CREATE INDEX IF NOT EXISTS idx_decisions_game ON decisions (game_uid);
"""


# ---------------------------------------------------------------------------
# 输入校验小工具
# ---------------------------------------------------------------------------

def _require_str(payload: dict, key: str) -> str:
    v = payload.get(key)
    if not isinstance(v, str) or not v:
        raise IngestError(f"{key} 须为非空字符串")
    return v


def _opt_int(payload: dict, key: str) -> int | None:
    v = payload.get(key)
    if v is None:
        return None
    try:
        return int(v)
    except (TypeError, ValueError) as e:
        raise IngestError(f"{key} 须为整数: {v!r}") from e


def _require_int(payload: dict, key: str) -> int:
    v = _opt_int(payload, key)
    if v is None:
        raise IngestError(f"缺少 {key}")
    return v


def _opt_tile(raw: Any, field: str) -> tuple[int | None, int | None]:
    """牌 [a, b] → (a, b)；None / 缺省 → (None, None)。"""
    if raw is None:
        return None, None
    if (
        isinstance(raw, (list, tuple))
        and len(raw) == 2
        and all(isinstance(x, (int, float)) for x in raw)
    ):
        return int(raw[0]), int(raw[1])
    raise IngestError(f"{field} 须为 [a, b] 或 null: {raw!r}")


def _json_or_none(v: Any) -> str | None:
    if v is None:
        return None
    return json.dumps(v, ensure_ascii=False, separators=(",", ":"))


def _followed_ai(
    has_advice: bool,
    best_tile: tuple[int | None, int | None],
    exec_action: str | None,
    exec_tile: tuple[int | None, int | None],
) -> int | None:
    """AI 建议 vs 实际执行是否一致；无建议或未执行时返回 None。"""
    if not has_advice or exec_action is None:
        return None
    if exec_action == "pass":
        return 1 if best_tile == (None, None) else 0
    # 执行了出牌：AI 建议 pass 或牌面不同都算未遵循
    if best_tile == (None, None) or exec_tile == (None, None):
        return 0
    return 1 if sorted(best_tile) == sorted(exec_tile) else 0


class GameStore:
    """线程安全的对局 SQLite 存储（WAL + 全局写锁，配合 ThreadingHTTPServer）。"""

    EVENTS = ("game_start", "move", "decision", "game_end")

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        if self.path.parent != Path():
            self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._conn = sqlite3.connect(str(self.path), check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA synchronous=NORMAL")
        self._conn.executescript(_SCHEMA)
        self._conn.commit()

    def close(self) -> None:
        with self._lock:
            self._conn.close()

    # -- 事件分发 -----------------------------------------------------------

    def ingest(self, payload: dict) -> dict:
        """校验并写入一条事件；返回可回显的摘要。"""
        if not isinstance(payload, dict):
            raise IngestError("请求体须为 JSON 对象")
        event = payload.get("event")
        if event not in self.EVENTS:
            raise IngestError(f"event 须为 {'/'.join(self.EVENTS)}，收到: {event!r}")
        game_uid = _require_str(payload, "game_uid")
        handler = getattr(self, f"_ingest_{event}")
        with self._lock:
            handler(game_uid, payload)
            self._conn.commit()
        return {"event": event, "game_uid": game_uid}

    # -- 各事件写入（调用方已持锁） -------------------------------------------

    def _touch_game(self, game_uid: str) -> None:
        """未知 game_uid 的 move/decision/game_end 自动补建 games 行（容错乱序）。"""
        self._conn.execute(
            "INSERT OR IGNORE INTO games (game_uid, status, updated_at) VALUES (?, 'playing', ?)",
            (game_uid, _utc_now_iso()),
        )

    def _ingest_game_start(self, game_uid: str, p: dict) -> None:
        now = _utc_now_iso()
        started_at = p.get("started_at") or now
        self._conn.execute(
            """
            INSERT INTO games (game_uid, started_at, status, dealer_seat, dealt_hand, updated_at)
            VALUES (?, ?, 'playing', ?, ?, ?)
            ON CONFLICT(game_uid) DO UPDATE SET
                started_at = excluded.started_at,
                dealer_seat = excluded.dealer_seat,
                dealt_hand = excluded.dealt_hand,
                updated_at = excluded.updated_at
            """,
            (
                game_uid,
                started_at,
                _opt_int(p, "dealer_seat"),
                _json_or_none(p.get("dealt_hand")),
                now,
            ),
        )

    def _ingest_move(self, game_uid: str, p: dict) -> None:
        self._touch_game(game_uid)
        tile_a, tile_b = _opt_tile(p.get("tile"), "tile")
        self._conn.execute(
            """
            INSERT OR REPLACE INTO moves
                (game_uid, move_index, t_ms, seat, action, tile_a, tile_b,
                 side, left_end, right_end, counts)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                game_uid,
                _require_int(p, "move_index"),
                _opt_int(p, "t_ms"),
                _opt_int(p, "seat"),
                p.get("action"),
                tile_a,
                tile_b,
                _opt_int(p, "side"),
                _opt_int(p, "left"),
                _opt_int(p, "right"),
                _json_or_none(p.get("counts")),
            ),
        )

    def _ingest_decision(self, game_uid: str, p: dict) -> None:
        self._touch_game(game_uid)
        response = p.get("response") or {}
        if not isinstance(response, dict):
            raise IngestError("response 须为对象或 null")
        best = response.get("best") or {}
        if not isinstance(best, dict):
            raise IngestError("response.best 须为对象或 null")
        executed = p.get("executed") or {}
        if not isinstance(executed, dict):
            raise IngestError("executed 须为对象或 null")

        best_tile = _opt_tile(best.get("tile"), "response.best.tile")
        exec_tile = _opt_tile(executed.get("tile"), "executed.tile")
        exec_action = executed.get("action")

        self._conn.execute(
            """
            INSERT OR REPLACE INTO decisions
                (game_uid, decision_seq, request_id, t_ms, latency_ms, request,
                 best_tile_a, best_tile_b, best_side, win_rate, ev, blocked_rate,
                 ranking, error,
                 exec_action, exec_tile_a, exec_tile_b, exec_side, followed_ai, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                game_uid,
                _require_int(p, "decision_seq"),
                _opt_int(p, "request_id"),
                _opt_int(p, "t_ms"),
                p.get("latency_ms"),
                _json_or_none(p.get("request")),
                best_tile[0],
                best_tile[1],
                best.get("side"),
                best.get("win_rate"),
                best.get("ev"),
                best.get("blocked_rate"),
                _json_or_none(response.get("ranking")),
                response.get("error"),
                exec_action,
                exec_tile[0],
                exec_tile[1],
                executed.get("side"),
                _followed_ai(bool(best), best_tile, exec_action, exec_tile),
                p.get("note"),
            ),
        )

    def _ingest_game_end(self, game_uid: str, p: dict) -> None:
        self._touch_game(game_uid)
        now = _utc_now_iso()
        my_seat = _opt_int(p, "my_seat")
        result = p.get("result")
        if result is not None and not isinstance(result, dict):
            raise IngestError("result 须为对象或 null")

        my_delta = my_remaining = my_pips = win = None
        if result is not None:
            money = result.get("money") or []
            counts = result.get("counts") or []
            pips = result.get("pips") or []
            hands = result.get("hands") or []
            if my_seat is not None and 0 <= my_seat < len(money):
                my_delta = _as_int(money[my_seat], "result.money")
                win = 1 if my_delta > 0 else 0
            if my_seat is not None and 0 <= my_seat < len(counts):
                my_remaining = _as_int(counts[my_seat], "result.counts")
            if my_seat is not None and 0 <= my_seat < len(pips):
                my_pips = _as_int(pips[my_seat], "result.pips")
            for seat in range(max(len(money), len(counts), len(pips), len(hands))):
                self._conn.execute(
                    """
                    INSERT OR REPLACE INTO game_seats
                        (game_uid, seat, money, remaining_count, pips, final_hand)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        game_uid,
                        seat,
                        _at(money, seat),
                        _at(counts, seat),
                        _at(pips, seat),
                        _json_or_none(_at(hands, seat)),
                    ),
                )

        self._conn.execute(
            """
            UPDATE games SET
                ended_at = ?,
                duration_ms = COALESCE(?, duration_ms),
                status = ?,
                my_seat = COALESCE(?, my_seat),
                my_delta = ?,
                my_remaining = ?,
                my_pips = ?,
                win = ?,
                updated_at = ?
            WHERE game_uid = ?
            """,
            (
                p.get("ended_at") or now,
                _opt_int(p, "duration_ms"),
                "finished" if result is not None else "abandoned",
                my_seat,
                my_delta,
                my_remaining,
                my_pips,
                win,
                now,
                game_uid,
            ),
        )


def _as_int(v: Any, field: str) -> int:
    try:
        return int(v)
    except (TypeError, ValueError) as e:
        raise IngestError(f"{field} 须为整数: {v!r}") from e


def _at(seq: Any, i: int) -> Any:
    if isinstance(seq, (list, tuple)) and 0 <= i < len(seq):
        return seq[i]
    return None
