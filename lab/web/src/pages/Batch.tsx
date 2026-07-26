import { useEffect, useState } from "react";
import {
  createMatch,
  getMatch,
  listBots,
  type BotInfo,
  type MatchState,
} from "../api/client";

export default function Batch() {
  const [bots, setBots] = useState<BotInfo[]>([]);
  const [seats, setSeats] = useState(["counting", "greedy", "random_go", "random_py"]);
  const [nGames, setNGames] = useState(200);
  const [concurrency, setConcurrency] = useState(4);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listBots().then(setBots).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!match || match.status === "done" || match.status === "error") return;
    const t = setInterval(() => {
      getMatch(match.id)
        .then(setMatch)
        .catch((e) => setErr(String(e.message || e)));
    }, 500);
    return () => clearInterval(t);
  }, [match?.id, match?.status]);

  const start = async () => {
    setBusy(true);
    setErr("");
    try {
      const m = await createMatch(
        seats.map((bot_id) => ({ bot_id })),
        nGames,
        concurrency
      );
      setMatch(m);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  };

  const pct = match ? Math.round((100 * match.done) / Math.max(1, match.n_games)) : 0;

  return (
    <>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>批量赛马</h2>
        <p className="muted">四个 Bot 对打 N 局，统计胜率与均分。</p>
        <div className="grid2">
          {seats.map((id, i) => (
            <div key={i} className="seat">
              <div className="row">
                <strong>S{i}</strong>
                <select
                  value={id}
                  onChange={(e) => {
                    const next = [...seats];
                    next[i] = e.target.value;
                    setSeats(next);
                  }}
                >
                  {bots.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id}
                      {!b.online ? " (offline)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <label className="muted">
            局数{" "}
            <input
              type="number"
              value={nGames}
              min={1}
              onChange={(e) => setNGames(Number(e.target.value))}
              style={{ width: 90 }}
            />
          </label>
          <label className="muted">
            并发{" "}
            <input
              type="number"
              value={concurrency}
              min={1}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              style={{ width: 70 }}
            />
          </label>
          <button className="primary" disabled={busy} onClick={start}>
            开始
          </button>
        </div>
        {err && <p style={{ color: "var(--bad)" }}>{err}</p>}
      </div>

      {match && (
        <div className="panel">
          <div className="row">
            <strong>{match.id}</strong>
            <span className="pill on">{match.status}</span>
            <span className="muted">
              {match.done}/{match.n_games}
            </span>
          </div>
          <div className="progress" style={{ margin: "10px 0" }}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <table>
            <thead>
              <tr>
                <th>座位</th>
                <th>Bot</th>
                <th>胜场</th>
                <th>胜率</th>
                <th>均分</th>
                <th>faults</th>
              </tr>
            </thead>
            <tbody>
              {match.seats.map((s, i) => (
                <tr key={i}>
                  <td>S{i}</td>
                  <td>{s.bot_id}</td>
                  <td>{match.wins[i]}</td>
                  <td>{(match.win_rates[i] * 100).toFixed(1)}%</td>
                  <td>{match.avg_scores[i].toFixed(2)}</td>
                  <td>{match.faults[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {match.error && (
            <p style={{ color: "var(--bad)" }}>{match.error}</p>
          )}
        </div>
      )}
    </>
  );
}
