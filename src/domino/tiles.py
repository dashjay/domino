"""牌编码与位图工具。

全项目统一约定：
- 一张牌 (a, b)（a <= b，点数 0..max_pip）用一个整数 id 表示；
- 一副双六牌共 28 张，id 范围 0..27；缩小版（如双三）id 范围更小；
- 一组牌（手牌 / 已出牌）用一个整数位图表示：第 i 位为 1 表示含 id=i 的牌。

id 编码为下三角行优先：
    (0,0)=0
    (0,1)=1 (1,1)=2
    (0,2)=3 (1,2)=4 (2,2)=5
    ...
即 tile_id(a, b) = b*(b+1)//2 + a  （a <= b）
"""

from __future__ import annotations

MAX_PIP_DEFAULT = 6


def num_tiles(max_pip: int = MAX_PIP_DEFAULT) -> int:
    """一副牌的张数：双 n 牌共 (n+1)(n+2)/2 张。"""
    return (max_pip + 1) * (max_pip + 2) // 2


def tile_id(a: int, b: int) -> int:
    """由两端点数得到牌 id（自动交换保证 a <= b）。"""
    if a > b:
        a, b = b, a
    return b * (b + 1) // 2 + a


def build_pips_table(max_pip: int = MAX_PIP_DEFAULT) -> tuple[tuple[int, int], ...]:
    """id -> (a, b) 反查表，a <= b。"""
    table: list[tuple[int, int]] = []
    for b in range(max_pip + 1):
        for a in range(b + 1):
            table.append((a, b))
    return tuple(table)


# 双六默认反查表（28 张）
TILE_PIPS: tuple[tuple[int, int], ...] = build_pips_table(MAX_PIP_DEFAULT)


def is_double(tid: int, pips: tuple[tuple[int, int], ...] = TILE_PIPS) -> bool:
    a, b = pips[tid]
    return a == b


def tile_pip_sum(tid: int, pips: tuple[tuple[int, int], ...] = TILE_PIPS) -> int:
    a, b = pips[tid]
    return a + b


# ---------------------------------------------------------------------------
# 位图工具
# ---------------------------------------------------------------------------

def has_tile(mask: int, tid: int) -> bool:
    return bool(mask & (1 << tid))


def add_tile(mask: int, tid: int) -> int:
    return mask | (1 << tid)


def remove_tile(mask: int, tid: int) -> int:
    return mask & ~(1 << tid)


def popcount(mask: int) -> int:
    return mask.bit_count()


def iter_tiles(mask: int):
    """遍历位图中所有牌 id（从小到大）。"""
    while mask:
        low = mask & -mask
        yield low.bit_length() - 1
        mask ^= low


def pip_sum(mask: int, pips: tuple[tuple[int, int], ...] = TILE_PIPS) -> int:
    """位图内所有牌的点数总和。"""
    total = 0
    for tid in iter_tiles(mask):
        a, b = pips[tid]
        total += a + b
    return total


def tiles_with_pip(pip: int, max_pip: int = MAX_PIP_DEFAULT) -> int:
    """返回含指定点数 pip 的所有牌构成的位图。"""
    mask = 0
    for other in range(max_pip + 1):
        mask |= 1 << tile_id(pip, other)
    return mask


def format_tile(tid: int, pips: tuple[tuple[int, int], ...] = TILE_PIPS) -> str:
    a, b = pips[tid]
    return f"[{a}|{b}]"


def format_mask(mask: int, pips: tuple[tuple[int, int], ...] = TILE_PIPS) -> str:
    return " ".join(format_tile(t, pips) for t in iter_tiles(mask))
