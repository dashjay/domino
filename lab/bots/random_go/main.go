// Random bot implementing the Lab Bot HTTP API.
package main

import (
	"encoding/json"
	"flag"
	"log"
	"math/rand"
	"net/http"
	"time"
)

type legalMove struct {
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"`
}

type actReq struct {
	Legal []legalMove `json:"legal"`
}

type actResp struct {
	Tile *[2]int `json:"tile"`
	Side string  `json:"side"`
}

func main() {
	port := flag.String("port", "9200", "listen port")
	flag.Parse()
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, map[string]any{"ok": true, "name": "random_go"})
	})
	mux.HandleFunc("/act", func(w http.ResponseWriter, r *http.Request) {
		var req actReq
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}
		if len(req.Legal) == 0 {
			writeJSON(w, actResp{Side: "pass"})
			return
		}
		m := req.Legal[rng.Intn(len(req.Legal))]
		writeJSON(w, actResp{Tile: m.Tile, Side: m.Side})
	})

	addr := ":" + *port
	log.Printf("random_go bot on http://127.0.0.1%s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}
