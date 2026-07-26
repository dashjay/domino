# Domino Bot 四阶段计划：从 PIMC 基线到深度强化学习替换

## 0. 目标与边界

目标是在现有 `src/domino/` 代码之上，重新组织一个面向“不完全信息 / 信息不对称”场景的 domino 机器人路线：

1. 先做一个稳健、可解释、至少不明显输给现有启发式的 **启发式搜索 + 蒙特卡洛模拟机器人**，同时完整记录公开信息、信念状态、推荐动作、旁路结果和终局反馈。
2. 累积足够多的对局与决策数据后，训练一个 **深度学习 / 强化学习旁路机器人**，让它在不影响主决策的情况下与蒙特卡洛推荐持续对比。
3. 用同一套日志评估“深度学习是否真的提高胜率 / 期望收益 / 决策质量”，避免只凭训练曲线判断。
4. 当模型在离线与在线旁路评估中稳定超过主路后，再用深度学习模型替换蒙特卡洛主机器人；保留蒙特卡洛作为 fallback 和校验器。

本计划只做本地模拟、离线训练、服务端推荐与日志分析，不实现对真钱平台的自动操作、自动下注或界面代打。

## 1. 可复用的现有代码

现有仓库已经有一批可直接复用的基础件：

- `src/domino/engine.py`：规则引擎，状态推进、合法动作、终局判定。
- `src/domino/mc/pimc.py`：当前 PIMC 核心，已包含 `PublicState`、确定化抽样、rollout 统计、EV / win-rate 排序。
- `src/domino/agents/mc_agent.py`：PIMC agent 包装。
- `src/domino/agents/counting_agent.py`：记牌与堵牌启发式，可作为 rollout policy 和 baseline。
- `src/domino/service/decision_log.py`：JSONL 决策日志雏形。
- `src/domino/rl/`：已有 PPO / rollout / model / league 框架，可作为第二阶段训练管道的起点。
- `src/domino/cli/evaluate.py` 与 `src/domino/arena.py`：用于批量评估。

新的 `src/domino-bot/` 先作为方案、实验配置和后续 bot orchestration 的根目录；具体可复用实现仍引用 `src/domino/`，避免复制引擎和 agent。

## 2. 核心设计原则

### 2.1 信息防火墙

机器人决策只能看到当前玩家真实可见的信息：

- 自己手牌；
- 桌面两端；
- 已出牌；
- 各玩家剩余手牌数；
- pass 后推断出的缺数字；
- 历史动作序列；
- 对局规则与座位信息。

严禁使用模拟器中的对手真实手牌训练主路决策特征。训练标签可以来自自博弈终局结果，但模型输入必须保持同样的信息边界。

### 2.2 主路 / 旁路分离

阶段 1 和阶段 2 不让深度模型直接控制行动。线上决策返回：

- `primary_recommendation`：当前真正执行的 PIMC 推荐；
- `shadow_recommendation`：深度模型旁路推荐；
- `agreement`：二者是否一致；
- `delta`：二者在 win-rate / EV / value 上的差异；
- `chosen_action`：实际执行动作；
- `outcome`：终局反馈，后置补齐。

这样可以在不影响胜率的前提下收集“如果听模型的会怎样”的证据。

### 2.3 统一评估口径

每次模型晋级都必须同时看三类指标：

- 对固定 baseline 的模拟竞技场胜率：`random`、`greedy`、`counting`、当前 `mc`。
- 线上 / 半线上旁路 counterfactual 指标：模型建议与主路分歧时，后续结果是否更好。
- 按赔付表计算的 EV，而不仅是胜率。现有 `PayoutModel` 已支持走空局与堵死局收益不同。

## 3. 阶段一：PIMC + 启发式搜索主机器人

### 3.1 目标

实现一个稳健的 `SearchBot`：基于公开信息维护对手可能手牌分布，用确定化抽样 + rollout 模拟给每个合法动作打分；它先作为主路机器人，并负责生产高质量日志。

