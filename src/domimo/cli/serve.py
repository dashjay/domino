"""启动蒙特卡洛出牌建议 HTTP 服务。

用法：
    python3 -m domimo.cli.serve                       # 监听 0.0.0.0:8000
    python3 -m domimo.cli.serve --host 127.0.0.1 --port 9000

然后 POST JSON 到 /analyze，返回按胜率从高到低排序的出牌：
    curl -s localhost:8000/analyze -H 'Content-Type: application/json' -d '{
      "hand": [[6,6],[3,4],[1,5],[0,4],[2,2],[0,1],[5,6]],
      "board": [[3,5]], "simulations": 400, "rollout": "counting"}'
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
    return ap


def main(argv: list[str] | None = None) -> None:
    args = _build_parser().parse_args(argv)
    run_server(host=args.host, port=args.port)


if __name__ == "__main__":
    main()
