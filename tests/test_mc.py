"""蒙特卡洛（PIMC）核心与 MCAgent 单测。"""

import random

import pytest

from domino.agents import MCAgent
from domino.config import GameConfig
from domino.engine import DominoEngine
from domino.mc.pimc import (
    PIMCConfig,
    PublicState,
    legal_actions_for,
    make_policy,
    rank_actions,
    sample_adversarial_deal,
    sample_deal,
)
from domino.tiles import build_pips_table, tile_id

CFG = GameConfig()


def _mid_state(hand_tiles, left, right, played_tiles, hand_sizes=None, missing=None):
    my_hand = 0
    for t in hand_tiles:
        my_hand |= 1 << t
    played = 0
    for t in played_tiles:
        played |= 1 << t
    return PublicState(
        my_hand=my_hand,
        played=played,
        left_end=left,
        right_end=right,
        hand_sizes=hand_sizes or [len(hand_tiles), 7, 7, 7],
        missing_pips=missing or [0, 0, 0, 0],
        me=0,
        leader=0,
    )


# ---------------------------------------------------------------------------
# rank_actions 基本性质
# ---------------------------------------------------------------------------

def test_rank_actions_sorted_and_complete():
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5), tile_id(0, 1),
         tile_id(2, 2), tile_id(6, 6), tile_id(0, 4)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
    )
    rk = rank_actions(state, CFG, PIMCConfig(n_sims=200, rollout="greedy", seed=1))
    # 只有 [3|4]接左, [5|6]接右, [1|5]接右 三个合法动作
    assert len(rk) == 3
    # 降序
    rates = [s.win_rate for s in rk]
    assert rates == sorted(rates, reverse=True)
    for s in rk:
        assert s.plays == 200
        assert 0.0 <= s.win_rate <= 1.0
        assert not s.is_pass


def test_rank_actions_matches_legal():
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
        hand_sizes=[3, 7, 7, 7],
    )
    legal = set(legal_actions_for(state, CFG))
    rk = rank_actions(state, CFG, PIMCConfig(n_sims=50, seed=0))
    assert {s.action for s in rk} == legal


def test_rank_actions_deterministic_with_seed():
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5), tile_id(0, 4)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
    )
    a = rank_actions(state, CFG, PIMCConfig(n_sims=100, seed=42), random.Random(42))
    b = rank_actions(state, CFG, PIMCConfig(n_sims=100, seed=42), random.Random(42))
    assert [(s.action, s.wins, s.plays) for s in a] == [
        (s.action, s.wins, s.plays) for s in b
    ]


def test_forced_win_move_ranks_first():
    """自己只剩两张、有一步可直接打完（出完即赢）应拿到最高胜率（=1.0）。"""
    # 手里 [3|4] 接左端 3, [0|1] 无法接 -> 出 [3|4] 后我剩 [0|1] 一张…
    # 用「只剩一张且可出」的必胜场景：手里仅 [3|6], 端点 3 -> 出掉即赢。
    state = _mid_state(
        [tile_id(3, 6)], left=3, right=5,
        played_tiles=[tile_id(3, 5)], hand_sizes=[1, 5, 5, 6],
    )
    rk = rank_actions(state, CFG, PIMCConfig(n_sims=50, seed=1))
    assert rk[0].win_rate == 1.0
    assert rk[0].tile == (3, 6)


# ---------------------------------------------------------------------------
# 确定化抽样满足约束
# ---------------------------------------------------------------------------

def test_sample_deal_respects_counts_and_missing():
    pips = build_pips_table(6)
    deck = 28
    my_hand = {tile_id(0, 0), tile_id(1, 1), tile_id(2, 2)}
    played = {tile_id(3, 3)}
    unseen = [t for t in range(deck) if t not in my_hand and t not in played]
    opp_seats = [1, 2, 3]
    counts = {1: 8, 2: 8, 3: 8}  # 24 未见牌
    missing = [0, 0, 0, 0]
    missing[1] = 1 << 6  # 对手1 不能有含 6 的牌
    rng = random.Random(0)
    deal = sample_deal(unseen, opp_seats, counts, missing, pips, rng)
    assert deal is not None
    # 数量正确、互不重叠、并集=未见
    all_mask = 0
    for s in opp_seats:
        assert deal[s].bit_count() == counts[s]
        assert (all_mask & deal[s]) == 0
        all_mask |= deal[s]
    assert all_mask == sum(1 << t for t in unseen)
    # 约束：对手1 没有含 6 的牌
    for t in range(deck):
        if (deal[1] >> t) & 1:
            a, b = pips[t]
            assert a != 6 and b != 6


