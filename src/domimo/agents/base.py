"""Agent 基类。

基线机器人直接读取引擎状态决策（拥有完整合法信息：自己手牌 + 公开信息）。
注意：引擎里 eng.hands 含其他玩家手牌，属于隐藏信息——Agent 实现只允许读取：
    - eng.hands[eng.current_player]（自己的手牌）
    - eng.left_end / eng.right_end / eng.played_mask / eng.history
    - eng.hand_sizes() / eng.missing_pips（公开可推断信息）
NN Agent 通过 env 的 obs 编码保证这一点；启发式 Agent 靠约定自律，
测试中会用"信息防火墙"用例守护（见 tests/test_agents.py）。
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from ..engine import DominoEngine


class Agent(ABC):
    name: str = "agent"

    def reset(self, seed: int | None = None) -> None:
        """新一批对局前重置内部状态（如随机数种子）。"""

    @abstractmethod
    def act(self, eng: DominoEngine) -> int:
        """轮到自己时返回一个合法动作 id。"""
