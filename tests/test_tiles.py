"""tiles.py 编码与位图工具单测。"""

from domino.tiles import (
    add_tile,
    build_pips_table,
    format_tile,
    has_tile,
    is_double,
    iter_tiles,
    num_tiles,
    pip_sum,
    popcount,
    remove_tile,
    tile_id,
    tiles_with_pip,
    TILE_PIPS,
)


def test_num_tiles():
    assert num_tiles(6) == 28
    assert num_tiles(3) == 10
    assert num_tiles(0) == 1


def test_tile_id_roundtrip():
    """编码-反查往返一致，且 id 恰好覆盖 0..27。"""
    seen = set()
    for b in range(7):
        for a in range(b + 1):
            tid = tile_id(a, b)
            assert TILE_PIPS[tid] == (a, b)
            seen.add(tid)
    assert seen == set(range(28))


def test_tile_id_symmetric():
    assert tile_id(2, 5) == tile_id(5, 2)


def test_known_ids():
    assert tile_id(0, 0) == 0
    assert tile_id(0, 1) == 1
    assert tile_id(1, 1) == 2
    assert tile_id(6, 6) == 27


def test_build_pips_table_mini():
    table = build_pips_table(3)
    assert len(table) == 10
    assert table[0] == (0, 0)
    assert table[-1] == (3, 3)


def test_is_double():
    assert is_double(tile_id(4, 4))
    assert not is_double(tile_id(4, 5))


def test_bitmask_ops():
    mask = 0
    mask = add_tile(mask, 5)
    mask = add_tile(mask, 27)
    assert has_tile(mask, 5) and has_tile(mask, 27)
    assert not has_tile(mask, 6)
    assert popcount(mask) == 2
    mask = remove_tile(mask, 5)
    assert not has_tile(mask, 5)
    assert popcount(mask) == 1


def test_iter_tiles_order():
    mask = (1 << 3) | (1 << 0) | (1 << 27)
    assert list(iter_tiles(mask)) == [0, 3, 27]


def test_pip_sum():
    mask = (1 << tile_id(6, 6)) | (1 << tile_id(0, 1))
    assert pip_sum(mask) == 12 + 1
    assert pip_sum(0) == 0


def test_full_deck_pip_sum():
    """双六整副牌点数和 = 168（守恒检查基准）。"""
    full = (1 << 28) - 1
    assert pip_sum(full) == 168


def test_tiles_with_pip():
    mask = tiles_with_pip(6)
    ids = list(iter_tiles(mask))
    assert len(ids) == 7  # (0,6)..(6,6)
    for tid in ids:
        assert 6 in TILE_PIPS[tid]


def test_format_tile():
    assert format_tile(tile_id(2, 5)) == "[2|5]"
