"""人机对战 CLI：你执一家，其余三家由指定 agent 执棋。

用法：
    python3 -m domimo.cli.play                          # 对手默认 counting
    python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt
    python3 -m domimo.cli.play --seat 2 --seed 42
"""

from __future__ import annotations

import argparse
import random

from ..config import GameConfig
from ..engine import DominoEngine
from ..tiles import format_tile, iter_tiles, pip_sum
from .evaluate import make_agent


def render_board(eng: DominoEngine, human_seat: int) -> str:
    lines = []
    if eng.left_end < 0:
        lines.append("桌面: (空)")
    else:
        played = " ".join(
            format_tile(a // 2, eng.pips) for _, a in eng.history if a != eng.config.pass_action
        )
        lines.append(f"桌面两端: 左[{eng.left_end}] ... 右[{eng.right_end}]")
        lines.append(f"已出牌序: {played}")
    sizes = eng.hand_sizes()
    tags = []
    for p in range(eng.config.num_players):
        who = "你" if p == human_seat else f"AI{p}"
        cur = "←当前" if (p == eng.current_player and not eng.is_over) else ""
        tags.append(f"{who}:{sizes[p]}张{cur}")
    lines.append(" | ".join(tags))
    return "\n".join(lines)


def human_turn(eng: DominoEngine) -> int:
    legal = eng.legal_actions_list()
    hand = list(iter_tiles(eng.hands[eng.current_player]))
    print(f"你的手牌: {'  '.join(f'{i}:{format_tile(t, eng.pips)}' for i, t in enumerate(hand))}")
    if legal == [eng.config.pass_action]:
        input("无牌可出，回车 PASS...")
        return eng.config.pass_action

    options = []
    for a in legal:
        tid, side = divmod(a, 2)
        side_txt = "左" if side == 0 else "右"
        if eng.left_end < 0:
            side_txt = "首"
        options.append((a, f"{format_tile(tid, eng.pips)}→{side_txt}"))
    print("可选: " + "  ".join(f"[{i}]{txt}" for i, (_, txt) in enumerate(options)))
    while True:
        raw = input("选择编号> ").strip()
        try:
            idx = int(raw)
            if 0 <= idx < len(options):
                return options[idx][0]
        except ValueError:
            pass
        print("输入无效，重试")


def main() -> None:
    ap = argparse.ArgumentParser(description="Domino 人机对战")
    ap.add_argument("--opponents", type=str, default="counting",
                    help="对手类型: random/greedy/counting/nn:<ckpt>")
    ap.add_argument("--seat", type=int, default=0, help="你的座位 0-3")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--games", type=int, default=0, help="打几局（0=无限）")
    args = ap.parse_args()

    cfg = GameConfig()
    eng = DominoEngine(cfg)
    ai = {
        p: make_agent(args.opponents, seed=p)
        for p in range(cfg.num_players)
        if p != args.seat
    }
    rng = random.Random(args.seed)
    totals = [0.0] * cfg.num_players
    game_no = 0

    while True:
        game_no += 1
        print(f"\n===== 第 {game_no} 局 =====")
        eng.reset(seed=rng.randrange(1 << 30))
        while not eng.is_over:
            print("\n" + render_board(eng, args.seat))
            p = eng.current_player
            if p == args.seat:
                action = human_turn(eng)
            else:
                action = ai[p].act(eng)
                if action == cfg.pass_action:
                    print(f"AI{p}: PASS")
                else:
                    tid, side = divmod(action, 2)
                    print(f"AI{p}: 出 {format_tile(tid, eng.pips)}（{'左' if side == 0 else '右'}）")
            eng.step(action)

        scores = eng.scores()
        tag = "堵死" if eng.blocked else "出完"
        winner = "你" if eng.winner == args.seat else (f"AI{eng.winner}" if eng.winner >= 0 else "平局")
        print(f"\n### 终局（{tag}）赢家: {winner}")
        for p in range(cfg.num_players):
            left = pip_sum(eng.hands[p], eng.pips)
            who = "你" if p == args.seat else f"AI{p}"
            totals[p] += scores[p]
            print(f"  {who}: 剩 {left} 点，本局 {scores[p]:+.0f}，累计 {totals[p]:+.0f}")

        if args.games and game_no >= args.games:
            break
        if input("\n再来一局？(y/n)> ").strip().lower() not in ("", "y", "yes"):
            break


if __name__ == "__main__":
    main()
