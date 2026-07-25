"""PPO 更新：clip 目标 + value loss + entropy 正则。"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import torch
import torch.nn as nn

from .model import DominoNet
from .rollout import RolloutBatch


@dataclass
class PPOConfig:
    learning_rate: float = 3e-4
    clip_range: float = 0.2
    entropy_coef: float = 0.01
    value_coef: float = 0.5
    max_grad_norm: float = 0.5
    epochs: int = 4
    batch_size: int = 512
    normalize_adv: bool = True


@dataclass
class PPOStats:
    policy_loss: float
    value_loss: float
    entropy: float
    approx_kl: float
    clip_frac: float


class PPOUpdater:
    def __init__(self, model: DominoNet, cfg: PPOConfig | None = None):
        self.model = model
        self.cfg = cfg or PPOConfig()
        self.optimizer = torch.optim.Adam(
            model.parameters(), lr=self.cfg.learning_rate
        )

    def update(self, batch: RolloutBatch) -> PPOStats:
        cfg = self.cfg
        obs = torch.from_numpy(batch.obs)
        mask = torch.from_numpy(batch.mask)
        action = torch.from_numpy(batch.action)
        old_logp = torch.from_numpy(batch.logp)
        adv = torch.from_numpy(batch.adv)
        ret = torch.from_numpy(batch.ret)

        if cfg.normalize_adv and len(adv) > 1:
            adv = (adv - adv.mean()) / (adv.std() + 1e-8)

        n = len(action)
        stats: list[tuple[float, float, float, float, float]] = []
        for _ in range(cfg.epochs):
            perm = torch.randperm(n)
            for start in range(0, n, cfg.batch_size):
                idx = perm[start : start + cfg.batch_size]
                logits, value = self.model(obs[idx], mask[idx])
                dist = torch.distributions.Categorical(logits=logits)
                logp = dist.log_prob(action[idx])
                entropy = dist.entropy().mean()

                ratio = torch.exp(logp - old_logp[idx])
                a = adv[idx]
                s1 = ratio * a
                s2 = torch.clamp(ratio, 1 - cfg.clip_range, 1 + cfg.clip_range) * a
                policy_loss = -torch.min(s1, s2).mean()
                value_loss = nn.functional.mse_loss(value, ret[idx])

                loss = (
                    policy_loss
                    + cfg.value_coef * value_loss
                    - cfg.entropy_coef * entropy
                )
                self.optimizer.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(
                    self.model.parameters(), cfg.max_grad_norm
                )
                self.optimizer.step()

                with torch.no_grad():
                    approx_kl = (old_logp[idx] - logp).mean().item()
                    clip_frac = (
                        ((ratio - 1).abs() > cfg.clip_range).float().mean().item()
                    )
                stats.append(
                    (
                        policy_loss.item(),
                        value_loss.item(),
                        entropy.item(),
                        approx_kl,
                        clip_frac,
                    )
                )

        arr = np.asarray(stats)
        return PPOStats(*arr.mean(axis=0).tolist())
