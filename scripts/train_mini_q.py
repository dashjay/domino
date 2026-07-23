#!/usr/bin/env python3
"""训练双三 mini 版表格 Q-learning 并评估 vs RandomAgent。

用法：python3 scripts/train_mini_q.py [训练局数] [评估局数]
"""

from __future__ import annotations

import sys
import time

from domimo.agents import RandomAgent
from domimo.arena import run_match
from domimo.mini.tabular_q import MINI_CONFIG, TabularQTrainer


def main() -> None:
    n_train = int(sys.argv[1]) if len(sys.argv) > 1 else 200_000
    n_eval = int(sys.argv[2]) if len(sys.argv) > 2 else 10_000

    trainer = TabularQTrainer(seed=0)
    t0 = time.perf_counter()
    trainer.train(n_train, log_every=max(n_train // 5, 1))
    dt = time.perf_counter() - t0
    print(f"训练 {n_train} 局，耗时 {dt:.1f}s（{n_train/dt:,.0f} 局/秒），Q 表 {len(trainer.q):,} 状态")

    agent = trainer.agent()
    r = run_match(
        [agent, RandomAgent(seed=1)],
        n_games=n_eval,
        seed=777,
        config=MINI_CONFIG,
        n_workers=1,  # Q 表大，避免多进程重复 pickle
    )
    print(r.report())
    print(f"未见状态回退随机次数: {agent.unseen_states}")
    wr = r.win_rates[0]
    print(f"验收(>=65%): {'PASS' if wr >= 0.65 else 'FAIL'}  (胜率 {wr:.2%})")


if __name__ == "__main__":
    main()
