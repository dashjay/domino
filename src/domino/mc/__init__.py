"""蒙特卡洛（Perfect Information Monte Carlo, PIMC）出牌搜索。

给定「桌面牌局 + 自己手牌」等公开信息，对每个可行出牌做多次「确定化」抽样
（把未见牌随机发给对手，满足各家手牌数与 pass 推断出的缺数字约束），
逐局模拟到终局，统计每个出牌的胜率并从高到低排序。
"""

from .pimc import ActionStat, PIMCConfig, PublicState, rank_actions

__all__ = ["ActionStat", "PIMCConfig", "PublicState", "rank_actions"]
