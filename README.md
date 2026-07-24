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
python3 -m domimo.cli.play --opponents mc                       # 对战蒙特卡洛(PIMC)最强机器人
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt    # 对战 PPO 模型（默认 curses TUI）
python3 -m domimo.cli.play --opponents counting                # 对战记牌启发式
python3 -m domimo.cli.play --opponents counting --ui plain      # 行模式（SSH/非全屏也可用）
```

## 蒙特卡洛出牌建议（PIMC）

深度学习（PPO）在本项目里胜率长期卡在约 26%（对 3×counting），效果不理想。
`mc` 机器人改用 **确定化蒙特卡洛（Perfect Information Monte Carlo, PIMC）**：
对「未见牌如何分布在对手手里」反复随机假设（满足各家张数与 pass 推断出的缺数字约束），
每种假设逐局模拟到终局，直接统计**每一步出牌的真实胜率**并从高到低排序。

免训练、可解释、与胜率目标直接对齐，是目前最强的机器人（见下表）。

### HTTP 出牌建议服务

```bash
python3 -m domimo.cli.serve                       # 监听 0.0.0.0:8000
python3 -m domimo.cli.serve --host 127.0.0.1 --port 9000
```

POST JSON 到 `/analyze`（`GET /health` 健康检查、`GET /` 首页说明）：

```bash
curl -s localhost:8000/analyze -H 'Content-Type: application/json' -d '{
  "hand":  [[6,6],[3,4],[1,5],[0,4],[2,2],[0,1],[5,6]],
  "board": [[3,5]],
  "simulations": 400,
  "rollout": "counting"
}'
```

请求字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| `hand` | 是 | 自己的手牌，每张写作 `[a, b]`（也支持 `"a\|b"`） |
| `board` | 否 | 桌面按连接顺序排列的牌链，用于推断两端点数与已出牌集合；留空=开局 |
| `left` / `right` | 否 | 显式指定桌面两端点数（优先于从 `board` 推断） |
| `played` | 否 | 只给已出牌集合（无序）时用，需配合 `left` / `right` |
| `opponent_hand_counts` | 否 | 按出牌顺序（下家在前）各对手剩余张数；省略则把未见牌均分 |
| `missing` | 否 | 按出牌顺序，各对手已确认没有的点数列表（来自 pass 推断） |
| `simulations` / `rollout` / `seed` | 否 | PIMC 抽样次数（默认 400）、模拟策略（`counting`/`greedy`/`random`）、随机种子 |

响应体 `ranking` 按胜率从高到低排序，每项含 `tile` / `side_label`（left/right/pass）/
`win_rate` / `tie_rate` / `mean_score` / `wins` / `plays`，`best` 为最佳出牌。

常用参数：

```bash
# 座位 / 种子 / AI 出牌停顿 / 无牌自动 PASS
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt \
    --seat 0 --seed 42 --delay 0.4 --auto-pass

# 对手附加参数：mc 抽样次数与模拟策略、counting 权重、nn 是否贪心
python3 -m domimo.cli.play --opponents mc,n_sims=400,rollout=counting
python3 -m domimo.cli.play --opponents counting,w_stuck_next=90,w_pip=2.0
python3 -m domimo.cli.play --opponents nn:models/ppo_best.pt,greedy=0

# 三个对手各用不同策略（座位 1/2/3）
python3 -m domimo.cli.play --opponents counting greedy nn:models/ppo_best.pt
```

TUI 键位：`↑↓`/`jk` 选招，`Enter` 确认，数字快捷键，`p` PASS，`a` 切换自动 PASS，`q` 退出。

## 评估棋力

```bash
python3 -m domimo.cli.evaluate --agents mc counting counting counting -n 1200 --workers 4
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

## 棋力现状（随机基准 25%）

| 对阵 | 胜率 |
|------|------|
| **mc vs 3×random**（PIMC，counting 模拟，1200 局，95% CI） | **44.2%** [41.4%, 47.0%] |
| **mc vs 3×counting**（PIMC，counting 模拟，1200 局，95% CI） | **32.0%** [29.4%, 34.6%]（均分 +3.4/局，全桌最高） |
| ppo_best vs 3×random（2 万局） | 39.3% |
| counting vs 3×random（2 万局） | 39.0% |
| ppo_best vs 3×counting（2 万局） | 26.0% |

> 蒙特卡洛（`mc`）显著超过 PPO 与 counting：对 3×counting 从 PPO 的 26% 提升到 **32%**，
> 对 3×random 从 39% 提升到 **44%**。代价是每步需在线模拟（默认吞吐约 17 局/秒 / 4 核）。

## 项目结构

```
src/domimo/
├── tiles.py / config.py / engine.py   # 位图规则引擎（单核 1.2 万局/秒，规则全可配）
├── env.py                             # 204 维观测编码 + 合法动作 mask
├── agents/                            # random / greedy / counting(超几何记牌) / nn / mc(蒙特卡洛PIMC)
├── mc/pimc.py                         # PIMC：确定化抽样 + 局面模拟 + 逐动作胜率排序
├── arena.py                           # 多进程竞技场（胜率/CI/Elo，座位轮换）
├── mini/tabular_q.py                  # 双三缩小版表格 Q-learning（管道验证）
├── rl/                                # DominoNet + PPO + 锁步自博弈采样 + League
├── service/                           # 出牌建议 HTTP 服务（POST /analyze）
└── cli/                               # play（人机对战）/ evaluate（评估）/ serve（HTTP 服务）
docs/PLAN.md                           # 实施计划与各阶段实测结果
```

详细设计、验收数据与训练迭代记录见 [docs/PLAN.md](docs/PLAN.md)。
