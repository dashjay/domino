"""基于 curses 的人机对战 TUI。

键位：
    数字 / 字母键  选择合法动作（与列表编号对应）
    ↑↓ / j k       移动高亮
    Enter / Space   确认
    p              PASS（仅当合法）
    a              切换自动 PASS
    q              退出
    n              终局后下一局
"""

from __future__ import annotations

import curses
import time
from typing import Callable

from ..agents.base import Agent
from ..engine import DominoEngine
from ..tiles import format_tile, iter_tiles, pip_sum
from .play_render import (
    describe_action,
    format_chain,
    legal_options,
    seat_label,
)


class PlayTUI:
    def __init__(
        self,
        *,
        eng: DominoEngine,
        agents: dict[int, Agent],
        human_seat: int,
        opponent_tag: str,
        games: int = 0,
        seed_rng,
        delay: float = 0.35,
        auto_pass: bool = False,
        human_name: str = "你",
        on_ai_act: Callable[[DominoEngine, Agent], int] | None = None,
    ):
        self.eng = eng
        self.agents = agents
        self.human_seat = human_seat
        self.opponent_tag = opponent_tag
        self.games = games
        self.seed_rng = seed_rng
        self.delay = delay
        self.auto_pass = auto_pass
        self.human_name = human_name
        self.on_ai_act = on_ai_act or (lambda e, a: a.act(e))
        self.totals = [0.0] * eng.config.num_players
        self.game_no = 0
        self.last_msg = ""
        self.cursor = 0
        self.quit = False

    def run(self) -> None:
        curses.wrapper(self._main)

    def _main(self, stdscr) -> None:
        curses.curs_set(0)
        stdscr.nodelay(False)
        stdscr.keypad(True)
        if curses.has_colors():
            curses.start_color()
            curses.use_default_colors()
            curses.init_pair(1, curses.COLOR_CYAN, -1)
            curses.init_pair(2, curses.COLOR_GREEN, -1)
            curses.init_pair(3, curses.COLOR_YELLOW, -1)
            curses.init_pair(4, curses.COLOR_RED, -1)
            curses.init_pair(5, curses.COLOR_MAGENTA, -1)
            curses.init_pair(6, curses.COLOR_WHITE, curses.COLOR_BLUE)

        while not self.quit:
            self.game_no += 1
            self.eng.reset(seed=self.seed_rng.randrange(1 << 30))
            self.last_msg = f"第 {self.game_no} 局开始"
            self.cursor = 0
            self._play_game(stdscr)
            if self.quit:
                break
            if self.games and self.game_no >= self.games:
                break
            if not self._ask_again(stdscr):
                break

    def _play_game(self, stdscr) -> None:
        eng = self.eng
        while not eng.is_over and not self.quit:
            self._draw(stdscr)
            p = eng.current_player
            if p == self.human_seat:
                action = self._human_turn(stdscr)
                if self.quit or action is None:
                    return
            else:
                action = self.on_ai_act(eng, self.agents[p])
                who = seat_label(p, self.human_seat, self.human_name)
                self.last_msg = f"{who}: {describe_action(eng, action)}"
                self._draw(stdscr)
                if self.delay > 0:
                    curses.napms(int(self.delay * 1000))
            eng.step(action)

        scores = eng.scores()
        tag = "堵死" if eng.blocked else "出完"
        if eng.winner == self.human_seat:
            winner = self.human_name
        elif eng.winner < 0:
            winner = "平局"
        else:
            winner = f"AI{eng.winner}"
        for p in range(eng.config.num_players):
            self.totals[p] += scores[p]
        self.last_msg = f"终局（{tag}）赢家: {winner}"
        self._draw(stdscr, end_screen=True)

    def _human_turn(self, stdscr) -> int | None:
        options = legal_options(self.eng)
        self.cursor = min(self.cursor, len(options) - 1)
        if (
            self.auto_pass
            and len(options) == 1
            and options[0][0] == self.eng.config.pass_action
        ):
            self.last_msg = "自动 PASS"
            if self.delay > 0:
                self._draw(stdscr)
                curses.napms(int(min(self.delay, 0.25) * 1000))
            return options[0][0]

        while True:
            self._draw(stdscr, options=options)
            key = stdscr.getch()
            if key in (ord("q"), ord("Q")):
                self.quit = True
                return None
            if key in (ord("a"), ord("A")):
                self.auto_pass = not self.auto_pass
                self.last_msg = f"自动 PASS: {'开' if self.auto_pass else '关'}"
                continue
            if key in (curses.KEY_UP, ord("k")):
                self.cursor = (self.cursor - 1) % len(options)
                continue
            if key in (curses.KEY_DOWN, ord("j")):
                self.cursor = (self.cursor + 1) % len(options)
                continue
            if key in (curses.KEY_ENTER, 10, 13, ord(" ")):
                return options[self.cursor][0]
            if key in (ord("p"), ord("P")):
                for a, _ in options:
                    if a == self.eng.config.pass_action:
                        return a
                self.last_msg = "当前不能 PASS"
                continue
            # 数字/字母快捷键：0-9 然后 a-z
            idx = None
            if ord("0") <= key <= ord("9"):
                idx = key - ord("0")
            elif ord("a") <= key <= ord("z"):
                idx = 10 + (key - ord("a"))
            elif ord("A") <= key <= ord("Z"):
                idx = 10 + (key - ord("A"))
            if idx is not None and 0 <= idx < len(options):
                return options[idx][0]

    def _ask_again(self, stdscr) -> bool:
        self.last_msg = "再来一局？ [n]=继续  [q]=退出"
        self._draw(stdscr, end_screen=True)
        while True:
            key = stdscr.getch()
            if key in (ord("q"), ord("Q")):
                return False
            if key in (ord("n"), ord("N"), ord("y"), ord("Y"), 10, 13, ord(" ")):
                return True

    def _draw(
        self,
        stdscr,
        options: list[tuple[int, str]] | None = None,
        end_screen: bool = False,
    ) -> None:
        stdscr.erase()
        h, w = stdscr.getmaxyx()
        eng = self.eng
        y = 0

        def put(text: str, attr: int = 0, row: int | None = None) -> int:
            nonlocal y
            if row is not None:
                y = row
            if y >= h - 1:
                return y
            stdscr.addnstr(y, 0, text.ljust(w - 1)[: w - 1], w - 1, attr)
            y += 1
            return y

        title = f" Domimo 人机对战  ·  对手 {self.opponent_tag}  ·  第 {self.game_no} 局 "
        put(title[: w - 1], curses.color_pair(6) | curses.A_BOLD if curses.has_colors() else curses.A_REVERSE)
        put("")

        put("桌面骨牌链", curses.color_pair(1) | curses.A_BOLD if curses.has_colors() else curses.A_BOLD)
        for row in format_chain(eng, max_width=max(20, w - 4)):
            put(f"  {row}")
        if eng.left_end >= 0:
            put(f"  两端  左[{eng.left_end}]  ···  右[{eng.right_end}]", curses.color_pair(3) if curses.has_colors() else 0)
        else:
            put("  (等待首出)")
        put("")

        # 座位圈
        sizes = eng.hand_sizes()
        put("座位", curses.color_pair(1) | curses.A_BOLD if curses.has_colors() else curses.A_BOLD)
        for p in range(eng.config.num_players):
            who = seat_label(p, self.human_seat, self.human_name)
            marker = "▶" if (p == eng.current_player and not eng.is_over) else " "
            attr = 0
            if p == eng.current_player and not eng.is_over:
                attr = curses.color_pair(2) | curses.A_BOLD if curses.has_colors() else curses.A_BOLD
            left = ""
            if eng.is_over or p == self.human_seat:
                # 终局亮出各家剩余；行棋中只亮自己
                if p == self.human_seat or eng.is_over:
                    tiles = " ".join(format_tile(t, eng.pips) for t in iter_tiles(eng.hands[p]))
                    pts = pip_sum(eng.hands[p], eng.pips)
                    left = f"  {tiles or '(空)'}  ({pts}点)"
            put(f" {marker} {who}  {sizes[p]}张  累计{self.totals[p]:+.0f}{left}", attr)

        put("")
        if self.last_msg:
            put(f"消息: {self.last_msg}", curses.color_pair(5) if curses.has_colors() else curses.A_DIM)

        if end_screen and eng.is_over:
            put("")
            scores = eng.scores()
            put("本局得分", curses.color_pair(3) | curses.A_BOLD if curses.has_colors() else curses.A_BOLD)
            for p in range(eng.config.num_players):
                who = seat_label(p, self.human_seat, self.human_name)
                put(f"  {who}: {scores[p]:+.0f}   累计 {self.totals[p]:+.0f}")

        if options is not None and not eng.is_over:
            put("")
            put("可选动作  (↑↓/jk 移动, Enter 确认, 数字快捷, p=PASS, a=自动PASS, q=退出)",
                curses.A_DIM)
            for i, (_, txt) in enumerate(options):
                prefix = chr(ord("0") + i) if i < 10 else chr(ord("a") + i - 10)
                label = f"  [{prefix}] {txt}"
                if i == self.cursor:
                    put(label, curses.color_pair(6) | curses.A_BOLD if curses.has_colors() else curses.A_REVERSE)
                else:
                    put(label)

        help_line = (
            f"自动PASS={'开' if self.auto_pass else '关'}  delay={self.delay:.2f}s  "
            f"座位={self.human_seat}"
        )
        if y < h - 1:
            stdscr.addnstr(h - 1, 0, help_line.ljust(w - 1)[: w - 1], w - 1, curses.A_DIM)
        stdscr.refresh()


