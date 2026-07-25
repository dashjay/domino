"""engine.py 规则单测 + 随机 fuzz 守恒检查。"""

import random

import pytest

from domino.config import (
    BlockedTieRule,
    FirstMoveRule,
    GameConfig,
    ScoringRule,
)
from domino.engine import DominoEngine, IllegalActionError
from domino.tiles import is_double, iter_tiles, pip_sum, popcount, tile_id


CFG = GameConfig()


def make_engine(seed=0, **kwargs) -> DominoEngine:
    eng = DominoEngine(GameConfig(**kwargs) if kwargs else CFG)
    eng.reset(seed=seed)
    return eng


def random_playout(eng: DominoEngine, rng: random.Random) -> None:
    while not eng.is_over:
        eng.step(rng.choice(eng.legal_actions_list()))


# ---------------------------------------------------------------------------
# 发牌
# ---------------------------------------------------------------------------

def test_deal_no_overlap_no_missing():
    eng = make_engine(seed=123)
    union = 0
    total = 0
    for h in eng.hands:
        assert union & h == 0, "手牌之间不应重叠"
        union |= h
        total += popcount(h)
    assert total == 28, "4 人 × 7 张 = 28 张全部发完"
    assert union == (1 << 28) - 1


def test_deal_deterministic_with_seed():
    e1, e2 = make_engine(seed=7), make_engine(seed=7)
    assert e1.hands == e2.hands
    assert e1.current_player == e2.current_player


def test_deal_differs_across_seeds():
    assert make_engine(seed=1).hands != make_engine(seed=2).hands


# ---------------------------------------------------------------------------
# 首手规则
# ---------------------------------------------------------------------------

def test_first_move_forced_highest_double():
    """默认规则：持最大双牌者先出且必须出它。"""
    for seed in range(20):
        eng = make_engine(seed=seed)
        # 找全场最大双牌
        best = max(
            tid
            for h in eng.hands
            for tid in iter_tiles(h)
            if is_double(tid, eng.pips)
        )
        holder = next(p for p, h in enumerate(eng.hands) if (h >> best) & 1)
        assert eng.current_player == holder
        assert eng.legal_actions_list() == [best * 2]
        # 出其他牌应报错
        other = next(t for t in iter_tiles(eng.hands[holder]) if t != best)
        with pytest.raises(IllegalActionError):
            eng.step(other * 2)


def test_first_move_free_rule():
    eng = make_engine(seed=3, first_move_rule=FirstMoveRule.HIGHEST_DOUBLE_FREE)
    hand = eng.hands[eng.current_player]
    legal = eng.legal_actions_list()
    assert legal == [tid * 2 for tid in iter_tiles(hand)], "自由首手可出任意手牌（side=0）"


def test_first_move_random_rule_seeded():
    eng = make_engine(seed=5, first_move_rule=FirstMoveRule.RANDOM_FREE)
    assert 0 <= eng.current_player < 4
    assert len(eng.legal_actions_list()) == 7


def test_first_move_sets_ends():
    eng = make_engine(seed=0)
    (forced,) = eng.legal_actions_list()
    tid = forced // 2
    a, b = eng.pips[tid]
    eng.step(forced)
    assert (eng.left_end, eng.right_end) == (a, b)


# ---------------------------------------------------------------------------
# 合法动作
# ---------------------------------------------------------------------------

def _setup_mid_game():
    """构造确定局面：桌面只出了 [3|5]，轮到玩家 1。"""
    eng = DominoEngine(CFG)
    eng.reset(seed=0)
    # 手工覆盖状态
    eng.hands = [0, 0, 0, 0]
    eng.left_end, eng.right_end = 3, 5
    eng.played_mask = 1 << tile_id(3, 5)
    eng.current_player = 1
    eng.forced_action = -1
    eng.is_over = False
    return eng


def test_legal_actions_both_ends():
    eng = _setup_mid_game()
    # [3|6] 只能接左；[5|5] 只能接右；[3|5] 已出（换 [1|2] 谁都接不上）
    t36, t55, t12 = tile_id(3, 6), tile_id(5, 5), tile_id(1, 2)
    eng.hands[1] = (1 << t36) | (1 << t55) | (1 << t12)
    legal = set(eng.legal_actions_list())
    assert legal == {t36 * 2, t55 * 2 + 1}