def test_sample_deal_infeasible_returns_none():
    pips = build_pips_table(6)
    unseen = [tile_id(0, 6), tile_id(1, 6)]  # 两张都含 6
    # 唯一对手缺 6 却要拿 2 张 -> 不可能
    deal = sample_deal(unseen, [1], {1: 2}, [0, 1 << 6], pips, random.Random(0), max_tries=10)
    assert deal is None


# ---------------------------------------------------------------------------
# 策略工厂
# ---------------------------------------------------------------------------

def test_make_policy_unknown():
    with pytest.raises(ValueError):
        make_policy("does-not-exist")


@pytest.mark.parametrize("name", ["random", "greedy", "counting", "mixed"])
def test_make_policy_returns_legal(name):
    policy = make_policy(name, seed=1, me=0)
    eng = DominoEngine(CFG)
    eng.reset(seed=3)
    a = policy(eng)
    assert (eng.legal_actions() >> a) & 1


def test_sample_adversarial_deal_respects_missing():
    pips = build_pips_table(6)
    my_hand = 1 << tile_id(6, 6)
    played = 1 << tile_id(3, 3)
    unseen = [
        t for t in range(28)
        if not ((my_hand >> t) & 1) and not ((played >> t) & 1)
    ]
    assert len(unseen) == 26
    counts = {1: 9, 2: 9, 3: 8}
    missing = [0, 1 << 0, 0, 0]  # 下家缺 0
    deal = sample_adversarial_deal(
        unseen, [1, 2, 3], counts, missing, pips, random.Random(1),
        next_seat=1, left_end=3, right_end=5, my_hand=my_hand,
        candidates=4,
    )
    assert deal is not None
    for t in range(28):
        if (deal[1] >> t) & 1:
            a, b = pips[t]
            assert a != 0 and b != 0


# ---------------------------------------------------------------------------
# MCAgent：合法性 + 信息防火墙
# ---------------------------------------------------------------------------

def test_mc_agent_always_legal():
    agents = [MCAgent(n_sims=30, seed=i) for i in range(4)]
    for seed in range(10):
        eng = DominoEngine(CFG)
        eng.reset(seed=seed)
        while not eng.is_over:
            a = agents[eng.current_player]
            action = a.act(eng)
            assert (eng.legal_actions() >> action) & 1
            eng.step(action)
        assert eng.is_over


def test_mc_agent_ignores_hidden_hands():
    """重排对手手牌内容但保持各家张数（公开信息不变）→ 决策必须不变。

    MCAgent 只从公开信息（未见牌集合 + 各家张数 + 缺数字推断）重新确定化，
    因此在同一随机种子下，任何仅改变隐藏内容、不改变公开量的扰动都不应影响决策。
    """
    rng = random.Random(0)
    checked = 0
    for seed in range(40):
        eng = DominoEngine(CFG)
        eng.reset(seed=seed)
        for _ in range(rng.randrange(0, 6)):
            if eng.is_over:
                break
            eng.step(rng.choice(eng.legal_actions_list()))
        if eng.is_over or len(eng.legal_actions_list()) == 1:
            continue
        agent = MCAgent(n_sims=80, seed=123)
        a1 = agent.act(eng)
        # 收集非当前玩家的全部牌，重排后按原张数重新发回各座位（张数不变）
        others = [p for p in range(4) if p != eng.current_player]
        sizes = {p: eng.hands[p].bit_count() for p in others}
        pool = [t for p in others for t in _bits(eng.hands[p])]
        rng.shuffle(pool)
        idx = 0
        for p in others:
            mask = 0
            for _ in range(sizes[p]):
                mask |= 1 << pool[idx]
                idx += 1
            eng.hands[p] = mask
        agent2 = MCAgent(n_sims=80, seed=123)
        a2 = agent2.act(eng)
        assert a1 == a2, "MCAgent 的决策依赖了隐藏信息"
        checked += 1
    assert checked > 0


