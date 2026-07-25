"""HTTP 出牌建议服务：解析、分析与端到端请求单测。"""

import json
import threading
import urllib.error
import urllib.request

import pytest

from domino.service.app import (
    AnalyzeError,
    analyze,
    build_public_state,
    derive_ends,
)
from domino.service.decision_log import DecisionLog


# ---------------------------------------------------------------------------
# derive_ends
# ---------------------------------------------------------------------------

def test_derive_ends_variants():
    assert derive_ends([]) == (-1, -1)
    assert derive_ends([(2, 4)]) == (2, 4)
    assert derive_ends([(3, 5), (5, 6), (6, 6)]) == (3, 6)
    assert derive_ends([(6, 6), (6, 3)]) == (6, 3)
    # 双牌在中间
    assert derive_ends([(2, 3), (3, 3), (3, 5)]) == (2, 5)


def test_derive_ends_discontinuous():
    with pytest.raises(AnalyzeError):
        derive_ends([(1, 2), (4, 5)])


# ---------------------------------------------------------------------------
# 输入解析
# ---------------------------------------------------------------------------

def test_build_state_defaults_even_split():
    state, cfg, pimc = build_public_state(
        {"hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]], "board": [[3, 5]]}
    )
    assert cfg.num_players == 4
    assert state.hand_sizes[0] == 7
    # 未见 = 28 - 7 - 1 = 20，三家 7/7/6
    assert sorted(state.hand_sizes[1:]) == [6, 7, 7]
    assert state.left_end == 3 and state.right_end == 5


def test_build_state_string_tiles():
    state, _, _ = build_public_state({"hand": ["6|6", "3|4", "1|5"], "left": 3, "right": 5,
                                      "board": [[3, 5]], "opponent_hand_counts": [8, 8, 8]})
    assert state.my_hand.bit_count() == 3


def test_build_state_rejects_overlap():
    with pytest.raises(AnalyzeError):
        build_public_state({"hand": [[3, 5]], "board": [[3, 5]]})


def test_build_state_rejects_bad_counts():
    with pytest.raises(AnalyzeError):
        build_public_state(
            {"hand": [[6, 6]], "board": [[3, 5]], "opponent_hand_counts": [1, 1, 1]}
        )


def test_build_state_missing_pips_offset():
    state, _, _ = build_public_state(
        {
            "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
            "board": [[3, 5]],
            "opponent_hand_counts": [7, 7, 6],
            "missing": [[6], [], [2, 3]],
        }
    )
    assert state.missing_pips[0] == 0
    assert state.missing_pips[1] == (1 << 6)
    assert state.missing_pips[3] == ((1 << 2) | (1 << 3))


def test_build_state_empty_board_is_opening():
    state, _, _ = build_public_state({"hand": [[6, 6], [3, 4], [1, 5]],
                                      "opponent_hand_counts": [8, 8, 9]})
    assert state.left_end == -1 and state.right_end == -1


# ---------------------------------------------------------------------------
# analyze 结果结构
# ---------------------------------------------------------------------------

def test_analyze_structure_and_sorted():
    result = analyze(
        {
            "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
            "board": [[3, 5]],
            "simulations": 150,
            "rollout": "greedy",
            "seed": 3,
        }
    )
    assert result["ok"] is True
    assert result["legal_moves"] == len(result["ranking"]) == 3
    rates = [r["win_rate"] for r in result["ranking"]]
    assert rates == sorted(rates, reverse=True)
    assert result["best"] == result["ranking"][0]
    for r in result["ranking"]:
        assert r["plays"] == 150
        assert 0.0 <= r["win_rate"] <= 1.0


def test_analyze_bad_rollout():
    with pytest.raises(AnalyzeError):
        analyze({"hand": [[6, 6]], "board": [[3, 5]], "rollout": "nope"})


# ---------------------------------------------------------------------------
# 决策 JSONL
# ---------------------------------------------------------------------------

def test_decision_log_writes_decision_and_feedback(tmp_path):
    log = DecisionLog(tmp_path / "mc.jsonl")
    req = {
        "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
        "board": [[3, 5]],
        "simulations": 80,
        "seed": 1,
        "requestId": 42,
    }
    result = analyze(req)
    log.log_decision(req, result, latency_ms=12.5)
    log.log_feedback(
        {"requestId": 42, "chosen": {"tile": [2, 2], "side_label": "left"}}
    )
    log.log_feedback({"requestId": 42, "won": True, "game_id": "g1"})
    lines = (tmp_path / "mc.jsonl").read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 3
    d0 = json.loads(lines[0])
    assert d0["type"] == "decision"
    assert d0["request_id"] == 42
    assert d0["win_rate"] == result["best"]["win_rate"]
    assert d0["best"]["tile"] == result["best"]["tile"]
    assert len(d0["ranking"]) == len(result["ranking"])
    d1 = json.loads(lines[1])
    assert d1["type"] == "feedback" and d1["chosen"]["tile"] == [2, 2]
    d2 = json.loads(lines[2])
    assert d2["won"] is True and d2["game_id"] == "g1"


# ---------------------------------------------------------------------------
# 端到端 HTTP
# ---------------------------------------------------------------------------

@pytest.fixture()
def live_server():
    from http.server import ThreadingHTTPServer

    from domino.service.app import build_handler

    httpd = ThreadingHTTPServer(("127.0.0.1", 0), build_handler())
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    yield port
    httpd.shutdown()
    httpd.server_close()


@pytest.fixture()
def live_server_with_log(tmp_path):
    from http.server import ThreadingHTTPServer

    from domino.service.app import build_handler

    log_path = tmp_path / "decisions.jsonl"
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), build_handler(DecisionLog(log_path)))
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    yield port, log_path
    httpd.shutdown()
    httpd.server_close()


