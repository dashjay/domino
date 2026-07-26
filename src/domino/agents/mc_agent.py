"""蒙特卡洛（PIMC）机器人：确定化抽样 + 局面模拟，选胜率最高的出牌。

直觉：多米诺是不完全信息博弈，深度学习难以稳定学到高胜率策略。PIMC 直接对
「未见牌如何分布在对手手里」做多次随机假设，逐局模拟到底并统计每步的真实胜率，
是与胜率目标对齐、可解释、免训练的强基线。

只使用公开信息（自己手牌、桌面两端、已出牌、各家手牌数、pass 推断的缺数字），
满足与 CountingAgent 相同的信息防火墙约定。
"""

from __future__ import annotations

import random

from ..engine import DominoEngine
from ..mc.pimc import PIMCConfig, PublicState, rank_actions
from .base import Agent


class MCAgent(Agent):
    name = "mc"

    def __init__(
        self,
        n_sims: int = 200,
        rollout: str = "mixed",
        seed: int = 0,
    ):
        self.pimc = PIMCConfig(n_sims=n_sims, rollout=rollout, seed=seed)
        self._rng = random.Random(seed)

    def reset(self, seed: int | None = None) -> None:
        if seed is not None:
            self._rng.seed(seed)
            self.pimc.seed = seed

    def public_state(self, eng: DominoEngine) -> PublicState:
        me = eng.current_player
        return PublicState(
            my_hand=eng.hands[me],
            played=eng.played_mask,
            left_end=eng.left_end,
            right_end=eng.right_end,
            hand_sizes=eng.hand_sizes(),
            missing_pips=list(eng.missing_pips),
            me=me,
            leader=eng.leader,
            consecutive_passes=eng.consecutive_passes,
        )

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        if len(legal) == 1:
            return legal[0]
        ranking = rank_actions(
            self.public_state(eng), eng.config, self.pimc, self._rng
        )
        return ranking[0].action
