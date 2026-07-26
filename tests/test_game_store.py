"""对局 SQLite 存储（GameStore）与 POST /ingest 端到端单测。"""

import json
import sqlite3
import threading
import urllib.error
import urllib.request

import pytest

from domino.service.game_store import GameStore, IngestError


@pytest.fixture()
def store(tmp_path):
    s = GameStore(tmp_path / "games.sqlite3")
    yield s
    s.close()


def _rows(store, sql, args=()):
    conn = sqlite3.connect(str(store.path))
    conn.row_factory = sqlite3.Row
    try:
        return [dict(r) for r in conn.execute(sql, args).fetchall()]
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# 事件写入
# ---------------------------------------------------------------------------

def test_full_game_flow(store):
    uid = "g-test-1"
    store.ingest(
        {
            "event": "game_start",
            "game_uid": uid,
            "started_at": "2026-07-25T08:00:00.000Z",
            "dealer_seat": 2,
            "dealt_hand": [[3, 5], [6, 6], [0, 1]],
        }
    )
    store.ingest(
        {
            "event": "move",
            "game_uid": uid,
            "move_index": 0,
            "t_ms": 1200,
            "seat": 2,
            "action": "PLAY",
            "tile": [3, 5],
            "side": 0,
            "left": 3,
            "right": 5,
            "counts": [7, 7, 6, 7],
        }
    )
    store.ingest(
        {
            "event": "move",
            "game_uid": uid,
            "move_index": 1,
            "t_ms": 3000,
            "seat": 1,
            "action": "PASS",
            "tile": None,
            "side": None,
        }
    )
    # decision 两阶段：先 AI 响应，再补实际执行（同 seq 覆盖）
    store.ingest(
        {
            "event": "decision",
            "game_uid": uid,
            "decision_seq": 0,
            "request_id": 5,
            "t_ms": 4000,
            "latency_ms": 230.5,
            "request": {"hand": [[6, 6]], "board": [[3, 5]]},
            "response": {
                "ok": True,
                "best": {"tile": [6, 6], "side": 0, "win_rate": 0.42, "ev": 0.1,
                         "blocked_rate": 0.2},
                "ranking": [{"tile": [6, 6]}],
            },
        }
    )
    store.ingest(
        {
            "event": "decision",
            "game_uid": uid,
            "decision_seq": 0,
            "request_id": 5,
            "t_ms": 4000,
            "latency_ms": 230.5,
            "request": {"hand": [[6, 6]], "board": [[3, 5]]},
            "response": {
                "ok": True,
                "best": {"tile": [6, 6], "side": 0, "win_rate": 0.42, "ev": 0.1,
                         "blocked_rate": 0.2},
                "ranking": [{"tile": [6, 6]}],
            },
            "executed": {"action": "play", "tile": [6, 6], "side": 0},
        }
    )
    store.ingest(
        {
            "event": "game_end",
            "game_uid": uid,
            "my_seat": 1,
            "duration_ms": 45000,
            "result": {
                "money": [-100, 300, -100, -100],
                "counts": [2, 0, 3, 1],
                "pips": [8, 0, 15, 4],
                "hands": [[[1, 2], [3, 3]], [], [[4, 5], [5, 6], [0, 0]], [[2, 6]]],
            },
        }
    )

    games = _rows(store, "SELECT * FROM games")
    assert len(games) == 1
    g = games[0]
    assert g["game_uid"] == uid
    assert g["status"] == "finished"
    assert g["dealer_seat"] == 2
    assert g["my_seat"] == 1
    assert g["my_delta"] == 300 and g["win"] == 1
    assert g["my_remaining"] == 0 and g["my_pips"] == 0
    assert json.loads(g["dealt_hand"]) == [[3, 5], [6, 6], [0, 1]]

    seats = _rows(store, "SELECT * FROM game_seats ORDER BY seat")
    assert [s["money"] for s in seats] == [-100, 300, -100, -100]
    assert json.loads(seats[2]["final_hand"]) == [[4, 5], [5, 6], [0, 0]]

    moves = _rows(store, "SELECT * FROM moves ORDER BY move_index")
    assert len(moves) == 2
    assert (moves[0]["tile_a"], moves[0]["tile_b"]) == (3, 5)
    assert moves[0]["action"] == "PLAY" and moves[0]["left_end"] == 3
    assert moves[1]["action"] == "PASS" and moves[1]["tile_a"] is None
    assert json.loads(moves[0]["counts"]) == [7, 7, 6, 7]

    decisions = _rows(store, "SELECT * FROM decisions")
    assert len(decisions) == 1  # 两阶段 upsert 只留一行
    d = decisions[0]
    assert d["request_id"] == 5
    assert (d["best_tile_a"], d["best_tile_b"]) == (6, 6)
    assert d["win_rate"] == 0.42
    assert d["exec_action"] == "play"
    assert d["followed_ai"] == 1


def test_move_before_game_start_autocreates_game(store):
    store.ingest(
        {"event": "move", "game_uid": "g-orphan", "move_index": 0,
         "seat": 0, "action": "PASS"}
    )
    games = _rows(store, "SELECT * FROM games WHERE game_uid = 'g-orphan'")
    assert len(games) == 1 and games[0]["status"] == "playing"