def _post(port, path, obj):
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}{path}",
        data=json.dumps(obj).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status, json.loads(resp.read())


def test_http_health(live_server):
    with urllib.request.urlopen(f"http://127.0.0.1:{live_server}/health", timeout=5) as r:
        assert r.status == 200
        assert json.loads(r.read())["ok"] is True


def test_http_analyze(live_server):
    status, body = _post(
        live_server,
        "/analyze",
        {
            "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
            "board": [[3, 5]],
            "simulations": 120,
            "seed": 5,
        },
    )
    assert status == 200
    assert body["ok"] is True
    assert len(body["ranking"]) == 3


def test_http_analyze_bad_request(live_server):
    req = urllib.request.Request(
        f"http://127.0.0.1:{live_server}/analyze",
        data=json.dumps({"hand": []}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with pytest.raises(urllib.error.HTTPError) as exc:
        urllib.request.urlopen(req, timeout=5)
    assert exc.value.code == 400
    body = json.loads(exc.value.read())
    assert body["ok"] is False


def test_http_decision_log_and_feedback(live_server_with_log):
    port, log_path = live_server_with_log
    status, body = _post(
        port,
        "/analyze",
        {
            "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
            "board": [[3, 5]],
            "simulations": 80,
            "seed": 7,
            "requestId": 99,
        },
    )
    assert status == 200
    status, fb = _post(
        port,
        "/feedback",
        {
            "requestId": 99,
            "chosen": {"tile": body["best"]["tile"], "side_label": body["best"]["side_label"]},
            "won": False,
            "game_id": "t1",
        },
    )
    assert status == 200 and fb["ok"] is True
    lines = log_path.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 2
    d = json.loads(lines[0])
    assert d["type"] == "decision" and d["request_id"] == 99
    assert d["ranking"][0]["tile"] == body["best"]["tile"]
    f = json.loads(lines[1])
    assert f["type"] == "feedback" and f["won"] is False


# ---------------------------------------------------------------------------
# objective / payout

_BASE = {
    "hand": [[6, 6], [3, 4], [1, 5], [0, 4], [2, 2], [0, 1], [5, 6]],
    "board": [[3, 5]],
    "simulations": 60,
    "rollout": "greedy",
    "seed": 3,
}


def test_analyze_defaults_to_ev_objective():
    out = analyze(dict(_BASE))
    assert out["config"]["objective"] == "ev"
    assert out["config"]["payout"]["win_out"] == 6.0
    evs = [r["ev"] for r in out["ranking"]]
    assert evs == sorted(evs, reverse=True)


def test_analyze_exposes_outcome_breakdown():
    out = analyze(dict(_BASE))
    for r in out["ranking"]:
        o = r["outcomes"]
        total = o["win_out"] + o["win_blocked"] + o["lose_out"] + o["lose_blocked"]
        assert total + r["ties"] == r["plays"]
        assert 0.0 <= r["blocked_rate"] <= 1.0


def test_analyze_win_rate_objective_still_available():
    out = analyze({**_BASE, "objective": "win_rate"})
    assert out["config"]["objective"] == "win_rate"
    rates = [r["win_rate"] for r in out["ranking"]]
    assert rates == sorted(rates, reverse=True)


def test_analyze_custom_payout():
    out = analyze({**_BASE, "payout": {"win_out": 10, "lose_out": -1}})
    assert out["config"]["payout"]["win_out"] == 10.0
    assert out["config"]["payout"]["lose_out"] == -1.0
    # 未指定的字段保留默认值
    assert out["config"]["payout"]["win_blocked"] == 3.0


@pytest.mark.parametrize(
    "bad, match",
    [
        ({"objective": "nope"}, "objective"),
        ({"payout": [1, 2]}, "payout"),
        ({"payout": {"bogus": 1}}, "payout"),
    ],
)
def test_analyze_rejects_bad_objective_or_payout(bad, match):
    with pytest.raises(AnalyzeError, match=match):
        analyze({**_BASE, **bad})
