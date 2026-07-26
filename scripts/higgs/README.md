# Higgs Domino 网页版协议逆向 + 出牌接管

把 `web.topbos.com` 的多米诺（Gaple）对局接到本项目的 `domimo.cli.serve`
（`POST /analyze`）上，由 PIMC 搜索决定每一手怎么出。

> ⚠️ **与主项目定位的冲突**：仓库根 README 明确写了「不包含也不支持针对任何真钱平台的
> 自动化代打功能」。本目录的脚本与该声明相悖，属于协议逆向的实验记录。若要保持主项目
> 的对外定位，建议把本目录加入 `.gitignore`，至少不要提交 `index.6efa3.js`
> ——那是 443 KB 的第三方专有代码，既有版权风险也会撑大仓库。

## 目录内容

| 文件 | 大小 | 说明 |
|------|------|------|
| `tampermonkey.js` | 79 KB | 我们写的 Tampermonkey 用户脚本：抓包、解析协议、接管出牌、调 AI、记日志 |
| `index.6efa3.js` | 443 KB | **游戏自己的** Cocos Creator 业务包（第三方代码），从浏览器下载留作逆向参考 |
| `deobfuscate.js` | 1 KB | 还原上面那个包的字符串切片混淆，让 `grep` 能用 |
| `CHANGELOG.md` | — | `tampermonkey.js` 的变更历史，按 `INIT-N` / `CHANGE-N` 逐条追加 |

本文件讲**脚本怎么工作**（架构、协议、hook 点）；`CHANGELOG.md` 只记**改了什么**。
改动脚本时两边都要更新。

---

# 一、tampermonkey.js

一个自包含的用户脚本，装进 Tampermonkey 后在 `https://web.topbos.com/` 上运行。
全部逻辑在一个 IIFE 里，不引入任何外部依赖，通过 `unsafeWindow` 往页面挂三个调试 API。

## 快速开始

1. **起 AI 服务**（在仓库根目录）：

   ```bash
   python3 -m domimo.cli.serve      # 监听 0.0.0.0:8000
   ```

2. **装脚本**：Tampermonkey → 新建脚本 → 粘贴 `tampermonkey.js` 全文 → 保存。

   脚本头部已声明所需权限，其中 `@connect 127.0.0.1` 是跨域访问本地 AI 服务的前提：

   ```javascript
   // @grant  unsafeWindow, GM_download, GM_xmlhttpRequest
   // @connect 127.0.0.1, localhost
   // @run-at  document-start
   // @match   https://web.topbos.com/
   ```

3. **开局即自动打**。默认 `aiEnabled = true`、`autoPlay = true`，无需手动开关。
   控制台会打印每一手的 AI 建议与实际动作。

## 分层结构

脚本自上而下分成六层，越靠后越贴近业务：

| 行号 | 层 | 作用 |
|------|-----|------|
| 22–432 | 反反调试 / 控制台保护 | **既有代码，未改动**。见下文说明 |
| 434–566 | WebSocket 抓包 | hook `WebSocket`，把收发数据统一成字节数组 |
| 568–922 | 协议解析 + 对局状态机 | 拆帧、解命令、维护 `gameState` |
| 924–1108 | `__dominoLog` 对局日志 | 按局记录发牌/决策/动作/结算，可导出 |
| 1110–1438 | 出牌接管 | 复刻 Cocos 的完整出牌调用链 |
| 1440–1622 | AI 对接 | 组装 `/analyze` 请求、应用建议 |
| 1624–1795 | 控制台 API 安装 | 挂 `__dominoNet` / `__dominoLog` / `__wsLog` |
| 1797–1953 | WebSocket hook 与初始化 | 替换 `WebSocket`、启动各项保护 |

### 反反调试层（22–432 行）

这部分是接手时就存在的代码，目的是让 DevTools 在这个站点上可用——页面会反复
`console.clear()`、插 `debugger` 语句、覆盖 `console` 方法。手法包括：

- 劫持 `Function.prototype.constructor` 与 `window.Function`，拦截含 `debugger`
  或改写 `console` 的动态代码；