def test_game_end_without_result_marks_abandoned(store):
    store.ingest({"event": "game_start", "game_uid": "g-quit", "dealer_seat": 0})
    store.ingest({"event": "game_end", "game_uid": "g-quit", "result": None})
    g = _rows(store, "SELECT * FROM games WHERE game_uid = 'g-quit'")[0]
    assert g["status"] == "abandoned"
    assert g["my_delta"] is None and g["win"] is None
    assert _rows(store, "SELECT * FROM game_seats WHERE game_uid = 'g-quit'") == []


def test_followed_ai_variants(store):
    uid = "g-follow"
    # AI 建议 [6,6] 但实际出 [3,4] → 未遵循
    store.ingest(
        {
            "event": "decision", "game_uid": uid, "decision_seq": 0,
            "response": {"best": {"tile": [6, 6], "side": 0}},
            "executed": {"action": "play", "tile": [3, 4], "side": 1},
        }
    )
    # 无 AI 决策（手动出牌）→ NULL
    store.ingest(
        {
            "event": "decision", "game_uid": uid, "decision_seq": 1,
            "executed": {"action": "play", "tile": [1, 2], "side": 0},
            "note": "no-ai-decision",
        }
    )
    # AI 建议 pass 且实际 pass → 遵循
    store.ingest(
        {
            "event": "decision", "game_uid": uid, "decision_seq": 2,
            "response": {"best": {"tile": None, "side": None, "pass": True}},
            "executed": {"action": "pass", "tile": None},
        }
    )
    rows = _rows(store, "SELECT * FROM decisions WHERE game_uid = ? ORDER BY decision_seq", (uid,))
    assert [r["followed_ai"] for r in rows] == [0, None, 1]
    assert rows[1]["note"] == "no-ai-decision"


def test_ingest_rejects_bad_input(store):
    with pytest.raises(IngestError, match="event"):
        store.ingest({"event": "nope", "game_uid": "g"})
    with pytest.raises(IngestError, match="game_uid"):
        store.ingest({"event": "move"})
    with pytest.raises(IngestError, match="move_index"):
        store.ingest({"event": "move", "game_uid": "g"})
    with pytest.raises(IngestError, match="tile"):
        store.ingest({"event": "move", "game_uid": "g", "move_index": 0, "tile": "6|6"})
    with pytest.raises(IngestError, match="decision_seq"):
        store.ingest({"event": "decision", "game_uid": "g"})


def test_ingest_idempotent_replay(store):
    ev = {
        "event": "move", "game_uid": "g-dup", "move_index": 0,
        "seat": 1, "action": "PLAY", "tile": [2, 4], "side": 1,
    }
    store.ingest(ev)
    store.ingest(ev)  # 重发（网络重试场景）
    assert len(_rows(store, "SELECT * FROM moves WHERE game_uid = 'g-dup'")) == 1


# ---------------------------------------------------------------------------
# 端到端 HTTP /ingest
# ---------------------------------------------------------------------------

@pytest.fixture()
def live_server_with_db(tmp_path):
    from http.server import ThreadingHTTPServer

    from domino.service.app import build_handler

    db_path = tmp_path / "games.sqlite3"
    store = GameStore(db_path)
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), build_handler(None, store))
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    yield port, store
    httpd.shutdown()
    httpd.server_close()
    store.close()


def _post(port, path, obj):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}{path}",
        data=json.dumps(obj).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read())


def test_http_ingest_flow(live_server_with_db):
    port, store = live_server_with_db
    status, body = _post(
        port, "/ingest",
        {"event": "game_start", "game_uid": "g-http", "dealer_seat": 1,
         "dealt_hand": [[0, 0]]},
    )
    assert status == 200 and body["ok"] is True
    assert body["recorded"] == {"event": "game_start", "game_uid": "g-http"}
    status, _ = _post(
        port, "/ingest",
        {"event": "game_end", "game_uid": "g-http", "my_seat": 0,
         "result": {"money": [10, -10, 0, 0], "counts": [0, 1, 2, 3],
                    "pips": [0, 5, 8, 9], "hands": [[], [[1, 1]], [], []]}},
    )
    assert status == 200
    g = _rows(store, "SELECT * FROM games WHERE game_uid = 'g-http'")[0]
    assert g["status"] == "finished" and g["my_delta"] == 10 and g["win"] == 1


def test_http_ingest_bad_event(live_server_with_db):
    port, _ = live_server_with_db
    with pytest.raises(urllib.error.HTTPError) as exc:
        _post(port, "/ingest", {"event": "bogus", "game_uid": "g"})
    assert exc.value.code == 400
    assert json.loads(exc.value.read())["ok"] is False


def test_http_ingest_disabled_returns_503(tmp_path):
    from http.server import ThreadingHTTPServer

    from domino.service.app import build_handler

    httpd = ThreadingHTTPServer(("127.0.0.1", 0), build_handler())
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    try:
        with pytest.raises(urllib.error.HTTPError) as exc:
            _post(port, "/ingest", {"event": "game_start", "game_uid": "g"})
        assert exc.value.code == 503
    finally:
        httpd.shutdown()
        httpd.server_close()
