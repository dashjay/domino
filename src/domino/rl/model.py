"""策略-价值网络：MLP 256-256-128 + masked policy 头 + value 头。"""

from __future__ import annotations

import torch
import torch.nn as nn


class DominoNet(nn.Module):
    def __init__(
        self,
        obs_size: int = 148,
        action_size: int = 57,
        hidden_sizes: tuple[int, ...] = (256, 256, 128),
    ):
        super().__init__()
        self.obs_size = obs_size
        self.action_size = action_size

        layers: list[nn.Module] = []
        prev = obs_size
        for h in hidden_sizes:
            layers += [nn.Linear(prev, h), nn.ReLU()]
            prev = h
        self.encoder = nn.Sequential(*layers)
        self.policy = nn.Linear(prev, action_size)
        self.value = nn.Linear(prev, 1)

        # 策略头小初始化：初始接近均匀分布，利于探索
        nn.init.orthogonal_(self.policy.weight, gain=0.01)
        nn.init.zeros_(self.policy.bias)

    def forward(
        self, obs: torch.Tensor, action_mask: torch.Tensor
    ) -> tuple[torch.Tensor, torch.Tensor]:
        """返回 (masked_logits, value)。obs: [B, obs], mask: [B, act] 0/1。"""
        x = self.encoder(obs)
        logits = self.policy(x)
        logits = logits.masked_fill(action_mask == 0, -1e9)
        value = self.value(x).squeeze(-1)
        return logits, value

    @torch.no_grad()
    def act(
        self, obs: torch.Tensor, action_mask: torch.Tensor, greedy: bool = False
    ) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """采样动作。返回 (action, logp, value)，均为 [B]。"""
        logits, value = self(obs, action_mask)
        if greedy:
            action = logits.argmax(dim=-1)
            logp = torch.log_softmax(logits, dim=-1).gather(
                -1, action.unsqueeze(-1)
            ).squeeze(-1)
        else:
            dist = torch.distributions.Categorical(logits=logits)
            action = dist.sample()
            logp = dist.log_prob(action)
        return action, logp, value
