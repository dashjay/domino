"""解析人机/评估用的 agent 规格字符串。

支持：
    random
    greedy
    counting
    counting,w_stuck_next=80,w_pip=2.0
    nn:models/ppo_best.pt
    nn:models/ppo_best.pt,greedy=0
"""

from __future__ import annotations

from typing import Any

from ..agents import CountingAgent, GreedyAgent, RandomAgent
from ..agents.base import Agent
from ..config import GameConfig


def _parse_value(raw: str) -> Any:
    low = raw.strip().lower()
    if low in ("true", "yes", "1"):
        return True
    if low in ("false", "no", "0"):
        return False
    try:
        if "." in raw:
            return float(raw)
        return int(raw)
    except ValueError:
        return raw


def parse_agent_spec(spec: str) -> tuple[str, dict[str, Any]]:
    """拆成 (kind_or_nn_path_form, kwargs)。

    kind 为 random/greedy/counting，或形如 ``nn:<path>``。
    """
    parts = [p.strip() for p in spec.split(",") if p.strip()]
    if not parts:
        raise ValueError("空的 agent 规格")
    head = parts[0]
    opts: dict[str, Any] = {}
    for part in parts[1:]:
        if "=" not in part:
            raise ValueError(f"无效参数片段（需 key=value）: {part}")
        key, val = part.split("=", 1)
        opts[key.strip()] = _parse_value(val)
    return head, opts


def make_agent(
    spec: str,
    seed: int = 0,
    config: GameConfig | None = None,
) -> Agent:
    """根据规格字符串构造 agent。"""
    head, opts = parse_agent_spec(spec)
    cfg = config or GameConfig()

    if head == "random":
        return RandomAgent(seed=int(opts.pop("seed", seed)))
    if head == "greedy":
        if opts:
            raise ValueError(f"greedy 不接受参数: {opts}")
        return GreedyAgent()
    if head == "counting":
        known = {
            "w_pip", "w_double", "w_stuck_next", "w_stuck_others",
            "w_flex", "w_diversity", "w_urgency",
        }
        unknown = set(opts) - known
        if unknown:
            raise ValueError(f"counting 未知参数: {sorted(unknown)}")
        return CountingAgent(**opts)
    if head.startswith("nn:"):
        from ..agents.nn_agent import NNAgent

        path = head[3:]
        if not path:
            raise ValueError("nn: 后须跟 checkpoint 路径")
        greedy = bool(opts.pop("greedy", True))
        ag_seed = int(opts.pop("seed", seed))
        if opts:
            raise ValueError(f"nn 未知参数: {sorted(opts)}")
        return NNAgent(path, config=cfg, greedy=greedy, seed=ag_seed)
    raise ValueError(
        f"未知 agent: {head}（可选 random/greedy/counting/nn:<ckpt>）"
    )


def resolve_opponent_specs(
    opponents: list[str],
    seat: int,
    num_players: int,
) -> dict[int, str]:
    """把 CLI 的 --opponents 列表展开为 {座位: 规格}（不含人类座位）。

    - 1 个规格：其余所有座位共用
    - num_players-1 个：按座位号从小到大填入非人类座位
    """
    others = [p for p in range(num_players) if p != seat]
    if len(opponents) == 1:
        return {p: opponents[0] for p in others}
    if len(opponents) == len(others):
        return {p: spec for p, spec in zip(others, opponents)}
    raise ValueError(
        f"--opponents 需要 1 个（全体相同）或 {len(others)} 个（逐座位），"
        f"收到 {len(opponents)} 个"
    )
