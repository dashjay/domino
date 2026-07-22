"""PPO 自博弈训练主循环。

用法：
    python3 -m domimo.rl.train --total-games 200000 --out runs/ppo_v1
    python3 -m domimo.rl.train --smoke   # 快速冒烟

架构：
    主进程：PPO 更新 + 定期评估 + checkpoint
    子进程池（persistent）：collect_rollout 自博弈采样（每进程 1 个 torch 线程）
"""

from __future__ import annotations

import argparse
import json
import os
import time
from concurrent.futures import ProcessPoolExecutor
from dataclasses import asdict, dataclass, field

import torch

from ..agents import CountingAgent, RandomAgent
from ..agents.nn_agent import NNAgent
from ..arena import run_match
from ..config import GameConfig
from ..env import obs_size
from .model import DominoNet
from .ppo import PPOConfig, PPOUpdater
from .rollout import RolloutBatch, collect_rollout


@dataclass
class TrainConfig:
    total_games: int = 200_000          # 总自博弈局数
    games_per_iter: int = 512           # 每次迭代采样局数
    n_workers: int = 3                  # 采样进程数（4 核留 1 核给主进程）
    n_parallel_envs: int = 16           # 每个 worker 内锁步引擎数
    reward_norm: float = 30.0
    gamma: float = 1.0
    gae_lambda: float = 0.95
    hidden_sizes: tuple[int, ...] = (256, 256, 128)
    eval_every_iters: int = 20
    eval_games: int = 2000
    out_dir: str = "runs/ppo"
    seed: int = 0
    ppo: PPOConfig = field(default_factory=PPOConfig)


def evaluate(
    model: DominoNet,
    config: GameConfig,
    n_games: int,
    hidden_sizes: tuple[int, ...],
    opponent: str = "counting",
    seed: int = 12345,
) -> tuple[float, float]:
    """返回 (胜率, 均分)。NN 执 1 家，其余 3 家为指定基线。"""
    ckpt = {"model": model.state_dict(), "hidden_sizes": hidden_sizes}
    nn_agent = NNAgent(ckpt, config=config, greedy=True)
    if opponent == "counting":
        others = [CountingAgent() for _ in range(3)]
    else:
        others = [RandomAgent(seed=i) for i in range(3)]
    r = run_match(
        [nn_agent, *others],
        n_games=n_games,
        seed=seed,
        config=config,
        n_workers=1,  # 模型已在主进程，避免重复 pickle
    )
    return r.win_rates[0], r.mean_scores[0]


def train(cfg: TrainConfig) -> str:
    torch.manual_seed(cfg.seed)
    torch.set_num_threads(max((os.cpu_count() or 4) - cfg.n_workers, 1))
    config = GameConfig()

    model = DominoNet(obs_size(config), config.num_actions, cfg.hidden_sizes)
    updater = PPOUpdater(model, cfg.ppo)

    os.makedirs(cfg.out_dir, exist_ok=True)
    log_path = os.path.join(cfg.out_dir, "log.jsonl")
    log_f = open(log_path, "a")

    n_iters = max(cfg.total_games // cfg.games_per_iter, 1)
    games_per_worker = max(cfg.games_per_iter // cfg.n_workers, 1)

    best_wr = -1.0
    t_start = time.perf_counter()
    total_games = 0
    total_steps = 0

    with ProcessPoolExecutor(max_workers=cfg.n_workers) as pool:
        for it in range(1, n_iters + 1):
            t0 = time.perf_counter()
            state = {k: v.cpu() for k, v in model.state_dict().items()}
            futures = [
                pool.submit(
                    collect_rollout,
                    state,
                    config,
                    games_per_worker,
                    seed=cfg.seed + it * 1000 + w,
                    n_parallel_envs=cfg.n_parallel_envs,
                    reward_norm=cfg.reward_norm,
                    gamma=cfg.gamma,
                    gae_lambda=cfg.gae_lambda,
                    hidden_sizes=cfg.hidden_sizes,
                )
                for w in range(cfg.n_workers)
            ]
            batch = RolloutBatch.concat([f.result() for f in futures])
            t_collect = time.perf_counter() - t0

            t1 = time.perf_counter()
            stats = updater.update(batch)
            t_update = time.perf_counter() - t1

            total_games += batch.n_games
            total_steps += len(batch.action)

            record = {
                "iter": it,
                "games": total_games,
                "steps": total_steps,
                "policy_loss": round(stats.policy_loss, 5),
                "value_loss": round(stats.value_loss, 5),
                "entropy": round(stats.entropy, 4),
                "approx_kl": round(stats.approx_kl, 5),
                "clip_frac": round(stats.clip_frac, 4),
                "t_collect": round(t_collect, 2),
                "t_update": round(t_update, 2),
            }

            if it % cfg.eval_every_iters == 0 or it == n_iters:
                wr_c, ms_c = evaluate(
                    model, config, cfg.eval_games, cfg.hidden_sizes, "counting"
                )
                wr_r, ms_r = evaluate(
                    model, config, cfg.eval_games, cfg.hidden_sizes, "random"
                )
                record.update(
                    wr_vs_counting=round(wr_c, 4),
                    score_vs_counting=round(ms_c, 3),
                    wr_vs_random=round(wr_r, 4),
                    score_vs_random=round(ms_r, 3),
                )
                ckpt = {
                    "model": model.state_dict(),
                    "hidden_sizes": list(cfg.hidden_sizes),
                    "iter": it,
                    "games": total_games,
                    "wr_vs_counting": wr_c,
                }
                torch.save(ckpt, os.path.join(cfg.out_dir, f"ckpt_{it:05d}.pt"))
                if wr_c > best_wr:
                    best_wr = wr_c
                    torch.save(ckpt, os.path.join(cfg.out_dir, "best.pt"))
                elapsed = time.perf_counter() - t_start
                print(
                    f"[iter {it}/{n_iters}] games={total_games} steps={total_steps} "
                    f"vs_counting={wr_c:.2%} vs_random={wr_r:.2%} "
                    f"entropy={stats.entropy:.3f} "
                    f"({total_steps/elapsed:,.0f} 步/秒)"
                )
            log_f.write(json.dumps(record) + "\n")
            log_f.flush()

    log_f.close()
    print(f"训练完成：best vs_counting = {best_wr:.2%}，输出目录 {cfg.out_dir}")
    return os.path.join(cfg.out_dir, "best.pt")


def main() -> None:
    ap = argparse.ArgumentParser(description="PPO 自博弈训练")
    ap.add_argument("--total-games", type=int, default=200_000)
    ap.add_argument("--games-per-iter", type=int, default=512)
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--out", type=str, default=None)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--lr", type=float, default=3e-4)
    ap.add_argument("--entropy-coef", type=float, default=0.01)
    ap.add_argument("--eval-every", type=int, default=20)
    ap.add_argument("--smoke", action="store_true", help="快速冒烟（少量对局）")
    args = ap.parse_args()

    cfg = TrainConfig(
        total_games=args.total_games,
        games_per_iter=args.games_per_iter,
        n_workers=args.workers,
        seed=args.seed,
        eval_every_iters=args.eval_every,
        out_dir=args.out or f"runs/ppo_seed{args.seed}_{int(time.time())}",
        ppo=PPOConfig(learning_rate=args.lr, entropy_coef=args.entropy_coef),
    )
    if args.smoke:
        cfg.total_games = 4096
        cfg.games_per_iter = 512
        cfg.eval_every_iters = 4
        cfg.eval_games = 400

    print(f"配置: {asdict(cfg)}")
    train(cfg)


if __name__ == "__main__":
    main()
