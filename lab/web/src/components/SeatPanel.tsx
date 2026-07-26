import type { GameState, Tile } from "../api/client";
import TileView from "./TileView";

type Props = {
  game: GameState;
  seat: number;
  onPlay?: (tile: Tile, side: string) => void;
};

export default function SeatPanel({ game, seat, onPlay }: Props) {
  const active = !game.is_over && game.current_player === seat;
  const hand = game.hands[seat];
  const label = game.seats[seat]?.type === "bot"
    ? `Bot:${game.seats[seat].bot_id}`
    : "Human";

  const legalFor = (tile: Tile) =>
    game.legal.filter(
      (m) =>
        m.tile &&
        ((m.tile[0] === tile[0] && m.tile[1] === tile[1]) ||
          (m.tile[0] === tile[1] && m.tile[1] === tile[0]))
    );

  return (
    <div className={`seat${active ? " active" : ""}`}>
      <div className="row">
        <strong>S{seat}</strong>
        <span className="muted">{label}</span>
        <span className="muted">×{game.hand_sizes[seat]}</span>
        {active && <span className="pill on">回合</span>}
        {game.is_over && game.winner === seat && (
          <span className="pill on">胜</span>
        )}
      </div>
      {hand && (
        <div className="hand">
          {hand.map((t, i) => {
            const opts = active && onPlay ? legalFor(t) : [];
            return (
              <TileView
                key={i}
                tile={t}
                playable={opts.length > 0}
                onClick={() => {
                  if (!onPlay || !opts.length) return;
                  onPlay(opts[0].tile as Tile, opts[0].side);
                }}
              />
            );
          })}
        </div>
      )}
      {!hand && <div className="muted">手牌隐藏</div>}
    </div>
  );
}
