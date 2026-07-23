"""基线机器人 + 竞技场单测。"""

import random

import pytest

from domimo.agents import CountingAgent, GreedyAgent, RandomAgent
from domimo.arena import run_match
from domimo.config import GameConfig
from domimo.engine import DominoEngine
from domimo.tiles import tile_id


CFG = GameConfig()


def playout(agents_by_seat, seed):
    eng = DominoEngine(CFG)
    eng.reset(seed=seed)
    while not eng.is_over:
        a = agents_by_seat[eng.current_player]
        action = a.act(eng)
        assert (eng.legal_actions() >> action) & 1, f"{a.name} 给出非法动作"
        eng.step(action)
    return eng


# ---------------------------------------------------------------------------
# 每个 agent 全程只出合法动作
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("agent_cls", [RandomAgent, GreedyAgent, CountingAgent])
def test_agent_always_legal(agent_cls):
    agents = [agent_cls() for _ in range(4)]
    for seed in range(100):
        eng = playout(agents, seed)
        assert eng.is_over


def test_random_agent_deterministic_with_seed():
    a1, a2 = RandomAgent(seed=1), RandomAgent(seed=1)
    eng1 = playout([a1, RandomAgent(seed=2), RandomAgent(seed=3), RandomAgent(seed=4)], 5)
    a2.reset(seed=1)
    # 同种子同局面 → 同选择
    eng = DominoEngine(CFG)
    eng.reset(seed=9)
    b1, b2 = RandomAgent(seed=7), RandomAgent(seed=7)
    assert b1.act(eng) == b2.act(eng)
    assert eng1.is_over


# ---------------------------------------------------------------------------
# Greedy：构造局面验证选择
# ---------------------------------------------------------------------------

def _mid_game_engine(hand_tiles, left=3, right=5):
    eng = DominoEngine(CFG)
    eng.reset(seed=0)
    eng.hands = [0, 0, 0, 0]
    mask = 0
    for t in hand_tiles:
        mask |= 1 << t
    eng.hands[1] = mask
    eng.left_end, eng.right_end = left, right
    eng.played_mask = 1 << tile_id(3, 5)
    eng.current_player = 1
    eng.forced_action = -1
    return eng


def test_greedy_picks_highest_pip():
    # [3|4]=7点 接左，[5|6]=11点 接右 → 选 [5|6]
    t34, t56 = tile_id(3, 4), tile_id(5, 6)
    eng = _mid_game_engine([t34, t56])
    assert GreedyAgent().act(eng) == t56 * 2 + 1


def test_greedy_prefers_double_on_tie():
    # [5|5]=10点(双) 接右 vs [4|6]=10点 接不上 → 用 [3|3]=6(双) vs [2|4]=6
    t33, t24 = tile_id(3, 3), tile_id(2, 4)
    eng = _mid_game_engine([t33, t24], left=3, right=4)
    # 两张都能出（[3|3]接左、[2|4]接右），同 6 点，双牌优先
    assert GreedyAgent().act(eng) == t33 * 2


# ---------------------------------------------------------------------------
# Counting：堵牌行为验证
# ---------------------------------------------------------------------------

def test_counting_blocks_opponent_known_missing():
    """对手 2 已公开缺 6：可选把端点变成 6 或变成 1，应选 6 堵他。"""
    t36, t31 = tile_id(3, 6), tile_id(1, 3)
    eng = _mid_game_engine([t36, t31], left=3, right=5)
    eng.missing_pips[2] = 1 << 6  # 对手缺 6
    action = CountingAgent().act(eng)
    assert action == t36 * 2, "应出 [3|6] 把左端变成对手缺的 6"


def test_counting_legal_and_never_pass_when_playable():
    eng = _mid_game_engine([tile_id(3, 6), tile_id(0, 5)])
    action = CountingAgent().act(eng)
    assert action != CFG.pass_action


# ---------------------------------------------------------------------------
# 信息防火墙：agent 决策不得依赖他人手牌
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("agent_cls", [GreedyAgent, CountingAgent])
def test_agent_ignores_hidden_hands(agent_cls):
    """把其他玩家手牌互换后，agent 的选择必须不变。"""
    rng = random.Random(0)
    for seed in range(30):
        eng = DominoEngine(CFG)
        eng.reset(seed=seed)
        # 推进几步产生中局
        for _ in range(rng.randrange(0, 6)):
            if eng.is_over:
                break
            eng.step(rng.choice(eng.legal_actions_list()))
        if eng.is_over:
            continue
        agent = agent_cls()
        a1 = agent.act(eng)
        # 交换两个非当前玩家的手牌（隐藏信息变化，公开信息不变）
        others = [p for p in range(4) if p != eng.current_player]
        eng.hands[others[0]], eng.hands[others[1]] = (
            eng.hands[others[1]],
            eng.hands[others[0]],
        )
        a2 = agent.act(eng)
        assert a1 == a2, f"{agent.name} 的决策依赖了隐藏信息"


# ---------------------------------------------------------------------------
# 竞技场
# ---------------------------------------------------------------------------

def test_arena_basic_stats():
    agents = [RandomAgent(seed=i) for i in range(4)]
    r = run_match(agents, n_games=400, seed=0, n_workers=1)
    assert sum(r.wins) + r.draws == 400
    assert abs(sum(r.total_scores)) < 1e-6, "总分零和"
    assert len(r.elo) == 4
    # 全随机时各家胜率应接近 25%
    for wr in r.win_rates:
        assert 0.15 < wr < 0.35


def test_arena_seat_rotation_removes_bias():
    """轮换后，同为 random 的 4 个 agent 胜率差应小于不轮换时的先手优势。"""
    agents = [RandomAgent(seed=i) for i in range(4)]
    r = run_match(agents, n_games=800, seed=1, rotate_seats=True, n_workers=1)
    spread = max(r.win_rates) - min(r.win_rates)
    assert spread < 0.08


def test_arena_multiprocess_matches_single():
    """多进程与单进程结果一致（相同种子流）。"""
    a1 = [RandomAgent(seed=i) for i in range(4)]
    a2 = [RandomAgent(seed=i) for i in range(4)]
    r1 = run_match(a1, n_games=400, seed=3, n_workers=1)
    r2 = run_match(a2, n_games=400, seed=3, n_workers=2)
    assert r1.wins == r2.wins and r1.draws == r2.draws


def test_strength_ordering():
    """棋力排序（统一口径：各自 vs 3 个 random 的胜率）：
    counting > greedy > 25%（随机基准）。

    注：混合桌上 greedy 因风格可被 counting 针对，排序不稳定，
    故用"对抗同一基准"的独立测量做排序断言。
    """

    def wr_vs_randoms(agent, n=4000):
        agents = [agent, RandomAgent(seed=1), RandomAgent(seed=2), RandomAgent(seed=3)]
        r = run_match(agents, n_games=n, seed=42, n_workers=2)
        return r.win_rates[0]

    counting = wr_vs_randoms(CountingAgent())
    greedy = wr_vs_randoms(GreedyAgent())
    assert counting > greedy > 0.25, f"棋力排序不成立: counting={counting}, greedy={greedy}"
    assert counting > 0.33, f"counting 应显著高于 25% 基准: {counting}"
