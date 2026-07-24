"""出牌建议 HTTP 服务：POST 桌面 + 手牌，返回按胜率降序的出牌排名。"""

from .app import analyze, build_handler, run_server

__all__ = ["analyze", "build_handler", "run_server"]