def test_legal_actions_tile_fits_both_sides():
    """[3|5] 类型的牌（此处用 [5|3] 手牌换成 [3|5] 已出，改用 [5|3]... 直接测两端都能接的牌）"""
    eng = _setup_mid_game()
    t35b = tile_id(3, 5)  # 已经出了，用 [5|3] 不存在——改用两端都匹配的另一张：[3|5] 唯一
    # 用一张同时含 3 和 5 的牌只有 [3|5]；改测：手持 [3|3] 与 [5|5]
    t33, t55 = tile_id(3, 3), tile_id(5, 5)
    eng.hands[1] = (1 << t33) | (1 << t55)
    legal = set(eng.legal_actions_list())
    assert legal == {t33 * 2, t55 * 2 + 1}
    assert t35b * 2 not in legal


def test_legal_actions_same_ends_canonicalized():
    """左右端点数相同时，同一张牌只保留 side=0，无冗余动作。"""
    eng = _setup_mid_game()
    eng.left_end, eng.right_end = 4, 4
    t46 = tile_id(4, 6)
    eng.hands[1] = 1 << t46
    assert eng.legal_actions_list() == [t46 * 2]


def test_pass_only_when_stuck():
    eng = _setup_mid_game()
    t12 = tile_id(1, 2)
    eng.hands[1] = 1 << t12  # 接不上 3/5
    assert eng.legal_actions_list() == [CFG.pass_action]
    # 有牌可出时 pass 非法
    eng.hands[1] |= 1 << tile_id(3, 6)
    with pytest.raises(IllegalActionError):
        eng.step(CFG.pass_action)


def test_illegal_tile_raises():
    eng = _setup_mid_game()
    eng.hands[1] = 1 << tile_id(3, 6)
    with pytest.raises(IllegalActionError):
        eng.step(tile_id(1, 2) * 2)  # 不在手中
    with pytest.raises(IllegalActionError):
        eng.step(tile_id(3, 6) * 2 + 1)  # 在手中但接不上右端


# ---------------------------------------------------------------------------
# step 状态更新
# ---------------------------------------------------------------------------

def test_step_updates_ends_left():
    eng = _setup_mid_game()
    t36 = tile_id(3, 6)
    eng.hands[1] = (1 << t36) | (1 << tile_id(0, 0))
    eng.step(t36 * 2)
    assert (eng.left_end, eng.right_end) == (6, 5)  # 左端 3→6，右端不变
    assert not (eng.hands[1] >> t36) & 1
    assert (eng.played_mask >> t36) & 1
    assert eng.current_player == 2


def test_step_updates_ends_right():
    eng = _setup_mid_game()
    t55 = tile_id(5, 5)
    eng.hands[1] = (1 << t55) | (1 << tile_id(0, 0))
    eng.step(t55 * 2 + 1)
    assert eng.left_end == 3 and eng.right_end == 5  # 双牌不改变端点数


def test_pass_records_missing_pips():
    eng = _setup_mid_game()
    eng.hands[1] = 1 << tile_id(1, 2)
    eng.step(CFG.pass_action)
    assert eng.missing_pips[1] == (1 << 3) | (1 << 5)
    assert eng.current_player == 2
    assert eng.consecutive_passes == 1


def test_play_resets_pass_counter():
    eng = _setup_mid_game()
    eng.hands[1] = 1 << tile_id(1, 2)
    eng.hands[2] = 1 << tile_id(3, 6) | 1 << tile_id(0, 0)
    eng.step(CFG.pass_action)
    eng.step(tile_id(3, 6) * 2)
    assert eng.consecutive_passes == 0


# ---------------------------------------------------------------------------
# 终局：出完 / 堵死
# ---------------------------------------------------------------------------

def test_win_by_emptying_hand():
    eng = _setup_mid_game()
    t36 = tile_id(3, 6)
    eng.hands[1] = 1 << t36
    eng.hands[0] = 1 << tile_id(0, 0)
    eng.hands[2] = 1 << tile_id(0, 1)
    eng.hands[3] = 1 << tile_id(0, 2)
    eng.step(t36 * 2)
    assert eng.is_over and eng.winner == 1 and not eng.blocked


def test_blocked_lowest_pips_wins():
    eng = _setup_mid_game()
    # 四家都接不上 3/5
    eng.hands[0] = 1 << tile_id(6, 6)  # 12 点
    eng.hands[1] = 1 << tile_id(0, 1)  # 1 点 → 赢
    eng.hands[2] = 1 << tile_id(2, 2)  # 4 点
    eng.hands[3] = 1 << tile_id(1, 2)  # 3 点
    for _ in range(4):
        eng.step(CFG.pass_action)
    assert eng.is_over and eng.blocked and eng.winner == 1


