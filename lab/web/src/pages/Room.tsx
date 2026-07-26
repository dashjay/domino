import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  actGame,
  createGame,
  getGame,
  listBots,
  subscribeGame,
  type BotInfo,
  type GameState,
  type SeatConfig,
  type Tile,
} from "../api/client";
import Board from "../components/Board";
import MoveLog from "../components/MoveLog";
import SeatPanel from "../components/SeatPanel";

const emptySeats = (): SeatConfig[] => [
  { type: "bot", bot_id: "counting" },
  { type: "bot", bot_id: "greedy" },
  { type: "bot", bot_id: "random_go" },
  { type: "human" },
];

export default function Room() {
  const { id } = useParams();
  const nav = useNavigate();
  const [bots, setBots] = useState<BotInfo[]>([]);
  const [seats, setSeats] = useState<SeatConfig[]>(emptySeats);
  const [game, setGame] = useState<GameState | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listBots().then(setBots).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!id) return;
    getGame(id, -1)
      .then(setGame)
      .catch((e) => setErr(String(e.message || e)));
    return subscribeGame(id, (_ev, data) => setGame(data));
  }, [id]);

  const humanSeat = useMemo(() => {
    if (!game) return -1;
    return game.seats.findIndex((s) => s.type === "human");
  }, [game]);

  const start = async () => {
    setBusy(true);
    setErr("");
    try {
      const g = await createGame(seats);
      nav(`/room/${g.id}`);
      setGame(g);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const play = async (tile: Tile, side: string) => {
    if (!game) return;
    try {
      const g = await actGame(game.id, tile, side);
      setGame(g);
    } catch (e: any) {
      setErr(String(e.message || e));
    }
  };

  const pass = async () => {
    if (!game) return;
    try {
      const g = await actGame(game.id, null, "pass");
      setGame(g);
    } catch (e: any) {
      setErr(String(e.message || e));
    }
  };

  const setSeat = (i: number, patch: Partial<SeatConfig>) => {
    setSeats((prev) => {
      const next = prev.map((s) => ({ ...s }));
      next[i] = { ...next[i], ...patch };
      if (next[i].type === "human") delete next[i].bot_id;
      if (next[i].type === "bot" && !next[i].bot_id) {
        next[i].bot_id = bots[0]?.id || "random_go";
      }
      return next;
    });
  };

  return (
    <>
      {!id && (
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>配置座位</h2>
          <div className="grid2">
            {seats.map((s, i) => (
              <div key={i} className="seat">
                <div className="row">
                  <strong>S{i}</strong>
                  <select
                    value={s.type}
                    onChange={(e) =>
                      setSeat(i, { type: e.target.value as "human" | "bot" })
                    }
                  >
                    <option value="human">Human</option>
                    <option value="bot">Bot</option>
                  </select>
                  {s.type === "bot" && (
                    <select
                      value={s.bot_id}
                      onChange={(e) => setSeat(i, { bot_id: e.target.value })}
                    >
                      {bots.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id}
                          {!b.online ? " (offline)" : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="primary" disabled={busy} onClick={start}>
              开始对局
            </button>
          </div>
        </div>
      )}

      {err && (
        <div className="panel" style={{ color: "var(--bad)" }}>
          {err}
        </div>
      )}

      {game && (
        <>
          <div className="panel">
            <div className="row">
              <strong>{game.id}</strong>
              <span className="muted">seed={game.seed}</span>
              {game.is_over ? (
                <span className="pill on">
                  结束 · {game.blocked ? "堵死" : "走空"} · 胜 S{game.winner}
                </span>
              ) : (
                <span className="pill on">进行中 · S{game.current_player}</span>
              )}
              {humanSeat >= 0 &&
                !game.is_over &&
                game.current_player === humanSeat &&
                game.legal.some((m) => m.side === "pass") && (
                  <button onClick={pass}>PASS</button>
                )}
            </div>
            <Board board={game.board} />
            <div className="muted" style={{ marginTop: 8 }}>
              两端 {game.left ?? "-"} | {game.right ?? "-"} · 连续过牌{" "}
              {game.consecutive_passes}
            </div>
          </div>

          <div className="grid2">
            {[0, 1, 2, 3].map((seat) => (
              <SeatPanel
                key={seat}
                game={game}
                seat={seat}
                onPlay={
                  humanSeat === seat &&
                  game.current_player === seat &&
                  !game.is_over
                    ? play
                    : undefined
                }
              />
            ))}
          </div>

          {game.is_over && game.scores && (
            <div className="panel">
              <div className="muted">得分 / 剩余点数</div>
              <table>
                <thead>
                  <tr>
                    <th>座位</th>
                    <th>得分</th>
                    <th>剩余点</th>
                    <th>faults</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td>S{i}</td>
                      <td>{game.scores![i].toFixed(1)}</td>
                      <td>{game.pip_sums[i]}</td>
                      <td>{game.faults[i]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <MoveLog game={game} />
        </>
      )}
    </>
  );
}
