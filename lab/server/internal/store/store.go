package store

import (
	"sync"
	"time"

	"domino/lab/server/internal/bot"
	"domino/lab/server/internal/engine"
)

type SeatType string

const (
	SeatHuman SeatType = "human"
	SeatBot   SeatType = "bot"
)

type SeatConfig struct {
	Type  SeatType `json:"type"`
	BotID string   `json:"bot_id,omitempty"`
}

type Game struct {
	ID        string
	CreatedAt time.Time
	Seed      int64
	Seats     []SeatConfig
	Engine    *engine.Engine
	Faults    []int // per-seat fault count
	Mu        sync.Mutex
	Subs      map[chan []byte]struct{}
	AutoDone  bool // true when bots finished auto-play loop
}

type MatchSeat struct {
	BotID string `json:"bot_id"`
}

type Match struct {
	ID          string
	CreatedAt   time.Time
	Seats       []MatchSeat
	NGames      int
	Seed        int64
	Concurrency int
	Done        int
	Wins        []int
	ScoresSum   []float64
	Faults      []int
	Status      string // running|done|error
	Error       string
	Mu          sync.Mutex
}

type Store struct {
	Mu     sync.RWMutex
	Games  map[string]*Game
	Matches map[string]*Match
	Bots   map[string]*bot.Client
}

func New() *Store {
	return &Store{
		Games:   map[string]*Game{},
		Matches: map[string]*Match{},
		Bots:    map[string]*bot.Client{},
	}
}

func (s *Store) SetBots(clients []*bot.Client) {
	s.Mu.Lock()
	defer s.Mu.Unlock()
	s.Bots = map[string]*bot.Client{}
	for _, c := range clients {
		s.Bots[c.ID] = c
	}
}

func (s *Store) ListBots() []*bot.Client {
	s.Mu.RLock()
	defer s.Mu.RUnlock()
	out := make([]*bot.Client, 0, len(s.Bots))
	for _, c := range s.Bots {
		out = append(out, c)
	}
	return out
}

func (s *Store) GetBot(id string) (*bot.Client, bool) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()
	c, ok := s.Bots[id]
	return c, ok
}

func (s *Store) PutGame(g *Game) {
	s.Mu.Lock()
	defer s.Mu.Unlock()
	s.Games[g.ID] = g
}

func (s *Store) GetGame(id string) (*Game, bool) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()
	g, ok := s.Games[id]
	return g, ok
}

func (s *Store) PutMatch(m *Match) {
	s.Mu.Lock()
	defer s.Mu.Unlock()
	s.Matches[m.ID] = m
}

func (s *Store) GetMatch(id string) (*Match, bool) {
	s.Mu.RLock()
	defer s.Mu.RUnlock()
	m, ok := s.Matches[id]
	return m, ok
}