def test_blocked_tie_nearest_from_leader():
    eng = _setup_mid_game()
    eng.leader = 2
    eng.hands[0] = 1 << tile_id(0, 1)  # 1 点，距 leader=2 为 2
    eng.hands[1] = 1 << tile_id(6, 6)
    eng.hands[2] = 1 << tile_id(2, 2)
    eng.hands[3] = 1 << tile_id(1, 0)  # 同为 1 点，距 leader=2 为 1 → 赢
    for _ in range(4):
        eng.step(CFG.pass_action)
    assert eng.winner == 3


def test_blocked_tie_draw_rule():
    eng = DominoEngine(GameConfig(blocked_tie_rule=BlockedTieRule.DRAW))
    eng.reset(seed=0)
    # 构造并列最低：P0 [0|2](2点)、P3 [1|1](2点)，两端 6/5 四家全接不上
    eng.hands = [
        1 << tile_id(0, 2),
        1 << tile_id(3, 4),
        1 << tile_id(2, 3),
        1 << tile_id(1, 1),
    ]
    eng.left_end, eng.right_end = 6, 5
    eng.played_mask = 1 << tile_id(5, 6)
    eng.current_player = 0
    eng.forced_action = -1
    for _ in range(4):
        eng.step(eng.config.pass_action)
    assert eng.is_over and eng.winner == -1
    assert eng.scores() == [0.0, 0.0, 0.0, 0.0]


# ---------------------------------------------------------------------------
# 计分
# ---------------------------------------------------------------------------

def test_scores_losers_pips():
    eng = _setup_mid_game()
    t36 = tile_id(3, 6)
    eng.hands[1] = 1 << t36
    eng.hands[0] = 1 << tile_id(6, 6)  # 12
    eng.hands[2] = 1 << tile_id(2, 2)  # 4
    eng.hands[3] = 1 << tile_id(1, 2)  # 3
    eng.step(t36 * 2)
    s = eng.scores()
    assert s == [-12.0, 19.0, -4.0, -3.0]
    assert sum(s) == 0.0, "计分应零和"


def test_scores_win_lose_fixed():
    eng = DominoEngine(GameConfig(scoring_rule=ScoringRule.WIN_LOSE_FIXED))
    eng.reset(seed=0)
    eng.hands = [1 << tile_id(3, 6), 1 << 0, 1 << 1, 1 << 3]
    eng.left_end, eng.right_end = 3, 5
    eng.played_mask = 1 << tile_id(3, 5)
    eng.current_player = 0
    eng.forced_action = -1
    eng.step(tile_id(3, 6) * 2)
    s = eng.scores()
    assert s[0] == 1.0
    assert abs(sum(s)) < 1e-9


def test_scores_before_over_raises():
    eng = make_engine(seed=0)
    with pytest.raises(RuntimeError):
        eng.scores()


# ---------------------------------------------------------------------------
# 缩小版配置
# ---------------------------------------------------------------------------

def test_mini_config_playout():
    cfg = GameConfig(max_pip=3, num_players=2, hand_size=3)
    eng = DominoEngine(cfg)
    rng = random.Random(0)
    for seed in range(200):
        eng.reset(seed=seed)
        random_playout(eng, rng)
        assert eng.is_over
        assert abs(sum(eng.scores())) < 1e-9


def test_config_validation():
    with pytest.raises(ValueError):
        GameConfig(max_pip=3, num_players=4, hand_size=7)  # 牌不够发


# ---------------------------------------------------------------------------
# 随机 fuzz：1 万局守恒检查
# ---------------------------------------------------------------------------

def test_fuzz_10k_games_conservation():
    eng = DominoEngine(CFG)
    rng = random.Random(2026)
    for seed in range(10_000):
        eng.reset(seed=seed)
        steps = 0
        while not eng.is_over:
            legal = eng.legal_actions_list()
            assert legal, "未结束时必有合法动作（至少 pass）"
            eng.step(rng.choice(legal))
            steps += 1
            assert steps <= 200, "对局步数异常（可能死循环）"
            # 守恒：手牌 + 已出 = 整副，且互不重叠
            union = eng.played_mask
            for h in eng.hands:
                assert union & h == 0
                union |= h
            assert union == (1 << 28) - 1
        # 终局检查
        if not eng.blocked:
            assert popcount(eng.hands[eng.winner]) == 0
        else:
            if eng.winner >= 0:
                wsum = pip_sum(eng.hands[eng.winner], eng.pips)
                assert all(
                    pip_sum(h, eng.pips) >= wsum for h in eng.hands
                ), "堵死时赢家点数应最小"
        assert abs(sum(eng.scores())) < 1e-9, "零和"