### 3.2 搜索结构

主流程：

1. 从当前局面构造 `PublicState`。
2. 生成合法动作集合 `A`。
3. 根据公开约束生成若干 `determinization`：
   - 未见牌 = 全牌集 - 自己手牌 - 已出牌；
   - 约束对手手牌数；
   - 约束 pass 暴露出的 missing pips；
   - 可选加入历史行为似然，例如“某玩家之前没有出某张可接牌”的弱约束。
4. 对每个候选动作在每个确定化世界中 rollout 到终局。
5. 按 `objective` 排序：
   - `win_rate`：纯胜率；
   - `ev`：按平台赔付表；
   - `risk_adjusted_ev`：`mean_ev - c * std`，用于减少高方差动作；
   - `block_control`：在劣势局主动提高堵死概率，延续当前 `PayoutModel` 中“堵死少输”的逻辑。

### 3.3 启发式增强

在纯 PIMC 之外增加轻量启发式，减少 rollout 噪声：

- **行动先验**：给候选动作一个先验分，进入排序时作为小权重项。
- **缺数字压制**：如果下家或多个对手公开缺某个端点，优先让桌面保持该端点。
- **手牌灵活性**：保留覆盖更多数字的牌，避免把自己打成单一花色。
- **危险数字规避**：若某数字剩余牌多且自己缺少控制牌，降低主动打开该端点的动作。
- **终局节奏**：当自己牌少且胜率高，偏向走空；当胜率低，偏向制造堵死。
- **置信度输出**：每个推荐动作记录样本数、均值、标准差、置信区间与最大竞争动作差距。

### 3.4 日志设计

把 `DecisionLog` 扩展为 append-only JSONL，至少包含：

```json
{
  "type": "decision",
  "schema_version": 2,
  "game_id": "...",
  "request_id": "...",
  "ts": "...",
  "seat": 0,
  "public_state": {
    "my_hand": 123,
    "played": 456,
    "left_end": 6,
    "right_end": 3,
    "hand_sizes": [5, 4, 6, 3],
    "missing_pips": [0, 4, 65, 0],
    "history_hash": "..."
  },
  "legal_actions": [0, 13, 56],
  "primary": {
    "agent": "pimc_v2",
    "action": 13,
    "objective": "ev",
    "ranking": []
  },
  "shadow": {
    "agent": "none",
    "action": null,
    "policy": null,
    "value": null
  },
  "latency_ms": 87.3
}
```

终局反馈单独写：

```json
{
  "type": "outcome",
  "schema_version": 2,
  "game_id": "...",
  "winner": 2,
  "scores": [-2, -2, 6, -2],
  "terminal_reason": "out",
  "final_hands": null
}
```

注意：`final_hands` 默认不记录，除非是本地模拟训练数据；真实隐藏信息日志中不应补录不可见手牌。

### 3.5 交付物

- `src/domino-bot/search_bot_design.md`：搜索机器人设计细化。
- `src/domino-bot/log_schema.md`：日志 schema 与版本迁移。
- 代码侧可新增：
  - `src/domino/agents/search_bot.py`
  - `src/domino/service/bot_runtime.py`
  - `src/domino/service/log_schema.py`

验收：

- 对 `counting_agent` 至少不显著劣于当前 `MCAgent`；
- 对 `random/greedy/counting` 有稳定评估报告；
- 每次推荐都能完整复盘“为什么选这步”。

## 4. 阶段二：深度学习 / 强化学习旁路机器人

### 4.1 目标

训练一个 `NeuralShadowBot`，先只做旁路推荐，不接管真实行动。它需要学习两类能力：

- 从公开信息估计当前动作的长期价值；
- 在 PIMC 样本不足或 rollout 偏差明显的局面给出不同建议。

### 4.2 数据来源

三类数据并行积累：

