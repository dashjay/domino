import { Link, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Batch from "./pages/Batch";

export default function App() {
  return (
    <div className="shell">
      <nav className="nav">
        <h1>Domino Lab</h1>
        <div className="links">
          <Link to="/">大厅</Link>
          <Link to="/room">单局</Link>
          <Link to="/batch">批量赛</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/batch" element={<Batch />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
