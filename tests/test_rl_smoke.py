"""RL 管道冒烟测试。

阶段 3：mini 版表格 Q-learning ——
    如果最简单的表格法都学不出超过随机的策略，
    说明"环境 → 状态 → 动作 → 奖励 → 学习"链路有 bug，必须先修再上 PPO。
"""

import random

import numpy as np
import pytest

from domimo.agents import RandomAgent
from domimo.arena import run_match
from domimo.engine import DominoEngine
from domimo.mini.tabular_q import MINI_CONFIG, TabularQTrainer, state_key


def test_state_key_no_hidden_info():
    """状态键只含合法信息：改变对手手牌内容（同张数）不改变键。"""
    eng = DominoEngine(MINI_CONFIG)
    rng = random.Random(0)
    for seed in range(50):
        eng.reset(seed=seed)
        for _ in range(rng.randrange(0, 3)):
            if eng.is_over:
                break
            eng.step(rng.choice(eng.legal_actions_list()))
        if eng.is_over:
            continue
        p = eng.current_player
        k1 = state_key(eng, p)
        # 用未发的牌替换对手一张手牌（张数不变，公开信息不变）
        opp = 1 - p
        dealt = eng.hands[0] | eng.hands[1] | eng.played_mask
        undealt = [t for t in range(MINI_CONFIG.deck_size) if not (dealt >> t) & 1]
        opp_tiles = [t for t in range(MINI_CONFIG.deck_size) if (eng.hands[opp] >> t) & 1]
        if not undealt or not opp_tiles:
            continue
        eng.hands[opp] = (eng.hands[opp] & ~(1 << opp_tiles[0])) | (1 << undealt[0])
        assert state_key(eng, p) == k1


def test_q_learning_beats_random():
    """核心验收：50 万局自博弈后对 random 胜率 >= 65%。"""
    trainer = TabularQTrainer(seed=0)
    trainer.train(500_000)
    assert len(trainer.q) > 1000, "状态覆盖异常少，环境可能有 bug"

    agent = trainer.agent()
    r = run_match(
        [agent, RandomAgent(seed=1)],
        n_games=10_000,
        seed=777,
        config=MINI_CONFIG,
        n_workers=1,
    )
    wr = r.win_rates[0]
    assert wr >= 0.65, f"Q-learning 胜率仅 {wr:.2%}，RL 管道疑似有 bug"
    # 训练覆盖应基本完整：评估中几乎不该遇到未见状态
    assert agent.unseen_states < 50


@pytest.mark.slow
def test_q_learning_beats_counting_heuristic():
    """更强证据：学出的策略直接击败 counting 启发式（>50%）。"""
    from domimo.agents import CountingAgent

    trainer = TabularQTrainer(seed=0)
    trainer.train(500_000)
    r = run_match(
        [trainer.agent(), CountingAgent()],
        n_games=10_000,
        seed=999,
        config=MINI_CONFIG,
        n_workers=1,
    )
    assert r.win_rates[0] > 0.50, f"未能击败启发式: {r.win_rates[0]:.2%}"


# ---------------------------------------------------------------------------
# 阶段 4：PPO 管道冒烟
# ---------------------------------------------------------------------------

def test_rollout_batch_shapes_and_gae():
    """采样 batch 形状一致、mask 与动作合法、GAE 数值有限。"""
    import torch

    from domimo.config import GameConfig
    from domimo.env import obs_size
    from domimo.rl.model import DominoNet
    from domimo.rl.rollout import collect_rollout

    torch.manual_seed(0)
    cfg = GameConfig()
    model = DominoNet(obs_size(cfg), cfg.num_actions)
    b = collect_rollout(
        model.state_dict(), cfg, n_games=32, seed=0, n_parallel_envs=8
    )
    n = len(b.action)
    assert b.n_games == 32
    assert b.obs.shape == (n, obs_size(cfg))
    assert b.mask.shape == (n, cfg.num_actions)
    for arr in (b.logp, b.value, b.adv, b.ret):
        assert arr.shape == (n,)
        assert np.isfinite(arr).all()
    # 每个动作都必须在 mask 允许范围内
    assert all(b.mask[i, b.action[i]] == 1.0 for i in range(n))
    # 自博弈零和：4 座位共享策略，座位 0 均分应接近 0
    assert abs(b.mean_score_p0) < 6.0


@pytest.mark.slow
def test_ppo_smoke_learns_above_random():
    """小规模 PPO（8k 局）应把 vs random 胜率拉到 25% 基准之上。"""
    import shutil
    import tempfile

    from domimo.rl.ppo import PPOConfig
    from domimo.rl.train import TrainConfig, train, evaluate
    from domimo.rl.model import DominoNet
    from domimo.config import GameConfig
    from domimo.env import obs_size

    import torch

    out_dir = tempfile.mkdtemp(prefix="ppo_smoke_")
    try:
        cfg = TrainConfig(
            total_games=8192,
            games_per_iter=1024,
            n_workers=2,
            eval_every_iters=8,
            eval_games=400,
            out_dir=out_dir,
            seed=0,
            ppo=PPOConfig(),
        )
        best = train(cfg)
        ckpt = torch.load(best, map_location="cpu", weights_only=True)
        game_cfg = GameConfig()
        model = DominoNet(obs_size(game_cfg), game_cfg.num_actions)
        model.load_state_dict(ckpt["model"])
        wr, _ = evaluate(model, game_cfg, 2000, (256, 256, 128), "random")
        assert wr > 0.27, f"8k 局 PPO 后 vs random 仅 {wr:.2%}，训练管道疑似有 bug"
    finally:
        shutil.rmtree(out_dir, ignore_errors=True)
