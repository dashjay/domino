"""env.py 观测编码单测。"""

import random

import numpy as np

from domimo.config import GameConfig
from domimo.engine import DominoEngine
from domimo.env import DominoEnv, encode_obs, legal_mask, obs_size
from domimo.tiles import iter_tiles, popcount, tile_id


CFG = GameConfig()


def test_obs_size_default():
    assert obs_size(CFG) == 204


def test_obs_hand_and_played_sections():
    eng = DominoEngine(CFG)
    eng.reset(seed=0)
    p = eng.current_player
    obs = encode_obs(eng)
    # 手牌段
    hand_bits = {t for t in iter_tiles(eng.hands[p])}
    assert {t for t in range(28) if obs[t] == 1.0} == hand_bits
    # 尚未出牌
    assert obs[28:56].sum() == 0
    # 无桌面标志位
    assert obs[56 + 7] == 1.0 and obs[64 + 7] == 1.0
    # 各家手牌数 = 1.0（满手）
    assert np.allclose(obs[72:76], 1.0)
    # 绝对座位 one-hot
    seat = obs[105:109]
    assert seat[p] == 1.0 and seat.sum() == 1.0


def test_obs_after_moves():
    eng = DominoEngine(CFG)
    eng.reset(seed=1)
    (a0,) = eng.legal_actions_list()
    t0 = a0 // 2
    eng.step(a0)
    obs = encode_obs(eng)
    # 已出牌段
    assert obs[28 + t0] == 1.0 and obs[28:56].sum() == 1.0
    # 端点 one-hot
    assert obs[56 + eng.left_end] == 1.0
    assert obs[64 + eng.right_end] == 1.0
    # 上一家（相对座位 n-1）手牌 6/7
    assert np.isclose(obs[72 + 3], 6 / 7)
    assert np.isclose(obs[72], 1.0)  # 自己还是满手


def test_obs_missing_pips_relative_order():
    eng = DominoEngine(CFG)
    eng.reset(seed=2)
    eng.left_end, eng.right_end = 2, 4
    eng.current_player = 1
    eng.forced_action = -1
    eng.missing_pips[2] = (1 << 2) | (1 << 4)  # 玩家2（当前玩家的下家）缺 2/4
    obs = encode_obs(eng)
    base = 76  # 下家缺数字段起点
    assert obs[base + 2] == 1.0 and obs[base + 4] == 1.0
    # 下下家（玩家3）段应为 0
    assert obs[base + 7 : base + 14].sum() == 0


def test_obs_no_hidden_info():
    """交换其他玩家手牌不改变当前玩家的 obs。"""
    rng = random.Random(0)
    eng = DominoEngine(CFG)
    for seed in range(30):
        eng.reset(seed=seed)
        for _ in range(rng.randrange(0, 8)):
            if eng.is_over:
                break
            eng.step(rng.choice(eng.legal_actions_list()))
        if eng.is_over:
            continue
        o1 = encode_obs(eng).copy()
        others = [q for q in range(4) if q != eng.current_player]
        a, b = others[0], others[1]
        if popcount(eng.hands[a]) != popcount(eng.hands[b]):
            continue  # 换牌须保持手牌数不变（手牌数是公开信息）
        eng.hands[a], eng.hands[b] = eng.hands[b], eng.hands[a]
        assert np.array_equal(encode_obs(eng), o1)


def test_obs_playability_features():
    """可接性特征段与两端点数一致。"""
    eng = DominoEngine(CFG)
    eng.reset(seed=4)
    (a0,) = eng.legal_actions_list()
    eng.step(a0)
    obs = encode_obs(eng)
    # v3 可接性段起点：56+16+4+21+7+1+4+14+2 = 125（见 env.py 布局）
    base = 125
    l, r = eng.left_end, eng.right_end
    for t in range(28):
        from domimo.tiles import TILE_PIPS

        a, b = TILE_PIPS[t]
        assert obs[base + t] == float(a == l or b == l)
        assert obs[base + 28 + t] == float(a == r or b == r)


def test_legal_mask_matches_engine():
    rng = random.Random(3)
    eng = DominoEngine(CFG)
    for seed in range(50):
        eng.reset(seed=seed)
        while not eng.is_over:
            m = legal_mask(eng)
            bits = eng.legal_actions()
            for a in range(CFG.num_actions):
                assert m[a] == float((bits >> a) & 1)
            eng.step(rng.choice(eng.legal_actions_list()))


def test_env_full_episode():
    env = DominoEnv(CFG)
    rng = random.Random(0)
    obs, mask, player = env.reset(seed=5)
    assert obs.shape == (204,) and mask.shape == (57,)
    steps = 0
    while True:
        action = rng.choice(np.flatnonzero(mask).tolist())
        obs, mask, player, done, scores = env.step(action)
        steps += 1
        if done:
            assert len(scores) == 4 and abs(sum(scores)) < 1e-9
            break
        assert mask.sum() >= 1
    assert steps <= 120


def test_obs_reuse_buffer():
    eng = DominoEngine(CFG)
    eng.reset(seed=0)
    buf = np.ones(204, dtype=np.float32) * 9.0
    out = encode_obs(eng, out=buf)
    assert out is buf
    assert np.array_equal(buf, encode_obs(eng))
