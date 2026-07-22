"""双三缩小版 + 表格 Q-learning 自博弈。

目的：在上神经网络之前，用最简单的表格法证明
"引擎 → 状态 → 动作 → 奖励 → 学习"整条链路没有 bug。
如果这里学不出超过随机的策略，问题一定在环境/奖励，先修再上 PPO。

状态键（当前玩家视角，只含合法信息）：
    (自己手牌位图, 左端, 右端, 对手手牌数, 已出牌位图)

算法：TD(0) Q-learning，自博弈（双方共享同一张 Q 表），
ε-greedy 探索，终局奖励 = 归一化得分（胜 +1 / 负 -1 / 平 0）。
每个玩家的 TD 目标 bootstrap 自"该玩家自己的下一个决策状态"。
"""

from __future__ import annotations

import random
from collections import defaultdict

from ..config import GameConfig, ScoringRule
from ..engine import DominoEngine
from ..agents.base import Agent

# 每人 4 张（共发 8/10 张）：实验显示 hand_size=3 时运气占比过高
# （counting 启发式上限仅 ~54.6%），4 张时技巧上限 ~62.5%，更适合验证学习效果
MINI_CONFIG = GameConfig(
    max_pip=3,
    num_players=2,
    hand_size=4,
    scoring_rule=ScoringRule.WIN_LOSE_FIXED,
)


def state_key(eng: DominoEngine, player: int) -> tuple:
    """当前玩家视角的状态键（不泄露对手手牌）。"""
    opp = 1 - player
    return (
        eng.hands[player],
        eng.left_end,
        eng.right_end,
        eng.hand_sizes()[opp],
        eng.played_mask,
    )


class TabularQTrainer:
    def __init__(
        self,
        config: GameConfig = MINI_CONFIG,
        alpha: float = 0.1,
        gamma: float = 1.0,
        eps_start: float = 0.3,
        eps_end: float = 0.02,
        seed: int = 0,
    ):
        self.config = config
        self.alpha = alpha
        self.gamma = gamma
        self.eps_start = eps_start
        self.eps_end = eps_end
        self.q: dict[tuple, dict[int, float]] = defaultdict(dict)
        self._rng = random.Random(seed)

    def _choose(self, key: tuple, legal: list[int], eps: float) -> int:
        if len(legal) == 1:
            return legal[0]
        if self._rng.random() < eps:
            return self._rng.choice(legal)
        qs = self.q[key]
        return max(legal, key=lambda a: qs.get(a, 0.0))

    def _update(self, key: tuple, action: int, target: float) -> None:
        qs = self.q[key]
        old = qs.get(action, 0.0)
        qs[action] = old + self.alpha * (target - old)

    def train(self, n_episodes: int, log_every: int = 0) -> None:
        eng = DominoEngine(self.config)
        n = self.config.num_players
        for ep in range(n_episodes):
            frac = ep / max(n_episodes - 1, 1)
            eps = self.eps_start + (self.eps_end - self.eps_start) * frac
            eng.reset(seed=self._rng.randrange(1 << 30))

            # 记录每个玩家上一个 (state, action)，在其下一个决策点做 TD 更新
            pending: list[tuple | None] = [None] * n
            while not eng.is_over:
                p = eng.current_player
                key = state_key(eng, p)
                legal = eng.legal_actions_list()
                action = self._choose(key, legal, eps)
                if pending[p] is not None:
                    prev_key, prev_action = pending[p]
                    # bootstrap：当前状态的 max-Q
                    qs = self.q[key]
                    boot = max((qs.get(a, 0.0) for a in legal), default=0.0)
                    self._update(prev_key, prev_action, self.gamma * boot)
                pending[p] = (key, action)
                eng.step(action)

            scores = eng.scores()
            for p in range(n):
                if pending[p] is not None:
                    self._update(pending[p][0], pending[p][1], scores[p])

            if log_every and (ep + 1) % log_every == 0:
                print(f"  episode {ep + 1}/{n_episodes}  |Q|={len(self.q)}")

    def agent(self) -> "QTableAgent":
        return QTableAgent(self.q)


class QTableAgent(Agent):
    """用训练好的 Q 表贪心决策（未见状态回退为随机）。"""

    name = "tabular_q"

    def __init__(self, q: dict[tuple, dict[int, float]], seed: int = 0):
        self.q = q
        self._rng = random.Random(seed)
        self.unseen_states = 0  # 统计：遇到多少未见状态

    def reset(self, seed: int | None = None) -> None:
        if seed is not None:
            self._rng.seed(seed)

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        if len(legal) == 1:
            return legal[0]
        key = state_key(eng, eng.current_player)
        qs = self.q.get(key)
        if not qs:
            self.unseen_states += 1
            return self._rng.choice(legal)
        return max(legal, key=lambda a: qs.get(a, 0.0))