1. **自博弈模拟数据**：用 `engine.py` 大量生成，拥有完整终局标签，但训练输入仍只用公开信息。
2. **PIMC 专家数据**：把阶段一 `ranking` 转成监督信号，训练 policy imitation / value head。
3. **真实决策日志**：只含公开信息和最终输赢，作为分布校准与离线评估集。

### 4.3 模型结构

先从 MLP 起步，后续升级到序列模型：

- 输入：
  - 手牌 bitset；
  - 已出牌 bitset；
  - 桌面两端；
  - 各家手牌数；
  - missing pips 矩阵；
  - 最近 K 步动作历史；
  - 当前座位、leader、连续 pass 数；
  - 合法动作 mask。
- 输出：
  - `policy_logits[57]`：masked policy；
  - `value`：当前座位期望收益；
  - 可选 `belief_head`：预测每个对手持有每张未见牌的概率，用于增强可解释性。

第一版：

- `DominoNetV1 = MLP(256, 256, 128) + policy/value`
- loss = PPO loss + value loss + entropy + optional behavior cloning loss

第二版：

- `DominoNetV2 = action-history encoder + GRU/Transformer-lite + policy/value/belief`
- 用历史动作改善“同一公开牌面但历史不同”的信念估计。

### 4.4 训练路线

推荐顺序：

1. **Behavior Cloning warm start**：用 PIMC ranking 的 top action 训练 policy，先学会“像主路一样打”。
2. **Value pretraining**：用模拟终局收益训练 value head，降低 PPO 冷启动方差。
3. **PPO / self-play**：复用现有 `src/domino/rl/`，加入固定 baseline 与历史模型池。
4. **League training**：新模型、历史模型、`counting`、`mc` 混合，避免只会打自己。
5. **Shadow calibration**：冻结候选模型，在旁路日志上做校准，不让它直接控制行动。

### 4.5 旁路输出

每次主路决策时，旁路模型同步输出：

```json
{
  "agent": "nn_shadow_v1",
  "checkpoint": "models/domino_shadow_v1.pt",
  "action": 13,
  "policy": {"13": 0.42, "0": 0.31, "56": 0.02},
  "value": 0.18,
  "agreement_with_primary": true,
  "latency_ms": 3.8
}
```

验收：

- 旁路延迟低于 10ms 量级；
- 与 PIMC 一致率、分歧局面、分歧后的收益都可统计；
- 在竞技场中至少超过 `counting_agent`，并逐步逼近 / 超过当前 PIMC。

## 5. 阶段三：评估深度学习是否提升胜率

### 5.1 核心问题

不是“模型训练 loss 是否下降”，而是回答：

> 当 NN 与 PIMC 意见不一致时，听 NN 是否能提高胜率或 EV？

### 5.2 离线评估

对每条历史决策日志重放公开状态：

- PIMC 推荐动作；
- NN 推荐动作；
- 实际动作；
- 最终结果。

能直接比较的指标：

- `agreement_rate`：NN 与 PIMC 一致率；
- `disagreement_rate`：分歧率；
- `nn_policy_entropy`：模型不确定性；
- `primary_confidence_margin`：PIMC 第一名与第二名差距；
- `shadow_value_delta`：NN 认为自己动作比 PIMC 好多少；
- `outcome_by_bucket`：按上述 bucket 分组后的胜率 / EV。

注意：真实日志不能完美回答 counterfactual，因为我们不知道“如果当时出另一张”会怎样。因此离线只能做相关性分析。

### 5.3 模拟反事实评估

对日志中的公开状态，使用 belief sampler 生成多个可能世界，然后分别强制首步为：

- PIMC 推荐；
- NN 推荐；
- 实际动作；
- 随机合法动作。

之后用同一组 rollout policy 打到终局，计算 paired difference：

- `EV(NN) - EV(PIMC)`
- `WinRate(NN) - WinRate(PIMC)`
- `BlockedRate(NN) - BlockedRate(PIMC)`

paired setup 能降低方差：同一个公开状态、同一批确定化世界，只改第一步动作。

### 5.4 在线旁路 A/B 门槛

