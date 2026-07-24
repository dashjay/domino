"""PIMC 核心：确定化抽样 + 局面模拟 + 逐动作胜率统计。

与项目其它部分一致，牌集合用位图整数表示，动作编码为 ``tile_id*2 + side``
（见 engine.py）。本模块只使用公开信息推断对手可能的手牌，不读取任何真实隐藏手牌。
"""

from __future__ import annotations

import random
from dataclasses import dataclass, field

from ..config import GameConfig
from ..engine import DominoEngine
from ..tiles import build_pips_table


# ---------------------------------------------------------------------------
# 输入 / 输出数据结构
# ---------------------------------------------------------------------------

@dataclass
class PublicState:
    """一次出牌决策所需的全部公开信息（当前玩家 = ``me``）。

    - ``my_hand`` / ``played`` 为位图整数；
    - ``hand_sizes`` / ``missing_pips`` 按绝对座位索引（长度 = num_players）；
    - 桌面为空（开局）时 ``left_end == right_end == -1``。
    """

    my_hand: int
    played: int
    left_end: int
    right_end: int
    hand_sizes: list[int]
    missing_pips: list[int]
    me: int = 0
    leader: int = 0
    consecutive_passes: int = 0

    def unseen_tiles(self, deck_size: int) -> list[int]:
        visible = self.my_hand | self.played
        return [t for t in range(deck_size) if not (visible >> t) & 1]


@dataclass
class PIMCConfig:
    """PIMC 搜索超参。"""

    n_sims: int = 400          # 确定化抽样次数（越大越稳，越慢）
    rollout: str = "counting"  # 模拟阶段各家出牌策略：random / greedy / counting
                               # counting 最强（准确建模对手），greedy 最快
    seed: int = 0
    max_deal_tries: int = 40   # 单次确定化在满足约束下的最大重试


@dataclass
class ActionStat:
    """单个候选出牌的模拟统计。"""

    action: int
    tile: tuple[int, int]
    side: int
    is_pass: bool
    plays: int = 0
    wins: float = 0.0
    ties: float = 0.0
    score_sum: float = 0.0
    _score_sq: float = field(default=0.0, repr=False)

    @property
    def win_rate(self) -> float:
        return self.wins / self.plays if self.plays else 0.0

    @property
    def tie_rate(self) -> float:
        return self.ties / self.plays if self.plays else 0.0

    @property
    def mean_score(self) -> float:
        return self.score_sum / self.plays if self.plays else 0.0


# ---------------------------------------------------------------------------
# 模拟阶段的出牌策略
# ---------------------------------------------------------------------------

def make_policy(name: str, seed: int = 0):
    """构造模拟阶段用的出牌策略 callable(eng) -> action。"""
    name = (name or "greedy").lower()
    if name == "random":
        from ..agents.random_agent import RandomAgent

        return RandomAgent(seed=seed).act
    if name == "greedy":
        from ..agents.greedy_agent import GreedyAgent

        return GreedyAgent().act
    if name == "counting":
        from ..agents.counting_agent import CountingAgent

        return CountingAgent().act
    raise ValueError(f"未知 rollout 策略: {name}（可选 random/greedy/counting）")


# ---------------------------------------------------------------------------
# 确定化抽样：把未见牌发给对手（满足手牌数 + 缺数字约束）
# ---------------------------------------------------------------------------

def sample_deal(
    unseen: list[int],
    opp_seats: list[int],
    counts: dict[int, int],
    missing: list[int],
    pips: tuple[tuple[int, int], ...],
    rng: random.Random,
    max_tries: int = 40,
) -> dict[int, int] | None:
    """把 ``unseen`` 中的牌随机分给对手，返回 {座位: 手牌位图}。

    约束：每位对手恰好拿 ``counts[seat]`` 张；且不给座位 q 分配任何一张
    含 q 已公开缺的数字的牌。无法满足约束时重试；仍失败返回 ``None``。
    """
    total = sum(counts.get(s, 0) for s in opp_seats)
    if total != len(unseen):
        return None

    for _ in range(max_tries):
        tiles = unseen[:]
        rng.shuffle(tiles)
        # 先分配「候选座位最少」的牌，降低走进死胡同的概率
        tiles.sort(
            key=lambda t: sum(
                1
                for s in opp_seats
                if not ((missing[s] >> pips[t][0]) & 1 or (missing[s] >> pips[t][1]) & 1)
            )
        )
        remaining = {s: counts.get(s, 0) for s in opp_seats}
        hands = {s: 0 for s in opp_seats}
        ok = True
        for t in tiles:
            a, b = pips[t]
            eligible = [
                s
                for s in opp_seats
                if remaining[s] > 0
                and not ((missing[s] >> a) & 1 or (missing[s] >> b) & 1)
            ]
            if not eligible:
                ok = False
                break
            s = rng.choice(eligible)
            hands[s] |= 1 << t
            remaining[s] -= 1
        if ok and all(v == 0 for v in remaining.values()):
            return hands
    return None