- 把原始 `console` / 定时器方法在闭包里存一份（`originalConsole`、`originalSetTimeout`
  等），后续所有输出都走这份副本，不受页面覆盖影响；
- 用 Web Worker 心跳、`MutationObserver`、ServiceWorker、`GM_setValue` 变更监听
  四条独立通道周期性调用 `restoreConsole()`，任意一条活着就能把控制台救回来。

> 这一层对协议逆向不是必需的，但没有它控制台会被清干净，什么都看不到。
> 如果你的环境不需要（比如换用 `mitmproxy` 抓包），可以整段删掉，
> 只保留 434 行往后的部分——注意保留 `originalConsole` 等常量定义。

## WebSocket 抓包与协议解析

### hook 方式

`hookWebSocket()`（1797 行）用一个 `PatchedWebSocket` 替换 `pageWindow.WebSocket`，
在 `send` 与 `message` 两侧各插一段：

```javascript
ws.send = function (data) {
    // 出牌瞬间同步抓栈（不能放进 Promise，否则栈已丢失）
    const u8 = dataToU8Sync(data);
    if (u8 && u8[0] === 0x03) {
        const playFrame = findFrameByCmd(u8, 0x12, 0xa0);
        if (playFrame) recordPlayCallStack(playFrame, new Error().stack);
    }
    resolvePayload(data).then((summary) => {
        logWs('→', sockId, String(url), summary, data);
        ingestWsBinary('→', summary);
    });
    return rawSend(data);
};
```

两个要点：

- **抓栈必须同步**。`recordPlayCallStack` 就是当初定位出牌函数的手段——在
  `send` 里立刻 `new Error().stack`，才能看到 `CallBackSendCard ← OnJLTouchEnd`
  这条业务调用链。挪进 `.then()` 就只剩 Promise 栈了。定位完成后它**默认只记录
  不打印**（否则每出一张牌都刷屏），最近 50 次留在内存里，
  `__dominoNet.playStacks()` 回查，`__dominoNet.playStackLog = true` 恢复实时打印。
- **协议解析与抓包记录解耦**。`ingestWsBinary()` 独立于 `logWs()` 调用，
  所以 `__wsLog` 关掉之后协议解析照常工作（见「日志系统」）。

### 帧格式

一个 TCP 包里可能粘着多个帧，`splitProtocolFrames()`（626 行）按长度字段切分。
16 字节头 + 变长 payload：

| 偏移 | 长度 | 含义 |
|------|------|------|
| 0 | 1 | 固定 `0x03`，用作帧起始标记 |
| 1 | 1 | 方向：`0x00` = C→S，`0x01` = S→C |
| 2–3 | 2 | **整帧长度**，大端 u16（含头） |
| 4–7 | 4 | 固定 `03 00 00 00` |
| 8–9 | 2 | 命令号，**小端 u16** |
| 10–15 | 6 | 保留/序号，未解析 |
| 16– | 变长 | payload |

> **关于命令号的字节序**：脚本里按大端读成 `0x10a0`、`0x13a0`，而游戏包里的枚举
> 实际是 `0xa010`、`0xa013`（见 `index.deobf.js:3064`）。也就是说线上是小端，
> 脚本的 `(frame[8] << 8) | frame[9]` 读出来的是字节序反过来的值。功能上等价
> （常量一致就行），但对照游戏源码时容易困惑，故记录在此。

### 命令表

命令号左列是脚本里用的（大端读法），右列是游戏包里的真实枚举名：

| 脚本常量 | 真实枚举（`EJL_MsgType`） | 方向 | payload 布局 |
|---|---|---|---|
| `0x10a0` | `DMINOJL_DEAL_CARDS_SERVER_MSG` = `0xa010` | S→C | `[0]` 庄家座位，`[1]` 张数 n，`[2..2+n]` 手牌 |
| `0x11a0` | `DMINOJL_SEND_CARDS_SERVER_MSG` = `0xa011` | S→C | `[0]` 当前该出牌的座位 |
| `0x12a0` | `DMINOJL_SEND_CARDS_REQ_MSG` = `0xa012` | C→S | `[0]` `cCardNum`，`[1]` `cCard`，`[2]` `cOriType` |
| `0x13a0` | `DMINOJL_SEND_CARDS_NOTICE_MSG` = `0xa013` | S→C | `[0]` 座位，`[1]` 张数，`[2]` 牌，`[3]` 方位 |
| `0x20a0` | `DMINOJL_GAME_RESULT_SERVER_MSG` = `0xa020` | S→C | 见下方结算包 |

