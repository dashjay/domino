"""记牌 + 堵牌启发式机器人（最强非学习基线）。

只使用合法信息：自己手牌、桌面两端、已出牌、各家手牌数、pass 推断（missing_pips）。

核心思想：所有未见牌都在对手手里（无摸牌堆），因此可以用超几何分布估计
"我走这步后，下家（及其他对手）一张都接不上的概率"，并把 pass 推断
（对手缺某数字 → 其手牌不可能含该数字的牌）用于收缩对手的候选牌集合。

对每个可行动作打分（加权和）：
1. 甩点数：出掉的牌点数越大越好（降低堵死判负的风险敞口）；
2. 甩双牌：双牌接口唯一，早甩为好；
3. 堵下家：下家接不上（被迫 pass）的概率越高越好——权重最大；
4. 堵全场：其余对手接不上的平均概率；
5. 自保灵活性：出牌后自己剩余手牌还能接上新端点的张数越多越好。
"""

from __future__ import annotations

from math import comb

from ..engine import DominoEngine
from ..tiles import is_double, iter_tiles, tile_pip_sum
from .base import Agent


class CountingAgent(Agent):
    name = "counting"

    def __init__(
        self,
        w_pip: float = 1.8,           # 甩点数
        w_double: float = 38.0,       # 甩双牌
        w_stuck_next: float = 72.0,   # 下家被堵概率
        w_stuck_others: float = 6.5,  # 其余对手被堵概率（每人）
        w_flex: float = 36.0,         # 自己剩牌对新端点的覆盖
        w_diversity: float = 3.5,     # 剩余手牌数字种类多样性
        w_urgency: float = 0.9,       # 堵牌价值随对手剩牌数减少而放大
    ):
        self.W_PIP = w_pip
        self.W_DOUBLE = w_double
        self.W_STUCK_NEXT = w_stuck_next
        self.W_STUCK_OTHERS = w_stuck_others
        self.W_FLEX = w_flex
        self.W_DIVERSITY = w_diversity
        self.W_URGENCY = w_urgency

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        if len(legal) == 1:
            return legal[0]

        p = eng.current_player
        cfg = eng.config
        n = cfg.num_players
        my_hand = eng.hands[p]
        pips = eng.pips
        max_pip = cfg.max_pip

        # 未见牌集合（全部分布在对手手里）
        visible = eng.played_mask | my_hand
        unseen = [
            tid for tid in range(cfg.deck_size) if not (visible >> tid) & 1
        ]
        hand_sizes = eng.hand_sizes()
        opponents = [(p + k) % n for k in range(1, n)]  # 按行动顺序

        def new_ends(action: int) -> tuple[int, int]:
            tid, side = divmod(action, 2)
            a, b = pips[tid]
            if eng.left_end < 0:
                return a, b
            l, r = eng.left_end, eng.right_end
            if side == 0:
                return (b if a == l else a), r
            return l, (b if a == r else a)

        def stuck_prob(q: int, l2: int, r2: int) -> float:
            """对手 q 手上一张都接不上端点 (l2, r2) 的概率（超几何估计）。

            候选集 = 未见牌中排除 q 已公开缺的数字；
            P = C(|候选|-|能接|, h) / C(|候选|, h)
            """
            miss = eng.missing_pips[q]
            cand = 0
            match = 0
            for tid in unseen:
                a, b = pips[tid]
                if (miss >> a) & 1 or (miss >> b) & 1:
                    continue  # q 不可能持有
                cand += 1
                if a == l2 or b == l2 or a == r2 or b == r2:
                    match += 1
            h = hand_sizes[q]
            if h <= 0:
                return 0.0
            if cand <= 0 or h > cand:
                return 0.0
            if match == 0:
                return 1.0
            if cand - match < h:
                return 0.0
            return comb(cand - match, h) / comb(cand, h)

        def score(action: int) -> float:
            if action == cfg.pass_action:
                return float("-inf")
            tid = action // 2
            l2, r2 = new_ends(action)
            s = self.W_PIP * tile_pip_sum(tid, pips)
            if is_double(tid, pips):
                s += self.W_DOUBLE

            # 堵牌：下家权重最大，其余对手次之；
            # 紧迫度：对手剩牌越少（越接近出完赢牌），堵他的价值越高
            def urgency(q: int) -> float:
                return 1.0 + self.W_URGENCY * (
                    (cfg.hand_size - hand_sizes[q]) / cfg.hand_size
                )

            s += self.W_STUCK_NEXT * stuck_prob(opponents[0], l2, r2) * urgency(
                opponents[0]
            )
            for q in opponents[1:]:
                s += self.W_STUCK_OTHERS * stuck_prob(q, l2, r2) * urgency(q)

            # 自保：出完后我还能接上新端点的张数（去掉本张）
            rest = my_hand & ~(1 << tid)
            flex = 0
            pip_set = 0
            for t in iter_tiles(rest):
                a, b = pips[t]
                if a == l2 or b == l2 or a == r2 or b == r2:
                    flex += 1
                pip_set |= (1 << a) | (1 << b)
            s += self.W_FLEX * min(flex, 3) / 3
            # 多样性：剩余手牌覆盖的数字种类越多，后续被堵概率越低
            s += self.W_DIVERSITY * pip_set.bit_count() / (max_pip + 1)

            return s

        return max(legal, key=score)
