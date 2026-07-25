"""domino：双六多米诺（Gaple）引擎、基线机器人与 RL 训练管道。"""

from .config import DEFAULT_CONFIG, MINI_2P_CONFIG, GameConfig
from .engine import DominoEngine, IllegalActionError

__all__ = [
    "GameConfig",
    "DEFAULT_CONFIG",
    "MINI_2P_CONFIG",
    "DominoEngine",
    "IllegalActionError",
]
