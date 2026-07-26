# Domino Lab — 实验平台

Go (Iris) 后端 + React 前端的多米诺实验台：

- **单局可视化**：四人桌、棋盘、着法日志、人类可介入
- **每座位挂 Bot**：统一 HTTP Bot API
- **批量赛马**：N 局并发对打，输出胜率 / 均分 / fault

引擎在 Go 内实现（对齐仓库内 Python `DominoEngine` 规则），批量对局不经过 Python GIL。现有 Python 机器人通过 adapter 接入。

## 快速开始

```bash
# 依赖：Go 1.22+、Python3（已 pip install -e .）、Node 18+

chmod +x lab/scripts/*.sh
lab/scripts/dev.sh          # random_go + counting/greedy/random adapters + labd:8088

cd lab/web && npm install && npm run dev   # http://127.0.0.1:5173
```

停止：`lab/scripts/stop.sh`

健康检查：

```bash
curl -s http://127.0.0.1:8088/api/health
curl -s http://127.0.0.1:8088/api/bots
```

四 Bot 打 200 局：

```bash
curl -s http://127.0.0.1:8088/api/matches -H 'Content-Type: application/json' -d '{
  "seats": [
    {"bot_id":"counting"},
    {"bot_id":"greedy"},
    {"bot_id":"random_go"},
    {"bot_id":"random_py"}
  ],
  "n_games": 200,
  "concurrency": 4
}'
```

## 目录

```
lab/
  server/          # Go module domino/lab/server → cmd/labd
  web/             # Vite + React
  bots/
    python_adapter # python -m lab.bots.python_adapter --agent counting --port 9101
    random_go      # 纯 Go 随机 bot
  proto/bot-api.md # Bot 契约
  scripts/dev.sh
```

Bot 注册表：[`server/bots.yaml`](server/bots.yaml)。

## Bot API

见 [`proto/bot-api.md`](proto/bot-api.md)。要点：`GET /health`、`POST /act`，响应 `{"tile":[a,b],"side":"left|right|pass"}`。

Python adapter：

```bash
PYTHONPATH=lab:. python -m lab.bots.python_adapter --agent mc --n-sims 200 --port 9104
```

## 平台 API（labd）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 服务健康 |
| GET | `/api/bots` | 注册 bot + 在线探测 |
| POST | `/api/games` | 创建单局 `{seats, seed?}` |
| GET | `/api/games/:id` | 快照 |
| POST | `/api/games/:id/act` | 人类出牌 |
| GET | `/api/games/:id/ws` | SSE 实时推送 |
| POST | `/api/matches` | 批量赛 |
| GET | `/api/matches/:id` | 进度与胜率 |

## 长期演进（未实现，规划）

1. **持久化**：SQLite/Postgres 存对局 JSON、赛季、Elo  
2. **回放与 diff**：逐步高亮两 bot 分歧着法  
3. **开放注册**：动态注册 bot URL、版本、标签  
4. **更强 bot**：挂 `domino.cli.serve` / NN checkpoint / 外部参赛程序  
5. **分析面板**：校准曲线、位置胜率、堵死率  
6. **规则变体**：人数 / 手牌 / 计分开关  
7. **分布式 MatchRunner**：worker 池跑万级对局  

## 开发说明

```bash
cd lab/server && go test ./...
cd lab/server && go build -o bin/labd ./cmd/labd
cd lab/web && npm run build   # 产物可被 labd 静态托管（web/dist）
```
