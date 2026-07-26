package engine

import (
	"errors"
	"fmt"
	"math/rand"
)

var ErrIllegalAction = errors.New("illegal action")
var ErrNotOver = errors.New("game not over")

// Config mirrors Python GameConfig defaults (Gaple).
type Config struct {
	MaxPip     int
	NumPlayers int
	HandSize   int
}

func DefaultConfig() Config {
	return Config{MaxPip: 6, NumPlayers: 4, HandSize: 7}
}

func (c Config) DeckSize() int { return NumTiles(c.MaxPip) }
func (c Config) PassAction() int { return c.DeckSize() * 2 }

// HistoryEntry records one play.
type HistoryEntry struct {
	Seat   int
	Action int
}

// Engine is a single-game Gaple rules engine.
type Engine struct {
	Config Config
	Pips   [][2]int
	rng    *rand.Rand

	Hands              []uint64
	PlayedMask         uint64
	LeftEnd, RightEnd  int
	CurrentPlayer      int
	Leader             int
	ConsecutivePasses  int
	ForcedAction       int
	History            []HistoryEntry
	MissingPips        []int
	IsOver             bool
	Winner             int
	Blocked            bool
	Board              [][2]int // oriented chain left→right for clients
}

func New(cfg Config) *Engine {
	if cfg.NumPlayers == 0 {
		cfg = DefaultConfig()
	}
	return &Engine{
		Config:       cfg,
		Pips:         BuildPipsTable(cfg.MaxPip),
		rng:          rand.New(rand.NewSource(1)),
		ForcedAction: -1,
		Winner:       -1,
		LeftEnd:      -1,
		RightEnd:     -1,
	}
}

// ResetWithHands deals fixed hands (for tests / golden). hands[p] is a tile bitmask.
func (e *Engine) ResetWithHands(hands []uint64) {
	cfg := e.Config
	e.Hands = make([]uint64, cfg.NumPlayers)
	copy(e.Hands, hands)
	e.PlayedMask = 0
	e.LeftEnd, e.RightEnd = -1, -1
	e.ConsecutivePasses = 0
	e.History = nil
	e.MissingPips = make([]int, cfg.NumPlayers)
	e.IsOver = false
	e.Winner = -1
	e.Blocked = false
	e.Board = [][2]int{} // non-nil so JSON is [] not null
	e.CurrentPlayer, e.ForcedAction = e.decideFirstMove()
	e.Leader = e.CurrentPlayer
}

func (e *Engine) Reset(seed int64) {
	cfg := e.Config
	e.rng = rand.New(rand.NewSource(seed))
	deck := make([]int, cfg.DeckSize())
	for i := range deck {
		deck[i] = i
	}
	e.rng.Shuffle(len(deck), func(i, j int) { deck[i], deck[j] = deck[j], deck[i] })

	hands := make([]uint64, cfg.NumPlayers)
	for p := 0; p < cfg.NumPlayers; p++ {
		for i := 0; i < cfg.HandSize; i++ {
			hands[p] |= 1 << deck[p*cfg.HandSize+i]
		}
	}
	e.ResetWithHands(hands)
}

func (e *Engine) decideFirstMove() (player, forced int) {
	bestTid, bestPlayer := -1, -1
	for p := 0; p < e.Config.NumPlayers; p++ {
		IterTiles(e.Hands[p], func(tid int) {
			if IsDouble(tid, e.Pips) && tid > bestTid {
				bestTid, bestPlayer = tid, p
			}
		})
	}
	if bestPlayer < 0 {
		for p := 0; p < e.Config.NumPlayers; p++ {
			IterTiles(e.Hands[p], func(tid int) {
				if tid > bestTid {
					bestTid, bestPlayer = tid, p
				}
			})
		}
		return bestPlayer, -1
	}
	return bestPlayer, bestTid * 2 // highest double forced, side=0
}

func (e *Engine) LegalActions() uint64 {
	if e.IsOver {
		return 0
	}
	if e.ForcedAction >= 0 {
		return 1 << e.ForcedAction
	}
	hand := e.Hands[e.CurrentPlayer]
	var mask uint64
	if e.LeftEnd < 0 {
		IterTiles(hand, func(tid int) {
			mask |= 1 << (tid * 2)
		})
		return mask
	}
	l, r := e.LeftEnd, e.RightEnd
	sameEnds := l == r
	IterTiles(hand, func(tid int) {
		a, b := e.Pips[tid][0], e.Pips[tid][1]
		fitsLeft := a == l || b == l
		fitsRight := a == r || b == r
		if fitsLeft {
			mask |= 1 << (tid * 2)
		}
		if fitsRight && !(fitsLeft && sameEnds) {
			mask |= 1 << (tid*2 + 1)
		}
	})
	if mask == 0 {
		mask = 1 << e.Config.PassAction()
	}
	return mask
}

func (e *Engine) LegalActionsList() []int {
	mask := e.LegalActions()
	out := make([]int, 0, 8)
	IterTiles(mask, func(a int) { out = append(out, a) })
	return out
}

func (e *Engine) HandSizes() []int {
	out := make([]int, e.Config.NumPlayers)
	for i, h := range e.Hands {
		out[i] = Popcount(h)
	}
	return out
}