出牌请求的第一个字节脚本里叫 `action`，其实是游戏结构体的 **`cCardNum`（出牌张数）**
——所以 `0` 天然表示过牌，`1` 表示出一张。这也解释了为什么过牌包是 `CallBackSendCard(0, 0, 0)`。

### 牌的编码

一字节装两个点数，高/低半字节各一个：`0x35` = `[3|5]`。`tileLabel()` 打印成
`35[3|5]` 的形式（前面是协议原始字节的十六进制，方便和抓包对照）。

`0xff` 是过牌占位。注意 `[0|0]` 编码为 `0x00`，与补零无法区分——结算包里
必须靠张数字段截断才能正确还原（下面会讲）。

### 结算包（`0x20a0`，payload 124 字节）

`parseResultPayload()`（1050 行）。这个布局是逐字节比对 7 局真实结算包推出来的：

| 偏移 | 长度 | 含义 |
|------|------|------|
| 0–3 | 4 | 标志位 |
| 4–67 | 64 | 8 个 int64（小端）；前 4 个是本局各座位输赢金额 |
| 68–71 | 4 | 各座位**剩余张数** |
| 72–99 | 28 | 各座位剩余手牌，每人 7 字节槽位，前部紧凑排列 |
| 100–123 | 24 | 其余字段（含底注等），未完全解析 |

**必须用张数截断手牌槽位**，否则 `[0|0]`（`0x00`）会被当成补零丢掉：

```javascript
return Array.from(payload.subarray(base, base + counts[s])).map(pairOf);
```

验证方式：7 局的金额都严格和为零，赢家都对得上（走空局是剩 0 张的那家，
封锁局是点数最小的那家）。**赔付倍数只有两档**——封锁局赢家 +3 底注 / 输家各 −1，
有人走空则翻倍（+6 / −2）。这个发现后来直接变成了 `domimo` 的
`PayoutModel` 与 `objective=ev`，详见仓库根 README 的「期望收益排序」一节。

## 对局状态机

`gameState`（593 行 `createGameState()`）：

```javascript
{
  mySeat, dealerSeat, turnSeat,
  hand,        // 我的手牌（协议字节数组）
  counts,      // 四家剩余张数
  board,       // 定向后的牌链 [[左点,右点], ...]，左→右
  leftEnd, rightEnd,
  history,     // [{seat, action, tile, side}]
  missingPips, // 四家因过牌被确认没有的点数（喂给 /analyze 的 missing）
  status,      // idle | playing | ended
}
```

两个值得说的实现细节：

**`attachTile()`（642 行）维护定向牌链。** 协议只给「牌 + 方位」，不给拼接后的朝向。
这个函数按当前两端点数决定翻不翻转，保证 `board` 从左到右首尾相接，
`/analyze` 才能直接吃。

**`missingPips` 是免费的对手信息。** 某家过牌，说明它当时两端的点数都没有：

```javascript
if (action === 0 || tile === 0xff) {
    if (gameState.leftEnd != null) {
        addMissingPip(seat, gameState.leftEnd);
        addMissingPip(seat, gameState.rightEnd);
    }
}
```

实测 47% 的决策带非空 `missing`，PIMC 的确定化抽样会用它排除不可能的发牌。

### 座位校准：踩过的坑

`mySeat` 是最容易出错的地方，曾导致「第一局能打，第二局就不动了」。协议里
**没有任何一个包直接告诉客户端自己坐几号位**，只能推断。现在是三重保险：

