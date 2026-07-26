export type BotInfo = {
  id: string;
  name: string;
  base_url: string;
  online: boolean;
  reported_name?: string;
  error?: string;
};

export type SeatConfig = { type: "human" | "bot"; bot_id?: string };

export type Tile = [number, number];

export type GameState = {
  id: string;
  seed: number;
  seats: SeatConfig[];
  current_player: number;
  leader: number;
  left: number | null;
  right: number | null;
  board: Tile[] | null;
  hand_sizes: number[];
  hands: (Tile[] | null)[];
  history: { seat: number; tile: Tile | null; side: string }[];
  legal: { tile: Tile | null; side: string }[];
  is_over: boolean;
  winner: number;
  blocked: boolean;
  scores?: number[];
  pip_sums: number[];
  faults: number[];
  consecutive_passes: number;
};

/** Normalize API payloads so the UI never sees null collections. */
export function normalizeGame(g: GameState): GameState {
  return {
    ...g,
    board: g.board ?? [],
    history: g.history ?? [],
    legal: g.legal ?? [],
    hand_sizes: g.hand_sizes ?? [0, 0, 0, 0],
    hands: g.hands ?? [null, null, null, null],
    faults: g.faults ?? [0, 0, 0, 0],
    pip_sums: g.pip_sums ?? [0, 0, 0, 0],
    seats: g.seats ?? [],
  };
}

export type MatchState = {
  id: string;
  seats: { bot_id: string }[];
  n_games: number;
  done: number;
  status: string;
  error?: string;
  wins: number[];
  win_rates: number[];
  avg_scores: number[];
  faults: number[];
  seed: number;
  concurrency: number;
};

const BASE = "";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const body = await r.json();
  if (!r.ok || body.ok === false) {
    throw new Error(body.error || r.statusText);
  }
  return body;
}

export async function listBots(): Promise<BotInfo[]> {
  const b = await req<{ bots: BotInfo[] }>("/api/bots");
  return b.bots;
}

export async function createGame(seats: SeatConfig[], seed?: number) {
  const b = await req<{ game: GameState }>("/api/games", {
    method: "POST",
    body: JSON.stringify({ seats, seed: seed || 0 }),
  });
  return normalizeGame(b.game);
}

export async function getGame(id: string, viewer = -1) {
  const b = await req<{ game: GameState }>(`/api/games/${id}?viewer=${viewer}`);
  return normalizeGame(b.game);
}

export async function actGame(id: string, tile: Tile | null, side: string) {
  const b = await req<{ game: GameState }>(`/api/games/${id}/act`, {
    method: "POST",
    body: JSON.stringify({ tile, side }),
  });
  return normalizeGame(b.game);
}

export async function createMatch(
  seats: { bot_id: string }[],
  n_games: number,
  concurrency = 4,
  seed = 0
) {
  const b = await req<{ match: MatchState }>("/api/matches", {
    method: "POST",
    body: JSON.stringify({ seats, n_games, concurrency, seed }),
  });
  return b.match;
}

export async function getMatch(id: string) {
  const b = await req<{ match: MatchState }>(`/api/matches/${id}`);
  return b.match;
}

export function subscribeGame(
  id: string,
  onEvent: (event: string, data: GameState) => void
) {
  const es = new EventSource(`/api/games/${id}/ws`);
  es.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      onEvent(msg.event, normalizeGame(msg.data));
    } catch {
      /* ignore */
    }
  };
  return () => es.close();
}
