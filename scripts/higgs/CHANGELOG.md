# INIT-0: Higgs Domino Tampermonkey 脚本：在 web.topbos.com 上 hook Domino 对局，对接本地 `domimo.cli.serve` `/analyze` 自动出牌，并记录 `__dominoLog` 对局轨迹

> 记录文件：`scripts/higgs/tampermonkey.js` 的变更历史。  
> 约定：每条以 `# INIT-N:` / `# CHANGE-N:` 开头，一句话说明「做了什么 / 为什么」。

---

## 脚本做什么

- **目标站**：`https://web.topbos.com/`（Higgs Domino Web）
- **防调试**：阻断 `debugger`、恢复 console、多重心跳保护
- **协议 hook**：拦截 WebSocket / HTTP，解析发牌、出牌、过牌、结算
- **自动对局**：定位 `GameView` 后调用本地 AI（`POST /analyze`），执行 `play` / `pass`
- **轨迹日志**：`__dominoLog` 记录每局发牌、AI 决策、实际动作与结算

## 变更日志

### INIT-0（基线）

- 文件：`tampermonkey.js`
- 版本：`2026-07-25.2`
- 说明：当前仓库中的初始可用版本；后续修改请在本文件追加条目。

### CHANGE-1：修掉「play 失败：手牌 UI 中找不到 XX」——内存手牌与 UI 分叉

- 版本：`2026-07-26.1`
- 起因：对局 `g-ms1euhcm-uol1yc`（`#96`，S3，输 -10000000）中 AI 两次推荐 `56[5|6]`
  都出不掉。查库发现 `gameState.hand` 里的 `[5|6]` 在 UI / 服务器手牌里都不存在，
  且全桌「已出牌 + 终局手牌」比 28 张少了 `[5|6]`、`[0|6]` 两张，牌链有 7 次接不上。
- 改动：
  1. **手牌以 UI 为准**（`syncHandFromUi()`）：每次求解前用
     `m_pSelfHandCard.m_arrSpriteCard[].cCard` 校正 `gameState.hand`，
     幽灵牌当场清掉。发牌动画期间（本局还没出过牌且 UI 手牌更少）不裁剪。
     同一张牌的两种字节序视为相同，保留原字节序避免下游抖动。
  2. **不再丢帧**（`splitProtocolFrames()`）：长度字段不合法时改为 `i += 1` 继续找
     同步点，而不是 `break`。旧写法会把同一条消息里后面的 `13a0` 广播一起丢掉
     ——这正是漏收出牌广播、牌链对不上的来源。只有真·截断帧才停。
  3. **不抢别人的回合**（`canPlayNow()`）：座位改为优先信
     `syncMySeatFromClient()`，与 `turnSeat` 不一致时拒绝出牌。
     `HANDCARD_SEND` 可能是发牌动画给庄家留下的陈旧状态，据此抢出的牌会被服务器
     丢弃，而本地已把牌从 UI / hand 摘掉，此后一直对不上。
  4. **出牌确认与兜底**：新增 `pendingPlay`，收到自己的 `13a0` 才算确认；
     转手或超时仍未确认则告警并按 UI 校正。AI 指定的牌不在 UI 里时，
     用 `pickPlayableFromUi()` 改出一张确实能出的牌（优先问 `JudgeSendCard`，
     同样能出先扔点数大的），避免这一手白白让给客户端托管。
  5. **漏帧可见**：`applyPlay()` 中牌接不上两端时置 `gameState.desynced` 并告警。

### CHANGE-2：出牌调用栈默认静音，改为可回查

- 版本：`2026-07-26.2`
- 起因：`[Domino][CallStack] 捕获到 出牌/过牌(12a0)` 每出一张牌就打一次，
  早已完成定位使命，现在只是刷屏盖掉真正要看的日志。
- 改动：`printPlayCallStack()` 改名 `recordPlayCallStack()`，**默认只记录不打印**；
  `framesContainCmd()` 改成返回帧本身的 `findFrameByCmd()`，顺带从 12a0 载荷里
  解出这次是 PLAY 还是 PASS、出的哪张牌。最近 50 次存内存环形缓冲。
- 用法：`__dominoNet.playStacks(n)` 回查；`__dominoNet.playStackLog = true`
  恢复实时打印（游戏改版、需要重新定位业务出牌函数时用）；
  `__dominoNet.lastPlayStack` 保持不变。
