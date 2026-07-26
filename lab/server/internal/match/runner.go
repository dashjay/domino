package match

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"domino/lab/server/internal/bot"
	"domino/lab/server/internal/engine"
	"domino/lab/server/internal/store"

	"github.com/google/uuid"
)

type Broadcaster func(g *store.Game, event string, payload any)

// Snapshot builds a JSON-serializable public view of the game.
func Snapshot(g *store.Game, viewerSeat int) map[string]any {
	e := g.Engine
	hands := make([]any, e.Config.NumPlayers)
	for i := 0; i < e.Config.NumPlayers; i++ {
		if viewerSeat < 0 || i == viewerSeat || e.IsOver {
			tiles := [][2]int{}
			engine.IterTiles(e.Hands[i], func(tid int) {
				tiles = append(tiles, e.Pips[tid])
			})
			hands[i] = tiles
		} else {
			hands[i] = nil
		}
	}
	hist := make([]map[string]any, 0, len(e.History))
	for _, h := range e.History {
		tile, side := e.DecodeAction(h.Action)
		var t any
		if tile != nil {
			t = *tile
		}
		hist = append(hist, map[string]any{
			"seat": h.Seat, "tile": t, "side": sideStr(side),
		})
	}
	legal := []map[string]any{}
	if !e.IsOver {
		for _, a := range e.LegalActionsList() {
			tile, side := e.DecodeAction(a)
			var t any
			if tile != nil {
				t = *tile
			}
			legal = append(legal, map[string]any{"tile": t, "side": sideStr(side)})
		}
	}
	var scores any
	if e.IsOver {
		if sc, err := e.Scores(); err == nil {
			scores = sc
		}
	}
	// nil slices become JSON null; always emit [] for the frontend.
	board := e.Board
	if board == nil {
		board = [][2]int{}
	}
	faults := append([]int(nil), g.Faults...)
	return map[string]any{
		"id":                 g.ID,
		"seed":               g.Seed,
		"seats":              g.Seats,
		"current_player":     e.CurrentPlayer,
		"leader":             e.Leader,
		"left":               nullInt(e.LeftEnd),
		"right":              nullInt(e.RightEnd),
		"board":              board,
		"hand_sizes":         e.HandSizes(),
		"hands":              hands,
		"history":            hist,
		"legal":              legal,
		"is_over":            e.IsOver,
		"winner":             e.Winner,
		"blocked":            e.Blocked,
		"scores":             scores,
		"pip_sums":           e.PipSums(),
		"faults":             faults,
		"consecutive_passes": e.ConsecutivePasses,
	}
}

func nullInt(v int) any {
	if v < 0 {
		return nil
	}
	return v
}

func sideStr(side int) string {
	switch side {
	case 0:
		return "left"
	case 1:
		return "right"
	default:
		return "pass"
	}
}

func MarshalEvent(event string, payload any) ([]byte, error) {
	return json.Marshal(map[string]any{"event": event, "data": payload})
}

func Broadcast(g *store.Game, event string, payload any) {
	msg, _ := MarshalEvent(event, payload)
	g.Mu.Lock()
	defer g.Mu.Unlock()
	for ch := range g.Subs {
		select {
		case ch <- msg:
		default:
		}
	}
}

// CreateGame allocates a new game room.
func CreateGame(st *store.Store, seats []store.SeatConfig, seed int64) (*store.Game, error) {
	if len(seats) != 4 {
		return nil, fmt.Errorf("need 4 seats")
	}
	for i, s := range seats {
		if s.Type == store.SeatBot {
			if _, ok := st.GetBot(s.BotID); !ok {
				return nil, fmt.Errorf("seat %d unknown bot %q", i, s.BotID)
			}
		} else if s.Type != store.SeatHuman {
			return nil, fmt.Errorf("seat %d invalid type", i)
		}
	}
	if seed == 0 {
		seed = time.Now().UnixNano()
	}
	eng := engine.New(engine.DefaultConfig())
	eng.Reset(seed)
	g := &store.Game{
		ID:        "g-" + uuid.NewString()[:8],
		CreatedAt: time.Now().UTC(),
		Seed:      seed,
		Seats:     seats,
		Engine:    eng,
		Faults:    make([]int, 4),
		Subs:      map[chan []byte]struct{}{},
	}
	st.PutGame(g)
	return g, nil
}

// AdvanceBots runs bot turns until a human must act or the game ends.
func AdvanceBots(ctx context.Context, st *store.Store, g *store.Game) {
	rng := rand.New(rand.NewSource(g.Seed ^ 0xB0B))
	for {
		g.Mu.Lock()
		if g.Engine.IsOver {
			g.Mu.Unlock()
			Broadcast(g, "ended", Snapshot(g, -1))
			return
		}
		seat := g.Engine.CurrentPlayer
		sc := g.Seats[seat]
		if sc.Type == store.SeatHuman {
			g.Mu.Unlock()
			Broadcast(g, "state", Snapshot(g, -1))
			return
		}
		client, ok := st.GetBot(sc.BotID)
		eng := g.Engine
		req := bot.BuildActRequest(g.ID, eng, seat)
		g.Mu.Unlock()

		action := -1
		actCtx, cancel := context.WithTimeout(ctx, client.Timeout)
		resp, err := client.Act(actCtx, req)
		cancel()

		g.Mu.Lock()
		if g.Engine.IsOver || g.Engine.CurrentPlayer != seat {
			g.Mu.Unlock()
			continue
		}
		if err != nil || !ok {
			g.Faults[seat]++
			action = engine.RandomLegal(g.Engine, rng)
		} else {
			a, encErr := g.Engine.EncodePlay(resp.Tile, resp.Side)
			if encErr != nil {
				g.Faults[seat]++
				action = engine.RandomLegal(g.Engine, rng)
			} else {
				action = a
			}
		}
		_ = g.Engine.Step(action)
		snap := Snapshot(g, -1)
		over := g.Engine.IsOver
		g.Mu.Unlock()
		Broadcast(g, "move", snap)
		if over {
			Broadcast(g, "ended", snap)
			return
		}
	}
}