在不直接接管前，先定义晋级门槛：

- 离线竞技场：NN vs PIMC 胜率显著大于 50% 或四人混桌 EV 显著高于 PIMC。
- 旁路分歧局面：NN 建议在模拟反事实中 `EV delta > 0`，且 95% CI 不跨 0。
- 稳定性：连续 N 个 checkpoint 都满足，避免偶然。
- 安全性：NN 在低置信度局面可以让位给 PIMC，而不是强行输出。

阶段三交付物：

- `src/domino-bot/evaluation_protocol.md`
- `scripts/evaluate_shadow.py`
- `scripts/replay_decision_log.py`
- 每个 checkpoint 的评估报告。

## 6. 阶段四：深度模型替换蒙特卡洛主路

### 6.1 渐进式接管

不要一次性全量替换。采用 gate：

1. `mode=shadow`：只记录，不行动。
2. `mode=assist`：仅当 NN 与 PIMC 一致，或 PIMC 置信度低且 NN 置信度高时采用 NN。
3. `mode=hybrid`：NN 作为默认，PIMC 用于高风险 / 低置信度局面复核。
4. `mode=nn_primary`：NN 主路，PIMC fallback。

### 6.2 决策融合器

`DecisionRouter` 输入：

- `pimc_action`
- `pimc_margin`
- `pimc_ev`
- `nn_action`
- `nn_policy_prob`
- `nn_value`
- `state_features`
- `latency_budget_ms`

输出：

- 最终动作；
- 使用哪个 agent；
- 为什么切换；
- 是否需要记录为高价值训练样本。

建议规则：

- 如果 NN 和 PIMC 一致，直接出。
- 如果 PIMC margin 很高，优先 PIMC，除非 NN 历史上在该 bucket 明显更强。
- 如果 PIMC margin 低且 NN policy prob 高，允许 NN 接管。
- 如果 NN entropy 高，退回 PIMC。
- 如果超时，使用最快可用动作：NN 通常更快，PIMC 可异步补日志。

### 6.3 替换验收

只有满足以下条件才切到 `nn_primary`：

- 离线竞技场：NN 在固定种子集上稳定高于 PIMC。
- 旁路日志：分歧局面中 NN 的反事实 EV 显著更好。
- 回归测试：信息防火墙测试、合法动作 mask 测试、无隐藏牌泄露测试全部通过。
- 延迟：P95 推理延迟低于目标，例如 20ms；PIMC fallback 不拖慢主流程。
- 可回滚：配置一键退回 `pimc_primary`。

## 7. 建议目录结构

```text
src/domino-bot/
├── PLAN.md
├── search_bot_design.md
├── log_schema.md
├── evaluation_protocol.md
├── experiments/
│   ├── pimc_v2.yaml
│   ├── shadow_bc_v1.yaml
│   ├── shadow_ppo_v1.yaml
│   └── router_hybrid_v1.yaml
├── reports/
│   └── README.md
└── notes/
    └── papers.md
```

代码仍建议放在 import 友好的 `src/domino/` 下：

```text
src/domino/
├── agents/
│   ├── search_bot.py
│   ├── shadow_bot.py
│   └── routed_bot.py
├── bot/
│   ├── belief.py
│   ├── features.py
│   ├── router.py
│   └── metrics.py
├── service/
│   ├── bot_runtime.py
│   └── log_schema.py
└── rl/
    ├── bc.py
    ├── datasets.py
    └── shadow_train.py
```

## 8. 论文与方法参考

这些论文都不是“完美信息棋类”路线，而是更接近 domino 的隐藏信息 / 信息不对称 / 不完全信息博弈。

1. Peter I. Cowling, Edward J. Powley, Daniel Whitehouse, **Information Set Monte Carlo Tree Search**, IEEE TCIAIG, 2012.  
   链接：https://eprints.whiterose.ac.uk/id/eprint/75048/  
   用处：PIMC / ISMCTS 如何在隐藏信息游戏中搜索。它也提醒我们 determinization 会有 strategy fusion 等问题，所以阶段一要记录置信度，阶段二不能只盲目模仿 PIMC。

