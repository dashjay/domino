import type { Tile } from "../api/client";
import TileView from "./TileView";

export default function Board({ board }: { board?: Tile[] | null }) {
  const tiles = board ?? [];
  if (!tiles.length) {
    return <div className="board muted">桌面为空</div>;
  }
  return (
    <div className="board">
      {tiles.map((t, i) => (
        <TileView key={`${t[0]}-${t[1]}-${i}`} tile={t} flat />
      ))}
    </div>
  );
}
