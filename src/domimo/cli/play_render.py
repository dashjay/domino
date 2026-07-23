"""人机对战共用的牌面重建与文本渲染。"""

from __future__ import annotations

from ..engine import DominoEngine
from ..tiles import format_tile, iter_tiles, pip_sum


def reconstruct_chain(eng: DominoEngine) -> list[tuple[int, int]]:
    """按桌面从左到右重建已出牌链（每张为朝向后的 (左端, 右端)）。"""
    if eng.left_end < 0:
        return []
    chain: list[tuple[int, int]] = []
    pass_a = eng.config.pass_action
    for _, action in eng.history:
        if action == pass_a:
            continue
        tid, side = divmod(action, 2)
        a, b = eng.pips[tid]
        if not chain:
            chain = [(a, b)]
            continue
        if side == 0:  # 接左端
            left = chain[0][0]
            chain.insert(0, (b, a) if a == left else (a, b))
        else:  # 接右端
            right = chain[-1][1]
            chain.append((a, b) if a == right else (b, a))
    return chain


def format_oriented(a: int, b: int) -> str:
    return f"[{a}|{b}]"


def format_chain(eng: DominoEngine, max_width: int = 72) -> list[str]:
    """桌面骨牌链，必要时折行。"""
    chain = reconstruct_chain(eng)
    if not chain:
        return ["(空桌)"]
    parts = [format_oriented(a, b) for a, b in chain]
    lines: list[str] = []
    cur = ""
    for p in parts:
        piece = p if not cur else f"-{p}"
        if cur and len(cur) + len(piece) > max_width:
            lines.append(cur)
            cur = p
        else:
            cur = cur + piece if cur else p
    if cur:
        lines.append(cur)
    return lines


def legal_options(eng: DominoEngine) -> list[tuple[int, str]]:
    """合法动作 -> (action, 显示文本)。"""
    legal = eng.legal_actions_list()
    if legal == [eng.config.pass_action]:
        return [(eng.config.pass_action, "PASS")]
    options: list[tuple[int, str]] = []
    for a in legal:
        tid, side = divmod(a, 2)
        if eng.left_end < 0:
            side_txt = "首出"
        else:
            side_txt = "左端" if side == 0 else "右端"
        options.append((a, f"{format_tile(tid, eng.pips)} → {side_txt}"))
    return options


def seat_label(seat: int, human_seat: int, human_name: str = "你") -> str:
    return human_name if seat == human_seat else f"AI{seat}"


def describe_action(eng: DominoEngine, action: int) -> str:
    if action == eng.config.pass_action:
        return "PASS"
    tid, side = divmod(action, 2)
    if eng.left_end < 0 and not eng.history:
        side_txt = "首出"
    else:
        # 注意：调用方应在 step 之前描述，此时 ends 仍是旧值
        side_txt = "左端" if side == 0 else "右端"
        if eng.left_end < 0:
            side_txt = "首出"
    return f"{format_tile(tid, eng.pips)}（{side_txt}）"


def render_status_block(
    eng: DominoEngine,
    human_seat: int,
    totals: list[float],
    game_no: int,
    opponent_tag: str,
    human_name: str = "你",
) -> str:
    lines = [
        f"═══ 第 {game_no} 局  ·  对手 {opponent_tag} ═══",
        "",
        "桌面:",
    ]
    for row in format_chain(eng):
        lines.append(f"  {row}")
    if eng.left_end >= 0:
        lines.append(f"  两端: 左[{eng.left_end}]  右[{eng.right_end}]")

    lines.append("")
    sizes = eng.hand_sizes()
    seats = []
    for p in range(eng.config.num_players):
        who = seat_label(p, human_seat, human_name)
        cur = " ◀" if (p == eng.current_player and not eng.is_over) else ""
        seats.append(f"{who}:{sizes[p]}张{cur}")
    lines.append("座位: " + "  |  ".join(seats))

    if not eng.is_over and eng.current_player == human_seat:
        hand = list(iter_tiles(eng.hands[human_seat]))
        hand_txt = "  ".join(format_tile(t, eng.pips) for t in hand)
        lines.append(f"手牌: {hand_txt}")
        left_pts = pip_sum(eng.hands[human_seat], eng.pips)
        lines.append(f"手牌点数合计: {left_pts}")

    score_bits = []
    for p in range(eng.config.num_players):
        who = seat_label(p, human_seat, human_name)
        score_bits.append(f"{who} {totals[p]:+.0f}")
    lines.append("累计: " + "  ".join(score_bits))
    return "\n".join(lines)
