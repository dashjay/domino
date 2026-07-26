"""PIMC 核心：确定化抽样 + 局面模拟 + 逐动作胜率统计。

与项目其它部分一致，牌集合用位图整数表示，动作编码为 ``tile_id*2 + side``
（见 engine.py）。本模块只使用公开信息推断对手可能的手牌，不读取任何真实隐藏手牌。

相对「纯 counting 自对弈」的增强（针对真人桌实盘校准偏乐观）：

1. ``rollout="mixed"``：我方用 counting，对手混入更凶的 denial / greedy；
2. 对抗性发牌：每次模拟在多种合规发牌里挑「下家威胁更大」的一副；
3. ``objective="ev"`` 时对低胜率着法加堵死/留小牌偏置，避免死冲走空。
"""

from __future__ import annotations

import random
from dataclasses import dataclass, field

from ..config import GameConfig
from ..engine import DominoEngine
from ..tiles import build_pips_table, pip_sum


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
class PayoutModel:
    """真实平台的赔付表，以底注为单位。

    默认值实测自 Higgs Domino 的结算包：**堵死局赌注减半**——
    堵死时赢家 +3、每个输家 -1；有人把牌走空则翻倍，赢家 +6、每个输家 -2。

    这带来一个纯胜率排序看不到的结论：设赢面为 p，"让本局堵死"的边际价值是
    ``(k-1) * (1 - 4p)``（k 为走空局相对堵死局的倍数）。也就是说 p < 25% 时
    应当主动把牌局往堵死方向带（把损失砍半），p > 25% 时才该抢着走空。
    注意零点固定在 25%，与倍数 k 无关，所以 k 估得不准也不会改变决策方向。
    """

    win_out: float = 6.0
    lose_out: float = -2.0
    win_blocked: float = 3.0
    lose_blocked: float = -1.0
    tie: float = 0.0


@dataclass
class PIMCConfig:
    """PIMC 搜索超参。"""

    n_sims: int = 400          # 确定化抽样次数（越大越稳，越慢）
    rollout: str = "mixed"     # random / greedy / counting / mixed
                               # mixed：我方 counting，对手混 denial（更贴近真人）
    seed: int = 0
    max_deal_tries: int = 40   # 单次确定化在满足约束下的最大重试
    deal_candidates: int = 3   # 每次模拟抽几副合规牌，挑对下家威胁最大的
    objective: str = "win_rate"  # 排序目标：win_rate（纯胜率）或 ev（按赔付表算期望收益）
    payout: PayoutModel | None = None  # objective="ev" 时生效，None 用默认赔付表
    # ev 排序：预测胜率低于该阈值时，给「堵死 + 留小牌」加分（纠正冲走空偏见）
    # 取 0.25 是因为 PayoutModel 推出的堵死收益零点就在 25%（见其 docstring）：
    # 高于 25% 抢走空才是对的，此时不应再有堵死奖励。
    underdog_wr: float = 0.25
    underdog_block_bonus: float = 0.55
    underdog_pip_bonus: float = 0.025


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
    blocked_plays: float = 0.0  # 模拟终局为「堵死」的次数
    wins_blocked: float = 0.0   # 其中我方获胜的次数
    end_pip_sum: float = 0.0    # 终局我方剩余点数之和（用于留小牌排序）
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

    @property
    def mean_end_pips(self) -> float:
        return self.end_pip_sum / self.plays if self.plays else 0.0

    @property
    def blocked_rate(self) -> float:
        return self.blocked_plays / self.plays if self.plays else 0.0

    @property
    def score_std(self) -> float:
        """终局得分的样本标准差（用于给 mean_score 加置信区间）。"""
        if self.plays < 2:
            return 0.0
        var = self._score_sq / self.plays - self.mean_score ** 2
        return var ** 0.5 if var > 0 else 0.0

    def outcome_counts(self) -> tuple[float, float, float, float]:
        """拆成 (走空赢, 堵死赢, 走空输, 堵死输)。平局单独由 ``ties`` 记。"""
        wins_blocked = self.wins_blocked
        wins_out = self.wins - wins_blocked
        # 平局只可能出现在堵死局（winner < 0 仅由 _finish_blocked 产生）
        losses_blocked = self.blocked_plays - wins_blocked - self.ties
        losses_out = self.plays - self.blocked_plays - wins_out
        return wins_out, wins_blocked, losses_out, losses_blocked

    def ev(self, payout: PayoutModel) -> float:
        """按赔付表折算的每局期望收益（底注为单位）。"""
        if not self.plays:
            return 0.0
        w_out, w_blk, l_out, l_blk = self.outcome_counts()
        total = (
            w_out * payout.win_out
            + w_blk * payout.win_blocked
            + l_out * payout.lose_out
            + l_blk * payout.lose_blocked
            + self.ties * payout.tie
        )
        return total / self.plays

    def ranking_ev(self, payout: PayoutModel, cfg: PIMCConfig) -> float:
        """用于排序的 EV：低胜率时奖励堵死率、惩罚终局剩余大点数。"""
        base = self.ev(payout)
        wr = self.win_rate
        thr = cfg.underdog_wr
        if wr >= thr or thr <= 0:
            return base
        underdog = (thr - wr) / thr
        # 剩余点数相对「一手均 7 点」的节约（越高越好）
        pip_save = max(0.0, 8.0 - self.mean_end_pips)
        return (
            base
            + underdog * cfg.underdog_block_bonus * self.blocked_rate
            + underdog * cfg.underdog_pip_bonus * pip_save
        )


