"""加载 checkpoint 的神经网络推理机器人。"""

from __future__ import annotations

import numpy as np
import torch

from ..config import GameConfig
from ..engine import DominoEngine
from ..env import encode_obs, legal_mask, obs_size
from .base import Agent


class NNAgent(Agent):
    name = "nn"

    def __init__(
        self,
        checkpoint: str | dict,
        config: GameConfig | None = None,
        greedy: bool = True,
        seed: int = 0,
    ):
        from ..rl.model import DominoNet

        self.config = config or GameConfig()
        if isinstance(checkpoint, str):
            ckpt = torch.load(checkpoint, map_location="cpu", weights_only=True)
        else:
            ckpt = checkpoint
        state = ckpt.get("model", ckpt)
        hidden = tuple(ckpt.get("hidden_sizes", (256, 256, 128)))
        self.model = DominoNet(
            obs_size(self.config), self.config.num_actions, hidden
        )
        self.model.load_state_dict(state)
        self.model.eval()
        self.greedy = greedy
        self._gen = torch.Generator().manual_seed(seed)
        self._obs_buf = np.zeros(obs_size(self.config), dtype=np.float32)
        self._mask_buf = np.zeros(self.config.num_actions, dtype=np.float32)

    def reset(self, seed: int | None = None) -> None:
        if seed is not None:
            self._gen.manual_seed(seed)

    def act(self, eng: DominoEngine) -> int:
        legal = eng.legal_actions_list()
        if len(legal) == 1:
            return legal[0]
        encode_obs(eng, out=self._obs_buf)
        legal_mask(eng, out=self._mask_buf)
        obs = torch.from_numpy(self._obs_buf).unsqueeze(0)
        mask = torch.from_numpy(self._mask_buf).unsqueeze(0)
        with torch.no_grad():
            logits, _ = self.model(obs, mask)
            if self.greedy:
                return int(logits.argmax(dim=-1).item())
            probs = torch.softmax(logits, dim=-1)
            return int(
                torch.multinomial(probs[0], 1, generator=self._gen).item()
            )
