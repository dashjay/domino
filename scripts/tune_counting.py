#!/usr/bin/env python3
"""CountingAgent 权重调参：随机搜索 + 竞技场评估（vs 3 random）。

用法：python3 scripts/tune_counting.py [轮数] [每轮局数]
"""

from __future__ import annotations

import random
import sys

from domimo.agents import CountingAgent, RandomAgent
from domimo.arena import run_match


def evaluate(weights: dict, n_games: int, seed: int = 0) -> float:
    agents = [
        CountingAgent(**weights),
        RandomAgent(seed=1),
        RandomAgent(seed=2),
        RandomAgent(seed=3),
    ]
    r = run_match(agents, n_games=n_games, seed=seed, n_workers=4)
    return r.win_rates[0]


def main() -> None:
    n_rounds = int(sys.argv[1]) if len(sys.argv) > 1 else 40
    n_games = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    rng = random.Random(0)

    base = dict(
        w_pip=1.8, w_double=38.0, w_stuck_next=72.0, w_stuck_others=6.5,
        w_flex=36.0, w_diversity=3.5, w_urgency=0.9,
    )
    best_wr = evaluate(base, n_games)
    best = dict(base)
    print(f"基准 {base} -> {best_wr:.2%}")

    for i in range(n_rounds):
        # 围绕当前最优做局部扰动 + 少量全局探索
        if rng.random() < 0.7:
            cand = {
                k: v * rng.choice([0.5, 0.75, 1.0, 1.25, 1.5]) + rng.choice([0.0, 0.5, 1.0])
                for k, v in best.items()
            }
        else:
            cand = {
                "w_pip": rng.choice([0.3, 0.5, 1.0, 1.7, 2.5]),
                "w_double": rng.choice([0.0, 4.0, 8.0, 16.0, 24.0]),
                "w_stuck_next": rng.choice([10.0, 25.0, 48.0, 70.0, 100.0]),
                "w_stuck_others": rng.choice([0.0, 4.0, 7.0, 15.0, 25.0]),
                "w_flex": rng.choice([0.0, 8.0, 16.0, 24.0, 36.0]),
                "w_diversity": rng.choice([0.0, 1.0, 3.0, 6.0, 12.0]),
                "w_urgency": rng.choice([0.0, 0.5, 1.0, 2.0, 4.0]),
            }
        wr = evaluate(cand, n_games, seed=0)
        mark = ""
        if wr > best_wr:
            best_wr, best = wr, cand
            mark = "  <-- 新最优"
        print(f"[{i+1:02d}/{n_rounds}] {cand} -> {wr:.2%}{mark}")

    print(f"\n最优: {best} -> {best_wr:.2%}")
    # 用不同种子复验，避免过拟合评估种子
    confirm = evaluate(best, n_games * 2, seed=99999)
    print(f"复验(独立种子, {n_games*2}局): {confirm:.2%}")


if __name__ == "__main__":
    main()