1. **发牌时强制清空**（712 行 `0x10a0` 分支）：`mySeat = null`、`gameViewRef = null`、
   `playInFlight = false`、`turnEpoch += 1`。不清的话会沿用上一局座位，永远对不上。
2. **`canPlayNow()` 以客户端状态为准**（1181 行）：真正可靠的信号是
   `m_pSelfHandCard.m_iSelfHandState === HANDCARD_SEND`。但这个状态**不能**单独用来
   反推座位：庄家发完牌它就被置位，若出牌权其实在别人手上，据此抢出的牌会被服务器
   丢弃。所以座位优先取 `syncMySeatFromClient()`，只有它拿不到时才退回 `turnSeat`；
   两者不一致时直接拒绝出牌。
3. **`syncMySeatFromClient()`**（1151 行）：从 `m_pPlayerInfo[1].GetServerTablePos()`
   读服务器座位。游戏里 `m_pPlayerInfo[1]` 恒为自己（索引 1 = 本人），
   见 `index.deobf.js:4539`。

出牌顺序是**座位号递减**（`2 → 1 → 0 → 3`），所以下家序列是
`[(me+3)%4, (me+2)%4, (me+1)%4]`（1296 行 `opponentSeatsInPlayOrder`）——
`opponent_hand_counts` 与 `missing` 都按这个顺序排，搞反了 AI 就在用错误的对手模型。

### 手牌同步：踩过的坑

`gameState.hand` 是纯粹从协议流推出来的，只要**漏收一个 `13a0`**，或者**出的牌没被
服务器接受**，它就会留下 UI 里并不存在的「幽灵牌」。症状是 AI 推荐了一张牌，
`dominoPlay()` 报 `play 失败：手牌 UI 中找不到 XX`，这一手于是白白让给客户端托管。

真实案例见 CHANGELOG 的 CHANGE-1：一局里 `[5|6]` 成了幽灵牌，全桌牌还少了两张，
牌链有 7 次接不上。现在的三道防线：

1. **求解前按 UI 校正**：`syncHandFromUi()` 拿
   `m_pSelfHandCard.m_arrSpriteCard[].cCard` 覆盖 `gameState.hand`。UI 是
   `findHandSprite()` 实际要搜的东西，以它为准，幽灵牌从哪来的都能清掉。
   注意发牌动画期间 UI 手牌是一张张长出来的，此时不能拿它去裁剪内存手牌。
2. **出牌要等确认**：`pendingPlay` 记下已乐观摘掉、还没等到自己 `13a0` 的那张牌；
   转手或 5 秒超时仍未确认就告警并重新按 UI 校正。
3. **漏帧要看得见**：`applyPlay()` 里牌接不上两端就置 `gameState.desynced` 并告警，
   而不是默默把 `PLAY?` 塞进 history。

`splitProtocolFrames()` 也修了一处丢帧：长度字段不合法时（载荷里恰好有 `0x03`）
原先直接 `break`，会把同一条消息里后面的 `13a0` 一起丢掉，现在改为继续找同步点。

## 出牌接管

这是整个脚本的核心。不模拟触摸事件，而是**直接复刻游戏自己的出牌调用链**。

`recordPlayCallStack` 当初抓到的栈是：

```
WebSock.Send ← NetNode.Send ← SendMsgToMainSocket
    ← CallBackSendCard (index.6efa3.js)
    ← OnJLTouchEnd     (index.6efa3.js)   ← 手指抬起
```

对照还原后的 `OnJLTouchEnd`（`index.deobf.js:4943`）可以看到，玩家出一张牌
实际会连着做三件事，缺一样客户端就会显示异常：

```javascript
this.m_pIGameCallBack.CallBackSendCard(N.cCard, 1, Q);         // 1. 发协议包
this.m_pSendCard.PlaySendCardAni(N.cCard, Q, U, false, 1,      // 2. 播放动画
    this.m_pIGameCallBack.GetPlayerUsePropID(1, 3));
this.RemoveCard(N.cCard);                                       // 3. 从手牌 UI 移除
```

`dominoPlay()`（1346 行）就是这三步的等价实现：