# ---------------------------------------------------------------------------
# 模拟阶段的出牌策略
# ---------------------------------------------------------------------------

_ROLLOUT_NAMES = ("random", "greedy", "counting", "mixed")


def make_policy(name: str, seed: int = 0, me: int | None = None):
    """构造模拟阶段用的出牌策略 callable(eng) -> action。

    ``mixed``：我方（``me``）用标准 counting；其余座位按局随机混入
    denial（更重堵下家/甩双）与 greedy，避免「三家都是 counting」的乐观偏差。
    """
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
    if name == "mixed":
        from ..agents.counting_agent import CountingAgent
        from ..agents.greedy_agent import GreedyAgent

        counting = CountingAgent().act
        # 更凶：优先堵下家、早甩双，少顾自己灵活性（贴近真人卡花色）
        denial = CountingAgent(
            w_pip=2.2,
            w_double=55.0,
            w_stuck_next=115.0,
            w_stuck_others=20.0,
            w_flex=14.0,
            w_diversity=2.0,
            w_urgency=1.6,
        ).act
        greedy = GreedyAgent().act
        rng = random.Random(seed ^ 0xA5A5_5A5A)

        def policy(eng: DominoEngine) -> int:
            if me is not None and eng.current_player == me:
                return counting(eng)
            u = rng.random()
            if u < 0.48:
                return denial(eng)
            if u < 0.82:
                return counting(eng)
            return greedy(eng)

        return policy
    raise ValueError(
        f"未知 rollout 策略: {name}（可选 {'/'.join(_ROLLOUT_NAMES)}）"
    )


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


def _hand_threat(
    hand: int,
    left: int,
    right: int,
    pips: tuple[tuple[int, int], ...],
    hot_pips: int,
) -> int:
    """一副对手手牌对我们的威胁分：能接当前端 / 持有热点数字（我方双牌花色）。"""
    score = 0
    mask = hand
    while mask:
        bit = mask & -mask
        tid = bit.bit_length() - 1
        mask ^= bit
        a, b = pips[tid]
        if left >= 0 and (a == left or b == left or a == right or b == right):
            score += 3
            if a == b:
                score += 2  # 端点双牌更凶
        elif left < 0 and a == b and a >= 4:
            score += 2  # 开局：下家大金双也危险
        if ((hot_pips >> a) & 1) or ((hot_pips >> b) & 1):
            score += 1
            if a == b:
                score += 1
    return score


