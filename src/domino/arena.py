"""竞技场：批量对局评估，输出胜率、均分、95% 置信区间与 Elo。

- 座位轮换：第 g 局 agent i 坐在 (i + g) % n 号位，消除先手/座位偏差；
- 多进程：按局数分块并行（每个子进程独立引擎 + 独立种子流）；
- 所有棋力比较统一走这里，保证口径一致。
"""

from __future__ import annotations

import math
import os
from concurrent.futures import ProcessPoolExecutor
from dataclasses import dataclass, field

from .agents.base import Agent
from .config import GameConfig
from .engine import DominoEngine


@dataclass
class MatchResult:
    names: list[str]
    n_games: int
    wins: list[int]
    draws: int
    total_scores: list[float]
    elo: list[float] = field(default_factory=list)

    @property
    def win_rates(self) -> list[float]:
        return [w / self.n_games for w in self.wins]

    def win_rate_ci95(self, i: int) -> tuple[float, float]:
        """二项分布正态近似 95% 置信区间。"""
        p = self.wins[i] / self.n_games
        half = 1.96 * math.sqrt(max(p * (1 - p), 1e-12) / self.n_games)
        return max(0.0, p - half), min(1.0, p + half)

    @property
    def mean_scores(self) -> list[float]:
        return [s / self.n_games for s in self.total_scores]

    def report(self) -> str:
        lines = [f"对局数: {self.n_games}（平局 {self.draws}）"]
        order = sorted(range(len(self.names)), key=lambda i: -self.wins[i])
        for i in order:
            lo, hi = self.win_rate_ci95(i)
            lines.append(
                f"  {self.names[i]:<12} 胜率 {self.win_rates[i]:6.2%} "
                f"[{lo:.2%}, {hi:.2%}]  均分 {self.mean_scores[i]:+7.2f}  "
                f"Elo {self.elo[i]:7.1f}"
            )
        return "\n".join(lines)


def _play_chunk(
    agents: list[Agent],
    config: GameConfig,
    game_indices: list[int],
    base_seed: int,
    rotate_seats: bool,
) -> tuple[list[int], int, list[float], list[list[int]]]:
    """子进程执行一段对局。返回 (wins, draws, total_scores, 每局赢家agent序号列表按局序)。"""
    n = config.num_players
    eng = DominoEngine(config)
    wins = [0] * len(agents)
    draws = 0
    total_scores = [0.0] * len(agents)
    game_winners: list[list[int]] = []  # [game_idx, winner_agent(-1=平)]

    for g in game_indices:
        # 每局按 (base_seed, g, agent序号) 重置随机 agent，
        # 保证结果与进程数/分块方式无关（可复现）
        for i, a in enumerate(agents):
            a.reset(seed=(base_seed + g) * 64 + i)
        # 座位轮换：seat -> agent 映射
        offset = g % n if rotate_seats else 0
        seat_to_agent = [(s - offset) % n for s in range(n)]

        eng.reset(seed=base_seed + g)
        while not eng.is_over:
            agent = agents[seat_to_agent[eng.current_player]]
            eng.step(agent.act(eng))

        scores = eng.scores()
        for seat in range(n):
            total_scores[seat_to_agent[seat]] += scores[seat]
        if eng.winner < 0:
            draws += 1
            game_winners.append([g, -1])
        else:
            w = seat_to_agent[eng.winner]
            wins[w] += 1
            game_winners.append([g, w])

    return wins, draws, total_scores, game_winners


def _compute_elo(
    n_agents: int, game_winners: list[list[int]], k: float = 8.0
) -> list[float]:
    """按局序做增量 Elo：赢家对其余每人记一胜。平局不更新。"""
    elo = [1000.0] * n_agents
    for _, w in sorted(game_winners):
        if w < 0:
            continue
        for o in range(n_agents):
            if o == w:
                continue
            expect = 1.0 / (1.0 + 10 ** ((elo[o] - elo[w]) / 400.0))
            delta = k * (1.0 - expect)
            elo[w] += delta
            elo[o] -= delta
    return elo


def run_match(
    agents: list[Agent],
    n_games: int = 2000,
    seed: int = 0,
    config: GameConfig | None = None,
    rotate_seats: bool = True,
    n_workers: int | None = None,
) -> MatchResult:
    config = config or GameConfig()
    assert len(agents) == config.num_players, "agent 数须等于玩家数"
    if n_workers is None:
        n_workers = min(os.cpu_count() or 1, 4)

    all_indices = list(range(n_games))
    if n_workers <= 1 or n_games < 200:
        chunks_results = [
            _play_chunk(agents, config, all_indices, seed, rotate_seats)
        ]
    else:
        chunk_size = math.ceil(n_games / n_workers)
        chunks = [
            all_indices[i : i + chunk_size]
            for i in range(0, n_games, chunk_size)
        ]
        with ProcessPoolExecutor(max_workers=n_workers) as pool:
            futures = [
                pool.submit(_play_chunk, agents, config, c, seed, rotate_seats)
                for c in chunks
            ]
            chunks_results = [f.result() for f in futures]

    wins = [0] * len(agents)
    draws = 0
    total_scores = [0.0] * len(agents)
    game_winners: list[list[int]] = []
    for w, d, s, gw in chunks_results:
        wins = [a + b for a, b in zip(wins, w)]
        draws += d
        total_scores = [a + b for a, b in zip(total_scores, s)]
        game_winners.extend(gw)

    # 重名 agent 加序号后缀（random#1 / random#2 ...），唯一的保留原名
    totals: dict[str, int] = {}
    for a in agents:
        totals[a.name] = totals.get(a.name, 0) + 1
    seen: dict[str, int] = {}
    names = []
    for a in agents:
        if totals[a.name] > 1:
            seen[a.name] = seen.get(a.name, 0) + 1
            names.append(f"{a.name}#{seen[a.name]}")
        else:
            names.append(a.name)

    return MatchResult(
        names=names,
        n_games=n_games,
        wins=wins,
        draws=draws,
        total_scores=total_scores,
        elo=_compute_elo(len(agents), game_winners),
    )