```javascript
gv.CallBackSendCard(tileByte, 1, ori);
if (gv.m_pSendCard && typeof gv.m_pSendCard.PlaySendCardAni === 'function') {
    const prop = typeof gv.GetPlayerUsePropID === 'function'
        ? gv.GetPlayerUsePropID(1, 3) : 0;
    gv.m_pSendCard.PlaySendCardAni(tileByte, ori, worldPos, false, 1, prop);
}
hand.RemoveCard(tileByte);
removeFromHand(tileByte);   // 同步我们自己的状态机，不等 13a0 广播
```

几个必要的配套处理：

- **牌字节必须以 UI 里的 `cCard` 为准**。`[3|5]` 和 `[5|3]` 在协议里是两个不同字节，
  `findHandSprite()` 两种都试，命中后用 `sprite.cCard` 覆盖入参，
  否则 `RemoveCard` 找不到对应精灵。
- **方位（`cOriType`）优先问游戏**。`inferSideFromHand()` 先调原生
  `hand.JudgeSendCard(tileByte)`，返回 `{bIfSend, cOriType}`：
  `0` = 接左端、`1` = 接右端、`2` = 两端都行（我们默认取左）。
  只有该函数不可用时才退回本地两端比对。
- **世界坐标**用于动画起点，从精灵节点
  `parent.convertToWorldSpaceAR(node.getPosition())` 取，失败则退回 `sprite.iX/iY`。
- **过牌**（`dominoPass()`，1414 行）优先调 `gv.OnTimeAutoPass()`
  ——就是倒计时到点自动过牌走的那条路；不可用时退回 `CallBackSendCard(0, 0, 0)`。

`findGameView()`（1231 行）负责拿到 GameView 实例：先用缓存的 `gameViewRef`，
失效则遍历 Cocos 场景树按特征字段（`m_pSelfHandCard`、`CallBackSendCard`）找。

## AI 对接

`exportStateForAi()`（1312 行）把 `gameState` 翻译成 `/analyze` 的请求体：

```javascript
{
  hand: [[5,6], [1,4], ...],        // 半字节拆成点数对
  board: [[6,3], [3,3], [3,5]],     // 定向牌链
  left: 6, right: 5,
  opponent_hand_counts: [6, 6, 6],  // 按出牌顺序（下家在前）
  missing: [[6], [], []],           // 同上顺序
  num_players: 4, hand_size: 7, max_pip: 6,
  simulations: 400, rollout: 'counting',
  consecutive_passes: 0,
  requestId: turnEpoch               // 仅本地用，服务端忽略
}
```

`opponent_hand_counts` 只在张数自洽时才带上（`sum === 28 - 手牌 - 桌面`），
避免服务端因约束不成立而退回宽松抽样。

### 并发控制

三个变量协同，避免「出两次牌」和「用过期建议出牌」：

| 变量 | 作用 |
|------|------|
| `turnEpoch` | 每次转手 +1。回复带回 `requestId`，不等于当前 epoch 就丢弃 |
| `playInFlight` | 本地已出牌、等服务器确认；5 秒超时自动解锁防卡死 |
| `aiRequestInFlight` + `aiRequestEpoch` | 同一 epoch 只求解一次，防重复请求 |

`applyAiSuggestion()`（1440 行）在执行前还会再查一次 `canPlayNow()`，
双重确认当下确实是自己的可出牌时机。

`requestAiSuggestHttp()`（1505 行）用 `GM_xmlhttpRequest` 发请求（普通 `fetch`
会被跨域拦），默认 6 秒超时。实测客户端到服务端的固定开销约 **135 ms**，
与计算量无关；服务端 400 sims 的中位耗时约 118 ms，开局首手最慢约 885 ms。
远低于游戏的出牌倒计时，是安全的。

## 日志系统

### `__dominoLog` — 对局轨迹（默认开启）

按局记录，用来事后回答「AI 说了什么 vs 我们做了什么 vs 最终输赢多少」：

