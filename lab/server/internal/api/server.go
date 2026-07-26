package api

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"domino/lab/server/internal/bot"
	"domino/lab/server/internal/match"
	"domino/lab/server/internal/store"

	"github.com/kataras/iris/v12"
	"gopkg.in/yaml.v3"
)

type botsFile struct {
	Bots []struct {
		ID        string `yaml:"id"`
		Name      string `yaml:"name"`
		BaseURL   string `yaml:"base_url"`
		TimeoutMS int    `yaml:"timeout_ms"`
	} `yaml:"bots"`
}

type Server struct {
	Store      *store.Store
	BotsPath   string
	CORSOrigin string
}

func NewServer(botsPath string) *Server {
	return &Server{
		Store:      store.New(),
		BotsPath:   botsPath,
		CORSOrigin: "*",
	}
}

func (s *Server) LoadBots() error {
	raw, err := os.ReadFile(s.BotsPath)
	if err != nil {
		return err
	}
	var bf botsFile
	if err := yaml.Unmarshal(raw, &bf); err != nil {
		return err
	}
	clients := make([]*bot.Client, 0, len(bf.Bots))
	for _, b := range bf.Bots {
		name := b.Name
		if name == "" {
			name = b.ID
		}
		to := time.Duration(b.TimeoutMS) * time.Millisecond
		if to == 0 {
			to = 3 * time.Second
		}
		clients = append(clients, bot.NewClient(b.ID, name, b.BaseURL, to))
	}
	s.Store.SetBots(clients)
	return nil
}

func (s *Server) App() *iris.Application {
	app := iris.New()
	app.Use(func(ctx iris.Context) {
		ctx.Header("Access-Control-Allow-Origin", s.CORSOrigin)
		ctx.Header("Access-Control-Allow-Headers", "Content-Type")
		ctx.Header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		if ctx.Method() == iris.MethodOptions {
			ctx.StatusCode(204)
			return
		}
		ctx.Next()
	})

	api := app.Party("/api")
	{
		api.Get("/health", func(ctx iris.Context) {
			ctx.JSON(iris.Map{"ok": true, "service": "labd"})
		})
		api.Get("/bots", s.handleListBots)
		api.Post("/games", s.handleCreateGame)
		api.Get("/games/{id:string}", s.handleGetGame)
		api.Post("/games/{id:string}/act", s.handleGameAct)
		api.Get("/games/{id:string}/ws", s.handleGameStream) // SSE (EventSource-friendly)
		api.Post("/matches", s.handleCreateMatch)
		api.Get("/matches/{id:string}", s.handleGetMatch)
	}

	webDist := filepath.Join(filepath.Dir(s.BotsPath), "..", "web", "dist")
	if st, err := os.Stat(webDist); err == nil && st.IsDir() {
		// Static assets only; API lives under /api Party above.
		app.HandleDir("/", iris.Dir(webDist))
	}

	return app
}

func (s *Server) handleListBots(ctx iris.Context) {
	out := make([]iris.Map, 0)
	for _, c := range s.Store.ListBots() {
		hctx, cancel := context.WithTimeout(ctx.Request().Context(), 800*time.Millisecond)
		h, err := c.Health(hctx)
		cancel()
		item := iris.Map{"id": c.ID, "name": c.Name, "base_url": c.BaseURL, "online": err == nil}
		if err == nil && h != nil {
			item["reported_name"] = h.Name
		} else if err != nil {
			item["error"] = err.Error()
		}
		out = append(out, item)
	}
	ctx.JSON(iris.Map{"ok": true, "bots": out})
}

type createGameReq struct {
	Seats []store.SeatConfig `json:"seats"`
	Seed  int64              `json:"seed"`
}