// HumanAct applies a human move then continues bot turns.
func HumanAct(ctx context.Context, st *store.Store, g *store.Game, tile *[2]int, side string) error {
	g.Mu.Lock()
	if g.Engine.IsOver {
		g.Mu.Unlock()
		return fmt.Errorf("game over")
	}
	seat := g.Engine.CurrentPlayer
	if g.Seats[seat].Type != store.SeatHuman {
		g.Mu.Unlock()
		return fmt.Errorf("not a human turn")
	}
	action, err := g.Engine.EncodePlay(tile, side)
	if err != nil {
		g.Mu.Unlock()
		return err
	}
	if err := g.Engine.Step(action); err != nil {
		g.Mu.Unlock()
		return err
	}
	snap := Snapshot(g, -1)
	over := g.Engine.IsOver
	g.Mu.Unlock()
	Broadcast(g, "move", snap)
	if over {
		Broadcast(g, "ended", snap)
		return nil
	}
	go AdvanceBots(ctx, st, g)
	return nil
}

// StartMatch runs n games concurrently between 4 bots.
func StartMatch(st *store.Store, seats []store.MatchSeat, nGames int, seed int64, concurrency int) (*store.Match, error) {
	if len(seats) != 4 {
		return nil, fmt.Errorf("need 4 bot seats")
	}
	for i, s := range seats {
		if _, ok := st.GetBot(s.BotID); !ok {
			return nil, fmt.Errorf("seat %d unknown bot %q", i, s.BotID)
		}
	}
	if nGames < 1 {
		nGames = 1
	}
	if concurrency < 1 {
		concurrency = 2
	}
	if seed == 0 {
		seed = time.Now().UnixNano()
	}
	m := &store.Match{
		ID:          "m-" + uuid.NewString()[:8],
		CreatedAt:   time.Now().UTC(),
		Seats:       seats,
		NGames:      nGames,
		Seed:        seed,
		Concurrency: concurrency,
		Wins:        make([]int, 4),
		ScoresSum:   make([]float64, 4),
		Faults:      make([]int, 4),
		Status:      "running",
	}
	st.PutMatch(m)
	go runMatch(st, m)
	return m, nil
}

func runMatch(st *store.Store, m *store.Match) {
	jobs := make(chan int, m.NGames)
	var wg sync.WaitGroup
	for i := 0; i < m.Concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for gi := range jobs {
				playOne(st, m, gi)
			}
		}()
	}
	for i := 0; i < m.NGames; i++ {
		jobs <- i
	}
	close(jobs)
	wg.Wait()
	m.Mu.Lock()
	if m.Status == "running" {
		m.Status = "done"
	}
	m.Mu.Unlock()
}

func playOne(st *store.Store, m *store.Match, gi int) {
	cfg := engine.DefaultConfig()
	eng := engine.New(cfg)
	eng.Reset(m.Seed + int64(gi)*9973)
	rng := rand.New(rand.NewSource(m.Seed + int64(gi)))
	faults := make([]int, 4)
	ctx := context.Background()
	gameID := fmt.Sprintf("%s-%d", m.ID, gi)

	for !eng.IsOver {
		seat := eng.CurrentPlayer
		client, _ := st.GetBot(m.Seats[seat].BotID)
		req := bot.BuildActRequest(gameID, eng, seat)
		actCtx, cancel := context.WithTimeout(ctx, client.Timeout)
		resp, err := client.Act(actCtx, req)
		cancel()
		var action int
		if err != nil {
			faults[seat]++
			action = engine.RandomLegal(eng, rng)
		} else {
			a, encErr := eng.EncodePlay(resp.Tile, resp.Side)
			if encErr != nil {
				faults[seat]++
				action = engine.RandomLegal(eng, rng)
			} else {
				action = a
			}
		}
		if err := eng.Step(action); err != nil {
			m.Mu.Lock()
			m.Status = "error"
			m.Error = err.Error()
			m.Mu.Unlock()
			return
		}
	}
	scores, _ := eng.Scores()
	m.Mu.Lock()
	m.Done++
	if eng.Winner >= 0 {
		m.Wins[eng.Winner]++
	}
	for i := 0; i < 4; i++ {
		m.ScoresSum[i] += scores[i]
		m.Faults[i] += faults[i]
	}
	m.Mu.Unlock()
}

// MatchView serializes match progress.
func MatchView(m *store.Match) map[string]any {
	m.Mu.Lock()
	defer m.Mu.Unlock()
	wr := make([]float64, 4)
	avg := make([]float64, 4)
	if m.Done > 0 {
		for i := 0; i < 4; i++ {
			wr[i] = float64(m.Wins[i]) / float64(m.Done)
			avg[i] = m.ScoresSum[i] / float64(m.Done)
		}
	}
	return map[string]any{
		"id":          m.ID,
		"seats":       m.Seats,
		"n_games":     m.NGames,
		"done":        m.Done,
		"status":      m.Status,
		"error":       m.Error,
		"wins":        m.Wins,
		"win_rates":   wr,
		"avg_scores":  avg,
		"faults":      m.Faults,
		"seed":        m.Seed,
		"concurrency": m.Concurrency,
	}
}
