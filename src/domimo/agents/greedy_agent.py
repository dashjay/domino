"""贪心机器人：优先出点数最大的可行牌，双牌加成。

直觉：剩余点数越小，堵死判负的风险敞口越小；双牌接口少、越拖越难甩。
"""

from __future__ import annotations

from ..engine import DominoEngine
from ..tiles import is_double, tile_pip_sum
from .base import Agent


class GreedyAgent(Agent):
    name = "greedy"

    DOUBLE_BONUS = 0.5  # 同点数时优先甩双牌

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        if len(legal) == 1:
            return legal[0]

        def key(action: int) -> float:
            if action == eng.config.pass_action:
                return float("-inf")
            tid = action // 2
            return tile_pip_sum(tid, eng.pips) + (
                self.DOUBLE_BONUS if is_double(tid, eng.pips) else 0.0
            )

        return max(legal, key=key)