def _bits(mask):
    out = []
    while mask:
        low = mask & -mask
        out.append(low.bit_length() - 1)
        mask ^= low
    return out


# ---------------------------------------------------------------------------
# EV 目标（按真实赔付排序）
# ---------------------------------------------------------------------------

def test_outcome_counts_partition_plays():
    """走空赢/堵死赢/走空输/堵死输 + 平局 应恰好覆盖全部模拟。"""
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5), tile_id(0, 1),
         tile_id(2, 2), tile_id(6, 6), tile_id(0, 4)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
    )
    rk = rank_actions(state, CFG, PIMCConfig(n_sims=120, rollout="greedy", seed=3))
    for s in rk:
        assert sum(s.outcome_counts()) + s.ties == s.plays
        assert all(c >= 0 for c in s.outcome_counts())
        assert 0.0 <= s.blocked_rate <= 1.0


def test_ev_matches_payout_definition():
    from domino.mc.pimc import PayoutModel

    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
        hand_sizes=[3, 7, 7, 7],
    )
    payout = PayoutModel()
    rk = rank_actions(state, CFG, PIMCConfig(n_sims=100, rollout="greedy", seed=5))
    for s in rk:
        w_out, w_blk, l_out, l_blk = s.outcome_counts()
        expect = (
            w_out * payout.win_out + w_blk * payout.win_blocked
            + l_out * payout.lose_out + l_blk * payout.lose_blocked
        ) / s.plays
        assert s.ev(payout) == pytest.approx(expect)


def test_ev_objective_sorts_by_ranking_ev():
    from domino.mc.pimc import PayoutModel

    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5), tile_id(0, 1),
         tile_id(2, 2), tile_id(6, 6), tile_id(0, 4)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
    )
    cfg = PIMCConfig(n_sims=200, rollout="greedy", seed=7, objective="ev")
    rk = rank_actions(state, CFG, cfg)
    payout = PayoutModel()
    evs = [s.ranking_ev(payout, cfg) for s in rk]
    assert evs == sorted(evs, reverse=True)


def test_ev_payout_all_wins_equal_reduces_to_win_rate():
    """把走空/堵死赔付调成一样且关闭 underdog 偏置时，EV 排序退化为纯胜率。"""
    from domino.mc.pimc import PayoutModel

    flat = PayoutModel(win_out=1.0, win_blocked=1.0, lose_out=0.0, lose_blocked=0.0)
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6), tile_id(1, 5), tile_id(0, 1),
         tile_id(2, 2), tile_id(6, 6), tile_id(0, 4)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
    )
    rk = rank_actions(
        state, CFG,
        PIMCConfig(
            n_sims=200, rollout="greedy", seed=11, objective="ev", payout=flat,
            underdog_wr=0.0, deal_candidates=1,
        ),
    )
    for s in rk:
        assert s.ev(flat) == pytest.approx(s.win_rate)
    assert [s.win_rate for s in rk] == sorted([s.win_rate for s in rk], reverse=True)


def test_underdog_ranking_prefers_higher_block_rate():
    """低胜率时 ranking_ev 应对更高堵死率给正加成。"""
    from domino.mc.pimc import ActionStat, PayoutModel

    cfg = PIMCConfig(objective="ev", underdog_wr=0.30, underdog_block_bonus=0.55)
    payout = PayoutModel()
    low_block = ActionStat(0, (1, 2), 0, False)
    high_block = ActionStat(1, (3, 4), 0, False)
    for st, br in ((low_block, 0.1), (high_block, 0.7)):
        st.plays = 100
        st.wins = 20
        st.blocked_plays = br * 100
        st.wins_blocked = 5
        st.end_pip_sum = 800
    assert high_block.ranking_ev(payout, cfg) > low_block.ranking_ev(payout, cfg)


def test_unknown_objective_rejected():
    state = _mid_state(
        [tile_id(3, 4), tile_id(5, 6)],
        left=3, right=5, played_tiles=[tile_id(3, 5)],
        hand_sizes=[2, 7, 7, 7],
    )
    with pytest.raises(ValueError, match="objective"):
        rank_actions(state, CFG, PIMCConfig(n_sims=10, objective="nope"))
