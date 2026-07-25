"""启动蒙特卡洛出牌建议 HTTP 服务。

用法：
    python3 -m domino.cli.serve                       # 监听 0.0.0.0:8000
    python3 -m domino.cli.serve --host 127.0.0.1 --port 9000
    python3 -m domino.cli.serve --log domino-mc.jsonl # 决策 JSONL（默认开启）
    python3 -m domino.cli.serve --no-log              # 关闭 JSONL

然后 POST JSON 到 /analyze，返回按胜率从高到低排序的出牌：
    curl -s localhost:8000/analyze -H 'Content-Type: application/json' -d '{
      "hand": [[6,6],[3,4],[1,5],[0,4],[2,2],[0,1],[5,6]],
      "board": [[3,5]], "simulations": 400, "rollout": "counting"}'

出招后回传实际动作 / 终局结果（用于校准）：
    curl -s localhost:8000/feedback -H 'Content-Type: application/json' -d '{
      "requestId": 159, "chosen": {"tile":[1,5],"side_label":"left"}}'
    curl -s localhost:8000/feedback -H 'Content-Type: application/json' -d '{
      "requestId": 159, "won": true, "game_id": "g1"}'
"""

from __future__ import annotations

import argparse

from ..service.app import run_server


def _build_parser() -> argparse.ArgumentParser:
    ap = argparse.ArgumentParser(
        description="Domino 蒙特卡洛（PIMC）出牌建议 HTTP 服务",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument("--host", default="0.0.0.0", help="监听地址（默认 0.0.0.0）")
    ap.add_argument("--port", type=int, default=8000, help="监听端口（默认 8000）")
    ap.add_argument(
        "--log",
        default="domino-mc.jsonl",
        metavar="PATH",
        help="决策 JSONL 路径（默认 domino-mc.jsonl）",
    )
    ap.add_argument(
        "--no-log",
        action="store_true",
        help="关闭决策 JSONL",
    )
    return ap


def main(argv: list[str] | None = None) -> None:
    args = _build_parser().parse_args(argv)
    log_path = None if args.no_log else args.log
    run_server(host=args.host, port=args.port, log_path=log_path)


if __name__ == "__main__":
    main()
