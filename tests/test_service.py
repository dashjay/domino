"""HTTP 出牌建议服务：解析、分析与端到端请求单测。"""

import json
import threading
import urllib.error
import urllib.request

import pytest

from domimo.service.app import (
    AnalyzeError,
    analyze,
    build_public_state,
    derive_ends,
)


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
# 端到端 HTTP
# ---------------------------------------------------------------------------

@pytest.fixture()
def live_server():
    from http.server import ThreadingHTTPServer

    from domimo.service.app import build_handler

    httpd = ThreadingHTTPServer(("127.0.0.1", 0), build_handler())
    port = httpd.server_address[1]
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    yield port
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
