import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBots, type BotInfo } from "../api/client";

export default function Home() {
  const [bots, setBots] = useState<BotInfo[]>([]);
  const [err, setErr] = useState("");

  const refresh = () => {
    listBots()
      .then(setBots)
      .catch((e) => setErr(String(e.message || e)));
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>实验大厅</h2>
        <p className="muted">
          单局可视化对战、每座位挂 HTTP Bot、批量赛马评估。后端 Iris + Go 引擎，
          机器人统一 <code>POST /act</code> 协议。
        </p>
        <div className="row">
          <Link to="/room">
            <button className="primary">开一局</button>
          </Link>
          <Link to="/batch">
            <button>批量赛</button>
          </Link>
          <button onClick={refresh}>刷新 Bot</button>
        </div>
        {err && <p style={{ color: "var(--bad)" }}>{err}</p>}
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>已注册 Bot</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>URL</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.reported_name || b.name}</td>
                <td className="muted">{b.base_url}</td>
                <td>
                  <span className={`pill ${b.online ? "on" : "off"}`}>
                    {b.online ? "online" : "offline"}
                  </span>
                </td>
              </tr>
            ))}
            {!bots.length && (
              <tr>
                <td colSpan={4} className="muted">
                  无 bot 或 labd 未启动
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