func (e *Engine) Step(action int) error {
	if e.IsOver {
		return ErrIllegalAction
	}
	if (e.LegalActions()>>action)&1 == 0 {
		return fmt.Errorf("%w: action %d seat %d", ErrIllegalAction, action, e.CurrentPlayer)
	}
	cfg := e.Config
	p := e.CurrentPlayer

	if action == cfg.PassAction() {
		if e.LeftEnd >= 0 {
			e.MissingPips[p] |= (1 << e.LeftEnd) | (1 << e.RightEnd)
		}
		e.ConsecutivePasses++
		e.History = append(e.History, HistoryEntry{Seat: p, Action: action})
		if e.ConsecutivePasses >= cfg.NumPlayers {
			e.finishBlocked()
			return nil
		}
		e.CurrentPlayer = (p + 1) % cfg.NumPlayers
		return nil
	}

	tid, side := action/2, action%2
	a, b := e.Pips[tid][0], e.Pips[tid][1]
	e.Hands[p] &^= 1 << tid
	e.PlayedMask |= 1 << tid
	e.ConsecutivePasses = 0
	e.ForcedAction = -1
	e.History = append(e.History, HistoryEntry{Seat: p, Action: action})

	if e.LeftEnd < 0 {
		e.LeftEnd, e.RightEnd = a, b
		e.Board = [][2]int{{a, b}}
	} else if side == 0 {
		if a == e.LeftEnd {
			e.LeftEnd = b
			e.Board = append([][2]int{{b, a}}, e.Board...)
		} else {
			e.LeftEnd = a
			e.Board = append([][2]int{{a, b}}, e.Board...)
		}
	} else {
		if a == e.RightEnd {
			e.RightEnd = b
			e.Board = append(e.Board, [2]int{a, b})
		} else {
			e.RightEnd = a
			e.Board = append(e.Board, [2]int{b, a})
		}
	}

	if e.Hands[p] == 0 {
		e.IsOver = true
		e.Winner = p
		return nil
	}
	e.CurrentPlayer = (p + 1) % cfg.NumPlayers
	return nil
}

func (e *Engine) finishBlocked() {
	e.IsOver = true
	e.Blocked = true
	sums := make([]int, e.Config.NumPlayers)
	best := int(^uint(0) >> 1)
	for p := 0; p < e.Config.NumPlayers; p++ {
		sums[p] = PipSum(e.Hands[p], e.Pips)
		if sums[p] < best {
			best = sums[p]
		}
	}
	candidates := make([]int, 0, 4)
	for p, s := range sums {
		if s == best {
			candidates = append(candidates, p)
		}
	}
	if len(candidates) == 1 {
		e.Winner = candidates[0]
		return
	}
	// nearest from leader clockwise
	bestDist := e.Config.NumPlayers
	win := candidates[0]
	for _, p := range candidates {
		d := (p - e.Leader + e.Config.NumPlayers) % e.Config.NumPlayers
		if d < bestDist {
			bestDist = d
			win = p
		}
	}
	e.Winner = win
}

func (e *Engine) Scores() ([]float64, error) {
	if !e.IsOver {
		return nil, ErrNotOver
	}
	n := e.Config.NumPlayers
	out := make([]float64, n)
	if e.Winner < 0 {
		return out, nil
	}
	sums := make([]int, n)
	totalOthers := 0.0
	for p := 0; p < n; p++ {
		sums[p] = PipSum(e.Hands[p], e.Pips)
		if p != e.Winner {
			out[p] = -float64(sums[p])
			totalOthers += float64(sums[p])
		}
	}
	out[e.Winner] = totalOthers
	return out, nil
}

func (e *Engine) PipSums() []int {
	out := make([]int, e.Config.NumPlayers)
	for p := range out {
		out[p] = PipSum(e.Hands[p], e.Pips)
	}
	return out
}

// DecodeAction converts action id to tile/side for the bot API.
// side: 0 left, 1 right, -1 pass. tile nil for pass.
func (e *Engine) DecodeAction(action int) (tile *[2]int, side int) {
	if action == e.Config.PassAction() {
		return nil, -1
	}
	tid, s := action/2, action%2
	t := [2]int{e.Pips[tid][0], e.Pips[tid][1]}
	return &t, s
}

// EncodePlay builds an action id from tile+side ("left"/"right"/"pass").
func (e *Engine) EncodePlay(tile *[2]int, sideLabel string) (int, error) {
	if sideLabel == "pass" || tile == nil {
		return e.Config.PassAction(), nil
	}
	tid := TileID((*tile)[0], (*tile)[1])
	side := 0
	if sideLabel == "right" {
		side = 1
	}
	action := tid*2 + side
	if (e.LegalActions()>>action)&1 == 0 {
		// try flipped orientation / other side
		alt := tid*2 + (1 - side)
		if (e.LegalActions()>>alt)&1 != 0 {
			return alt, nil
		}
		return 0, fmt.Errorf("%w: tile %v side %s", ErrIllegalAction, *tile, sideLabel)
	}
	return action, nil
}

func RandomLegal(e *Engine, rng *rand.Rand) int {
	legal := e.LegalActionsList()
	if len(legal) == 0 {
		return e.Config.PassAction()
	}
	return legal[rng.Intn(len(legal))]
}
