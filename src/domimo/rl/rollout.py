"""自博弈采样：多进程 worker，每个 worker 内 K 个引擎锁步推进 + 批量前向。

设计要点：
- 回合制多智能体：每个引擎任意时刻只有一个"当前玩家"，因此 K 个引擎的
  当前玩家 obs 可拼成一个 batch 做一次网络前向（比逐局逐步推理快一个量级）；
- 四个座位共享同一策略（参数共享自博弈）；
- 奖励只在局终发放：reward_p = scores[p] / reward_norm，中途为 0；
- GAE 按"每个玩家自己的决策序列"计算（bootstrap 自该玩家下一个决策点的 V）。
"""

from __future__ import annotations

import random
from dataclasses import dataclass

import numpy as np
import torch

from ..config import GameConfig
from ..engine import DominoEngine
from ..env import encode_obs, legal_mask, obs_size
from .model import DominoNet


@dataclass
class RolloutBatch:
    obs: np.ndarray      # [N, obs]
    mask: np.ndarray     # [N, act]
    action: np.ndarray   # [N]
    logp: np.ndarray     # [N]
    value: np.ndarray    # [N]
    adv: np.ndarray      # [N]
    ret: np.ndarray      # [N]
    n_games: int
    mean_score_p0: float  # 诊断用：座位0平均得分（自博弈应≈0）

    @staticmethod
    def concat(batches: list["RolloutBatch"]) -> "RolloutBatch":
        return RolloutBatch(
            obs=np.concatenate([b.obs for b in batches]),
            mask=np.concatenate([b.mask for b in batches]),
            action=np.concatenate([b.action for b in batches]),
            logp=np.concatenate([b.logp for b in batches]),
            value=np.concatenate([b.value for b in batches]),
            adv=np.concatenate([b.adv for b in batches]),
            ret=np.concatenate([b.ret for b in batches]),
            n_games=sum(b.n_games for b in batches),
            mean_score_p0=float(
                np.mean([b.mean_score_p0 for b in batches])
            ),
        )


class _PlayerTraj:
    """单局中单个玩家的决策序列缓存。"""

    __slots__ = ("obs", "mask", "action", "logp", "value")

    def __init__(self):
        self.obs: list[np.ndarray] = []
        self.mask: list[np.ndarray] = []
        self.action: list[int] = []
        self.logp: list[float] = []
        self.value: list[float] = []


def _finalize_game(
    trajs: list[_PlayerTraj],
    scores: list[float],
    reward_norm: float,
    gamma: float,
    gae_lambda: float,
    out: dict[str, list],
) -> None:
    """对一局四个玩家的轨迹计算 GAE 并写入输出缓冲。"""
    for p, tr in enumerate(trajs):
        T = len(tr.action)
        if T == 0:
            continue
        reward = scores[p] / reward_norm  # 只有终局奖励
        adv = np.zeros(T, dtype=np.float32)
        last_gae = 0.0
        for t in reversed(range(T)):
            if t == T - 1:
                delta = reward - tr.value[t]  # 终局无 bootstrap
            else:
                delta = gamma * tr.value[t + 1] - tr.value[t]
            last_gae = delta + gamma * gae_lambda * last_gae
            adv[t] = last_gae
        ret = adv + np.asarray(tr.value, dtype=np.float32)
        out["obs"].extend(tr.obs)
        out["mask"].extend(tr.mask)
        out["action"].extend(tr.action)
        out["logp"].extend(tr.logp)
        out["value"].extend(tr.value)
        out["adv"].extend(adv.tolist())
        out["ret"].extend(ret.tolist())


def collect_rollout(
    state_dict: dict,
    config: GameConfig,
    n_games: int,
    seed: int,
    n_parallel_envs: int = 16,
    reward_norm: float = 30.0,
    gamma: float = 1.0,
    gae_lambda: float = 0.95,
    hidden_sizes: tuple[int, ...] = (256, 256, 128),
) -> RolloutBatch:
    """跑满 n_games 局自博弈，返回训练 batch。可在子进程中调用。"""
    torch.set_num_threads(1)

    model = DominoNet(obs_size(config), config.num_actions, hidden_sizes)
    model.load_state_dict(state_dict)
    model.eval()

    rng = random.Random(seed)
    K = min(n_parallel_envs, n_games)
    engines = [DominoEngine(config) for _ in range(K)]
    trajs: list[list[_PlayerTraj]] = [
        [_PlayerTraj() for _ in range(config.num_players)] for _ in range(K)
    ]
    for eng in engines:
        eng.reset(seed=rng.randrange(1 << 30))

    out: dict[str, list] = {
        k: [] for k in ("obs", "mask", "action", "logp", "value", "adv", "ret")
    }
    games_done = 0
    games_launched = K
    score_p0_sum = 0.0
    nobs = obs_size(config)
    na = config.num_actions

    obs_buf = np.zeros((K, nobs), dtype=np.float32)
    mask_buf = np.zeros((K, na), dtype=np.float32)

    active = list(range(K))
    while active:
        # 1) 编码所有活跃引擎当前玩家的 obs
        for row, k in enumerate(active):
            encode_obs(engines[k], out=obs_buf[row])
            legal_mask(engines[k], out=mask_buf[row])
        obs_t = torch.from_numpy(obs_buf[: len(active)])
        mask_t = torch.from_numpy(mask_buf[: len(active)])

        # 2) 批量前向 + 采样
        action_t, logp_t, value_t = model.act(obs_t, mask_t)
        actions = action_t.tolist()
        logps = logp_t.tolist()
        values = value_t.tolist()

        # 3) 推进每个引擎
        next_active = []
        for row, k in enumerate(active):
            eng = engines[k]
            p = eng.current_player
            tr = trajs[k][p]
            tr.obs.append(obs_buf[row].copy())
            tr.mask.append(mask_buf[row].copy())
            tr.action.append(actions[row])
            tr.logp.append(logps[row])
            tr.value.append(values[row])
            eng.step(actions[row])

            if eng.is_over:
                scores = eng.scores()
                score_p0_sum += scores[0]
                _finalize_game(
                    trajs[k], scores, reward_norm, gamma, gae_lambda, out
                )
                games_done += 1
                trajs[k] = [
                    _PlayerTraj() for _ in range(config.num_players)
                ]
                if games_launched < n_games:
                    eng.reset(seed=rng.randrange(1 << 30))
                    games_launched += 1
                    next_active.append(k)
            else:
                next_active.append(k)
        active = next_active

    return RolloutBatch(
        obs=np.asarray(out["obs"], dtype=np.float32),
        mask=np.asarray(out["mask"], dtype=np.float32),
        action=np.asarray(out["action"], dtype=np.int64),
        logp=np.asarray(out["logp"], dtype=np.float32),
        value=np.asarray(out["value"], dtype=np.float32),
        adv=np.asarray(out["adv"], dtype=np.float32),
        ret=np.asarray(out["ret"], dtype=np.float32),
        n_games=games_done,
        mean_score_p0=score_p0_sum / max(games_done, 1),
    )