2. Michael Buro et al., **Recursive Monte Carlo Search for Imperfect Information Games**, 2013.  
   链接：https://skatgame.net/mburo/ps/recmc13.pdf  
   用处：讨论 PIMC 在纸牌类游戏中的问题，以及如何用更真实的 playout 缓解“把不同隐藏世界里的最优策略混在一起”的偏差。

3. Matej Moravcik et al., **DeepStack: Expert-Level Artificial Intelligence in Heads-Up No-Limit Poker**, Science, 2017.  
   链接：https://arxiv.org/pdf/1701.01724  
   用处：核心启发是“当前局面重解 + 学出来的 value intuition”。我们的阶段二可把 NN value 作为 PIMC 的旁路价值估计，后续再走 hybrid。

4. Noam Brown, Tuomas Sandholm, **Superhuman AI for heads-up no-limit poker: Libratus beats top professionals**, Science, 2017.  
   链接：https://www.science.org/doi/10.1126/science.aao1733  
   用处：强调大规模不完全信息博弈中，预先策略、子博弈求解、赛后修补缺口的组合路线。对应我们的“主路 + 旁路 + 日志复盘 + 渐进替换”。

5. Noam Brown, Tuomas Sandholm, **Safe and Nested Subgame Solving for Imperfect-Information Games**, NeurIPS, 2017.  
   链接：https://arxiv.org/pdf/1705.02955  
   用处：说明在隐藏信息博弈中局部重解不能随便贪，需要考虑对手可选策略与 exploitability。对应阶段四的 router gate：只有证据充分才让 NN 接管。

6. Noam Brown, Adam Lerer, Sam Gross, Tuomas Sandholm, **Deep Counterfactual Regret Minimization**, ICML, 2019.  
   链接：https://proceedings.mlr.press/v97/brown19b.html  
   用处：用神经网络近似 CFR，适合大信息集不完全信息游戏。不是第一版必做，但如果 PPO 上限明显，Deep CFR / NFSP 是后续升级方向。

## 9. 近期实现顺序

第一批任务建议如下：

1. 写 `log_schema.md`，确定 schema v2，扩展 `DecisionLog`。
2. 写 `search_bot.py`，在当前 `MCAgent` 基础上加入 risk-adjusted EV、置信度、行动先验和详细 ranking。
3. 写 `bot/features.py`，统一 PIMC、NN、日志复盘使用的公开信息特征。
4. 写 `datasets.py`，从 JSONL 日志和模拟对局生成训练样本。
5. 写 `shadow_bot.py`，加载模型并在服务接口中旁路输出。
6. 写 `evaluate_shadow.py`，完成阶段三最重要的分歧局面评估。
7. 最后写 `router.py`，在证据足够后从 shadow 切到 assist/hybrid/nn_primary。

## 10. 当前最小可执行里程碑

M0 文档落地：

- `src/domino-bot/PLAN.md` 存在；
- 明确四阶段路线；
- 明确搜索机器人、日志、旁路模型、评估和替换门槛；
- 明确相关不完全信息博弈论文。

M1 搜索主路：

- `SearchBot` 可通过 CLI evaluate；
- 日志能完整记录每次推荐；
- 与当前 `MCAgent` 做 20k 局对比，无显著退化。

M2 NN 旁路：

- 训练出 `shadow_v1.pt`；
- 服务返回 PIMC + NN 双推荐；
- 生成第一版旁路对比报告。

M3 引入收益判断：

- 有固定 replay 集；
- 每个 checkpoint 自动产出 win-rate / EV / disagreement bucket 报告；
- 至少一个模型在分歧局面的 paired EV 上显著优于 PIMC。

M4 替换：

- `DecisionRouter(mode=nn_primary)` 可用；
- PIMC 保留 fallback；
- 配置可一键回滚。
