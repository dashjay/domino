"""人机对战参数解析与牌面渲染测试。"""

from __future__ import annotations

import io
from contextlib import redirect_stdout

import pytest

from domimo.agents import CountingAgent, GreedyAgent, RandomAgent
from domimo.cli.agent_spec import make_agent, parse_agent_spec, resolve_opponent_specs
from domimo.cli.play_render import format_chain, legal_options, reconstruct_chain
from domimo.engine import DominoEngine


def test_parse_counting_kwargs():
    head, opts = parse_agent_spec("counting,w_stuck_next=90,w_pip=2.5")
    assert head == "counting"
    assert opts == {"w_stuck_next": 90, "w_pip": 2.5}
    agent = make_agent("counting,w_stuck_next=90,w_pip=2.5")
    assert isinstance(agent, CountingAgent)
    assert agent.W_STUCK_NEXT == 90.0
    assert agent.W_PIP == 2.5


def test_parse_nn_greedy_flag():
    head, opts = parse_agent_spec("nn:models/ppo_best.pt,greedy=0")
    assert head == "nn:models/ppo_best.pt"
    assert opts["greedy"] is False


def test_make_basic_agents():
    assert isinstance(make_agent("random", seed=1), RandomAgent)
    assert isinstance(make_agent("greedy"), GreedyAgent)
    assert isinstance(make_agent("counting"), CountingAgent)


def test_make_nn_agent_loads_checkpoint():
    pytest.importorskip("torch")
    from domimo.agents.nn_agent import NNAgent

    agent = make_agent("nn:models/ppo_best.pt,greedy=1", seed=0)
    assert isinstance(agent, NNAgent)
    assert agent.greedy is True


def test_resolve_opponent_specs_broadcast_and_per_seat():
    assert resolve_opponent_specs(["counting"], seat=0, num_players=4) == {
        1: "counting",
        2: "counting",
        3: "counting",
    }
    assert resolve_opponent_specs(
        ["counting", "greedy", "nn:models/ppo_best.pt"], seat=0, num_players=4
    ) == {1: "counting", 2: "greedy", 3: "nn:models/ppo_best.pt"}
    assert resolve_opponent_specs(["counting"], seat=2, num_players=4) == {
        0: "counting",
        1: "counting",
        3: "counting",
    }
    with pytest.raises(ValueError):
        resolve_opponent_specs(["a", "b"], seat=0, num_players=4)


def test_reconstruct_chain_matches_ends():
    eng = DominoEngine()
    eng.reset(seed=7)
    # 强制走若干随机合法步，链两端应与引擎一致
    rng_actions = 0
    while not eng.is_over and rng_actions < 20:
        legal = eng.legal_actions_list()
        # 优先出牌而非 pass，便于形成链
        playable = [a for a in legal if a != eng.config.pass_action]
        action = (playable or legal)[0]
        eng.step(action)
        rng_actions += 1
        chain = reconstruct_chain(eng)
        if eng.left_end < 0:
            assert chain == []
        else:
            assert chain[0][0] == eng.left_end
            assert chain[-1][1] == eng.right_end
            assert format_chain(eng)


def test_legal_options_first_move_or_pass():
    eng = DominoEngine()
    eng.reset(seed=1)
    opts = legal_options(eng)
    assert opts
    assert all(isinstance(a, int) and txt for a, txt in opts)


def test_plain_ui_plays_one_game_with_scripted_input():
    """用脚本化输入跑完 plain UI 一局（对手 random，自动可走完）。"""
    from domimo.cli import play as play_mod

    # 人类座位若首手被强制出双六，只需不断选 0；无法出则 PASS
    # 用足够多的 "0\n" 覆盖一手选择；终局后 n 退出
    script = "\n".join(["0"] * 80 + ["n"]) + "\n"
    buf = io.StringIO()
    with redirect_stdout(buf):
        # stdin 替换
        import sys

        old_in = sys.stdin
        sys.stdin = io.StringIO(script)
        try:
            play_mod.main([
                "--opponents", "random",
                "--ui", "plain",
                "--games", "1",
                "--seed", "123",
                "--no-color",
                "--auto-pass",
            ])
        finally:
            sys.stdin = old_in
    out = buf.getvalue()
    assert "终局" in out
    assert "累计" in out


def test_play_help_mentions_ui_and_params():
    from domimo.cli.play import _build_parser

    help_txt = _build_parser().format_help()
    assert "--ui" in help_txt
    assert "counting" in help_txt
    assert "nn:" in help_txt
