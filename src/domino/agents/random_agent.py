"""随机机器人：合法动作中均匀随机。"""

from __future__ import annotations

import random

from ..engine import DominoEngine
from .base import Agent


class RandomAgent(Agent):
    name = "random"

    def __init__(self, seed: int | None = None):
        self._rng = random.Random(seed)

    def reset(self, seed: int | None = None) -> None:
        if seed is not None:
            self._rng.seed(seed)

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        return legal[0] if len(legal) == 1 else self._rng.choice(legal)
