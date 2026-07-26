# Lab Bot HTTP API

所有座位 AI 实现同一接口。平台在轮到该座位时调用 `POST /act`；超时或非法着法将随机合法着并记 `fault`。

## `GET /health`

```json
{"ok": true, "name": "counting"}
```

## `POST /act`

请求（信息防火墙：不含他人手牌）：

```json
{
  "game_id": "g-...",
  "seat": 0,
  "hand": [[6,6],[3,4]],
  "board": [[3,5],[5,1]],
  "left": 3,
  "right": 1,
  "hand_sizes": [6,7,7,6],
  "missing": [[], [3], [], [1]],
  "consecutive_passes": 0,
  "legal": [{"tile":[3,4],"side":"left"}, {"tile":null,"side":"pass"}],
  "history": [{"seat":2,"tile":[3,5],"side":"left"}]
}
```

- `left` / `right`：开局为空桌时为 `null`
- `side`：`left` | `right` | `pass`
- `missing[i]`：座位 i 已因 PASS 确认没有的点数列表

响应：

```json
{"tile":[3,4],"side":"left"}
```

或

```json
{"tile":null,"side":"pass"}
```

与 `domino.cli.serve` 的 `/analyze` 不同：本接口只要着法，不要 ranking。