def _relaxed_deal(
    unseen: list[int],
    opp_seats: list[int],
    counts: dict[int, int],
    rng: random.Random,
) -> dict[int, int]:
    """忽略缺数字约束的兜底分配（仅按手牌数），保证总能给出一副。"""
    tiles = unseen[:]
    rng.shuffle(tiles)
    hands = {s: 0 for s in opp_seats}
    idx = 0
    for s in opp_seats:
        for _ in range(counts.get(s, 0)):
            hands[s] |= 1 << tiles[idx]
            idx += 1
    return hands


# ---------------------------------------------------------------------------
# 局面复原与模拟
# ---------------------------------------------------------------------------

def _load_state(
    eng: DominoEngine,
    hands: list[int],
    state: PublicState,
) -> None:
    """把 hands + 公开局面写入（复用）引擎，重置为「me 待出牌」的中局。"""
    eng.hands = hands
    eng.played_mask = state.played
    eng.left_end = state.left_end
    eng.right_end = state.right_end
    eng.current_player = state.me
    eng.leader = state.leader
    eng.consecutive_passes = state.consecutive_passes
    eng.forced_action = -1
    eng.missing_pips = list(state.missing_pips)
    eng.history = []
    eng.is_over = False
    eng.winner = -1
    eng.blocked = False


def legal_actions_for(state: PublicState, cfg: GameConfig) -> list[int]:
    """当前公开局面下 me 的全部合法出牌（不含首手强制）。"""
    eng = DominoEngine(cfg)
    _load_state(eng, [0] * cfg.num_players, state)
    eng.hands[state.me] = state.my_hand
    return eng.legal_actions_list()


def rank_actions(
    state: PublicState,
    cfg: GameConfig | None = None,
    pimc: PIMCConfig | None = None,
    rng: random.Random | None = None,
) -> list[ActionStat]:
    """对每个可行出牌做 PIMC 模拟，返回按胜率降序排列的统计。

    平手（堵死并列判负规则下 winner<0）不计入胜局；排序主键为胜率，
    次键为均分，第三键为动作编号（保证确定性）。
    """
    cfg = cfg or GameConfig()
    pimc = pimc or PIMCConfig()
    rng = rng or random.Random(pimc.seed)

    pips = build_state_pips(cfg)
    me = state.me
    opp_seats = [s for s in range(cfg.num_players) if s != me]
    counts = {s: state.hand_sizes[s] for s in opp_seats}
    unseen = state.unseen_tiles(cfg.deck_size)

    legal = legal_actions_for(state, cfg)
    stats: dict[int, ActionStat] = {}
    for a in legal:
        if a == cfg.pass_action:
            stats[a] = ActionStat(a, (-1, -1), -1, True)
        else:
            tid, side = divmod(a, 2)
            stats[a] = ActionStat(a, pips[tid], side, False)

    # 未见牌数应等于对手手牌数之和；否则无法做合规确定化，退回按张数兜底
    strict = sum(counts.values()) == len(unseen)

    scratch = DominoEngine(cfg)
    policy = make_policy(pimc.rollout, seed=pimc.seed)

    for _ in range(pimc.n_sims):
        deal = None
        if strict:
            deal = sample_deal(
                unseen, opp_seats, counts, state.missing_pips, pips, rng,
                max_tries=pimc.max_deal_tries,
            )
        if deal is None:
            deal = _relaxed_deal(unseen, opp_seats, _fit_counts(counts, len(unseen)), rng)

        for a, st in stats.items():
            hands = [0] * cfg.num_players
            hands[me] = state.my_hand
            for s in opp_seats:
                hands[s] = deal[s]
            _load_state(scratch, hands, state)
            scratch.step(a)
            while not scratch.is_over:
                scratch.step(policy(scratch))
            scores = scratch.scores()
            st.plays += 1
            st.score_sum += scores[me]
            st._score_sq += scores[me] * scores[me]
            if scratch.winner == me:
                st.wins += 1
            elif scratch.winner < 0:
                st.ties += 1

    return sorted(
        stats.values(),
        key=lambda s: (s.win_rate, s.mean_score, -s.action),
        reverse=True,
    )


def _fit_counts(counts: dict[int, int], total: int) -> dict[int, int]:
    """把对手手牌数按比例/取整调整到总和等于 ``total``（兜底用）。"""
    seats = list(counts.keys())
    cur = sum(counts.values())
    out = dict(counts)
    if cur == total or not seats:
        return out
    diff = total - cur
    i = 0
    step = 1 if diff > 0 else -1
    while diff != 0:
        s = seats[i % len(seats)]
        if out[s] + step >= 0:
            out[s] += step
            diff -= step
        i += 1
    return out


def build_state_pips(cfg: GameConfig) -> tuple[tuple[int, int], ...]:
    return build_pips_table(cfg.max_pip)