```javascript
{
  gameId, startedAt, dealerSeat, mySeat,
  dealtHand: [[5,6], ...],
  decisions: [{                     // 每次轮到我们
    requestId, request,             // 发给 /analyze 的完整请求
    response: { best, ranking, ev, blocked_rate },
    latencyMs,
    executed: { action, tile, side },
    note: 'no-ai-decision'          // 无对应 AI 决策时才有
  }],
  moves: [...],                     // 全桌每一手（含对手），供拟合对手模型
  result: { money, counts, hands, pips }
}
```

API：

| 调用 | 作用 |
|------|------|
| `__dominoLog.summary()` | 战绩表：胜率、净收益、AI 执行率、均胜率、均 EV、最大延迟 |
| `__dominoLog.export()` | 导出 JSONL 字符串（一行一局） |
| `__dominoLog.download()` | 存成 `.jsonl` 文件 |
| `__dominoLog.copy()` | 复制到剪贴板 |
| `__dominoLog.games` / `.current` | 直接访问已完成 / 进行中的记录 |
| `__dominoLog.clear()` | 清空 |

上限 200 局（约 1 MB）。手动出牌或 AI 超时被客户端托管时会记
`note: 'no-ai-decision'`——这个标记很重要，能区分「AI 决策差」和「AI 根本没来得及」。

> 已知不足：被迫过牌（无合法牌）和「漏掉的回合」目前都记成 `no-ai-decision`，
> 要靠重放手牌才能区分。记录时直接标注当时有无合法牌会更好。
> 另外 `mySeat` 只在结算时写入，导出进行中的那局会是 `null`。

### `__wsLog` — 原始帧（**默认关闭**）

留着做协议考古用，默认不累积以省内存。协议解析不依赖它。

```javascript
__wsLog.enable();        // 开始记录原始帧
__wsLog.dump(50);        // 最近 50 条
__wsLog.exportText(100); // 复制友好的 hex 文本
__wsLog.disable();       // 关闭并清空
```

## 控制台 API 速查

```javascript
// —— 运行控制 ——
__dominoNet.aiEnabled = false;   // 停止 AI
__dominoNet.autoPlay = false;    // 只建议不自动出
__dominoNet.aiSimulations = 400; // 实测再高也不涨棋力，见下文
__dominoNet.aiHttpUrl = 'http://127.0.0.1:8000';
__dominoNet.aiTimeoutMs = 6000;
__dominoNet.askAi();             // 手动问一次

// —— 手动出牌 ——
__dominoNet.play(0x35);          // 出 [3|5]，方位自动判断
__dominoNet.play([3, 5], 1);     // 也接受点数对；1 = 接右端
__dominoNet.pass();

// —— 状态检查 ——
__dominoNet.getState();          // 当前 gameState
__dominoNet.exportState();       // 即将发给 /analyze 的请求体
__dominoNet.findGameView();      // Cocos GameView 实例

// —— 出牌调用栈（默认只记录不打印）——
__dominoNet.lastPlayStack;       // 最近一次出牌的调用栈
__dominoNet.playStacks(10);      // 回查最近 N 次（默认 10，最多留 50）
__dominoNet.playStackLog = true; // 恢复每次出牌实时打印
```

---

# 二、index.6efa3.js

**这不是我们写的代码**，是游戏自己的 Cocos Creator 业务包，从浏览器下载下来
留作逆向参考。443 KB / 6423 行（已被格式化过，原始是单行）。

## 混淆手法与还原

这个包的关键特征：**每个标识符和字符串都被切成 10 字符片段再拼接**。

```javascript
// 原始形态——直接 grep `GetServerTablePos` 零命中
this['m_pPlayerI' + 'nfo'][b6]['GetServerT' + 'ablePos']()
```

所以先跑一遍还原再搜：

```bash
node deobfuscate.js index.6efa3.js /tmp/index.deobf.js
rg -n "CallBackSendCard" /tmp/index.deobf.js
```

还原前后的命中数差异：

| 符号 | 还原前 | 还原后 |
|---|---|---|
| `CallBackSendCard` | 0 | 8 |
| `PlaySendCardAni` | 0 | 7 |
| `m_iSelfHandState` | 0 | 8 |
| `GetServerTablePos` | 0 | 12 |
| `m_pPlayerInfo` | 0 | 160 |

