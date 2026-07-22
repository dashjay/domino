"""RL 管道冒烟测试。

阶段 3：mini 版表格 Q-learning ——
    如果最简单的表格法都学不出超过随机的策略，
    说明"环境 → 状态 → 动作 → 奖励 → 学习"链路有 bug，必须先修再上 PPO。
"""

import random

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
