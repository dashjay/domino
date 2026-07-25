#!/usr/bin/env python3
"""引擎速度基准：单核随机对局吞吐。

目标：>= 1 万局/秒（docs/PLAN.md 阶段 1 验收标准）。
用法：python3 scripts/bench_engine.py [局数]
"""

import random
import sys
import time

from domino.config import GameConfig
from domino.engine import DominoEngine
from domino.tiles import iter_tiles


def main() -> None:
    n_games = int(sys.argv[1]) if len(sys.argv) > 1 else 20_000
    eng = DominoEngine(GameConfig())
    rng = random.Random(0)

    total_steps = 0
    t0 = time.perf_counter()
    for seed in range(n_games):
        eng.reset(seed=seed)
        while not eng.is_over:
            legal = eng.legal_actions()
            # 快速随机选：收集合法动作后取一个
            actions = list(iter_tiles(legal))
            eng.step(actions[rng.randrange(len(actions))] if len(actions) > 1 else actions[0])
            total_steps += 1
    dt = time.perf_counter() - t0

    print(f"局数           : {n_games}")
    print(f"总步数         : {total_steps}")
    print(f"耗时           : {dt:.3f} s")
    print(f"吞吐           : {n_games / dt:,.0f} 局/秒")
    print(f"步吞吐         : {total_steps / dt:,.0f} 步/秒")
    target = 10_000
    print(f"验收(>=1万局/秒): {'PASS' if n_games / dt >= target else 'FAIL'}")


if __name__ == "__main__":
    main()
