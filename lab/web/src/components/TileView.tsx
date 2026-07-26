import type { Tile } from "../api/client";

type Props = {
  tile: Tile;
  flat?: boolean;
  playable?: boolean;
  onClick?: () => void;
};

export default function TileView({ tile, flat, playable, onClick }: Props) {
  return (
    <div
      className={`tile${flat ? " flat" : ""}${playable ? " playable" : ""}`}
      onClick={onClick}
      role={playable ? "button" : undefined}
    >
      <span className="pip">{tile[0]}</span>
      <span className="bar" />
      <span className="pip">{tile[1]}</span>
    </div>
  );
}
