"""竞技场评估入口。

用法：
    python3 -m domimo.cli.evaluate --agents counting random random random -n 20000
    python3 -m domimo.cli.evaluate --agents counting greedy random random -n 20000 --workers 4
    python3 -m domimo.cli.evaluate --agents nn:models/ppo_best.pt,greedy=1 counting counting counting -n 2000

agent 名可选：random / greedy / counting / nn:<checkpoint路径>（可附 ,key=value 参数）
"""

from __future__ import annotations

import argparse
import time

from ..arena import run_match
from ..config import GameConfig
from .agent_spec import make_agent


def main() -> None:
    ap = argparse.ArgumentParser(description="Domino 竞技场评估")
    ap.add_argument("--agents", nargs=4, required=True, help="4 个 agent 规格")
    ap.add_argument("-n", "--n-games", type=int, default=2000)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--workers", type=int, default=None)
    args = ap.parse_args()

    try:
        agents = [
            make_agent(s, seed=args.seed + i, config=GameConfig())
            for i, s in enumerate(args.agents)
        ]
    except (ValueError, FileNotFoundError, OSError) as e:
        raise SystemExit(f"创建 agent 失败: {e}") from e

    workers = args.workers
    if any(s.startswith("nn:") for s in args.agents) and (workers or 4) > 1:
        # torch 模型经 fork 到子进程可能死锁（OpenMP after-fork），NN 评估强制单进程
        workers = 1
        print("[提示] 含 NN agent，已强制单进程评估（避免 fork+torch 死锁）")
    t0 = time.perf_counter()
    result = run_match(
        agents,
        n_games=args.n_games,
        seed=args.seed,
        config=GameConfig(),
        n_workers=workers,
    )
    dt = time.perf_counter() - t0
    print(result.report())
    print(f"耗时 {dt:.1f}s（{args.n_games / dt:,.0f} 局/秒）")


if __name__ == "__main__":
    main()
