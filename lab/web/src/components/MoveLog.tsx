import type { GameState } from "../api/client";

export default function MoveLog({ game }: { game: GameState }) {
  return (
    <div className="panel">
      <div className="muted" style={{ marginBottom: 6 }}>
        着法日志
      </div>
      <div className="log">
        {game.history.length === 0 && <div>（尚无着法）</div>}
        {game.history.map((h, i) => (
          <div key={i}>
            #{i} S{h.seat}{" "}
            {h.side === "pass"
              ? "PASS"
              : `[${h.tile?.[0]}|${h.tile?.[1]}] →${h.side}`}
          </div>
        ))}
      </div>
    </div>
  );
}
