"""对手池（League）：保存历史 checkpoint，采样多样化对手，防自博弈策略循环。

采样规则（每次 rollout 调用一次）：
    - 70%：纯自博弈（全部座位用最新策略）
    - 30%：混合局——从池中随机抽一个历史策略（或 counting 锚点）执部分座位
"""

from __future__ import annotations

import os
import random

import torch


class OpponentLeague:
    def __init__(self, pool_dir: str, max_size: int = 20, seed: int = 0):
        self.pool_dir = pool_dir
        self.max_size = max_size
        self._rng = random.Random(seed)
        self.paths: list[str] = []
        os.makedirs(pool_dir, exist_ok=True)

    def add(self, state_dict: dict, tag: str) -> None:
        path = os.path.join(self.pool_dir, f"opp_{tag}.pt")
        torch.save({k: v.cpu() for k, v in state_dict.items()}, path)
        self.paths.append(path)
        if len(self.paths) > self.max_size:
            old = self.paths.pop(self._rng.randrange(len(self.paths) // 2))
            try:
                os.remove(old)
            except OSError:
                pass

    def sample_opponent(self) -> dict | None:
        """返回历史策略 state_dict；None 表示用 counting 锚点。"""
        if not self.paths or self._rng.random() < 0.34:
            return None  # counting 锚点
        path = self._rng.choice(self.paths)
        return torch.load(path, map_location="cpu", weights_only=True)

    def __len__(self) -> int:
        return len(self.paths)