除此之外还有常规的十六进制字面量（`0x1` 代替 `1`）、
布尔取反（`!![]` = `true`，`![]` = `false`）、属性一律用字符串下标访问。
这些不影响搜索，看代码时习惯一下即可。

## 关键位置索引

行号均指**还原后**的 `/tmp/index.deobf.js`：

| 行 | 符号 | 说明 |
|---|---|---|
| 3064–3069 | `EJL_MsgType` | 协议命令枚举，权威来源 |
| 4639–4645 | `ESelfHandCardState` | `HANDCARD_NO=0`、`DEAL=1`、`NORMAL=2`、**`SEND=3`** |
| 2158 | `CallBackSendCard(cCard, cCardNum, cOriType)` | 组 `DMINOJL_SendCardsReq` 并发包 |
| 4943 | `OnJLTouchEnd(event)` | 玩家松手出牌的完整路径，我们照抄的就是这段 |
| 4709 | `JudgeSendCard(cCard)` | 判定能否出 + 方位，返回 `{bIfSend, cOriType}` |
| 4728 | `AutoSendCard()` | 托管自动出牌，含 `HANDCARD_SEND` 前置判断 |
| 2003 | `OnTimeAutoPass()` | 倒计时到点自动过牌（我们的 `pass` 走这条） |
| 5197 | `PlaySendCardAni(card, ori, worldPos, ...)` | 出牌动画 |
| 6245 | `RemoveCard(card)` | 从手牌 UI 移除 |
| 4539 | `GetServerTablePos()` | 玩家信息组件 → 服务器座位号 |
| 2401 | `CallBackAutoSendCard()` | 自动出最后一张的入口 |

## 客户端里的现成信息源

比自己维护状态更可靠的几个地方，`DoMinoJL_TableInfo.GetInstance()` 上有：

| 字段 | 含义 |
|---|---|
| `cBeginCardVal` | 桌面**左端**点数 |
| `cBackCardVal` | 桌面**右端**点数 |
| `iCardNum[]` | 各座位剩余张数 |
| `cFirstSendCard` | 是否首手（`-1` 表示空桌，任意牌可出） |
| `bIfAutoSendLastCard` | 是否自动出最后一张 |

我们的脚本目前自己从协议维护 `leftEnd` / `rightEnd` / `counts`。
直接读这些字段能少一层出错可能，是个可做的简化——不过现在两边一直是一致的，
没有实际问题。

`m_pPlayerInfo[]` 按**客户端视角**索引，`[1]` 恒为自己；
`GetServerTablePos()` 才是服务器座位号。这两套编号别混用。

---

# 三、已知结论与后续方向

基于 64 个真实决策局面 + 13 局完整对局做过的测量（细节见仓库根 README）：

- **加 sims 没用**。400 → 4000（10 倍算力）平均只多赚 0.21 个百分点胜率，
  88% 的情况本来就选对了。默认 400 足够，别调高——调高只会顶到出牌倒计时。
- **31% 的 `/analyze` 调用只有一个合法着法**，纯属白跑。客户端先算一遍合法着法、
  只有一个就直接出，能省掉三分之一请求。这个还没做。
- **瓶颈在 rollout 策略**（`counting` 启发式）对真人的建模偏差，而不是搜索预算。
  `__dominoLog` 的 `moves` 字段已经在记录全桌每一手，
  用真人牌谱拟合 rollout 是唯一一条能带来实质棋力提升的路。
- **结算包的赔付结构已经接进 AI**：封锁局赌注减半这一发现变成了
  `PayoutModel` 与 `objective=ev`（现在是 `/analyze` 的默认排序）。
  实测只改变 7% 的决策、平均每次决策 +0.004 底注，数学上更正确但收益很小。
- **盈亏平衡点正好是 25% 胜率**，PIMC 对 3×counting 是 32%，理论上是正期望；
  但单局收益标准差约 3 个底注，要 95% 置信度确认自己在赚钱需要约 180 局。
  十几局的连输完全在噪声内。
