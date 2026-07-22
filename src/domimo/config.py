"""游戏规则配置。

所有平台差异都收敛为 GameConfig 的开关，默认值按 docs/PLAN.md 第 1 节的假设：
4 人、每人 7 张、双六 28 张全部发完、无摸牌堆的阻塞式 Gaple。
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from .tiles import num_tiles


class FirstMoveRule(Enum):
    """首局首家规则。"""

    HIGHEST_DOUBLE_FORCED = "highest_double_forced"  # 持最大双牌者先出且必须出该双牌（默认 6|6）
    HIGHEST_DOUBLE_FREE = "highest_double_free"      # 持最大双牌者先出，可出任意牌
    RANDOM_FREE = "random_free"                       # 随机先手，任意牌


class BlockedTieRule(Enum):
    """堵死且最低点数并列时的判定。"""

    NEAREST_FROM_LEADER = "nearest_from_leader"  # 从先手位起顺时针最近者赢
    DRAW = "draw"                                # 平局（无人得分）


class ScoringRule(Enum):
    """计分方式。"""

    LOSERS_PIPS = "losers_pips"    # 赢家得其余各家剩余点数之和，输家各扣自己剩余点数
    WIN_LOSE_FIXED = "win_lose_fixed"  # 赢家 +1，其余 -1/3（零和固定分）


@dataclass(frozen=True)
class GameConfig:
    """一局多米诺的全部规则参数。"""

    max_pip: int = 6            # 最大点数（双六=6；mini 版可设 3）
    num_players: int = 4
    hand_size: int = 7          # 每人发几张
    first_move_rule: FirstMoveRule = FirstMoveRule.HIGHEST_DOUBLE_FORCED
    blocked_tie_rule: BlockedTieRule = BlockedTieRule.NEAREST_FROM_LEADER
    scoring_rule: ScoringRule = ScoringRule.LOSERS_PIPS

    @property
    def deck_size(self) -> int:
        return num_tiles(self.max_pip)

    @property
    def num_actions(self) -> int:
        """动作空间大小：每张牌 × 2 端 + 1 个 pass。双六 = 57。"""
        return self.deck_size * 2 + 1

    @property
    def pass_action(self) -> int:
        return self.deck_size * 2

    def __post_init__(self) -> None:
        if self.max_pip < 1:
            raise ValueError("max_pip 至少为 1")
        if self.num_players < 2:
            raise ValueError("至少 2 名玩家")
        if self.hand_size * self.num_players > self.deck_size:
            raise ValueError(
                f"牌不够发：{self.num_players} 人 × {self.hand_size} 张 > 一副 {self.deck_size} 张"
            )


# 常用预设
DEFAULT_CONFIG = GameConfig()
MINI_2P_CONFIG = GameConfig(max_pip=3, num_players=2, hand_size=3)
