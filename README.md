# domimo — 双六多米诺（Gaple）AI

从零实现的多米诺骨牌（4 人、每人 7 张、无摸牌堆的阻塞式 Gaple）游戏引擎、
启发式基线机器人与 PPO 自博弈强化学习训练管道。

> 本项目为游戏 AI 研究项目：模拟、训练、离线评估、人机对战全部在本地模拟器中完成，
> 不包含也不支持针对任何真钱平台的自动化代打功能。

## 快速开始

```bash
pip install -e .                                # 基础依赖（numpy/tqdm）
pip install torch --index-url https://download.pytorch.org/whl/cpu   # RL 需要
pip install pytest                              # 测试需要

python3 -m pytest tests/ -q                     # 全量测试（66 个，含RL冒烟约1分钟）
```

## 和 AI 对战

```bash
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt   # 对战最强模型（默认 curses TUI）
python3 -m domimo.cli.play --opponents counting                # 对战记牌启发式
python3 -m domimo.cli.play --opponents counting --ui plain     # 行模式（SSH/非全屏也可用）
```

常用参数：

```bash
# 座位 / 种子 / AI 出牌停顿 / 无牌自动 PASS
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt \
    --seat 0 --seed 42 --delay 0.4 --auto-pass

# 对手附加参数：counting 权重、nn 是否贪心
python3 -m domimo.cli.play --opponents counting,w_stuck_next=90,w_pip=2.0
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt,greedy=0

# 三个对手各用不同策略（座位 1/2/3）
python3 -m domimo.cli.play --opponents counting greedy nn:models/ppo_best.pt
```

TUI 键位：`↑↓`/`jk` 选招，`Enter` 确认，数字快捷键，`p` PASS，`a` 切换自动 PASS，`q` 退出。

## 评估棋力

```bash
python3 -m domimo.cli.evaluate --agents nn:models/ppo_best.pt counting counting counting -n 20000
python3 -m domimo.cli.evaluate --agents counting greedy random random -n 20000 --workers 4
```

## 训练

```bash
# mini 版表格 Q-learning（验证管道，~20 秒）
python3 scripts/train_mini_q.py

# PPO 自博弈（50 万局约 30 分钟 / 4 核 CPU）
python3 -m domimo.rl.train --total-games 500000 --out runs/my_run \
    --entropy-coef 0.02 --entropy-anneal-to 0.005 --lr-anneal \
    --opponent-mix 0.5 --league --reward-mode mixed
# 热启动微调
python3 -m domimo.rl.train --init-from runs/my_run/best.pt ...
```

## 棋力现状（2 万局评估，95% CI ±0.6%）

| 对阵 | 胜率（随机基准 25%） |
|------|---------------------|
| ppo_best vs 3×random | **39.3%** |
| counting vs 3×random | 39.0% |
| ppo_best vs 3×counting | 26.0%（均分 +0.72/局，全桌最高） |
| 混合桌 ppo_best / counting / greedy / random | **35.8%** / 28.7% / 17.5% / 18.0% |

## 项目结构

```
src/domimo/
├── tiles.py / config.py / engine.py   # 位图规则引擎（单核 1.2 万局/秒，规则全可配）
├── env.py                             # 204 维观测编码 + 合法动作 mask
├── agents/                            # random / greedy / counting(超几何记牌) / nn
├── arena.py                           # 多进程竞技场（胜率/CI/Elo，座位轮换）
├── mini/tabular_q.py                  # 双三缩小版表格 Q-learning（管道验证）
├── rl/                                # DominoNet + PPO + 锁步自博弈采样 + League
└── cli/                               # play（人机对战）/ evaluate（评估）
docs/PLAN.md                           # 实施计划与各阶段实测结果
```

详细设计、验收数据与训练迭代记录见 [docs/PLAN.md](docs/PLAN.md)。
