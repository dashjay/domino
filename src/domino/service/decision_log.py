"""决策 JSONL 日志：请求 + MC 推荐 +（可选）实际出招 / 终局结果。

每行一条 JSON，便于事后算胜率、画校准曲线、定位系统性偏差。

记录类型：

- ``decision``：一次 ``/analyze`` 成功响应（含 request / best / ranking）
- ``feedback``：客户端回传实际出招或终局 ``won``（经 ``POST /feedback``）
"""

from __future__ import annotations

import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def request_id_of(payload: dict) -> Any:
    if "requestId" in payload:
        return payload["requestId"]
    return payload.get("request_id")


class DecisionLog:
    """线程安全的 JSONL append-only 日志。"""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    def _append(self, record: dict) -> None:
        line = json.dumps(record, ensure_ascii=False, separators=(",", ":"))
        with self._lock:
            with self.path.open("a", encoding="utf-8") as f:
                f.write(line + "\n")

    def log_decision(
        self,
        request: dict,
        result: dict,
        *,
        latency_ms: float,
    ) -> None:
        best = result.get("best")
        self._append(
            {
                "type": "decision",
                "ts": _utc_now_iso(),
                "latency_ms": round(latency_ms, 3),
                "request_id": request_id_of(request),
                "request": request,
                "best": best,
                "win_rate": None if best is None else best.get("win_rate"),
                "ranking": result.get("ranking"),
                "chosen": request.get("chosen"),
            }
        )

    def log_feedback(self, payload: dict) -> dict:
        """校验并写入 feedback；返回规范化后的记录（不含 ts 前可预览）。"""
        if not isinstance(payload, dict):
            raise ValueError("feedback 须为 JSON 对象")
        rid = request_id_of(payload)
        if rid is None:
            raise ValueError("feedback 须含 requestId（或 request_id）")
        chosen = payload.get("chosen")
        if "won" in payload:
            won = payload["won"]
            if won is not None and not isinstance(won, bool):
                raise ValueError("won 须为 bool 或 null")
        else:
            won = None
        if chosen is None and won is None and "game_id" not in payload:
            raise ValueError("feedback 至少提供 chosen / won / game_id 之一")
        record = {
            "type": "feedback",
            "ts": _utc_now_iso(),
            "request_id": rid,
            "chosen": chosen,
            "won": won,
            "game_id": payload.get("game_id"),
        }
        self._append(record)
        return record