def _my_hot_pips(my_hand: int, pips: tuple[tuple[int, int], ...]) -> int:
    """我手牌里的双牌点数 + 高频点数，对手拿这些花色更能卡我。"""
    hot = 0
    counts = [0] * 8
    mask = my_hand
    while mask:
        bit = mask & -mask
        tid = bit.bit_length() - 1
        mask ^= bit
        a, b = pips[tid]
        if a == b:
            hot |= 1 << a
        counts[a] += 1
        counts[b] += 1
    for pip, c in enumerate(counts):
        if c >= 2:
            hot |= 1 << pip
    return hot


def sample_adversarial_deal(
    unseen: list[int],
    opp_seats: list[int],
    counts: dict[int, int],
    missing: list[int],
    pips: tuple[tuple[int, int], ...],
    rng: random.Random,
    *,
    next_seat: int,
    left_end: int,
    right_end: int,
    my_hand: int,
    max_tries: int = 40,
    candidates: int = 3,
) -> dict[int, int] | None:
    """抽多副合规牌，选对「下家」威胁最大的一副（空 missing 时尤其重要）。"""
    if candidates <= 1:
        return sample_deal(
            unseen, opp_seats, counts, missing, pips, rng, max_tries=max_tries
        )
    hot = _my_hot_pips(my_hand, pips)
    best: dict[int, int] | None = None
    best_score = -1
    for _ in range(candidates):
        deal = sample_deal(
            unseen, opp_seats, counts, missing, pips, rng, max_tries=max_tries
        )
        if deal is None:
            break
        score = _hand_threat(
            deal.get(next_seat, 0), left_end, right_end, pips, hot
        )
        # 对家（隔一位）的接应能力也计入，权重较低
        across = (next_seat + 1) % (len(missing) or 4)
        if across in deal:
            score += _hand_threat(
                deal[across], left_end, right_end, pips, hot
            ) // 2
        if score > best_score:
            best_score = score
            best = deal
    return best


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
    next_seat = (me + 1) % cfg.num_players
    deal_candidates = max(1, int(pimc.deal_candidates))

    scratch = DominoEngine(cfg)
    policy = make_policy(pimc.rollout, seed=pimc.seed, me=me)

    for _ in range(pimc.n_sims):
        deal = None
        if strict:
            deal = sample_adversarial_deal(
                unseen,
                opp_seats,
                counts,
                state.missing_pips,
                pips,
                rng,
                next_seat=next_seat,
                left_end=state.left_end,
                right_end=state.right_end,
                my_hand=state.my_hand,
                max_tries=pimc.max_deal_tries,
                candidates=deal_candidates,
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
            blocked = scratch.blocked
            st.plays += 1
            st.score_sum += scores[me]
            st._score_sq += scores[me] * scores[me]
            st.end_pip_sum += pip_sum(scratch.hands[me], scratch.pips)
            if blocked:
                st.blocked_plays += 1
            if scratch.winner == me:
                st.wins += 1
                if blocked:
                    st.wins_blocked += 1
            elif scratch.winner < 0:
                st.ties += 1

    if pimc.objective == "ev":
        payout = pimc.payout or PayoutModel()
        key = lambda s: (  # noqa: E731
            s.ranking_ev(payout, pimc),
            s.blocked_rate if s.win_rate < pimc.underdog_wr else 0.0,
            -s.mean_end_pips,
            s.win_rate,
            -s.action,
        )
    elif pimc.objective == "win_rate":
        key = lambda s: (s.win_rate, s.mean_score, -s.mean_end_pips, -s.action)  # noqa: E731
    else:
        raise ValueError(f"未知 objective: {pimc.objective}（可选 win_rate / ev）")
    return sorted(stats.values(), key=key, reverse=True)


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