func (s *Server) handleCreateGame(ctx iris.Context) {
	var req createGameReq
	if err := ctx.ReadJSON(&req); err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	g, err := match.CreateGame(s.Store, req.Seats, req.Seed)
	if err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	// Snapshot under lock BEFORE kicking bots off, to avoid data races / panics.
	g.Mu.Lock()
	snap := match.Snapshot(g, -1)
	g.Mu.Unlock()
	go match.AdvanceBots(context.Background(), s.Store, g)
	ctx.JSON(iris.Map{"ok": true, "game": snap})
}

func (s *Server) handleGetGame(ctx iris.Context) {
	id := ctx.Params().Get("id")
	g, ok := s.Store.GetGame(id)
	if !ok {
		ctx.StopWithJSON(404, iris.Map{"ok": false, "error": "not found"})
		return
	}
	viewer := ctx.URLParamIntDefault("viewer", -1)
	g.Mu.Lock()
	snap := match.Snapshot(g, viewer)
	g.Mu.Unlock()
	ctx.JSON(iris.Map{"ok": true, "game": snap})
}

type actReq struct {
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"`
}

func (s *Server) handleGameAct(ctx iris.Context) {
	id := ctx.Params().Get("id")
	g, ok := s.Store.GetGame(id)
	if !ok {
		ctx.StopWithJSON(404, iris.Map{"ok": false, "error": "not found"})
		return
	}
	var req actReq
	if err := ctx.ReadJSON(&req); err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	if err := match.HumanAct(context.Background(), s.Store, g, req.Tile, req.Side); err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	g.Mu.Lock()
	snap := match.Snapshot(g, -1)
	g.Mu.Unlock()
	ctx.JSON(iris.Map{"ok": true, "game": snap})
}

type createMatchReq struct {
	Seats       []store.MatchSeat `json:"seats"`
	NGames      int               `json:"n_games"`
	Seed        int64             `json:"seed"`
	Concurrency int               `json:"concurrency"`
}

func (s *Server) handleCreateMatch(ctx iris.Context) {
	var req createMatchReq
	if err := ctx.ReadJSON(&req); err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	m, err := match.StartMatch(s.Store, req.Seats, req.NGames, req.Seed, req.Concurrency)
	if err != nil {
		ctx.StopWithJSON(400, iris.Map{"ok": false, "error": err.Error()})
		return
	}
	ctx.JSON(iris.Map{"ok": true, "match": match.MatchView(m)})
}

func (s *Server) handleGetMatch(ctx iris.Context) {
	id := ctx.Params().Get("id")
	m, ok := s.Store.GetMatch(id)
	if !ok {
		ctx.StopWithJSON(404, iris.Map{"ok": false, "error": "not found"})
		return
	}
	ctx.JSON(iris.Map{"ok": true, "match": match.MatchView(m)})
}

// handleGameStream is SSE over the /ws path (EventSource compatible).
func (s *Server) handleGameStream(ctx iris.Context) {
	id := ctx.Params().Get("id")
	g, ok := s.Store.GetGame(id)
	if !ok {
		ctx.StopWithJSON(404, iris.Map{"ok": false, "error": "not found"})
		return
	}
	ch := make(chan []byte, 32)
	g.Mu.Lock()
	g.Subs[ch] = struct{}{}
	initMsg, _ := match.MarshalEvent("state", match.Snapshot(g, -1))
	g.Mu.Unlock()
	defer func() {
		g.Mu.Lock()
		delete(g.Subs, ch)
		g.Mu.Unlock()
	}()

	ctx.ContentType("text/event-stream")
	ctx.Header("Cache-Control", "no-cache")
	ctx.Header("Connection", "keep-alive")
	w := ctx.ResponseWriter()
	_, _ = fmt.Fprintf(w, "data: %s\n\n", initMsg)
	ctx.ResponseWriter().Flush()

	notify := ctx.Request().Context().Done()
	for {
		select {
		case <-notify:
			return
		case msg := <-ch:
			_, _ = fmt.Fprintf(w, "data: %s\n\n", msg)
			ctx.ResponseWriter().Flush()
		}
	}
}
