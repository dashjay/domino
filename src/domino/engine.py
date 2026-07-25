"""阻塞式多米诺（Gaple）规则引擎。

性能约定：状态全部使用 int / 小 list，牌集合用位图，不创建牌对象。

动作编码（config.num_actions 个）：
    action = tile_id * 2 + side   （side: 0=接左端, 1=接右端）
    action = config.pass_action    表示 pass

规范化：
- 开局第一手（桌面为空）统一用 side=0；
- 当左右端点数相同（含开局后任意时刻 left_end == right_end）时，同一张牌
  接左接右完全等价，合法动作只保留 side=0，消除冗余动作。
"""

from __future__ import annotations

import random

from .config import BlockedTieRule, FirstMoveRule, GameConfig, ScoringRule
from .tiles import (
    build_pips_table,
    is_double,
    iter_tiles,
    pip_sum,
    popcount,
)


class IllegalActionError(Exception):
    pass


class DominoEngine:
    """单局引擎。用法：

        eng = DominoEngine(config)
        eng.reset(seed=42)
        while not eng.is_over:
            mask = eng.legal_actions()
            eng.step(choose(mask))
        eng.scores()
    """

    def __init__(self, config: GameConfig | None = None):
        self.config = config or GameConfig()
        self.pips = build_pips_table(self.config.max_pip)
        self._rng = random.Random()
        # 状态字段在 reset() 中初始化
        self.hands: list[int] = []
        self.played_mask: int = 0
        self.left_end: int = -1
        self.right_end: int = -1
        self.current_player: int = 0
        self.leader: int = 0
        self.consecutive_passes: int = 0
        self.forced_action: int = -1  # 首手强制动作（-1 表示无强制）
        self.history: list[tuple[int, int]] = []  # (player, action)
        self.missing_pips: list[int] = []  # 每人被公开推断"缺"的点数位图（pass 时记录）
        self.is_over: bool = False
        self.winner: int = -1  # -1 表示未结束或平局
        self.blocked: bool = False

    # ------------------------------------------------------------------
    # 发牌与开局
    # ------------------------------------------------------------------
    def reset(self, seed: int | None = None) -> None:
        cfg = self.config
        if seed is not None:
            self._rng.seed(seed)
        deck = list(range(cfg.deck_size))
        self._rng.shuffle(deck)

        self.hands = [0] * cfg.num_players
        for p in range(cfg.num_players):
            for i in range(cfg.hand_size):
                self.hands[p] |= 1 << deck[p * cfg.hand_size + i]

        self.played_mask = 0
        self.left_end = -1
        self.right_end = -1
        self.consecutive_passes = 0
        self.history = []
        self.missing_pips = [0] * cfg.num_players
        self.is_over = False
        self.winner = -1
        self.blocked = False

        self.current_player, self.forced_action = self._decide_first_move()
        self.leader = self.current_player

    def _decide_first_move(self) -> tuple[int, int]:
        cfg = self.config
        rule = cfg.first_move_rule
        if rule == FirstMoveRule.RANDOM_FREE:
            return self._rng.randrange(cfg.num_players), -1

        # 找持有最大双牌的玩家（双牌 id 越大点数越大）
        best_tid, best_player = -1, -1
        for p in range(cfg.num_players):
            for tid in iter_tiles(self.hands[p]):
                if is_double(tid, self.pips) and tid > best_tid:
                    best_tid, best_player = tid, p
        if best_player < 0:
            # 未发出任何双牌（仅在牌未发完的缩小版可能出现）：
            # 回退为持最大牌者先出、任意牌
            for p in range(cfg.num_players):
                for tid in iter_tiles(self.hands[p]):
                    if tid > best_tid:
                        best_tid, best_player = tid, p
            return best_player, -1
        if rule == FirstMoveRule.HIGHEST_DOUBLE_FORCED:
            return best_player, best_tid * 2  # 必须出该双牌（side=0）
        return best_player, -1  # HIGHEST_DOUBLE_FREE

    # ------------------------------------------------------------------
    # 合法动作
    # ------------------------------------------------------------------
    def legal_actions(self) -> int:
        """返回动作位图（int，第 a 位为 1 表示动作 a 合法）。"""
        if self.is_over:
            return 0
        if self.forced_action >= 0:
            return 1 << self.forced_action

        hand = self.hands[self.current_player]
        mask = 0
        if self.left_end < 0:  # 桌面为空（自由首手）：任意手牌，side=0
            for tid in iter_tiles(hand):
                mask |= 1 << (tid * 2)
            return mask

        l, r = self.left_end, self.right_end
        same_ends = l == r
        for tid in iter_tiles(hand):
            a, b = self.pips[tid]
            fits_left = a == l or b == l
            fits_right = a == r or b == r
            if fits_left:
                mask |= 1 << (tid * 2)
            if fits_right and not (fits_left and same_ends):
                # 两端点数相同时接右与接左等价，规范化为只保留左
                mask |= 1 << (tid * 2 + 1)
        if mask == 0:
            mask = 1 << self.config.pass_action
        return mask

    def legal_actions_list(self) -> list[int]:
        return list(iter_tiles(self.legal_actions()))

    # ------------------------------------------------------------------
    # 状态推进
    # ------------------------------------------------------------------
    def step(self, action: int) -> None:
        if self.is_over:
            raise IllegalActionError("对局已结束")
        if not (self.legal_actions() >> action) & 1:
            raise IllegalActionError(
                f"非法动作 {action}（玩家 {self.current_player}）"
            )

        cfg = self.config
        p = self.current_player

        if action == cfg.pass_action:
            # pass：公开信息——该玩家两端点数都接不上
            self.missing_pips[p] |= (1 << self.left_end) | (1 << self.right_end)
            self.consecutive_passes += 1
            self.history.append((p, action))
            if self.consecutive_passes >= cfg.num_players:
                self._finish_blocked()
                return
            self.current_player = (p + 1) % cfg.num_players
            return

        tid, side = divmod(action, 2)
        a, b = self.pips[tid]
        self.hands[p] &= ~(1 << tid)
        self.played_mask |= 1 << tid
        self.consecutive_passes = 0
        self.forced_action = -1
        self.history.append((p, action))

        if self.left_end < 0:  # 首手
            self.left_end, self.right_end = a, b
        elif side == 0:  # 接左端
            self.left_end = b if a == self.left_end else a
        else:  # 接右端
            self.right_end = b if a == self.right_end else a

        if self.hands[p] == 0:
            self.is_over = True
            self.winner = p
            return
        self.current_player = (p + 1) % cfg.num_players

    def _finish_blocked(self) -> None:
        cfg = self.config
        self.is_over = True
        self.blocked = True
        sums = [pip_sum(h, self.pips) for h in self.hands]
        best = min(sums)
        candidates = [p for p in range(cfg.num_players) if sums[p] == best]
        if len(candidates) == 1:
            self.winner = candidates[0]
        elif cfg.blocked_tie_rule == BlockedTieRule.NEAREST_FROM_LEADER:
            # 从先手位起顺时针最近
            self.winner = min(
                candidates, key=lambda p: (p - self.leader) % cfg.num_players
            )
        else:  # DRAW
            self.winner = -1

    # ------------------------------------------------------------------
    # 计分
    # ------------------------------------------------------------------
    def scores(self) -> list[float]:
        """终局各玩家得分（零和）。未结束时抛错；平局返回全 0。"""
        if not self.is_over:
            raise RuntimeError("对局尚未结束")
        cfg = self.config
        n = cfg.num_players
        if self.winner < 0:  # 平局
            return [0.0] * n
        if cfg.scoring_rule == ScoringRule.WIN_LOSE_FIXED:
            return [
                1.0 if p == self.winner else -1.0 / (n - 1) for p in range(n)
            ]
        # LOSERS_PIPS：赢家收其余各家剩余点数之和
        sums = [pip_sum(h, self.pips) for h in self.hands]
        out = [-float(s) for s in sums]
        out[self.winner] = float(sum(s for p, s in enumerate(sums) if p != self.winner))
        return out

    # ------------------------------------------------------------------
    # 辅助
    # ------------------------------------------------------------------
    def hand_sizes(self) -> list[int]:
        return [popcount(h) for h in self.hands]

    def render(self) -> str:
        from .tiles import format_mask

        lines = [
            f"两端: {self.left_end} .. {self.right_end}"
            if self.left_end >= 0
            else "桌面: 空",
        ]
        for p in range(self.config.num_players):
            cur = "->" if (p == self.current_player and not self.is_over) else "  "
            lines.append(f"{cur} P{p}: {format_mask(self.hands[p], self.pips)}")
        if self.is_over:
            tag = "堵死" if self.blocked else "出完"
            lines.append(f"终局({tag}) 赢家: {self.winner} 得分: {self.scores()}")
        return "\n".join(lines)
