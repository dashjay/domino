"""观测编码层：把引擎状态编码为定长 float32 向量 + 合法动作 mask。

观测只含当前玩家的合法信息（自己手牌 + 公开信息），从相对座位视角编码，
保证共享参数策略与座位无关。

双六默认配置下 obs 维度 = 148：
    [0..deck)                自己手牌 one-hot                     28
    [deck..2*deck)           已打出的牌 one-hot                    28
    左端 one-hot(max_pip+1) + "无桌面"位                            8
    右端同上                                                       8
    各家手牌数 / hand_size（相对座位序：自己, 下家, ...）              4
    对手 pass 推断缺数字位（相对座位序，每人 max_pip+1）              21
    每个数字已打出的牌数 / (max_pip+1)                               7
    手数 len(history) / (2*deck)（截断到 1）                        1
    自己的绝对座位 one-hot（先手位信息）                              4
    预留（置 0，后续加历史特征）                                     39
"""

from __future__ import annotations

import numpy as np

from .config import GameConfig
from .engine import DominoEngine

RESERVED_DIMS = 39


def obs_size(cfg: GameConfig) -> int:
    deck, mp, n = cfg.deck_size, cfg.max_pip, cfg.num_players
    return (
        deck * 2
        + 2 * (mp + 2)
        + n
        + (n - 1) * (mp + 1)
        + (mp + 1)
        + 1
        + n
        + RESERVED_DIMS
    )


def encode_obs(eng: DominoEngine, out: np.ndarray | None = None) -> np.ndarray:
    """编码当前玩家视角的观测。out 可复用缓冲区（将被清零后写入）。"""
    cfg = eng.config
    deck, mp, n = cfg.deck_size, cfg.max_pip, cfg.num_players
    p = eng.current_player

    if out is None:
        out = np.zeros(obs_size(cfg), dtype=np.float32)
    else:
        out.fill(0.0)

    i = 0
    # 自己手牌
    hand = eng.hands[p]
    for t in range(deck):
        if (hand >> t) & 1:
            out[i + t] = 1.0
    i += deck
    # 已打出
    played = eng.played_mask
    for t in range(deck):
        if (played >> t) & 1:
            out[i + t] = 1.0
    i += deck
    # 左右端
    if eng.left_end < 0:
        out[i + mp + 1] = 1.0
        out[i + (mp + 2) + mp + 1] = 1.0
    else:
        out[i + eng.left_end] = 1.0
        out[i + (mp + 2) + eng.right_end] = 1.0
    i += 2 * (mp + 2)
    # 手牌数（相对座位）
    sizes = eng.hand_sizes()
    for k in range(n):
        out[i + k] = sizes[(p + k) % n] / cfg.hand_size
    i += n
    # 对手缺数字推断（相对座位：下家, 下下家, ...）
    for k in range(1, n):
        miss = eng.missing_pips[(p + k) % n]
        for d in range(mp + 1):
            if (miss >> d) & 1:
                out[i + d] = 1.0
        i += mp + 1
    # 每个数字已打出的牌数
    for t in range(deck):
        if (played >> t) & 1:
            a, b = eng.pips[t]
            out[i + a] += 1.0
            if b != a:
                out[i + b] += 1.0
    for d in range(mp + 1):
        out[i + d] /= mp + 1
    i += mp + 1
    # 手数
    out[i] = min(len(eng.history) / (2 * deck), 1.0)
    i += 1
    # 绝对座位
    out[i + p] = 1.0
    i += n
    # 预留 RESERVED_DIMS 维保持 0
    return out


def legal_mask(eng: DominoEngine, out: np.ndarray | None = None) -> np.ndarray:
    """合法动作 0/1 掩码（float32，长度 num_actions）。"""
    na = eng.config.num_actions
    if out is None:
        out = np.zeros(na, dtype=np.float32)
    else:
        out.fill(0.0)
    bits = eng.legal_actions()
    for a in range(na):
        if (bits >> a) & 1:
            out[a] = 1.0
    return out


class DominoEnv:
    """薄封装：回合制多智能体接口（当前玩家视角）。

    用法：
        env = DominoEnv(cfg)
        obs, mask, player = env.reset(seed)
        while True:
            obs, mask, player, done, scores = env.step(action)
            if done: break
    """

    def __init__(self, config: GameConfig | None = None):
        self.config = config or GameConfig()
        self.eng = DominoEngine(self.config)

    def reset(self, seed: int | None = None):
        self.eng.reset(seed=seed)
        return encode_obs(self.eng), legal_mask(self.eng), self.eng.current_player

    def step(self, action: int):
        self.eng.step(action)
        done = self.eng.is_over
        if done:
            return None, None, -1, True, self.eng.scores()
        return (
            encode_obs(self.eng),
            legal_mask(self.eng),
            self.eng.current_player,
            False,
            None,
        )