def run_plain_ui(
    *,
    eng: DominoEngine,
    agents: dict[int, Agent],
    human_seat: int,
    opponent_tag: str,
    games: int = 0,
    seed_rng,
    delay: float = 0.0,
    auto_pass: bool = False,
    human_name: str = "你",
    color: bool = True,
) -> None:
    """增强版行模式 UI（不依赖 curses 全屏）。"""
    from .play_render import render_status_block

    use_color = color and _stdout_supports_color()
    totals = [0.0] * eng.config.num_players
    game_no = 0
    c = _Ansi(use_color)

    while True:
        game_no += 1
        print(c.clear, end="")
        eng.reset(seed=seed_rng.randrange(1 << 30))
        while not eng.is_over:
            print()
            print(render_status_block(
                eng, human_seat, totals, game_no, opponent_tag, human_name
            ))
            p = eng.current_player
            if p == human_seat:
                action = _plain_human_turn(eng, auto_pass=auto_pass)
            else:
                action = agents[p].act(eng)
                who = seat_label(p, human_seat, human_name)
                print(f"{c.magenta}{who}{c.reset}: {describe_action(eng, action)}")
                if delay > 0:
                    time.sleep(delay)
            eng.step(action)

        scores = eng.scores()
        tag = "堵死" if eng.blocked else "出完"
        if eng.winner == human_seat:
            winner = human_name
        elif eng.winner < 0:
            winner = "平局"
        else:
            winner = f"AI{eng.winner}"
        print()
        print(c.bold + c.yellow + f"### 终局（{tag}）赢家: {winner}" + c.reset)
        for p in range(eng.config.num_players):
            left = pip_sum(eng.hands[p], eng.pips)
            who = seat_label(p, human_seat, human_name)
            totals[p] += scores[p]
            tiles = " ".join(format_tile(t, eng.pips) for t in iter_tiles(eng.hands[p]))
            print(f"  {who}: 剩 {left} 点 [{tiles or '空'}]，本局 {scores[p]:+.0f}，累计 {totals[p]:+.0f}")

        if games and game_no >= games:
            break
        if input("\n再来一局？(y/n)> ").strip().lower() not in ("", "y", "yes"):
            break


def _plain_human_turn(eng: DominoEngine, auto_pass: bool = False) -> int:
    options = legal_options(eng)
    if (
        auto_pass
        and len(options) == 1
        and options[0][0] == eng.config.pass_action
    ):
        print("无牌可出，自动 PASS")
        return options[0][0]
    if options == [(eng.config.pass_action, "PASS")]:
        input("无牌可出，回车 PASS...")
        return eng.config.pass_action
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


def _stdout_supports_color() -> bool:
    import os
    import sys

    if os.environ.get("NO_COLOR"):
        return False
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


class _Ansi:
    def __init__(self, enabled: bool):
        if enabled:
            self.reset = "\033[0m"
            self.bold = "\033[1m"
            self.yellow = "\033[33m"
            self.magenta = "\033[35m"
            self.clear = "\033[H\033[J"
        else:
            self.reset = self.bold = self.yellow = self.magenta = ""
            self.clear = ""
