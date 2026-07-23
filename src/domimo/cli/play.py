"""人机对战 CLI：你执一家，其余座位由指定 agent 执棋。

用法：
    python3 -m domimo.cli.play                                    # 默认 counting + TUI
    python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt  # 对战最强模型
    python3 -m domimo.cli.play --opponents counting               # 对战记牌启发式
    python3 -m domimo.cli.play --opponents counting,w_stuck_next=90 --ui plain
    python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt,greedy=0 \\
        --seat 2 --seed 42 --delay 0.5 --auto-pass
    python3 -m domimo.cli.play --opponents counting greedy nn:models/ppo_best.pt
"""

from __future__ import annotations

import argparse
import random
import sys

from ..config import GameConfig
from ..engine import DominoEngine
from .agent_spec import make_agent, resolve_opponent_specs
from .play_tui import PlayTUI, run_plain_ui


def _build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="Domino 人机对战（支持 counting / nn 等对手 + 简易 TUI）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
对手规格（--opponents）：
  random / greedy / counting
  counting,w_pip=1.8,w_double=38,w_stuck_next=72,w_stuck_others=6.5,w_flex=36,w_diversity=3.5,w_urgency=0.9
  nn:<checkpoint路径>
  nn:<checkpoint路径>,greedy=0          # 按策略分布采样而非贪心

传 1 个规格时，其余三家全部使用该对手；传 3 个规格时按座位从小到大填入非人类座位。

界面（--ui）：
  tui    curses 全屏（默认；非 tty 时自动回退 plain）
  plain  行模式增强 UI（编号选招、ANSI 配色）
""",
    )
    ap.add_argument(
        "--opponents",
        nargs="+",
        default=["counting"],
        metavar="SPEC",
        help="对手规格：1 个=全体相同；3 个=逐座位。默认 counting",
    )
    ap.add_argument("--seat", type=int, default=0, help="你的座位 0-3（默认 0）")
    ap.add_argument("--seed", type=int, default=None, help="随机种子（可复现整场）")
    ap.add_argument("--games", type=int, default=0, help="打几局（0=无限，每局后询问）")
    ap.add_argument(
        "--ui",
        choices=("tui", "plain"),
        default="tui",
        help="界面模式：tui=curses 全屏，plain=行模式（默认 tui）",
    )
    ap.add_argument(
        "--delay",
        type=float,
        default=0.35,
        help="AI 出牌后停顿秒数，便于观看（默认 0.35；plain 默认仍可用 0）",
    )
    ap.add_argument(
        "--auto-pass",
        action="store_true",
        help="无牌可出时自动 PASS，无需确认",
    )
    ap.add_argument(
        "--name",
        type=str,
        default="你",
        help="你的显示名（默认「你」）",
    )
    ap.add_argument(
        "--no-color",
        action="store_true",
        help="plain 模式下关闭 ANSI 颜色",
    )
    return ap


def main(argv: list[str] | None = None) -> None:
    args = _build_parser().parse_args(argv)
    cfg = GameConfig()

    if not (0 <= args.seat < cfg.num_players):
        raise SystemExit(f"--seat 须在 0..{cfg.num_players - 1}")

    try:
        seat_specs = resolve_opponent_specs(args.opponents, args.seat, cfg.num_players)
    except ValueError as e:
        raise SystemExit(str(e)) from e

    try:
        agents = {
            seat: make_agent(spec, seed=(args.seed or 0) + 17 + seat, config=cfg)
            for seat, spec in seat_specs.items()
        }
    except (ValueError, FileNotFoundError, OSError) as e:
        raise SystemExit(f"创建对手失败: {e}") from e

    # 展示用标签：去重保序
    seen: list[str] = []
    for spec in seat_specs.values():
        if spec not in seen:
            seen.append(spec)
    opponent_tag = " + ".join(seen)

    eng = DominoEngine(cfg)
    rng = random.Random(args.seed)

    ui = args.ui
    if ui == "tui" and (not sys.stdin.isatty() or not sys.stdout.isatty()):
        print("[提示] 非交互终端，回退到 --ui plain", file=sys.stderr)
        ui = "plain"

    if ui == "tui":
        try:
            import curses
        except ImportError as e:  # pragma: no cover
            print(f"[提示] curses 不可用（{e}），回退到 --ui plain", file=sys.stderr)
            ui = "plain"
        else:
            try:
                PlayTUI(
                    eng=eng,
                    agents=agents,
                    human_seat=args.seat,
                    opponent_tag=opponent_tag,
                    games=args.games,
                    seed_rng=rng,
                    delay=args.delay,
                    auto_pass=args.auto_pass,
                    human_name=args.name,
                ).run()
                return
            except curses.error as e:  # pragma: no cover - 终端环境相关
                print(f"[提示] curses 启动失败（{e}），回退到 --ui plain", file=sys.stderr)
                ui = "plain"

    # plain 默认更短延迟，除非用户显式传了 --delay
    delay = args.delay
    argv_list = argv if argv is not None else sys.argv[1:]
    if "--delay" not in argv_list:
        delay = 0.0
    run_plain_ui(
        eng=eng,
        agents=agents,
        human_seat=args.seat,
        opponent_tag=opponent_tag,
        games=args.games,
        seed_rng=rng,
        delay=delay,
        auto_pass=args.auto_pass,
        human_name=args.name,
        color=not args.no_color,
    )


if __name__ == "__main__":
    main()
